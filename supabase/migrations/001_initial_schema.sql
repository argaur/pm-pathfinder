-- ============================================================
-- PM Pathfinder — Initial Schema
-- ============================================================

-- Profiles (extends Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  background_axis TEXT CHECK (background_axis IN ('technical', 'human_centered', 'business')),
  years_experience INT,
  industry TEXT,
  archetype TEXT CHECK (archetype IN ('builder', 'architect', 'storyteller', 'advocate', 'operator', 'strategist')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- Anonymous quiz sessions (pre-auth flow)
-- ============================================================
CREATE TABLE quiz_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT UNIQUE NOT NULL,
  onboarding_answers JSONB DEFAULT '{}',
  -- { background: string, years_experience: number, industry: string }
  background_axis TEXT CHECK (background_axis IN ('technical', 'human_centered', 'business')),
  diagnostic_answers JSONB DEFAULT '{}',
  -- { q1: 'a', q2: 'b', ... }
  dimension_scores JSONB DEFAULT '{}',
  -- { thinking_strategy: 7.2, execution: 5.1, technical_fluency: 6.0, user_research: 4.3, communication: 8.1 }
  archetype TEXT CHECK (archetype IN ('builder', 'architect', 'storyteller', 'advocate', 'operator', 'strategist')),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  migrated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days')
);

ALTER TABLE quiz_sessions ENABLE ROW LEVEL SECURITY;
-- Anyone can create a session (anon flow)
CREATE POLICY "Anyone can insert quiz sessions" ON quiz_sessions FOR INSERT WITH CHECK (true);
-- Read/update: match by session token (stored in localStorage) OR by auth user
CREATE POLICY "Session owner can read" ON quiz_sessions FOR SELECT USING (
  session_token = current_setting('app.session_token', true)
  OR auth.uid() = user_id
);
CREATE POLICY "Session owner can update" ON quiz_sessions FOR UPDATE USING (
  session_token = current_setting('app.session_token', true)
  OR auth.uid() = user_id
);

-- ============================================================
-- Assessments (post-auth, full history for re-evaluation)
-- ============================================================
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_id UUID REFERENCES quiz_sessions(id),
  dimension_scores JSONB NOT NULL,
  archetype TEXT NOT NULL,
  background_axis TEXT NOT NULL,
  onboarding_answers JSONB,
  version INT DEFAULT 1,
  taken_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own assessments" ON assessments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own assessments" ON assessments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- ============================================================
-- Roadmap video progress
-- ============================================================
CREATE TABLE roadmap_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES assessments(id),
  archetype TEXT NOT NULL,
  week_number INT NOT NULL,
  timeline_months INT NOT NULL CHECK (timeline_months IN (1, 3, 6)),
  video_id TEXT,
  video_title TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'complete')),
  marked_done_at TIMESTAMPTZ,
  UNIQUE(user_id, archetype, week_number, timeline_months)
);

ALTER TABLE roadmap_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own roadmap" ON roadmap_progress FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- Text content library (seeded in Phase 9 from .docx files)
-- ============================================================
CREATE TABLE content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  archetype TEXT NOT NULL,
  dimension TEXT NOT NULL,
  skill_category TEXT NOT NULL,
  priority_level TEXT NOT NULL CHECK (priority_level IN ('growth', 'neutral', 'strength')),
  concept TEXT,
  framework TEXT,
  exercise TEXT,
  reading TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_content_archetype_dimension ON content(archetype, dimension);
CREATE INDEX idx_content_archetype_priority ON content(archetype, priority_level);

ALTER TABLE content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read content" ON content FOR SELECT USING (true);

-- ============================================================
-- Deep dive assessments
-- ============================================================
CREATE TABLE deep_dive_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  assessment_id UUID REFERENCES assessments(id),
  dimension TEXT NOT NULL,
  sub_category_scores JSONB NOT NULL,
  taken_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE deep_dive_assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own deep dives" ON deep_dive_assessments FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- Daily metrics (kill switch: L2 rate limiter)
-- ============================================================
CREATE TABLE daily_metrics (
  date DATE PRIMARY KEY DEFAULT CURRENT_DATE,
  ai_calls_count INT DEFAULT 0,
  assessments_count INT DEFAULT 0
);
