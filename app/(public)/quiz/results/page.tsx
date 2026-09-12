'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import { getOnboardingAnswers, getDiagnosticAnswers } from '@/lib/utils/session'
import { classifyBackground } from '@/lib/classifiers/background'
import { runFullScoring, DIMENSION_LABELS, TIER_CONFIG } from '@/lib/scoring/engine'
import { ARCHETYPES } from '@/lib/data/archetypes'
import { Dimension } from '@/lib/data/questions'
import type { ScoringResult } from '@/lib/scoring/engine'
import QuizShell from '@/components/quiz/QuizShell'
import JourneyCTA from '@/components/quiz/JourneyCTA'
import DimensionBar from '@/components/quiz/DimensionBar'

/**
 * Stage 4 — the pre-signup teaser.
 *
 * Scoring is re-run client-side from the localStorage answers exactly as
 * before; nothing is read from or written to Supabase here. The bottom three
 * dimensions stay blurred behind a plain CSS blur (not BlurGate — BlurGate
 * opens the pricing modal, which is the wrong signal for "sign in to see
 * this"), and the only action is still the push to /auth.
 */

export default function ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<ScoringResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const onboarding = getOnboardingAnswers()
      const diagnostic = getDiagnosticAnswers()

      if (!onboarding || !diagnostic) {
        router.replace('/quiz')
        return
      }

      const backgroundAxis = classifyBackground(onboarding.background, onboarding.industry)
      const scored = runFullScoring(diagnostic, backgroundAxis)
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from session storage (external system) read above, not derived from props/state
      setResult(scored)
    } catch (err) {
      console.error('[results] scoring error:', err)
      setError(err instanceof Error ? err.message : String(err))
    }
  }, [router])

  if (error) {
    return (
      <QuizShell stage="results" showProgress={false} transitionKey="error">
        <div
          role="alert"
          className="rounded-2xl border border-destructive/40 bg-surface-1 p-card-sm font-mono text-sm text-destructive"
        >
          <p className="mb-2 font-bold">Scoring error</p>
          <p className="text-pretty">{error}</p>
        </div>
      </QuizShell>
    )
  }

  if (!result) return null

  const archetype = ARCHETYPES[result.archetype]
  // Show only growth areas as teaser
  const growthDimensions = (Object.entries(result.tiers) as [Dimension, 'growth' | 'neutral' | 'strength'][])
    .filter(([, tier]) => tier === 'growth')
    .slice(0, 2)

  const scoreRows = Object.entries(result.dimensionScores) as [Dimension, number][]

  return (
    <QuizShell
      stage="results"
      completed={0}
      positionLabel="Locked preview"
      align="top"
      width="narrow"
      eyebrow="Your PM archetype"
      title={archetype.name}
      subtitle={archetype.tagline}
      transitionKey="results"
      footer={
        <JourneyCTA
          label="Unlock your full report — free"
          tone="convert"
          onClick={() => router.push('/auth')}
          note="Google sign-in · Your results are saved · Takes 10 seconds"
        />
      }
    >
      <div className="flex flex-col gap-6">
        <ul className="flex flex-wrap gap-2">
          {archetype.traits.map((trait) => (
            <li
              key={trait}
              className="rounded-full border border-brand-indigo/30 bg-brand-indigo/10 px-3 py-1.5 text-xs text-foreground"
            >
              {trait}
            </li>
          ))}
        </ul>

        {/* Blurred 5D teaser — plain CSS blur, deliberately not BlurGate. */}
        <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-1 p-card-sm">
          <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Your 5-dimension scores
          </p>

          <div className="flex flex-col gap-3">
            {scoreRows.map(([dim, score], i) => (
              <DimensionBar
                key={dim}
                label={DIMENSION_LABELS[dim]}
                score={score}
                obscured={i >= 2}
                valueClassName={TIER_CONFIG[result.tiers[dim]].color}
              />
            ))}
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-24 items-end justify-center bg-gradient-to-t from-surface-1 to-transparent pb-4">
            <p className="flex items-center gap-2 text-xs text-muted-foreground">
              <Lock className="h-3.5 w-3.5" aria-hidden />
              Sign up to unlock your full report
            </p>
          </div>
        </div>

        {growthDimensions.length > 0 && (
          <div className="rounded-2xl border border-border bg-surface-1 p-card-sm">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Your biggest growth opportunities
            </p>
            <ul className="flex flex-wrap gap-2">
              {growthDimensions.map(([dim]) => (
                <li
                  key={dim}
                  className="rounded-lg border border-rose-800/50 bg-rose-950/40 px-2.5 py-1 text-xs text-rose-400"
                >
                  {DIMENSION_LABELS[dim]}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </QuizShell>
  )
}
