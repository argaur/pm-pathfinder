'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Lock, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getOrCreateSessionToken, getOnboardingAnswers, getDiagnosticAnswers } from '@/lib/utils/session'
import { classifyBackground } from '@/lib/classifiers/background'
import { runFullScoring, DIMENSION_LABELS, TIER_CONFIG } from '@/lib/scoring/engine'
import { ARCHETYPES } from '@/lib/data/archetypes'
import { Dimension } from '@/lib/data/questions'
import type { ScoringResult } from '@/lib/scoring/engine'

export default function ResultsPage() {
  const router = useRouter()
  const [result, setResult] = useState<ScoringResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      const onboarding = getOnboardingAnswers()
      const diagnostic = getDiagnosticAnswers()

      console.log('[results] onboarding:', onboarding)
      console.log('[results] diagnostic keys:', diagnostic ? Object.keys(diagnostic).length : null)

      if (!onboarding || !diagnostic) {
        console.warn('[results] missing data — redirecting to /quiz')
        router.replace('/quiz')
        return
      }

      const backgroundAxis = classifyBackground(onboarding.background, onboarding.industry)
      console.log('[results] backgroundAxis:', backgroundAxis)

      const scored = runFullScoring(diagnostic, backgroundAxis)
      console.log('[results] scored:', scored)

      setResult(scored)
    } catch (err) {
      console.error('[results] scoring error:', err)
      setError(err instanceof Error ? err.message : String(err))
    }
  }, [router])

  if (error) return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-rose-400 text-sm font-mono bg-[#171f33] p-6 rounded-xl max-w-lg">
        <p className="font-bold mb-2">Scoring error</p>
        <p>{error}</p>
      </div>
    </main>
  )

  if (!result) return null

  const archetype = ARCHETYPES[result.archetype]
  // Show only growth areas as teaser
  const growthDimensions = (Object.entries(result.tiers) as [Dimension, 'growth' | 'neutral' | 'strength'][])
    .filter(([, tier]) => tier === 'growth')
    .slice(0, 2)

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Archetype reveal */}
          <div className="bg-[#171f33] rounded-2xl p-6 mb-6">
            <p className="text-xs uppercase tracking-widest text-indigo-400 font-medium mb-3">
              Your PM Archetype
            </p>
            <h2 className="text-3xl font-bold text-[#dae2fd] mb-2">{archetype.name}</h2>
            <p className="text-sm text-[#c7c4d8] leading-relaxed mb-4">{archetype.tagline}</p>

            <div className="flex flex-wrap gap-2">
              {archetype.traits.map((trait) => (
                <Badge
                  key={trait}
                  className="bg-[#222a3d] text-[#c3c0ff] border border-white/10 text-xs"
                >
                  {trait}
                </Badge>
              ))}
            </div>
          </div>

          {/* Partial radar — blurred teaser */}
          <div className="bg-[#171f33] rounded-2xl p-6 mb-6 relative overflow-hidden">
            <p className="text-xs uppercase tracking-widest text-[#918fa1] font-medium mb-4">
              Your 5-dimension scores
            </p>

            <div className="flex flex-col gap-3">
              {(Object.entries(result.dimensionScores) as [Dimension, number][]).map(([dim, score], i) => {
                const tier = result.tiers[dim]
                const config = TIER_CONFIG[tier]
                const isBlurred = i >= 2 // blur bottom 3

                return (
                  <div
                    key={dim}
                    className={`flex items-center gap-3 transition-all ${isBlurred ? 'blur-sm select-none' : ''}`}
                  >
                    <span className="text-xs text-[#c7c4d8] w-40 flex-shrink-0">
                      {DIMENSION_LABELS[dim]}
                    </span>
                    <div className="flex-1 h-2 bg-[#222a3d] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-teal-500"
                        style={{ width: isBlurred ? '60%' : `${score * 10}%` }}
                      />
                    </div>
                    <span className={`text-xs font-mono w-8 text-right ${config.color}`}>
                      {isBlurred ? '?' : `${score}`}
                    </span>
                  </div>
                )
              })}
            </div>

            {/* Lock overlay */}
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#171f33] to-transparent flex items-end justify-center pb-4">
              <div className="flex items-center gap-2 text-[#918fa1] text-xs">
                <Lock className="w-3.5 h-3.5" />
                Sign up to unlock your full report
              </div>
            </div>
          </div>

          {/* Growth tease */}
          {growthDimensions.length > 0 && (
            <div className="bg-[#171f33] rounded-xl p-4 mb-6">
              <p className="text-xs text-[#918fa1] mb-2">Your biggest growth opportunities:</p>
              <div className="flex gap-2 flex-wrap">
                {growthDimensions.map(([dim]) => (
                  <span
                    key={dim}
                    className="text-xs bg-rose-950/40 text-rose-400 border border-rose-800/50 px-2.5 py-1 rounded-lg"
                  >
                    {DIMENSION_LABELS[dim]}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <Button
            onClick={() => router.push('/auth')}
            className="w-full h-12 bg-[#ffb95f] hover:bg-amber-400 text-slate-950 font-semibold rounded-xl mb-3"
          >
            Unlock your full report — free
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <p className="text-center text-xs text-[#918fa1]">
            Google sign-in · Your results are saved · Takes 10 seconds
          </p>
        </motion.div>
      </div>
    </main>
  )
}
