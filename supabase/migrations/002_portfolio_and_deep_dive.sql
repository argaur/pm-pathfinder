-- ============================================================
-- Migration 002: Portfolio + Deep Dive tables
-- Run manually in Supabase SQL Editor
-- ============================================================

-- Learning path progress (if not already created)
CREATE TABLE IF NOT EXISTS learning_path_progress (
  user_id uuid references auth.users(id) on delete cascade,
  step_id text NOT NULL,
  mode text NOT NULL CHECK (mode IN ('video', 'text')),
  status text NOT NULL DEFAULT 'complete',
  marked_done_at timestamptz DEFAULT now(),
  PRIMARY KEY (user_id, step_id, mode)
);
ALTER TABLE learning_path_progress ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users own their learning progress" ON learning_path_progress;
CREATE POLICY "users own their learning progress"
  ON learning_path_progress FOR ALL USING (auth.uid() = user_id);

-- Deep dive results
CREATE TABLE IF NOT EXISTS deep_dive_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  dimension text NOT NULL,
  answers jsonb NOT NULL DEFAULT '{}',
  completed_at timestamptz DEFAULT now()
);
ALTER TABLE deep_dive_results ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users own their deep dive results" ON deep_dive_results;
CREATE POLICY "users own their deep dive results"
  ON deep_dive_results FOR ALL USING (auth.uid() = user_id);

-- Portfolio profiles (public-facing snapshot)
CREATE TABLE IF NOT EXISTS portfolio_profiles (
  user_id uuid PRIMARY KEY references auth.users(id) on delete cascade,
  display_name text,
  archetype text,
  background_axis text,
  traits jsonb DEFAULT '[]',
  strengths jsonb DEFAULT '[]',
  pm_story text,
  is_public boolean DEFAULT false,
  updated_at timestamptz DEFAULT now()
);
ALTER TABLE portfolio_profiles ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users own their portfolio profile" ON portfolio_profiles;
CREATE POLICY "users own their portfolio profile"
  ON portfolio_profiles FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "public can view public portfolios" ON portfolio_profiles;
CREATE POLICY "public can view public portfolios"
  ON portfolio_profiles FOR SELECT USING (is_public = true);

-- Portfolio case studies
CREATE TABLE IF NOT EXISTS portfolio_case_studies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  title text DEFAULT '',
  problem text DEFAULT '',
  approach text DEFAULT '',
  outcome text DEFAULT '',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
ALTER TABLE portfolio_case_studies ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "users own their case studies" ON portfolio_case_studies;
CREATE POLICY "users own their case studies"
  ON portfolio_case_studies FOR ALL USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "public can read case studies of public portfolios" ON portfolio_case_studies;
CREATE POLICY "public can read case studies of public portfolios"
  ON portfolio_case_studies FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM portfolio_profiles
      WHERE portfolio_profiles.user_id = portfolio_case_studies.user_id
        AND portfolio_profiles.is_public = true
    )
  );
