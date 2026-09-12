'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { DURATIONS, EASINGS } from '@/lib/motion'
import {
  JOURNEY_STAGES,
  getStage,
  getStageIndex,
  journeyProgress,
  stageFill,
  type JourneyStageId,
} from './journey'

/**
 * The journey rail — one continuous bar, segmented by stage, shown on every
 * screen of the assessment.
 *
 * Segment widths are proportional to each stage's unit count, so the diagnostic
 * visibly is the long part of the journey and the three onboarding steps
 * visibly are not. Completed stages read solid, the current stage fills as the
 * person moves through it, and stages ahead stay as empty track.
 *
 * Colour rules (measured, do not "fix"):
 *   - brand-indigo is 2.94:1 as text on dark and fails AA. It is a fill here
 *     only (the completed track), never text.
 *   - the readout text uses foreground/muted-foreground, both AA on surface-0.
 */

export interface JourneyProgressProps {
  /** Stage the person is currently on. */
  stage: JourneyStageId
  /** Units of the current stage already completed. */
  completed?: number
  /**
   * Right-hand position readout, e.g. "Question 7 of 10". Omit to have it
   * derived from the stage's unit noun and `completed`.
   */
  positionLabel?: string
  className?: string
}

export default function JourneyProgress({
  stage,
  completed = 0,
  positionLabel,
  className,
}: JourneyProgressProps) {
  const current = getStage(stage)
  const stageNumber = getStageIndex(stage) + 1
  const overall = journeyProgress(stage, completed)

  const derivedPosition =
    current.units > 1
      ? `${current.unitNoun} ${Math.min(completed + 1, current.units)} of ${current.units}`
      : current.unitNoun
  const position = positionLabel ?? derivedPosition

  return (
    <div
      className={cn('flex flex-col gap-2', className)}
      role="group"
      aria-label="Assessment progress"
    >
      <div className="flex items-baseline justify-between gap-4 font-mono text-[10px] uppercase tracking-[0.18em]">
        <span className="truncate text-muted-foreground">
          Stage {stageNumber} of {JOURNEY_STAGES.length} · {current.label}
        </span>
        <span className="shrink-0 text-foreground/80">{position}</span>
      </div>

      <div
        className="flex gap-1"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(overall * 100)}
        aria-valuetext={`${current.label}, ${position}`}
      >
        {JOURNEY_STAGES.map((s) => {
          const fill = stageFill(s.id, stage, completed)
          return (
            <div
              key={s.id}
              style={{ flexGrow: s.units }}
              className="h-1 overflow-hidden rounded-full bg-surface-2"
            >
              <motion.div
                className={cn(
                  'h-full rounded-full',
                  s.id === stage ? 'bg-secondary' : 'bg-brand-indigo'
                )}
                initial={false}
                animate={{ width: `${fill * 100}%` }}
                transition={{ duration: DURATIONS.medium, ease: EASINGS.easeInOut }}
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
