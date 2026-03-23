// ============================================================
// Diagnostic Scoring Engine
// Pure functions — no side effects, fully testable
// ============================================================

import {
  DIAGNOSTIC_QUESTIONS,
  Dimension,
  DiagnosticQuestion,
  QuestionOption,
} from '@/lib/data/questions'
import {
  ArchetypeId,
  BackgroundAxis,
  MindsetAxis,
  ARCHETYPE_MATRIX,
} from '@/lib/data/archetypes'

export type DiagnosticAnswers = Record<string, string> // { q1: 'a', q2: 'c', ... }

export type DimensionScores = Record<Dimension, number> // 0–10 normalised

export interface ScoringResult {
  dimensionScores: DimensionScores
  mindsetAxis: MindsetAxis
  archetype: ArchetypeId
  tiers: Record<Dimension, 'growth' | 'neutral' | 'strength'>
}

// ─── Constants ───────────────────────────────────────────
const QUESTIONS_PER_DIMENSION = 2
const MAX_SCORE_PER_QUESTION = 3
const MAX_RAW_PER_DIMENSION = QUESTIONS_PER_DIMENSION * MAX_SCORE_PER_QUESTION // 6

const TIER_THRESHOLDS = {
  growth: 4,    // < 4 → growth
  neutral: 7,   // 4–6.9 → neutral
  // >= 7 → strength
}

// ─── Core scoring function ───────────────────────────────
export function scoreDiagnostic(answers: DiagnosticAnswers): ScoringResult {
  const rawScores: Record<Dimension, number> = {
    thinking_strategy: 0,
    execution: 0,
    technical_fluency: 0,
    user_research: 0,
    communication: 0,
  }

  for (const question of DIAGNOSTIC_QUESTIONS) {
    const selectedOptionId = answers[question.id]
    if (!selectedOptionId) continue

    const selectedOption = question.options.find((o: QuestionOption) => o.id === selectedOptionId)
    if (!selectedOption) continue

    for (const [dimension, score] of Object.entries(selectedOption.scores)) {
      rawScores[dimension as Dimension] += score
    }
  }

  // Normalise to 0–10
  const dimensionScores = {} as DimensionScores
  for (const dim of Object.keys(rawScores) as Dimension[]) {
    dimensionScores[dim] = Math.round((rawScores[dim] / MAX_RAW_PER_DIMENSION) * 100) / 10
  }

  // Determine mindset axis
  const strategyScore = (dimensionScores.thinking_strategy + dimensionScores.communication) / 2
  const executionScore = (dimensionScores.execution + dimensionScores.technical_fluency) / 2
  const mindsetAxis: MindsetAxis = strategyScore >= executionScore ? 'strategy' : 'execution'

  return {
    dimensionScores,
    mindsetAxis,
    archetype: 'builder', // placeholder — needs background axis; see assignArchetype()
    tiers: getTiers(dimensionScores),
  }
}

// ─── Assign archetype from both axes ────────────────────
export function assignArchetype(
  backgroundAxis: BackgroundAxis,
  dimensionScores: DimensionScores
): ArchetypeId {
  const strategyScore = (dimensionScores.thinking_strategy + dimensionScores.communication) / 2
  const executionScore = (dimensionScores.execution + dimensionScores.technical_fluency) / 2
  const mindsetAxis: MindsetAxis = strategyScore >= executionScore ? 'strategy' : 'execution'
  return ARCHETYPE_MATRIX[backgroundAxis][mindsetAxis]
}

// ─── Full scoring pipeline ───────────────────────────────
export function runFullScoring(
  answers: DiagnosticAnswers,
  backgroundAxis: BackgroundAxis
): ScoringResult {
  const { dimensionScores, tiers } = scoreDiagnostic(answers)
  const strategyScore = (dimensionScores.thinking_strategy + dimensionScores.communication) / 2
  const executionScore = (dimensionScores.execution + dimensionScores.technical_fluency) / 2
  const mindsetAxis: MindsetAxis = strategyScore >= executionScore ? 'strategy' : 'execution'
  const archetype = ARCHETYPE_MATRIX[backgroundAxis][mindsetAxis]

  return { dimensionScores, mindsetAxis, archetype, tiers }
}

// ─── Helpers ─────────────────────────────────────────────
function getTiers(scores: DimensionScores): Record<Dimension, 'growth' | 'neutral' | 'strength'> {
  const tiers = {} as Record<Dimension, 'growth' | 'neutral' | 'strength'>
  for (const [dim, score] of Object.entries(scores)) {
    if (score < TIER_THRESHOLDS.growth) {
      tiers[dim as Dimension] = 'growth'
    } else if (score < TIER_THRESHOLDS.neutral) {
      tiers[dim as Dimension] = 'neutral'
    } else {
      tiers[dim as Dimension] = 'strength'
    }
  }
  return tiers
}

// Human-readable dimension labels
export const DIMENSION_LABELS: Record<Dimension, string> = {
  thinking_strategy: 'Thinking & Strategy',
  execution: 'Execution',
  technical_fluency: 'Technical Fluency',
  user_research: 'User & Research',
  communication: 'Communication',
}

// Tier badge styles
export const TIER_CONFIG = {
  growth: {
    label: 'Growth Area',
    color: 'text-rose-400',
    bg: 'bg-rose-950/40',
    border: 'border-rose-800',
    description: 'Focus here first — biggest opportunity for improvement',
  },
  neutral: {
    label: 'Building',
    color: 'text-amber-400',
    bg: 'bg-amber-950/40',
    border: 'border-amber-800',
    description: 'Solid foundation — targeted practice will level this up',
  },
  strength: {
    label: 'Strength',
    color: 'text-emerald-400',
    bg: 'bg-emerald-950/40',
    border: 'border-emerald-800',
    description: 'Competitive advantage — maintain and showcase this',
  },
} as const
