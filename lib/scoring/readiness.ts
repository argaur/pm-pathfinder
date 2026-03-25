import { LEARNING_CHAPTERS } from '@/lib/data/learning-path'
import { Dimension } from '@/lib/data/questions'

export const TOTAL_STEPS = LEARNING_CHAPTERS.reduce((acc, c) => acc + c.steps.length, 0)

export interface ReadinessBreakdownItem {
  label: string
  score: number
  max: number
  description: string
}

export interface ReadinessResult {
  total: number
  breakdown: ReadinessBreakdownItem[]
}

export function computeReadinessScore({
  dimensionScores,
  completedSteps,
  completedDeepDives,
}: {
  dimensionScores: Record<Dimension, number>
  completedSteps: number
  completedDeepDives: number
}): ReadinessResult {
  const avg = Object.values(dimensionScores).reduce((a, b) => a + b, 0) / 5

  const dimensionScore  = Math.round((avg / 10) * 40)
  const pathScore       = TOTAL_STEPS > 0
    ? Math.round((Math.min(completedSteps, TOTAL_STEPS) / TOTAL_STEPS) * 25)
    : 0
  const deepDiveScore   = Math.round((Math.min(completedDeepDives, 5) / 5) * 20)
  const portfolioScore  = 0 // post-MVP

  const total = Math.min(dimensionScore + pathScore + deepDiveScore + portfolioScore, 100)

  return {
    total,
    breakdown: [
      {
        label: 'Skill Assessment',
        score: dimensionScore,
        max: 40,
        description: 'Based on your 5-dimension diagnostic scores',
      },
      {
        label: 'Learning Progress',
        score: pathScore,
        max: 25,
        description: `${completedSteps} of ${TOTAL_STEPS} Learning Path steps completed`,
      },
      {
        label: 'Deep Dive Analysis',
        score: deepDiveScore,
        max: 20,
        description: `${completedDeepDives} of 5 Deep Dive sessions completed`,
      },
      {
        label: 'Portfolio Strength',
        score: portfolioScore,
        max: 15,
        description: 'Add case studies to your portfolio (coming soon)',
      },
    ],
  }
}
