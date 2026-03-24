import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ARCHETYPES } from '@/lib/data/archetypes'
import { DIMENSION_LABELS, TIER_CONFIG } from '@/lib/scoring/engine'
import { DIMENSION_DETAILS } from '@/lib/data/dimension-details'
import { LEARNING_CHAPTERS } from '@/lib/data/learning-path'
import { Dimension } from '@/lib/data/questions'
import {
  FileText,
  Map,
  Microscope,
  Target,
  ArrowRight,
  TrendingUp,
  Calendar,
  BookOpen,
  Activity,
} from 'lucide-react'
import MultiRadarChart, {
  RadarSeriesPoint,
  RadarSeries,
} from '@/components/dashboard/MultiRadarChart'
import BlurGate from '@/components/ui/BlurGate'

// Archetype accent colours (for gradient cards)
const ARCHETYPE_GRADIENTS: Record<string, string> = {
  builder: 'from-blue-900/60 to-[#171f33]',
  architect: 'from-indigo-900/60 to-[#171f33]',
  storyteller: 'from-violet-900/60 to-[#171f33]',
  advocate: 'from-pink-900/60 to-[#171f33]',
  operator: 'from-amber-900/60 to-[#171f33]',
  strategist: 'from-emerald-900/60 to-[#171f33]',
}

const QUICK_LINKS = [
  { href: '/report', icon: FileText, label: 'My Report', desc: 'Full archetype + skill gap map', color: 'text-indigo-400' },
  { href: '/roadmap', icon: Map, label: 'Learning Path', desc: '5 chapters, personalised to your gaps', color: 'text-teal-400' },
  { href: '/deep-dive', icon: Microscope, label: 'Deep Dive', desc: 'Sub-category breakdown per dimension', color: 'text-violet-400' },
  { href: '/interview-readiness', icon: Target, label: 'Interview Readiness', desc: 'Your score + what to fix', color: 'text-amber-400' },
]

function computeReadinessScore(
  dimensionScores: Record<Dimension, number>,
  completedSteps: number,
): number {
  const totalSteps = LEARNING_CHAPTERS.reduce((acc, c) => acc + c.steps.length, 0)
  const avg = Object.values(dimensionScores).reduce((a, b) => a + b, 0) / 5
  const dimensionScore = (avg / 10) * 40
  const pathScore = (Math.min(completedSteps, totalSteps) / totalSteps) * 25
  return Math.round(dimensionScore + pathScore)
}

function getWeakestDimension(scores: Record<Dimension, number>): Dimension {
  return (Object.entries(scores) as [Dimension, number][]).reduce((a, b) =>
    b[1] < a[1] ? b : a
  )[0]
}

function daysSince(dateStr: string): number {
  return Math.floor((Date.now() - new Date(dateStr).getTime()) / (1000 * 60 * 60 * 24))
}

const RADAR_COLORS = ['#374151', '#4f46e5', '#06b6d4', '#10b981']

