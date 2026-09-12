// ============================================================
// Static sample assessment — powers the public /sample-report route.
// No DB call, no seeded row. Shaped exactly like the fields of the
// `assessments` table that lib/report/transform.ts reads (see
// AssessmentLike in that file, and the `assessments` table in
// supabase/migrations/001_initial_schema.sql for the full row shape).
//
// Scores are chosen, not random, so the archetype and tiers below are
// internally consistent with the scoring rules in lib/scoring/engine.ts:
//   - mindsetAxis = strategy iff avg(thinking_strategy, communication)
//     >= avg(execution, technical_fluency)
//   - archetype = ARCHETYPE_MATRIX[background_axis][mindsetAxis]
//   - tier: <4 growth, <7 neutral, >=7 strength
//
// strategyScore = avg(9.0, 6.8) = 7.9
// executionScore = avg(5.5, 8.8) = 7.15
// 7.9 >= 7.15 -> mindset = strategy; background = technical
// ARCHETYPE_MATRIX.technical.strategy = 'architect'
// ============================================================

import { AssessmentLike } from '@/lib/report/transform'

export const SAMPLE_REPORT: AssessmentLike = {
  archetype: 'architect',
  dimension_scores: {
    thinking_strategy: 9.0,
    communication: 6.8,
    execution: 5.5,
    technical_fluency: 8.8,
    user_research: 3.5,
  },
  tiers: {
    thinking_strategy: 'strength',
    communication: 'neutral',
    execution: 'neutral',
    technical_fluency: 'strength',
    user_research: 'growth',
  },
}
