# PM Pathfinder

Archetype-based PM career navigation platform. Submitted for Rethink AI MPM Cohort 7 (2026-03-26). Now treating as a real product.

**Live:** https://pm-pathfinder-pi.vercel.app | **Repo:** https://github.com/argaur/pm-pathfinder

## Commands

```bash
npm run dev          # localhost:3000
npm run build        # verify no type errors before pushing
npm run lint
```

**Env required locally:** copy `.env.local` — needs `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

## Architecture

Next.js App Router + Supabase (auth + DB) + Vercel.

```
app/                        # All routes (App Router)
  (auth)/auth/              # Google OAuth sign-in
  (auth)/auth/callback/     # OAuth callback — exchanges code, sets session
  migrate/                  # Bridge: migrates anon quiz session to auth user
  quiz/                     # 3-step onboarding (background, years, industry)
  quiz/insights/            # Early insights — skill-to-PM-lingo mapping
  quiz/diagnostic/          # 10 MCQs across 4 chunks with progress bar
  quiz/results/             # Pre-signup teaser — blurred 5D scores
  reveal/                   # Archetype reveal — shown once after signup
  dashboard/                # Main hub — multi-radar, stat cards, readiness ring
  report/                   # Full diagnostic report — Pro-gating disabled, see Paywall section
  roadmap/                  # Learning path — Pro-gating disabled, see Paywall section
  deep-dive/                # Sub-category breakdown per dimension
  topics/[slug]/            # 15 topic content pages
  interview-readiness/      # Readiness score 0-100 vs APM/PM/Senior PM benchmarks
  profile/                  # 3 tabs: Overview, Portfolio, Evaluations
  u/[id]/                   # Public portfolio (no auth)
lib/
  data/role-thresholds.ts   # NO DIRECTIVE — neutral, importable by server + client
  data/topics.ts            # 15 topic entries, slugToTopic(), subCategoryToSlug()
  scoring/readiness.ts      # computeReadinessScore() — shared by dashboard + interview-readiness
  user/getIsPro.ts          # Single DB query for Pro status — called per server page
  supabase/admin.ts         # Service role client — bypasses RLS. ONLY for /api/session/migrate
```

## Auth Flow

```
New user:     /quiz → /quiz/results → /auth → OAuth → /auth/callback → /migrate → /reveal → /dashboard
Returning:    /auth → OAuth → /auth/callback → /migrate (detects assessment exists) → /dashboard
No session:   /auth → /migrate → no sessionToken OR API error → /quiz directly
```

## DB Tables (Supabase prod)

| Table | Purpose |
|---|---|
| `profiles` | `is_pro boolean`, archetype, display_name, avatar_url |
| `assessments` | dimension_scores, archetype, tiers JSONB per user |
| `quiz_sessions` | Anon pre-auth sessions — migrated flag, session_token |
| `learning_path_progress` | Step-level completion |
| `deep_dive_results` | Per-dimension answers JSONB |
| `portfolio_profiles` | Denormalized public portfolio snapshot |
| `portfolio_case_studies` | Up to 3 case studies per user |

## Critical Constraints

**`'use client'` boundary** — `lib/data/role-thresholds.ts` has NO directive intentionally. Never add one. Server components cannot import from `'use client'` modules — build passes, runtime crashes.

**BlurGate vs Coming Soon** — `BlurGate` triggers the pricing modal. For content-in-progress, use CSS opacity/blur overlay directly. Wrong component = wrong UX signal.

**Supabase RLS** — `CREATE POLICY IF NOT EXISTS` is invalid PostgreSQL. Always: `DROP POLICY IF EXISTS` + `CREATE POLICY`.

**Service role key** — `lib/supabase/admin.ts` bypasses RLS. Only used in `/api/session/migrate`. Never import it in client components or any other route.

**Vercel deployment verification** — use Vercel REST API, not GitHub Deployments API. GitHub API returns preview URLs, not production. Don't trust the "Live:" link at the top of this file either without checking — verify the actual bound domain via `get_project`'s `domains` field; this file has gone stale before.

**Supabase OAuth redirect allow-list** — Authentication → URL Configuration → Redirect URLs in the Supabase dashboard must include every Vercel domain alias the app is actually served from (e.g. `https://pm-pathfinder-pi.vercel.app/**`). If it's missing the current domain, Google sign-in will succeed on Google's side and then fail silently on the redirect back — symptom: user approves on Google, then lands on an error with nothing in our own server/runtime logs (the rejection happens between Supabase and Google, never reaching our app).

**Mobile navigation** — any `router.push('/')` that destroys in-progress state must have a confirmation dialog first.

**`assessments.tiers`** — `tiers JSONB` column is NOT in the original migration file. It was added manually via SQL editor. Don't regenerate migrations without accounting for this.

## Paywall

`is_pro boolean` on `profiles`. Flip manually: `UPDATE profiles SET is_pro = true WHERE id = 'uuid';`
No payment integration yet — Razorpay is next.

**Pro-gating is currently disabled everywhere** (2026-06-19) — this is a cohort case-study product right now, not a paid product, so every feature (report, roadmap, profile portfolio link, interview-readiness breakdown, chat, practice, deep-dive) is unlocked for all users. `getIsPro`, `BlurGate`, and `PricingModal` still exist and work — they're just not called from any page. Re-enable gating by re-adding `isPro`/`getIsPro()` checks once Razorpay ships.

## Out of Scope (do not build unless explicitly asked)

- Payment integration (Razorpay) — scheduled, not started
- Resume upload + AI parsing — backlog
- Real content for topic pages (video IDs, framework copy) — content task, not dev

---

---

## Status
- **State:** active
- **Current task:** Submitted to Razorpay's "AI Builders" hiring channel (2026-07-15) — cohort strip removed, README/LICENSE/lint cleaned up for public-repo readiness. Next real work: Razorpay payment integration (Pro-gating is disabled platform-wide until this ships — see Paywall section).
- **Blocker:** none
- **Last updated:** 2026-07-15

## Model notes
**This section expires. Review it at every model launch and every Claude Code version bump.**
Current as of 2026-08-05: Opus 5 / Sonnet 5 / Fable 5, Claude Code 2.1.222.
Re-checked 2026-08-07 by `Claude Optimisation/scripts/claude-md-eval.sh`, after five contract-drift
rules were added to it. Clean on that run.
- Delegation is not automatic. Claude Code 2.1.219 and later suppress subagents on Opus 5 unless
  the user asks for one, so name the agent when you want it.
- Do not add verification, anti-laziness or hedging instructions. These models self-verify, are
  direct by default, and obey a hedge literally by reporting less.
- Reasoning: `Claude Optimisation/docs/setup-versions/artifacts/2026-08-05-model5-migration/`.
