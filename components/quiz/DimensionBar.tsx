'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { DURATIONS } from '@/lib/motion'

/**
 * One 5-dimension score row.
 *
 * /quiz/results and /reveal both draw this list, three minutes apart in the
 * journey, and previously drew it two different ways — different label widths,
 * different bar heights, different gradients. Same data, so: same row.
 *
 * `obscured` is the pre-signup teaser state on /quiz/results. It is a plain CSS
 * blur plus a masked value, deliberately not BlurGate — BlurGate opens the
 * pricing modal, which is the wrong signal for "sign up to see this".
 */

export interface DimensionBarProps {
  label: string
  /** Score on the 0-10 dimension scale. */
  score: number
  /** Text shown at the right. Defaults to the rounded score. */
  display?: string
  /** Tailwind text colour class for the value (tier colour on the results page). */
  valueClassName?: string
  /** Teaser state: blurs the row and pins the bar at a neutral width. */
  obscured?: boolean
  /** Animate the bar filling from zero, after this delay (seconds). */
  animateFill?: boolean
  delay?: number
}

export default function DimensionBar({
  label,
  score,
  display,
  valueClassName,
  obscured = false,
  animateFill = false,
  delay = 0,
}: DimensionBarProps) {
  const width = obscured ? 60 : Math.max(0, Math.min(score, 10)) * 10
  const value = obscured ? '?' : (display ?? `${Math.round(score)}`)

  return (
    <div
      className={cn(
        'flex items-center gap-3',
        obscured && 'select-none blur-sm'
      )}
      aria-hidden={obscured || undefined}
    >
      <span className="w-36 shrink-0 truncate text-xs text-card-foreground/80">
        {label}
      </span>
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-surface-2">
        {animateFill ? (
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-brand-indigo to-secondary"
            initial={{ width: 0 }}
            animate={{ width: `${width}%` }}
            transition={{ delay, duration: DURATIONS.long }}
          />
        ) : (
          <div
            className="h-full rounded-full bg-gradient-to-r from-brand-indigo to-secondary"
            style={{ width: `${width}%` }}
          />
        )}
      </div>
      <span
        className={cn(
          'w-8 shrink-0 text-right font-mono text-xs',
          valueClassName ?? 'text-foreground'
        )}
      >
        {value}
      </span>
    </div>
  )
}