export default async function DashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const [{ data: profile }, { data: allAssessments }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('assessments')
      .select('*')
      .eq('user_id', user.id)
      .order('taken_at', { ascending: true }),
  ])

  if (!allAssessments || allAssessments.length === 0) redirect('/quiz')

  const latest = allAssessments[allAssessments.length - 1]
  const archetype = ARCHETYPES[latest.archetype as keyof typeof ARCHETYPES]
  const dimensionScores = latest.dimension_scores as Record<Dimension, number>
  const tiers = latest.tiers as Record<Dimension, 'growth' | 'neutral' | 'strength'>

  // Learning path progress
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

  const totalSteps = LEARNING_CHAPTERS.reduce((acc, c) => acc + c.steps.length, 0)
  const readinessScore = computeReadinessScore(dimensionScores, completedSteps)
  const weakestDim = getWeakestDimension(dimensionScores)
  const daysSinceEval = daysSince(latest.taken_at)
  const gradientClass = ARCHETYPE_GRADIENTS[latest.archetype] ?? 'from-indigo-900/60 to-[#171f33]'

  // Build multi-radar data
  // Assessments are sorted oldest → newest; show up to last 3
  const visibleAssessments = allAssessments.slice(-3)
  const radarData: RadarSeriesPoint[] = (Object.keys(dimensionScores) as Dimension[]).map((dim) => {
    const point: RadarSeriesPoint = {
      dimension: DIMENSION_LABELS[dim].split(' & ')[0], // shorten label for chart
      fullMark: 10,
    }
    visibleAssessments.forEach((a, i) => {
      point[`eval_${i}`] = (a.dimension_scores as Record<Dimension, number>)[dim]
    })
    return point
  })

  const radarSeries: RadarSeries[] = visibleAssessments.map((a, i) => {
    const isLatest = i === visibleAssessments.length - 1
    const date = new Date(a.taken_at).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
    })
    return {
      key: `eval_${i}`,
      label: isLatest ? `Latest (${date})` : `Eval ${i + 1} (${date})`,
      color: RADAR_COLORS[i + (4 - visibleAssessments.length)],
      fillOpacity: isLatest ? 0.2 : 0.06,
      strokeWidth: isLatest ? 2 : 1,
    }
  })

  // Activity feed (derived from assessments)
  const activityItems = [
    ...allAssessments
      .slice()
      .reverse()
      .slice(0, 4)
      .map((a, i) => ({
        label: i === 0 ? 'Completed diagnostic assessment' : `Retook diagnostic — became ${a.archetype}`,
        sub: new Date(a.taken_at).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
        icon: Activity,
        color: 'text-indigo-400',
      })),
    {
      label: 'Joined PM Pathfinder',
      sub: new Date(allAssessments[0].taken_at).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      icon: BookOpen,
      color: 'text-teal-400',
    },
  ]

  const firstName = profile?.display_name?.split(' ')[0] ?? 'there'

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-indigo-400 font-medium mb-0.5">
            Dashboard
          </p>
          <h1 className="text-2xl font-bold text-[#dae2fd] font-[family-name:var(--font-space-grotesk)]">
            Welcome back, {firstName}
          </h1>
        </div>
        <p className="text-xs text-[#918fa1]">
          Last eval:{' '}
          {new Date(latest.taken_at).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </p>
      </div>

      {/* ── Archetype hero + Stats row ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Archetype card */}
        <div
          className={`md:col-span-2 bg-gradient-to-br ${gradientClass} border border-white/[0.07] rounded-2xl p-6`}
        >
          <p className="text-[10px] uppercase tracking-widest text-[#918fa1] mb-2">Your PM Archetype</p>
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-[#dae2fd] mb-1">{archetype.name}</h2>
              <p className="text-sm text-[#c7c4d8]">{archetype.tagline}</p>
            </div>
            <span className="text-[10px] font-mono text-[#918fa1] bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg capitalize whitespace-nowrap">
              {archetype.background.replace('_', '-')} × {archetype.mindset}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {archetype.traits.map((t) => (
              <span
                key={t}
                className="text-[10px] px-2.5 py-1 rounded-full bg-white/[0.07] border border-white/10 text-[#c3c0ff]"
              >
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Stat cards — 2×2 grid */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          {/* Learning Path — ring */}
          <div className="bg-[#171f33] border border-white/[0.06] rounded-2xl p-4 flex flex-col items-center justify-center gap-2">
            <p className="text-[10px] uppercase tracking-widest text-[#918fa1] self-start">Learning Path</p>
            {(() => {
              const pct = totalSteps > 0 ? completedSteps / totalSteps : 0
              const r = 28
              const circ = 2 * Math.PI * r
              const offset = circ * (1 - pct)
              return (
                <div className="relative flex items-center justify-center">
                  <svg width="72" height="72" className="-rotate-90">
                    <circle cx="36" cy="36" r={r} fill="none" stroke="#222a3d" strokeWidth="5" />
                    <circle
                      cx="36" cy="36" r={r} fill="none"
                      stroke="#4fdbc8" strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray={circ}
                      strokeDashoffset={offset}
                      style={{ transition: 'stroke-dashoffset 0.6s ease' }}
                    />
                  </svg>
                  <span className="absolute text-sm font-bold font-mono text-teal-400">
                    {Math.round(pct * 100)}%
                  </span>
                </div>
              )
            })()}
            <p className="text-[11px] text-[#918fa1]">{completedSteps} / {totalSteps} steps</p>
          </div>

          {/* Days active */}
          <div className="bg-[#171f33] border border-white/[0.06] rounded-2xl p-4 flex flex-col justify-between">
            <p className="text-[10px] uppercase tracking-widest text-[#918fa1]">Days Active</p>
            <div>
              <p className="text-2xl font-bold font-mono text-indigo-400">
                {daysSince(allAssessments[0].taken_at)}
              </p>
              <p className="text-[11px] text-[#918fa1]">since you joined</p>
            </div>
          </div>

          {/* Assessments */}
          <div className="bg-[#171f33] border border-white/[0.06] rounded-2xl p-4 flex flex-col justify-between">
            <p className="text-[10px] uppercase tracking-widest text-[#918fa1]">Assessments</p>
            <div>
              <p className="text-2xl font-bold font-mono text-violet-400">{allAssessments.length}</p>
              <p className="text-[11px] text-[#918fa1]">taken so far</p>
            </div>
          </div>

          {/* Interview Readiness teaser */}
          <div className="bg-[#171f33] border border-white/[0.06] rounded-2xl p-4 flex flex-col justify-between">
            <p className="text-[10px] uppercase tracking-widest text-[#918fa1]">Interview Ready</p>
            <div>
              <p className="text-2xl font-bold font-mono text-amber-400">
                {readinessScore}
                <span className="text-sm text-[#918fa1] font-normal"> / 100</span>
              </p>
              <Link
                href="/interview-readiness"
                className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                See breakdown →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ── Skill History + What to do next ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Multi-radar */}
        <div className="md:col-span-2 bg-[#171f33] border border-white/[0.06] rounded-2xl p-6">
          <div className="flex items-center justify-between mb-1">
            <p className="text-[10px] uppercase tracking-widest text-[#918fa1] font-medium">
              Skill History
            </p>
            {allAssessments.length === 1 && (
              <Link
                href="/quiz/diagnostic"
                className="text-[10px] text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Retake to see growth →
              </Link>
            )}
          </div>
          {allAssessments.length > 1 && (
            <p className="text-[11px] text-[#918fa1] mb-3">
              {allAssessments.length} evaluations — each polygon is one assessment
            </p>
          )}
          <MultiRadarChart data={radarData} series={radarSeries} height={260} />
        </div>

        {/* What to do next */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#171f33] border border-white/[0.06] rounded-2xl p-5 flex-1">
            <p className="text-[10px] uppercase tracking-widest text-[#918fa1] font-medium mb-3">
              What to do next
            </p>
            <div className="mb-3">
              <div className="flex items-center gap-2 mb-1.5">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full border border-white/10 ${TIER_CONFIG[tiers[weakestDim]].bg} ${TIER_CONFIG[tiers[weakestDim]].color}`}
                >
                  {TIER_CONFIG[tiers[weakestDim]].label}
                </span>
                <span className="text-xs font-medium text-[#dae2fd]">
                  {DIMENSION_LABELS[weakestDim]}
                </span>
              </div>
              <p className="text-xs text-[#918fa1] leading-relaxed">
                {DIMENSION_DETAILS[weakestDim].nextStepAction}
              </p>
            </div>
            <Link
              href="/roadmap"
              className="flex items-center justify-between w-full px-3.5 py-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/15 transition-all group"
            >
              <span className="text-xs font-medium text-indigo-300">Open Learning Path</span>
              <ArrowRight className="w-3.5 h-3.5 text-indigo-400 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Dimension score mini-list */}
          <div className="bg-[#171f33] border border-white/[0.06] rounded-2xl p-5">
            <p className="text-[10px] uppercase tracking-widest text-[#918fa1] font-medium mb-3">
              Current Scores
            </p>
            <div className="flex flex-col gap-2">
              {(Object.entries(dimensionScores) as [Dimension, number][]).map(([dim, score]) => {
                const tier = tiers?.[dim] ?? 'neutral'
                const cfg = TIER_CONFIG[tier]
                return (
                  <div key={dim} className="flex items-center gap-2">
                    <span className="text-[11px] text-[#918fa1] w-20 flex-shrink-0 truncate">
                      {DIMENSION_LABELS[dim].split(' & ')[0]}
                    </span>
                    <div className="flex-1 h-1 bg-[#222a3d] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-teal-500"
                        style={{ width: `${score * 10}%` }}
                      />
                    </div>
                    <span className={`text-[11px] font-mono w-7 text-right ${cfg.color}`}>
                      {score.toFixed(1)}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ── Activity feed ── */}
      <div className="bg-[#171f33] border border-white/[0.06] rounded-2xl p-6">
        <p className="text-[10px] uppercase tracking-widest text-[#918fa1] font-medium mb-4">
          Activity
        </p>
        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {activityItems.slice(0, 5).map((item, i) => {
            const Icon = item.icon
            return (
              <div key={i} className="flex items-center gap-2">
                <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${item.color}`} />
                <span className="text-xs text-[#c7c4d8]">{item.label}</span>
                <span className="text-[11px] text-[#918fa1]">· {item.sub}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Quick links ── */}
      <div>
        <p className="text-[10px] uppercase tracking-widest text-[#918fa1] font-medium mb-3">
          Explore
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {QUICK_LINKS.map(({ href, icon: Icon, label, desc, color }) => (
            <Link
              key={href}
              href={href}
              className="bg-[#171f33] border border-white/[0.06] rounded-xl p-4 hover:bg-[#1a2438] hover:border-white/10 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <Icon className={`w-4 h-4 ${color}`} />
                <ArrowRight className="w-3.5 h-3.5 text-[#918fa1] group-hover:text-[#c7c4d8] transition-colors" />
              </div>
              <p className="text-sm font-medium text-[#dae2fd] mb-0.5">{label}</p>
              <p className="text-[11px] text-[#918fa1] leading-relaxed">{desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Re-evaluate nudge (inline, not a separate nav item) ── */}
      {daysSinceEval >= 7 && (
        <div className="bg-[#171f33] border border-teal-500/20 rounded-2xl p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-teal-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-[#dae2fd]">Time for a re-evaluation?</p>
              <p className="text-xs text-[#918fa1]">
                It&apos;s been {daysSinceEval} days since your last assessment.
              </p>
            </div>
          </div>
          <Link
            href="/profile#evaluations"
            className="text-xs font-medium text-teal-400 hover:text-teal-300 whitespace-nowrap transition-colors"
          >
            Go to Profile →
          </Link>
        </div>
      )}
    </div>
  )
}
