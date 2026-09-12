'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { getInsightsForBackground, InsightMapping } from '@/lib/data/insights-map'
import { getOnboardingAnswers } from '@/lib/utils/session'
import { classifyBackground } from '@/lib/classifiers/background'
import { BackgroundAxis } from '@/lib/data/archetypes'
import { DURATIONS, fadeUpVariants, staggerDelay } from '@/lib/motion'
import QuizShell from '@/components/quiz/QuizShell'
import JourneyCTA from '@/components/quiz/JourneyCTA'

/**
 * Stage 2 — the payoff for finishing onboarding, and the argument for starting
 * the diagnostic. Reads nothing new: it re-derives the axis from the
 * onboarding answers already in localStorage, exactly as before, and bounces
 * to /quiz if they are missing.
 */

const AXIS_LABELS: Record<BackgroundAxis, string> = {
  technical: 'Technical',
  human_centered: 'Human-Centered',
  business: 'Business',
}

export default function InsightsPage() {
  const router = useRouter()
  const [insights, setInsights] = useState<InsightMapping[]>([])
  const [backgroundLabel, setBackgroundLabel] = useState('')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onboarding = getOnboardingAnswers()
    if (!onboarding) {
      router.replace('/quiz')
      return
    }

    const axis = classifyBackground(onboarding.background, onboarding.industry)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing from session storage (external system) read above, not derived from props/state
    setBackgroundLabel(AXIS_LABELS[axis])
    setInsights(getInsightsForBackground(axis))

    // Brief delay for dramatic effect
    setTimeout(() => setVisible(true), 300)
  }, [router])

  return (
    <QuizShell
      stage="insights"
      completed={0}
      positionLabel="Before the diagnostic"
      align="top"
      eyebrow="Early insights"
      title="You already speak PM."
      subtitle={
        backgroundLabel ? (
          <>
            Based on your{' '}
            <span className="text-foreground">{backgroundLabel}</span> background,
            here&apos;s what you&apos;re already doing — in PM terms.
          </>
        ) : undefined
      }
      footer={
        <JourneyCTA
          label="Take the full diagnostic"
          onClick={() => router.push('/quiz/diagnostic')}
          note="~8 minutes · 10 questions"
        />
      }
    >
      {visible && (
        <div className="flex flex-col gap-4">
          {insights.map((insight, i) => (
            <motion.div
              key={i}
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              transition={{
                duration: DURATIONS.medium,
                delay: staggerDelay(i, 0.12, 0.1),
              }}
              className="rounded-2xl border border-border bg-surface-1 p-card-sm"
            >
              <div className="flex flex-wrap items-start gap-x-6 gap-y-3">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <Check
                    className="mt-0.5 h-4 w-4 shrink-0 text-secondary"
                    aria-hidden
                  />
                  <div className="min-w-0">
                    <p className="mb-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                      You call it
                    </p>
                    <p className="text-pretty text-sm text-foreground">
                      {insight.yourSkill}
                    </p>
                  </div>
                </div>
                <div className="min-w-0 shrink-0 text-right">
                  <p className="mb-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                    PMs call it
                  </p>
                  <p className="text-pretty text-sm font-medium text-secondary">
                    {insight.pmCallsIt}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-pretty text-xs leading-relaxed text-muted-foreground sm:pl-7">
                {insight.why}
              </p>
            </motion.div>
          ))}

          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            transition={{
              duration: DURATIONS.medium,
              delay: staggerDelay(insights.length, 0.12, 0.1),
            }}
            className="rounded-2xl border border-brand-indigo/30 bg-surface-2 p-card-sm"
          >
            <p className="text-pretty text-sm leading-relaxed text-card-foreground/85">
              These are surface signals. To understand your full picture — where
              you&apos;re strong, where the gaps are, and which PM archetype fits
              you — take the full diagnostic.
            </p>
          </motion.div>
        </div>
      )}
    </QuizShell>
  )
}
