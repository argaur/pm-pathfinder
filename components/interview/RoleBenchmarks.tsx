'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { DIMENSION_LABELS, TIER_CONFIG } from '@/lib/scoring/engine'
import { Dimension } from '@/lib/data/questions'
import { ROLE_THRESHOLDS } from '@/lib/data/role-thresholds'

export { ROLE_THRESHOLDS }

interface Props {
  score: number
  dimensionScores: Record<Dimension, number>
  tiers: Record<Dimension, 'growth' | 'neutral' | 'strength'>
}

export default function RoleBenchmarks({ score, dimensionScores, tiers }: Props) {
  const [expanded, setExpanded] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-4">
      {ROLE_THRESHOLDS.map((r) => {
        const reached = score >= r.min
        const canExpand = score >= r.unlocksAt - 10 // within 10pts of unlock threshold
        const isExpanded = expanded === r.role
        const prereqRole = ROLE_THRESHOLDS.find((p) => p.min === r.unlocksAt)

        return (
          <div key={r.role} className={`rounded-xl border transition-all ${
            reached ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-white/5 bg-[#131b2e]'
          }`}>
            {/* Header row */}
            <button
              onClick={() => canExpand ? setExpanded(isExpanded ? null : r.role) : undefined}
              className={`w-full text-left px-5 py-4 ${canExpand ? 'cursor-pointer' : 'cursor-default'}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${reached ? 'bg-emerald-400' : 'bg-[#3d4a60]'}`} />
                  <span className={`text-sm font-medium ${reached ? 'text-[#dae2fd]' : 'text-[#918fa1]'}`}>
                    {r.role}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-mono ${reached ? 'text-emerald-400' : 'text-[#918fa1]'}`}>
                    {reached ? '✓ Reached' : `Need ${r.min}`}
                  </span>
                  {canExpand && (
                    <ChevronDown className={`w-4 h-4 text-[#918fa1] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                  )}
                </div>
              </div>
              <div className="h-2 bg-[#222a3d] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${reached ? 'bg-gradient-to-r from-emerald-500 to-teal-400' : 'bg-gradient-to-r from-indigo-600 to-indigo-500'}`}
                  style={{ width: `${Math.min((score / r.min) * 100, 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-[#918fa1] mt-1">{r.description}</p>
            </button>

            {/* Locked message */}
            {!canExpand && prereqRole && (
              <div className="px-5 pb-4">
                <p className="text-xs text-[#918fa1] italic">
                  Reach {prereqRole.role} readiness first to unlock this breakdown.
                </p>
              </div>
            )}

            {/* Expanded content */}
            {canExpand && isExpanded && (
              <div className="px-5 pb-5 border-t border-white/5 pt-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Skills generally required */}
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#918fa1] font-mono mb-2">
                      Skills required
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {r.requiredSkills.map((skill) => (
                        <div key={skill} className="flex items-center gap-2 text-xs text-[#c7c4d8]">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                          {skill}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* What the user already has */}
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#918fa1] font-mono mb-2">
                      Your current standing
                    </p>
                    <div className="flex flex-col gap-1.5">
                      {r.dimensionFocus.map((dim) => {
                        const tier = tiers[dim]
                        const cfg = TIER_CONFIG[tier]
                        const s = dimensionScores[dim]
                        return (
                          <div key={dim} className="flex items-center justify-between text-xs">
                            <span className="text-[#918fa1] truncate mr-2">
                              {DIMENSION_LABELS[dim].split(' & ')[0]}
                            </span>
                            <span className={`font-mono flex-shrink-0 ${cfg.color}`}>
                              {s.toFixed(1)} · {cfg.label}
                            </span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
