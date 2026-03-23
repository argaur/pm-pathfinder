'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { getInsightsForBackground, InsightMapping } from '@/lib/data/insights-map'
import { getOnboardingAnswers } from '@/lib/utils/session'
import { classifyBackground } from '@/lib/classifiers/background'
import { BackgroundAxis } from '@/lib/data/archetypes'

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
    setBackgroundLabel(AXIS_LABELS[axis])
    setInsights(getInsightsForBackground(axis))

    // Brief delay for dramatic effect
    setTimeout(() => setVisible(true), 300)
  }, [router])

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-slate-950">
      <div className="w-full max-w-lg">
        {visible && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <p className="text-xs uppercase tracking-widest text-teal-400 font-medium mb-3">
              Early insights
            </p>
            <h2 className="text-2xl font-semibold text-white mb-2">
              You already speak PM.
            </h2>
            <p className="text-sm text-slate-400 mb-8">
              Based on your <span className="text-slate-300">{backgroundLabel}</span> background,
              here&apos;s what you&apos;re already doing — in PM terms.
            </p>

            <div className="flex flex-col gap-4 mb-10">
              {insights.map((insight, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.12 }}
                  className="bg-slate-900/60 border border-slate-800 rounded-xl p-5"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <CheckCircle className="w-4 h-4 text-teal-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-500 mb-0.5">You call it</p>
                      <p className="text-sm text-slate-300">{insight.yourSkill}</p>
                    </div>
                    <div className="ml-auto text-right pl-4">
                      <p className="text-xs text-slate-500 mb-0.5">PMs call it</p>
                      <p className="text-sm font-medium text-teal-400">{insight.pmCallsIt}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 leading-relaxed pl-7">{insight.why}</p>
                </motion.div>
              ))}
            </div>

            <div className="bg-indigo-950/40 border border-indigo-900/60 rounded-xl p-5 mb-8">
              <p className="text-sm text-indigo-300 leading-relaxed">
                These are surface signals. To understand your full picture — where you&apos;re strong,
                where the gaps are, and which PM archetype fits you — take the full diagnostic.
              </p>
            </div>

            <Button
              onClick={() => router.push('/quiz/diagnostic')}
              className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl"
            >
              Take the full diagnostic
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <p className="text-center text-xs text-slate-600 mt-3">~8 minutes · 10 questions</p>
          </motion.div>
        )}
      </div>
    </main>
  )
}
