import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { DIMENSION_LABELS, TIER_CONFIG } from '@/lib/scoring/engine'
import { DIMENSION_DETAILS } from '@/lib/data/dimension-details'
import { LEARNING_CHAPTERS } from '@/lib/data/learning-path'
import { Dimension } from '@/lib/data/questions'
import { ArrowRight, Lock, TrendingUp } from 'lucide-react'
import BlurGate from '@/components/ui/BlurGate'
import { getIsPro } from '@/lib/user/getIsPro'

const ROLE_THRESHOLDS = [
  { role: 'APM / Associate PM', min: 55, description: 'Entry-level PM roles, often at large tech companies' },
  { role: 'Product Manager (IC)', min: 70, description: 'Core PM roles — 2–5 years experience expected' },
  { role: 'Senior PM', min: 82, description: 'Senior IC or Lead roles — strong track record required' },
]

function getScoreLabel(score: number): { label: string; color: string } {
  if (score < 30) return { label: 'Just starting out', color: 'text-rose-400' }
  if (score < 50) return { label: 'Building foundations', color: 'text-amber-400' }
  if (score < 65) return { label: 'Getting there', color: 'text-yellow-400' }
  if (score < 75) return { label: 'Interview ready', color: 'text-teal-400' }
  return { label: 'Strongly positioned', color: 'text-emerald-400' }
}

function computeScoreBreakdown(
  dimensionScores: Record<Dimension, number>,
  completedSteps: number,
): {
  total: number
  breakdown: { label: string; score: number; max: number; description: string }[]
} {
  const totalSteps = LEARNING_CHAPTERS.reduce((acc, c) => acc + c.steps.length, 0)
  const avg = Object.values(dimensionScores).reduce((a, b) => a + b, 0) / 5
  const dimensionScore = Math.round((avg / 10) * 40)
  const pathScore = Math.round((Math.min(completedSteps, totalSteps) / totalSteps) * 25)
  const total = Math.min(dimensionScore + pathScore, 100)

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
        description: `${completedSteps} of ${totalSteps} Learning Path steps completed`,
      },
      {
        label: 'Deep Dive Analysis',
        score: 0,
        max: 20,
        description: 'Complete Deep Dive sessions to add up to 20 points',
      },
      {
        label: 'Portfolio Strength',
        score: 0,
        max: 15,
        description: 'Add case studies to your portfolio to add up to 15 points',
      },
    ],
  }
}

