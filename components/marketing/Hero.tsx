'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { motion, MotionConfig } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { DURATIONS, EASINGS, REDUCED_MOTION, fadeUpVariants, staggerDelay } from '@/lib/motion'

/**
 * Page-opening hero.
 *
 * Two consumers by design:
 *   1. `app/u/[id]/page.tsx` — a person's public case-study portfolio header
 *      (monogram aside, archetype eyebrow, PM story as the lede).
 *   2. `app/page.tsx` — the product landing header (next step in the redesign;
 *      it will reuse this file verbatim, passing product copy and an amber CTA).
 *
 * So nothing here is portfolio-specific: every string, pill and action is a
 * prop, and the visual slot (`aside`) takes whatever the page wants to put
 * beside the copy — an avatar monogram on the portfolio, a product visual on
 * the landing page.
 *
 * Colour rules this component encodes (measured, do not "fix" them):
 *   - brand-indigo is 2.94:1 as text on dark and fails AA, so it is only ever
 *     used here as a *fill* (button background, ring, wash) — never as text.
 *   - the amber CTA always carries `text-slate-950` (11.87:1). Never light text
 *     on amber.
 */

export type HeroActionVariant = 'amber' | 'indigo' | 'ghost'

export interface HeroAction {
  label: string
  href: string
  /** amber = primary conversion CTA, indigo = secondary solid, ghost = quiet link. */
  variant?: HeroActionVariant
  /** Show a trailing arrow. Defaults to true for amber/indigo, false for ghost. */
  trailingIcon?: boolean
}

export interface HeroProps {
  /** Small uppercase label above the title. Landing: category. Portfolio: archetype. */
  eyebrow?: string
  /** The one line the page is about. Rendered as the page's h1. */
  title: string
  /** Optional supporting sentence(s) under the title. */
  lede?: string
  /** Pill row — traits on the portfolio, feature words on the landing page. */
  badges?: string[]
  /** Terse mono facts, joined with separators (e.g. "Business background · 3 case studies"). */
  meta?: string[]
  /** Zero, one or two calls to action. */
  actions?: HeroAction[]
  /** Visual slot rendered beside (desktop) or above (mobile) the copy. */
  aside?: ReactNode
  /** Left is the default; the landing page may want centre. */
  align?: 'left' | 'center'
  /** Anything extra below the actions (stats strip, note, scroll cue). */
  children?: ReactNode
  className?: string
}

const ACTION_STYLES: Record<HeroActionVariant, string> = {
  amber:
    'bg-brand-amber text-slate-950 shadow-glow-amber hover:bg-amber-400 focus-visible:outline-brand-amber',
  indigo:
    'bg-brand-indigo text-white hover:bg-indigo-500 focus-visible:outline-indigo-400',
  ghost:
    'bg-transparent text-foreground border border-border hover:bg-surface-2 focus-visible:outline-indigo-400',
}

export default function Hero({
  eyebrow,
  title,
  lede,
  badges,
  meta,
  actions,
  aside,
  align = 'left',
  children,
  className,
}: HeroProps) {
  const centered = align === 'center'
  let step = 0
  const nextDelay = () => staggerDelay(step++)

  return (
    <MotionConfig reducedMotion={REDUCED_MOTION}>
    <header
      className={cn(
        'relative overflow-hidden border-b border-border bg-surface-0',
        className
      )}
    >
      {/* Ambient indigo wash. Fill only — indigo is never text. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-48 right-[-12rem] h-[36rem] w-[36rem] rounded-full bg-brand-indigo/10 blur-[130px]"
      />

      <div
        className={cn(
          'relative mx-auto flex max-w-4xl flex-col gap-8 px-6 py-16 sm:py-section',
          centered ? 'items-center text-center' : 'items-start',
          aside && !centered && 'sm:flex-row sm:items-center sm:gap-10'
        )}
      >
        {aside && (
          <motion.div
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            transition={{ duration: DURATIONS.slow, ease: EASINGS.easeOutExpo }}
            className="shrink-0"
          >
            {aside}
          </motion.div>
        )}

        <div
          className={cn(
            'flex min-w-0 flex-col',
            centered ? 'items-center' : 'items-start'
          )}
        >
          {eyebrow && (
            <motion.p
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: DURATIONS.medium, delay: nextDelay() }}
              className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground"
            >
              {eyebrow}
            </motion.p>
          )}

          <motion.h1
            variants={fadeUpVariants}
            initial="hidden"
            animate="visible"
            transition={{
              duration: DURATIONS.slow,
              delay: nextDelay(),
              ease: EASINGS.easeOutExpo,
            }}
            className="text-balance font-heading text-3xl font-bold leading-tight tracking-tight text-foreground sm:text-4xl"
          >
            {title}
          </motion.h1>

          {lede && (
            <motion.p
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: DURATIONS.medium, delay: nextDelay() }}
              className={cn(
                'mt-4 max-w-2xl text-pretty text-base leading-relaxed text-card-foreground/80',
                centered && 'mx-auto'
              )}
            >
              {lede}
            </motion.p>
          )}

          {meta && meta.length > 0 && (
            <motion.p
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: DURATIONS.medium, delay: nextDelay() }}
              className="mt-4 font-mono text-xs text-muted-foreground"
            >
              {meta.join(' · ')}
            </motion.p>
          )}

          {badges && badges.length > 0 && (
            <motion.ul
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: DURATIONS.medium, delay: nextDelay() }}
              className={cn(
                'mt-5 flex flex-wrap gap-2',
                centered && 'justify-center'
              )}
            >
              {badges.map((badge) => (
                <li
                  key={badge}
                  className="rounded-full border border-brand-indigo/30 bg-brand-indigo/10 px-3 py-1.5 text-xs text-foreground"
                >
                  {badge}
                </li>
              ))}
            </motion.ul>
          )}

          {actions && actions.length > 0 && (
            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: DURATIONS.medium, delay: nextDelay() }}
              className={cn(
                'mt-8 flex flex-wrap gap-3',
                centered && 'justify-center'
              )}
            >
              {actions.map((action) => {
                const variant = action.variant ?? 'indigo'
                const showIcon = action.trailingIcon ?? variant !== 'ghost'
                return (
                  <Link
                    key={action.href + action.label}
                    href={action.href}
                    className={cn(
                      'inline-flex min-h-[44px] items-center gap-2 rounded-xl px-6 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2',
                      ACTION_STYLES[variant]
                    )}
                  >
                    {action.label}
                    {showIcon && <ArrowRight className="h-4 w-4" aria-hidden />}
                  </Link>
                )
              })}
            </motion.div>
          )}

          {children && (
            <motion.div
              variants={fadeUpVariants}
              initial="hidden"
              animate="visible"
              transition={{ duration: DURATIONS.medium, delay: nextDelay() }}
              className="mt-8 w-full"
            >
              {children}
            </motion.div>
          )}
        </div>
      </div>
    </header>
    </MotionConfig>
  )
}
