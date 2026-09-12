import { TOTAL_QUESTIONS } from '@/lib/data/questions'

/**
 * The one progress model for the whole assessment journey.
 *
 * Five screens used to each invent their own progress chrome: /quiz drew three
 * dots that reset at the door, /quiz/diagnostic drew a 0-100% bar that also
 * started at zero, and /quiz/insights, /quiz/results and /reveal drew nothing
 * at all. A recruiter clicking through read that as five products.
 *
 * So progress is defined once, here, as a single ordered list of stages, each
 * contributing a number of "units" (one unit = one thing the person does). The
 * journey total is the sum. Every screen reports its stage plus how many units
 * of that stage are done, and the shared rail resolves that to one position in
 * one journey — which is what makes "Step 2 of 3" on one screen and
 * "Question 7 of 10" on the next read as two points on the same line.
 *
 * No 'use client' directive here on purpose: this module is constants and pure
 * functions, importable from server or client components (same rule as
 * lib/data/role-thresholds.ts).
 */

export type JourneyStageId =
  | 'onboarding'
  | 'insights'
  | 'diagnostic'
  | 'results'
  | 'reveal'

export interface JourneyStage {
  id: JourneyStageId
  /** Name on the rail and in the "Stage n of 5" readout. */
  label: string
  /** How many units this stage contributes to the journey total. */
  units: number
  /** Singular noun for the position readout: "Step 2 of 3", "Question 7 of 10". */
  unitNoun: string
}

export const JOURNEY_STAGES: readonly JourneyStage[] = [
  { id: 'onboarding', label: 'About you', units: 3, unitNoun: 'Step' },
  { id: 'insights', label: 'Early read', units: 1, unitNoun: 'Warm-up' },
  // Sourced from the question bank rather than hardcoded, so the rail cannot
  // drift from the actual diagnostic length.
  { id: 'diagnostic', label: 'Diagnostic', units: TOTAL_QUESTIONS, unitNoun: 'Question' },
  { id: 'results', label: 'Your scores', units: 1, unitNoun: 'Preview' },
  { id: 'reveal', label: 'Archetype', units: 1, unitNoun: 'Complete' },
] as const

export const JOURNEY_TOTAL_UNITS = JOURNEY_STAGES.reduce(
  (total, stage) => total + stage.units,
  0
)

export function getStage(id: JourneyStageId): JourneyStage {
  const stage = JOURNEY_STAGES.find((s) => s.id === id)
  if (!stage) throw new Error(`Unknown journey stage: ${id}`)
  return stage
}

/** 0-based position of a stage in the journey. */
export function getStageIndex(id: JourneyStageId): number {
  return JOURNEY_STAGES.findIndex((s) => s.id === id)
}

/** Units completed before this stage is entered. */
export function unitsBefore(id: JourneyStageId): number {
  const index = getStageIndex(id)
  return JOURNEY_STAGES.slice(0, index).reduce((total, s) => total + s.units, 0)
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

/**
 * Overall journey completion, 0 to 1.
 *
 * @param id                 the stage the person is on
 * @param completedInStage   units of that stage already done
 */
export function journeyProgress(id: JourneyStageId, completedInStage = 0): number {
  const stage = getStage(id)
  const done = clamp(completedInStage, 0, stage.units)
  return (unitsBefore(id) + done) / JOURNEY_TOTAL_UNITS
}

/** Fill of one stage's own rail segment, 0 to 1. */
export function stageFill(
  id: JourneyStageId,
  current: JourneyStageId,
  completedInStage = 0
): number {
  const index = getStageIndex(id)
  const currentIndex = getStageIndex(current)
  if (index < currentIndex) return 1
  if (index > currentIndex) return 0
  const stage = getStage(id)
  return clamp(completedInStage, 0, stage.units) / stage.units
}
