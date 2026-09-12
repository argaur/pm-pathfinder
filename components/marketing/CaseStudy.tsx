'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { DURATIONS, EASINGS, fadeUpVariants, staggerDelay } from '@/lib/motion'

/**
 * One case study, rendered as the main unit of content on the public portfolio
 * page — not as a list row. The narrative (Problem → Approach → Outcome) is the
 * point, so it gets the full measure, a numbered marker and a connecting rail.
 *
 * Blocks with no content are dropped rather than shown empty, so a
 * partially-filled case study still reads as finished prose.
 */

export interface CaseStudyProps {
  /** Zero-based position, used for the marker number and the entrance stagger. */
  index: number
  title: string
  problem?: string | null
  approach?: string | null
  outcome?: string | null
  className?: string
}

const BLOCK_LABELS = [
  { key: 'problem', label: 'Problem' },
  { key: 'approach', label: 'Approach' },
  { key: 'outcome', label: 'Outcome' },
] as const

export default function CaseStudy({
  index,
  title,
  problem,
  approach,
  outcome,
  className,
}: CaseStudyProps) {
  const values: Record<(typeof BLOCK_LABELS)[number]['key'], string | null | undefined> =
    { problem, approach, outcome }

  const blocks = BLOCK_LABELS.filter(({ key }) => {
    const value = values[key]
    return typeof value === 'string' && value.trim().length > 0
  })

  const number = String(index + 1).padStart(2, '0')

  return (
    <motion.article
      variants={fadeUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      transition={{
        duration: DURATIONS.long,
        delay: staggerDelay(index, 0.08),
        ease: EASINGS.easeOutExpo,
      }}
      className={cn(
        'relative rounded-2xl border border-border bg-surface-1 p-card-sm sm:p-card',
        className
      )}
    >
      <div className="flex items-baseline gap-4">
        {/* Indigo is a fill here, never text: the numeral sits on an indigo wash. */}
        <span
          aria-hidden
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-indigo/20 font-mono text-sm font-semibold text-foreground"
        >
          {number}
        </span>
        <h3 className="font-heading text-lg font-semibold leading-snug text-foreground sm:text-xl">
          {title}
        </h3>
      </div>

      {blocks.length > 0 && (
        <dl className="mt-6 flex flex-col gap-5 border-l border-border pl-5 sm:ml-[1.125rem]">
          {blocks.map(({ key, label }) => (
            <div key={key} className="relative">
              <span
                aria-hidden
                className="absolute -left-[1.4375rem] top-2 h-1.5 w-1.5 rounded-full bg-brand-amber"
              />
              <dt className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {label}
              </dt>
              <dd className="text-pretty text-sm leading-relaxed text-card-foreground/85">
                {values[key]}
              </dd>
            </div>
          ))}
        </dl>
      )}
    </motion.article>
  )
}
