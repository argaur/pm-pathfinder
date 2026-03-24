'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, BookOpen, Dumbbell, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { TIER_CONFIG } from '@/lib/scoring/engine'
import { DIMENSION_DETAILS } from '@/lib/data/dimension-details'
import { Dimension } from '@/lib/data/questions'

interface DimensionCardProps {
  dimension: Dimension
  label: string
  score: number
  tier: 'growth' | 'neutral' | 'strength'
  locked?: boolean
}

export default function DimensionCard({
  dimension,
  label,
  score,
  tier,
  locked = false,
}: DimensionCardProps) {
  const [open, setOpen] = useState(false)
  const config = TIER_CONFIG[tier]
  const detail = DIMENSION_DETAILS[dimension]

  return (
    <div className={`border border-white/10 rounded-xl overflow-hidden ${config.bg} transition-all`}>
      {/* Header row — always visible */}
      <button
        className="w-full text-left px-5 py-4 flex items-center gap-4 group"
        onClick={() => {
          if (!locked) setOpen((p) => !p)
        }}
        disabled={locked}
      >
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-[#dae2fd]">{label}</p>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-mono ${config.color}`}>{score.toFixed(1)}/10</span>
              <span className={`text-xs px-2 py-0.5 rounded-full border border-white/10 ${config.bg} ${config.color}`}>
                {config.label}
              </span>
            </div>
          </div>
          <div className="h-1.5 bg-[#222a3d] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-teal-500 transition-all"
              style={{ width: `${score * 10}%` }}
            />
          </div>
          {!open && (
            <p className="text-xs text-[#918fa1] mt-1.5">{config.description}</p>
          )}
        </div>

        {locked ? (
          <div className="flex-shrink-0 text-[10px] text-indigo-400 border border-indigo-500/30 bg-indigo-500/10 px-2 py-1 rounded-lg">
            Pro
          </div>
        ) : (
          <ChevronDown
            className={`w-4 h-4 text-[#918fa1] flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      {/* Expanded content */}
      <AnimatePresence initial={false}>
        {open && !locked && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 flex flex-col gap-5 border-t border-white/[0.06] pt-4">
              {/* What this skill means */}
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#918fa1] font-medium mb-2">
                  What this means in PM work
                </p>
                <p className="text-sm text-[#c7c4d8] leading-relaxed">{detail.what}</p>
              </div>

              {/* What your level means */}
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#918fa1] font-medium mb-2">
                  What your score means
                </p>
                <p className="text-sm text-[#c7c4d8] leading-relaxed">{detail.levels[tier]}</p>
              </div>

              {/* Behaviors */}
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#918fa1] font-medium mb-2">
                  At your level, you typically
                </p>
                <ul className="flex flex-col gap-2">
                  {detail.behaviors[tier].map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-[#c7c4d8]">
                      <span className={`mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0 ${config.color.replace('text-', 'bg-')}`} />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resources */}
              <div>
                <p className="text-[10px] uppercase tracking-widest text-[#918fa1] font-medium mb-2">
                  How to improve
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {detail.resources.map((r, i) => (
                    <div key={i} className="bg-[#0f1729] rounded-lg p-3.5 border border-white/[0.06]">
                      <div className="flex items-center gap-2 mb-1.5">
                        {r.type === 'read' ? (
                          <BookOpen className="w-3 h-3 text-indigo-400 flex-shrink-0" />
                        ) : (
                          <Dumbbell className="w-3 h-3 text-teal-400 flex-shrink-0" />
                        )}
                        <span className="text-[10px] uppercase tracking-widest text-[#918fa1]">
                          {r.type === 'read' ? 'Read' : 'Exercise'} · {r.duration}
                        </span>
                      </div>
                      <p className="text-xs font-medium text-[#dae2fd] mb-1">{r.title}</p>
                      <p className="text-[11px] text-[#918fa1] leading-relaxed">{r.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Deep Dive CTA */}
              <Link
                href="/deep-dive"
                className="flex items-center justify-between px-4 py-3 rounded-lg bg-[#0f1729] border border-white/[0.06] hover:border-indigo-500/30 hover:bg-indigo-500/[0.04] transition-all group"
              >
                <div>
                  <p className="text-xs font-medium text-[#dae2fd]">Deep Dive: {label}</p>
                  <p className="text-[11px] text-[#918fa1]">{detail.deepDiveHint}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#918fa1] group-hover:text-indigo-400 transition-colors flex-shrink-0" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
