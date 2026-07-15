# PM Pathfinder

**Live:** [pm-pathfinder-pi.vercel.app](https://pm-pathfinder-pi.vercel.app)

An archetype-based career navigation tool for professionals transitioning into Product Management. Instead of generic PM courses, it diagnoses *where you actually stand* — background, mindset, skill gaps — and builds a roadmap from there.

Built on primary research: 9 structured interviews with professionals attempting the engineering/design/consulting → PM transition, surfacing five recurring structural barriers (proof gap, access gap, theory-practice gap, feedback vacuum, jargon barrier). The product is a direct response to those interviews, not a template.

## What it does

1. **3-step onboarding** — background, experience, industry — no login required.
2. **Early insights** — instantly reframes the user's existing experience in PM language (e.g. "triaging bugs by severity" → "incident prioritisation"), before asking them to invest more time.
3. **10-question scenario-based diagnostic** across 4 dimensions: Thinking & Strategy, Execution, Technical Fluency, and User Research & Communication.
4. **Archetype reveal** — maps the user to 1 of 6 PM archetypes (The Builder, The Architect, The Storyteller, The Advocate, The Operator, The Strategist) along two axes: professional background × execution-vs-strategy mindset.
5. **Personalised dashboard** — 5-dimension radar chart, readiness score (0–100) benchmarked against APM/PM/Senior PM roles, chapter-by-chapter learning path ordered by the user's actual gaps, and a per-dimension deep dive.
6. **Public portfolio page** (`/u/[id]`) — a shareable, no-auth-required page showing a user's archetype and readiness, meant to function as the "proof of work" artifact the product itself argues candidates need.

The full experience — report, roadmap, interview readiness breakdown, deep dive, portfolio — is currently unlocked for every user (Pro-tier gating is built but intentionally disabled pending payments integration).

## Tech stack

- **Framework:** Next.js 16 (App Router, Turbopack) + React 19 + TypeScript
- **Styling:** Tailwind CSS v4, Framer Motion, Recharts (radar charts)
- **Backend:** Supabase (Postgres + Auth + Row-Level Security)
- **Auth:** Google OAuth via Supabase Auth, with an anonymous-session-to-account migration flow so users can start the quiz before signing in
- **AI:** Google Gemini (`@google/generative-ai`) powers the in-app chat/practice feature
- **Deployment:** Vercel

## Architecture

```
app/
  (auth)/auth/              Google OAuth sign-in
  (auth)/auth/callback/     OAuth callback — exchanges code, sets session
  api/
    chat/                   Gemini-backed practice/chat endpoint
    deep-dive/              Per-dimension deep-dive scoring
    portfolio/              Public portfolio data
    session/migrate/        Bridges an anonymous quiz session to an authenticated user
  migrate/                  Client-side landing point for the anon → auth bridge
  quiz/                     3-step onboarding
  quiz/insights/            Early insights (skill-to-PM-lingo reframing)
  quiz/diagnostic/          10-question, 4-section scenario diagnostic
  quiz/results/             Pre-signup teaser — archetype revealed, scores blurred
  reveal/                   Full archetype reveal (post-auth, first time only)
  dashboard/                Main hub — radar chart, readiness ring, stat cards
  report/                   Full diagnostic report
  roadmap/                  Personalised learning path
  deep-dive/                Sub-category breakdown per dimension
  interview-readiness/      0–100 readiness score vs role benchmarks
  profile/                  Overview / portfolio / evaluations
  u/[id]/                   Public portfolio (no auth required)

lib/
  scoring/engine.ts         Archetype + dimension scoring from quiz answers
  scoring/readiness.ts      Shared readiness-score formula (dashboard + interview-readiness)
  classifiers/background.ts Maps a user's background input to a technical/human/business axis
  data/                     Static content: archetypes, questions, topics, learning path
  supabase/                 Client, server, cached, and admin (service-role) Supabase clients
  user/getIsPro.ts          Single source of truth for Pro-tier status

supabase/migrations/        Schema: profiles, assessments, quiz_sessions,
                             learning_path_progress, deep_dive_results,
                             portfolio_profiles, portfolio_case_studies
```

### Auth flow

```
New user:   /quiz → /quiz/results → /auth → OAuth → /auth/callback → /migrate → /reveal → /dashboard
Returning:  /auth → OAuth → /auth/callback → /migrate (assessment exists) → /dashboard
No session: /auth → /migrate → no token or API error → /quiz
```

Quiz progress is stored client-side for anonymous users and migrated to their Supabase account on first sign-in (`/api/session/migrate`, using the service-role client to bypass RLS for that single write path).

## Getting started

```bash
git clone https://github.com/argaur/pm-pathfinder.git
cd pm-pathfinder
npm install
cp .env.local.example .env.local   # fill in the values below
npm run dev                        # http://localhost:3000
```

### Environment variables

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key, used exclusively by the anon-session migration route |
| `GOOGLE_AI_API_KEY` | Gemini API key for the chat/practice feature |
| `NEXT_PUBLIC_APP_URL` | Base URL of the deployment (used for OAuth redirects) |

```bash
npm run build   # verify no type errors
npm run lint
```

## Status

Live and functional end-to-end. Payment integration (Razorpay) and re-enabling Pro-tier gating are next; content for the topic library and resume-parsing are on the backlog.

## License

MIT — see [LICENSE](./LICENSE).
