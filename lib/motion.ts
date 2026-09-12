import type { Transition, Variants } from 'framer-motion'

/**
 * Shared framer-motion timing/easing constants and variants.
 *
 * These are inventoried verbatim from the ten files already using
 * framer-motion (app/page.tsx, quiz flow, reveal, deep-dive, profile,
 * DimensionCard) — not a new design system. They're a first-pass draft
 * meant to be revisited later in the plan. No 'use client' here: this
 * module is constants and types only, safe to import from server or
 * client components.
 */

/** Durations (seconds) as used today, keyed by their most common role. */
export const DURATIONS = {
  /** ProfileClient tab switch (AnimatePresence exit/enter). */
  fast: 0.15,
  /** DimensionCard + DeepDiveClient collapse/expand and question-step exit. */
  quick: 0.2,
  /** DimensionCard collapse ease-in-out, quiz step forward/back transition. */
  short: 0.25,
  /** reveal.tsx inline step fade, reveal score-bar fill. */
  base: 0.3,
  /** reveal.tsx modal card enter, quiz/diagnostic card + progress bar. */
  medium: 0.4,
  /** quiz/results hero fade-up. */
  long: 0.5,
  /** reveal.tsx hero card entrance, app/page.tsx hero fade-up. */
  slow: 0.6,
} as const satisfies Record<string, number>

/**
 * Named easing curves in active use. Most transitions in the codebase omit
 * `ease` entirely and rely on framer-motion's implicit default — only add
 * an explicit easing here when a file already sets one.
 */
export const EASINGS = {
  /** DimensionCard's collapse/expand transition. */
  easeInOut: 'easeInOut' as const,
  /** reveal.tsx hero card entrance — the custom cubic-bezier already used there. */
  easeOutExpo: [0.16, 1, 0.3, 1] as [number, number, number, number],
}

/** y-offset values (px) used for fade-up entrances, smallest to largest, as found in the codebase. */
export const Y_OFFSETS = {
  xs: 6,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
} as const satisfies Record<string, number>

/** x-offset (px) used for horizontal slide transitions (quiz step forward/back). */
export const X_OFFSET = 24

/**
 * Per-item delay increments used with `i * increment` inside `.map()` loops
 * for list entrances (app/page.tsx, quiz/insights/page.tsx). No
 * `staggerChildren` container exists anywhere in the codebase today — every
 * "stagger" is this manual per-index delay pattern.
 */
export const STAGGER_INCREMENTS = {
  tight: 0.06,
  base: 0.07,
  loose: 0.08,
  wide: 0.1,
  wider: 0.12,
} as const satisfies Record<string, number>

/**
 * Fade + rise entrance. Matches the most common `initial`/`animate` pair
 * across quiz, reveal, deep-dive, dashboard and DimensionCard usage
 * (`{ opacity: 0, y }` → `{ opacity: 1, y: 0 }`).
 */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: Y_OFFSETS.lg },
  visible: { opacity: 1, y: 0 },
}

/** Plain opacity fade, no movement — matches reveal.tsx's outer AnimatePresence wrapper. */
export const fadeVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

/** Horizontal slide used for quiz/page.tsx step-to-step transitions. */
export const slideXVariants: Variants = {
  enter: { opacity: 0, x: X_OFFSET },
  center: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -X_OFFSET },
}

/**
 * Collapse/expand for accordion-style content (DimensionCard's explanation
 * panel, DeepDiveClient's expanded answer).
 */
export const collapseVariants: Variants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { height: 'auto', opacity: 1 },
}

/** Transition paired with collapseVariants — matches DimensionCard's `{ duration: 0.25, ease: 'easeInOut' }`. */
export const collapseTransition: Transition = {
  duration: DURATIONS.short,
  ease: EASINGS.easeInOut,
}

/** Default transition for fadeUp/fade variants where the codebase uses a bare duration with no easing. */
export const baseTransition: Transition = {
  duration: DURATIONS.medium,
}

/**
 * Stagger helper matching the existing `transition={{ delay: i * increment }}`
 * pattern used in app/page.tsx and quiz/insights/page.tsx — a drop-in
 * replacement for the inline arithmetic, not a new mechanism.
 */
export function staggerDelay(
  index: number,
  increment: number = STAGGER_INCREMENTS.base,
  baseDelay = 0
): number {
  return baseDelay + index * increment
}

/**
 * framer-motion does not read `prefers-reduced-motion` on its own — every
 * `fadeUpVariants`/`slideXVariants` entrance in this codebase animates `y`/`x`
 * regardless of the OS setting unless something opts in to reduced motion.
 *
 * The fix is `<MotionConfig reducedMotion={REDUCED_MOTION}>` wrapped around
 * each surface's root (Hero, CaseStudy, QuizShell, ReportBody, the landing
 * page). `"user"` makes framer-motion detect `prefers-reduced-motion: reduce`
 * itself and, for any element under that provider, apply `x`/`y`/`scale`/
 * `rotate` target values instantly while still crossfading `opacity` —
 * exactly the "replace slide/scale with an opacity crossfade" rule, with no
 * per-component branching needed. Height/width animations (e.g. an accordion
 * expand) are unaffected by this setting; they aren't a vestibular trigger.
 */
export const REDUCED_MOTION = 'user' as const
