import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ARCHETYPES } from '@/lib/data/archetypes'
import { DIMENSION_LABELS, TIER_CONFIG } from '@/lib/scoring/engine'
import { Dimension } from '@/lib/data/questions'
import { Badge } from '@/components/ui/badge'
import RadarChart from '@/components/report/RadarChart'

export default async function ReportPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: assessment } = await supabase
    .from('assessments')
    .select('*')
    .eq('user_id', user.id)
    .order('taken_at', { ascending: false })
    .limit(1)
    .single()

  if (!assessment) redirect('/quiz')

  const archetype = ARCHETYPES[assessment.archetype as keyof typeof ARCHETYPES]
  const dimensionScores = assessment.dimension_scores as Record<Dimension, number>
  const tiers = assessment.tiers as Record<Dimension, 'growth' | 'neutral' | 'strength'>

  const radarData = (Object.entries(dimensionScores) as [Dimension, number][]).map(([dim, score]) => ({
    dimension: DIMENSION_LABELS[dim],
    score,
    fullMark: 10,
  }))

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-indigo-400 font-medium mb-1">Diagnostic Report</p>
        <h1 className="text-2xl font-bold text-[#dae2fd]">Your Complete Profile</h1>
      </div>

      {/* Archetype card */}
      <div className="bg-[#171f33] rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <p className="text-xs text-[#918fa1] uppercase tracking-widest mb-1">Your PM Archetype</p>
            <h2 className="text-2xl font-bold text-[#dae2fd] mb-1">{archetype.name}</h2>
            <p className="text-sm text-[#c7c4d8]">{archetype.tagline}</p>
          </div>
          <div className="flex-shrink-0 text-xs font-mono text-[#918fa1] bg-[#222a3d] px-3 py-1.5 rounded-lg capitalize">
            {archetype.background.replace('_', '-')} × {archetype.mindset}
          </div>
        </div>

        <p className="text-sm text-[#dae2fd] leading-relaxed mb-4">{archetype.description}</p>

        <div className="flex flex-wrap gap-2">
          {archetype.traits.map((t) => (
            <Badge key={t} className="bg-[#222a3d] border border-white/10 text-[#c3c0ff] text-xs">
              {t}
            </Badge>
          ))}
        </div>
      </div>

      {/* Radar chart */}
      <div className="bg-[#171f33] rounded-2xl p-6 mb-6">
        <p className="text-xs text-[#918fa1] uppercase tracking-widest mb-4">5-Dimension Scores</p>
        <RadarChart data={radarData} />
      </div>

      {/* Dimension breakdown */}
      <div className="flex flex-col gap-3 mb-6">
        {(Object.entries(dimensionScores) as [Dimension, number][]).map(([dim, score]) => {
          const tier = tiers?.[dim] ?? 'neutral'
          const config = TIER_CONFIG[tier]
          return (
            <div key={dim} className={`border border-white/10 rounded-xl p-5 ${config.bg}`}>
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-medium text-[#dae2fd]">{DIMENSION_LABELS[dim]}</p>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono ${config.color}`}>{score.toFixed(1)}/10</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border border-white/10 ${config.bg} ${config.color}`}>
                    {config.label}
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-[#222a3d] rounded-full overflow-hidden mb-2">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-teal-500"
                  style={{ width: `${score * 10}%` }}
                />
              </div>
              <p className="text-xs text-[#918fa1]">{config.description}</p>
            </div>
          )
        })}
      </div>

      {/* Strengths and growth */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#171f33] rounded-xl p-5">
          <p className="text-xs text-emerald-500 uppercase tracking-widest font-medium mb-3">Your PM Strengths</p>
          <ul className="flex flex-col gap-2">
            {archetype.strengths.map((s) => (
              <li key={s} className="text-sm text-[#dae2fd] flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✓</span>{s}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-[#171f33] rounded-xl p-5">
          <p className="text-xs text-amber-500 uppercase tracking-widest font-medium mb-3">Areas to Develop</p>
          <ul className="flex flex-col gap-2">
            {archetype.growthAreas.map((g) => (
              <li key={g} className="text-sm text-[#dae2fd] flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">→</span>{g}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
