'use client'

import { useEffect, useRef, type ReactNode } from 'react'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import {
  DURATIONS,
  EASINGS,
  REDUCED_MOTION,
  fadeUpVariants,
  slideXVariants,
} from '@/lib/motion'
import JourneyProgress from './JourneyProgress'
import type { JourneyStageId } from './journey'

/**
 * The single frame every assessment screen is drawn inside.
 *
 * Five pages previously repeated their own `<main>`, their own atmospheric
 * orbs, their own fixed footer gradient and their own eyebrow/heading type
 * scale — with small drifts in each copy. This owns all of it, so the only
 * thing a page supplies is its content, its position in the journey, and its
 * footer action.
 *
 * Motion is shared too: `transition="slide"` for moving between units of the
 * same stage (question to question), `"fade"` for arriving at a new screen.
 * Both come from lib/motion.ts — no inline timing numbers.
 *
 * Colour rules (measured, do not "fix"):
 *   - brand-indigo is 2.94:1 as text on dark and fails AA. Fill only here (the
 *     ambient wash, the completed rail), never text.
 *   - amber always carries text-slate-950. Never light text on amber.
 */

export interface QuizShellProps {
  /** Where this screen sits in the journey. */
  stage: JourneyStageId
  /** Units of that stage already completed — drives the rail fill. */
  completed?: number
  /** Override the right-hand position readout on the rail. */
  positionLabel?: string
  /** Hide the rail entirely (the reveal's loading phase has no position yet). */
  showProgress?: boolean

  /** Small uppercase label above the title. */
  eyebrow?: string
  /** The screen's h1. */
  title?: ReactNode
  /** Supporting sentence under the title. */
  subtitle?: ReactNode

  /**
   * Changes to this value re-run the content transition. Use the question id,
   * step index, or phase name — whatever identifies "a new thing to read".
   */
  transitionKey?: string | number
  /** How the content region enters and leaves. */
  transition?: 'slide' | 'fade' | 'none'

  /** Content column width. Options lists want 'wide'; prose wants 'narrow'. */
  width?: 'narrow' | 'wide' | 'full'
  /** Vertically centre the content (default) or let it start at the top. */
  align?: 'center' | 'top'

  /** Renders an exit affordance in the top bar when provided. */
  onExit?: () => void
  /** Fixed bottom action area. Usually a <JourneyCTA />. */
  footer?: ReactNode

  children: ReactNode
}

const WIDTHS = {
  narrow: 'max-w-lg',
  wide: 'max-w-xl',
  full: 'max-w-2xl',
} as const

export default function QuizShell({
  stage,
  completed = 0,
  positionLabel,
  showProgress = true,
  eyebrow,
  title,
  subtitle,
  transitionKey,
  transition = 'fade',
  width = 'narrow',
  align = 'center',
  onExit,
  footer,
  children,
}: QuizShellProps) {
  const columnWidth = WIDTHS[width]
  const hasHeader = Boolean(eyebrow || title || subtitle)

  // Every question/step change re-keys the AnimatePresence content but doesn't navigate — no
  // Next.js route change happens, so nothing moves focus or announces the new heading to a
  // screen-reader or keyboard user. Move focus to the new screen's h1 on every change after the
  // first mount (the first mount is a real route change and Next.js's own route announcer covers
  // it). Queried from the content container rather than a ref on QuizShell's own <h1> because
  // some screens (the diagnostic's chunk-intro card) supply their own h1 as `children` instead of
  // the `title` prop — both need the same tabIndex={-1} + focus() treatment to be reachable here.
  const contentRef = useRef<HTMLDivElement>(null)
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    contentRef.current?.querySelector<HTMLElement>('h1')?.focus()
  }, [transitionKey])

  const motionProps =
    transition === 'slide'
      ? {
          variants: slideXVariants,
          initial: 'enter',
          animate: 'center',
          exit: 'exit',
          transition: { duration: DURATIONS.short },
        }
      : transition === 'fade'
        ? {
            variants: fadeUpVariants,
            initial: 'hidden',
            animate: 'visible',
            exit: 'hidden',
            transition: { duration: DURATIONS.medium, ease: EASINGS.easeOutExpo },
          }
        : {}

  return (
    <MotionConfig reducedMotion={REDUCED_MOTION}>
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-surface-0">
      <a href="#quiz-content" className="skip-link">
        Skip to content
      </a>

      {/* Ambient wash. Fill only — indigo is never text. */}
      <div
        aria-hidden
        className="pointer-events-none fixed -bottom-40 right-[-10rem] -z-10 h-[32rem] w-[32rem] rounded-full bg-brand-indigo/10 blur-[130px]"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed -top-40 left-[-10rem] -z-10 h-[26rem] w-[26rem] rounded-full bg-secondary/[0.07] blur-[120px]"
      />

      {/* Top bar — brand mark, rail, exit. Identical on all five screens. */}
      <header className="shrink-0 px-6 pt-6">
        <div className={cn('mx-auto w-full', columnWidth)}>
          <div className="flex items-center gap-4">
            <span className="font-heading text-xs font-bold tracking-tight text-primary">
              PM Pathfinder
            </span>
            <div className="flex-1" />
            {onExit && (
              <button
                type="button"
                onClick={onExit}
                aria-label="Exit the assessment"
                className="-m-2 flex h-11 w-11 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
              >
                <X className="h-4 w-4" aria-hidden />
              </button>
            )}
          </div>

          {showProgress && (
            <JourneyProgress
              stage={stage}
              completed={completed}
              positionLabel={positionLabel}
              className="mt-4"
            />
          )}
        </div>
      </header>

      {/* Content — one column, one type scale, one transition. */}
      <div
        id="quiz-content"
        className={cn(
          'flex flex-1 flex-col px-6 pt-10',
          footer ? 'pb-36' : 'pb-16',
          align === 'center' ? 'justify-center' : 'justify-start'
        )}
      >
        <div ref={contentRef} className={cn('mx-auto w-full', columnWidth)}>
          <AnimatePresence mode="wait">
            <motion.div key={transitionKey ?? stage} {...motionProps}>
              {hasHeader && (
                <div className="mb-8">
                  {eyebrow && (
                    <p className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-secondary">
                      {eyebrow}
                    </p>
                  )}
                  {title && (
                    <h1
                      tabIndex={-1}
                      className="text-balance font-heading text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
                    >
                      {title}
                    </h1>
                  )}
                  {subtitle && (
                    <p className="mt-3 text-pretty text-sm leading-relaxed text-card-foreground/80">
                      {subtitle}
                    </p>
                  )}
                </div>
              )}
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {footer && (
        <div className="fixed inset-x-0 bottom-0 bg-gradient-to-t from-surface-0 via-surface-0/95 to-transparent px-6 pb-8 pt-6">
          <div className={cn('mx-auto w-full', columnWidth)}>{footer}</div>
        </div>
      )}
    </main>
    </MotionConfig>
  )
}
