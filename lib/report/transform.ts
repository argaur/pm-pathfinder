// ============================================================
// Report view-model transform
// Shared by app/(protected)/report and app/sample-report so both
// consume one implementation of "assessments row -> chart props".
// ============================================================

import { ARCHETYPES, Archetype, ArchetypeId } from '@/lib/data/archetypes'
import { DIMENSION_LABELS } from '@/lib/scoring/engine'
import { Dimension } from '@/lib/data/questions'

export interface RadarDataPoint {
  dimension: string
  score: number
  fullMark: number
}

/**
 * Minimal shape this transform needs from an `assessments` row. A real
 * Supabase row has more columns (id, user_id, session_id, taken_at, ...)
 * but the transform only touches these three, so the sample report can
 * supply a plain static object with the same shape instead of a DB row.
 */
export interface AssessmentLike {
  archetype: string
  dimension_scores: Record<Dimension, number>
  tiers: Record<Dimension, 'growth' | 'neutral' | 'strength'>
}

export interface ReportViewModel {
  archetype: Archetype
  dimensionScores: Record<Dimension, number>
  tiers: Record<Dimension, 'growth' | 'neutral' | 'strength'>
  radarData: RadarDataPoint[]
  dimensions: Dimension[]
}

export function toReportViewModel(assessment: AssessmentLike): ReportViewModel {
  const archetype = ARCHETYPES[assessment.archetype as ArchetypeId]
  const dimensionScores = assessment.dimension_scores
  const tiers = assessment.tiers

  const radarData = (Object.entries(dimensionScores) as [Dimension, number][]).map(
    ([dim, score]) => ({
      dimension: DIMENSION_LABELS[dim],
      score,
      fullMark: 10,
    })
  )

  const dimensions = Object.keys(dimensionScores) as Dimension[]

  return { archetype, dimensionScores, tiers, radarData, dimensions }
}