export default async function InterviewReadinessPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: assessment } = await supabase
    .from('assessments')
    .select('*')
    .eq('user_id', user.id)
    .order('taken_at', { ascending: false })
    .limit(1)
    .single()

  if (!assessment) redirect('/quiz')

  const dimensionScores = assessment.dimension_scores as Record<Dimension, number>
  const tiers = assessment.tiers as Record<Dimension, 'growth' | 'neutral' | 'strength'>

  let completedSteps = 0
  try {
    const { count } = await supabase
      .from('learning_path_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('status', 'complete')
    completedSteps = count ?? 0
  } catch {
    completedSteps = 0
  }

  const isPro = await getIsPro(user.id)

  const { total: score, breakdown } = computeScoreBreakdown(dimensionScores, completedSteps)
  const { label: scoreLabel, color: scoreColor } = getScoreLabel(score)

  // Top 3 gaps (dimensions with lowest scores)
  const sortedDims = (Object.entries(dimensionScores) as [Dimension, number][])
    .sort((a, b) => a[1] - b[1])
    .slice(0, 3)

  // Nearest role threshold
  const nextRole = ROLE_THRESHOLDS.find((r) => score < r.min) ?? null
  const pointsToNext = nextRole ? nextRole.min - score : 0

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-indigo-400 font-medium mb-1">
          Interview Readiness
        </p>
        <h1 className="text-2xl font-bold text-[#dae2fd] font-[family-name:var(--font-space-grotesk)]">
          Your PM Readiness Score
        </h1>
      </div>

      {/* Big score card */}
      <div className="bg-[#171f33] border border-white/[0.06] rounded-2xl p-8 mb-6 text-center">
        <div className="inline-flex flex-col items-center">
          {/* Circular ring */}
          <div className="relative w-36 h-36 mb-4">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
              {/* Background ring */}
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke="#1e2d45"
                strokeWidth="8"
              />
              {/* Score ring */}
              <circle
                cx="50" cy="50" r="42"
                fill="none"
                stroke="url(#readinessGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={`${(score / 100) * 263.9} 263.9`}
                className="transition-all duration-700"
              />
              <defs>
                <linearGradient id="readinessGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#14b8a6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold font-mono text-[#dae2fd]">{score}</span>
              <span className="text-xs text-[#918fa1]">out of 100</span>
            </div>
          </div>

          <p className={`text-lg font-semibold mb-1 ${scoreColor}`}>{scoreLabel}</p>
          {nextRole ? (
            <p className="text-sm text-[#918fa1]">
              {pointsToNext} points away from{' '}
              <span className="text-[#c7c4d8]">{nextRole.role}</span> readiness
            </p>
          ) : (
            <p className="text-sm text-emerald-400">
              You&apos;re positioned for Senior PM roles
            </p>
          )}
        </div>
      </div>

      {/* Role benchmarks */}
      <div className="bg-[#171f33] border border-white/[0.06] rounded-2xl p-6 mb-6">
        <p className="text-[10px] uppercase tracking-widest text-[#918fa1] font-medium mb-4">
          Role Benchmarks
        </p>
        <div className="flex flex-col gap-4">
          {ROLE_THRESHOLDS.map((r) => {
            const reached = score >= r.min
            return (
              <div key={r.role}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${reached ? 'bg-emerald-400' : 'bg-[#3d4a60]'}`} />
                    <span className={`text-sm font-medium ${reached ? 'text-[#dae2fd]' : 'text-[#918fa1]'}`}>
                      {r.role}
                    </span>
                  </div>
                  <span className={`text-xs font-mono ${reached ? 'text-emerald-400' : 'text-[#918fa1]'}`}>
                    {reached ? '✓ Reached' : `Need ${r.min}`}
                  </span>
                </div>
                <div className="h-2 bg-[#222a3d] rounded-full overflow-hidden ml-4">
                  <div
                    className={`h-full rounded-full transition-all ${reached ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-indigo-600 to-indigo-500'}`}
                    style={{ width: `${Math.min((score / r.min) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-[11px] text-[#918fa1] ml-4 mt-1">{r.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Score breakdown — Pro locked */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] uppercase tracking-widest text-[#918fa1] font-medium">
            Score Breakdown
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-indigo-400">
            <Lock className="w-3 h-3" />
            Pro feature
          </div>
        </div>
        <BlurGate locked={!isPro} label="Full score breakdown">
          <div className="bg-[#171f33] border border-white/[0.06] rounded-2xl p-6">
            <div className="flex flex-col gap-5">
              {breakdown.map((item) => (
                <div key={item.label}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-[#dae2fd]">{item.label}</span>
                    <span className="text-xs font-mono text-[#918fa1]">
                      {item.score} / {item.max}
                    </span>
                  </div>
                  <div className="h-1.5 bg-[#222a3d] rounded-full overflow-hidden mb-1">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-teal-500"
                      style={{ width: `${(item.score / item.max) * 100}%` }}
                    />
                  </div>
                  <p className="text-[11px] text-[#918fa1]">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </BlurGate>
      </div>

      {/* What's holding you back — Pro locked */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] uppercase tracking-widest text-[#918fa1] font-medium">
            What&apos;s Holding You Back
          </p>
          <div className="flex items-center gap-1.5 text-[11px] text-indigo-400">
            <Lock className="w-3 h-3" />
            Pro feature
          </div>
        </div>
        <BlurGate locked={!isPro} label="Personalised gap analysis">
          <div className="bg-[#171f33] border border-white/[0.06] rounded-2xl p-6">
            <div className="flex flex-col gap-4">
              {sortedDims.map(([dim, score], i) => {
                const tier = tiers[dim]
                const config = TIER_CONFIG[tier]
                const detail = DIMENSION_DETAILS[dim]
                return (
                  <div key={dim} className="flex gap-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#222a3d] flex items-center justify-center">
                      <span className="text-[11px] font-mono text-[#918fa1]">{i + 1}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-[#dae2fd]">
                          {DIMENSION_LABELS[dim]}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border border-white/10 ${config.bg} ${config.color}`}>
                          {config.label}
                        </span>
                      </div>
                      <p className="text-xs text-[#918fa1] mb-2">{detail.nextStepAction}</p>
                      <Link
                        href="/roadmap"
                        className="inline-flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                      >
                        Go to Learning Path
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                    <span className={`text-sm font-mono flex-shrink-0 ${config.color}`}>
                      {score.toFixed(1)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </BlurGate>
      </div>

      {/* Improve your score CTA */}
      <div className="bg-[#171f33] border border-indigo-500/20 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          <p className="text-sm font-medium text-[#dae2fd]">How to improve your score</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { label: 'Complete Learning Path chapters', href: '/roadmap', points: '+25 pts' },
            { label: 'Do Deep Dive sessions', href: '/deep-dive', points: '+20 pts' },
            { label: 'Build your portfolio', href: '/profile', points: '+15 pts' },
            { label: 'Retake the diagnostic', href: '/quiz/diagnostic', points: 'Re-score' },
          ].map(({ label, href, points }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-between px-4 py-3 rounded-xl bg-[#0f1729] border border-white/[0.06] hover:border-indigo-500/30 transition-all group"
            >
              <span className="text-xs text-[#c7c4d8] group-hover:text-[#dae2fd] transition-colors">
                {label}
              </span>
              <span className="text-[11px] font-mono text-indigo-400 flex-shrink-0 ml-2">
                {points}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
