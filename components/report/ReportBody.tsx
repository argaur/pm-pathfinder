'use client'

import { MotionConfig } from 'framer-motion'
import { Archetype } from '@/lib/data/archetypes'
import { DIMENSION_LABELS } from '@/lib/scoring/engine'
import { Dimension } from '@/lib/data/questions'
import { Badge } from '@/components/ui/badge'
import RadarChart from '@/components/report/RadarChart'
import DimensionCard from '@/components/report/DimensionCard'
import type { RadarDataPoint } from '@/lib/report/transform'
import { REDUCED_MOTION } from '@/lib/motion'

interface ReportBodyProps {
  archetype: Archetype
  dimensionScores: Record<Dimension, number>
  tiers: Record<Dimension, 'growth' | 'neutral' | 'strength'>
  radarData: RadarDataPoint[]
  dimensions: Dimension[]
}

/**
 * The diagnostic report's content — archetype card, radar chart, dimension
 * breakdown, strengths/growth, "typically comes from". Shared by the real
 * report page (`app/(protected)/report`) and the public sample report
 * (`app/sample-report`) so there is exactly one report design, driven by
 * whatever `lib/report/transform.ts` produces from an assessments-shaped
 * object — real or static.
 */
export default function ReportBody({
  archetype,
  dimensionScores,
  tiers,
  radarData,
  dimensions,
}: ReportBodyProps) {
  return (
    <MotionConfig reducedMotion={REDUCED_MOTION}>
      {/* Archetype card */}
      <div className="bg-[#171f33] rounded-2xl p-6 mb-6 border border-white/[0.06]">
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
            <Badge
              key={t}
              className="bg-[#222a3d] border border-white/10 text-[#c3c0ff] text-xs"
            >
              {t}
            </Badge>
          ))}
        </div>
      </div>

      {/* Radar chart */}
      <div className="bg-[#171f33] rounded-2xl p-6 mb-6 border border-white/[0.06]">
        <p className="text-xs text-[#918fa1] uppercase tracking-widest mb-4">
          5-Dimension Scores
        </p>
        <RadarChart data={radarData} />
      </div>

      {/* Dimension breakdown — expandable */}
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs text-[#918fa1] uppercase tracking-widest">Dimension Breakdown</p>
        <p className="text-[11px] text-[#918fa1]">
          Click any card to expand insights
        </p>
      </div>
      <div className="flex flex-col gap-3 mb-6">
        {dimensions.map((dim) => {
          const score = dimensionScores[dim]
          const tier = tiers?.[dim] ?? 'neutral'
          return (
            <DimensionCard
              key={dim}
              dimension={dim}
              label={DIMENSION_LABELS[dim]}
              score={score}
              tier={tier}
            />
          )
        })}
      </div>

      {/* Strengths and growth */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-[#171f33] rounded-xl p-5 border border-white/[0.06]">
          <p className="text-xs text-emerald-500 uppercase tracking-widest font-medium mb-3">
            Your PM Strengths
          </p>
          <ul className="flex flex-col gap-2">
            {archetype.strengths.map((s) => (
              <li key={s} className="text-sm text-[#dae2fd] flex items-start gap-2">
                <span className="text-emerald-500 mt-0.5">✓</span>
                {s}
              </li>
            ))}
          </ul>
        </div>
        <div className="bg-[#171f33] rounded-xl p-5 border border-white/[0.06]">
          <p className="text-xs text-amber-500 uppercase tracking-widest font-medium mb-3">
            Areas to Develop
          </p>
          <ul className="flex flex-col gap-2">
            {archetype.growthAreas.map((g) => (
              <li key={g} className="text-sm text-[#dae2fd] flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">→</span>
                {g}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Typically comes from */}
      <div className="bg-[#171f33] rounded-xl p-5 border border-white/[0.06]">
        <p className="text-xs text-[#918fa1] uppercase tracking-widest mb-3">
          Typically comes from
        </p>
        <div className="flex flex-wrap gap-2">
          {archetype.comesFrom.map((role) => (
            <span
              key={role}
              className="text-xs px-3 py-1.5 rounded-full bg-[#222a3d] border border-white/10 text-[#c7c4d8]"
            >
              {role}
            </span>
          ))}
        </div>
      </div>
    </MotionConfig>
  )
}
