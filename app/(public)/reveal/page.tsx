'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import { ARCHETYPES } from '@/lib/data/archetypes'
import type { ArchetypeId } from '@/lib/data/archetypes'
import { DIMENSION_LABELS } from '@/lib/scoring/engine'
import { Dimension } from '@/lib/data/questions'
import { DURATIONS, EASINGS, fadeUpVariants, staggerDelay } from '@/lib/motion'
import QuizShell from '@/components/quiz/QuizShell'
import JourneyCTA from '@/components/quiz/JourneyCTA'
import DimensionBar from '@/components/quiz/DimensionBar'

/**
 * Stage 5 — the last screen of the journey, shown once after signup.
 *
 * It is drawn in the same shell as the four screens before it, with the rail
 * completing rather than disappearing: the analysis phase reads "Analysing" on
 * a nearly full rail, and the reveal fills it. That is the whole point of the
 * shared progress model — the payoff is visibly the end of the same line the
 * person started on /quiz.
 *
 * Data behaviour is unchanged: the same pm_archetype_revealed localStorage
 * guard, the same auth check, the same single assessments read, the same
 * push to /dashboard.
 *
 * Pacing: the reveal used to flip as soon as a 2.5s timer (started only
 * after the data fetch resolved) expired — a clock unrelated to the 2.2s
 * radar-draw animation running alongside it, so on a fast connection the
 * screen changed right as the animation was barely finishing. The reveal
 * now waits for all three of: the data being ready, the radar having
 * genuinely finished drawing, and a MIN_HOLD_MS floor timed from mount (not
 * from data-ready), so the loading screen always gets seen for a real
 * minimum stretch regardless of how fast the query comes back. The last
 * SETTLE_MS of that floor swaps the cycling phrase for a static "ready" beat
 * with a small pulse, so the cut to the report card reads as a payoff
 * instead of an interruption.
 */

const LOADING_PHRASES = [
  'Analyzing your profile...',
  'Mapping your strengths...',
  'Identifying skill gaps...',
  'Generating your archetype...',
]

const MIN_HOLD_MS = 4500
const SETTLE_MS = 600

// Pentagon vertices for 5 dimensions, centered at 100,100 radius 62
const PENTAGON = '100,38 158.8,79.6 136.3,149.6 63.7,149.6 41.2,79.6'
const PENTAGON_VERTICES = ['100,38', '158.8,79.6', '136.3,149.6', '63.7,149.6', '41.2,79.6']
const PENTAGON_OUTLINE_LENGTH = 330 // approx total perimeter

type Phase = 'loading' | 'reveal'

export default function RevealPage() {
  const router = useRouter()
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [archetype, setArchetype] = useState<(typeof ARCHETYPES)[ArchetypeId] | null>(null)
  const [scores, setScores] = useState<Record<Dimension, number> | null>(null)
  const [drawProgress, setDrawProgress] = useState(0) // 0 → 1
  const [archetypeLoaded, setArchetypeLoaded] = useState(false)
  const [settled, setSettled] = useState(false)
  const dataReady = useRef(false)

  // Cycle loading phrases until the final settle beat takes over
  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((i) => (settled ? i : (i + 1) % LOADING_PHRASES.length))
    }, 650)
    return () => clearInterval(interval)
  }, [settled])

  // Minimum-hold floor, timed from mount so it runs in parallel with the
  // data fetch rather than chained after it.
  useEffect(() => {
    const timer = setTimeout(() => setSettled(true), MIN_HOLD_MS - SETTLE_MS)
    return () => clearTimeout(timer)
  }, [])

  // Reveal only once the data has arrived, the radar has genuinely finished
  // drawing, and the minimum hold has elapsed — derived, not stored, so
  // there's no extra render round-trip or setState-in-effect.
  const phase: Phase = archetypeLoaded && settled && drawProgress >= 1 ? 'reveal' : 'loading'

  // Animate radar draw 0 → 1 over 2.2s
  useEffect(() => {
    const start = performance.now()
    const duration = 2200
    const raf = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      setDrawProgress(t)
      if (t < 1) requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)
  }, [])

  // Fetch archetype data
  useEffect(() => {
    // Skip reveal if user has seen it before (returning visit)
    if (localStorage.getItem('pm_archetype_revealed')) {
      router.replace('/dashboard')
      return
    }

    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) {
        router.replace('/auth')
        return
      }

      const { data: assessment } = await supabase
        .from('assessments')
        .select('archetype, dimension_scores')
        .eq('user_id', user.id)
        .order('taken_at', { ascending: false })
        .limit(1)
        .single()

      if (!assessment?.archetype) {
        router.replace('/dashboard')
        return
      }

      setArchetype(ARCHETYPES[assessment.archetype as ArchetypeId])
      setScores(assessment.dimension_scores as Record<Dimension, number>)
      dataReady.current = true
      setArchetypeLoaded(true)
    })
  }, [router])

  const handleContinue = () => {
    localStorage.setItem('pm_archetype_revealed', '1')
    router.push('/dashboard')
  }

  const dashOffset = PENTAGON_OUTLINE_LENGTH * (1 - drawProgress)

  if (phase === 'loading' || !archetype) {
    return (
      <QuizShell
        stage="reveal"
        completed={0}
        positionLabel="Analysing"
        transitionKey="loading"
        width="full"
      >
        <div className="flex flex-col items-center gap-10">
          <motion.div
            className="relative h-48 w-48"
            animate={settled ? { scale: [1, 1.06, 1] } : { scale: 1 }}
            transition={{ duration: SETTLE_MS / 1000, ease: EASINGS.easeOutExpo }}
          >
            <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden>
              {/* Grid rings */}
              {[0.33, 0.66, 1].map((scale, i) => (
                <polygon
                  key={i}
                  points={PENTAGON}
                  fill="none"
                  stroke="currentColor"
                  className="text-surface-2"
                  strokeWidth="1"
                  transform={`scale(${scale}) translate(${100 - 100 * scale}, ${100 - 100 * scale})`}
                  style={{ transformOrigin: '100px 100px' }}
                />
              ))}
              {/* Axis lines */}
              {PENTAGON_VERTICES.map((pt, i) => (
                <line
                  key={i}
                  x1="100"
                  y1="100"
                  x2={pt.split(',')[0]}
                  y2={pt.split(',')[1]}
                  stroke="currentColor"
                  className="text-surface-2"
                  strokeWidth="1"
                />
              ))}
              {/* Drawing outline — animates in */}
              <polygon
                points={PENTAGON}
                fill="none"
                stroke="currentColor"
                className="text-primary"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray={PENTAGON_OUTLINE_LENGTH}
                strokeDashoffset={dashOffset}
                style={{ transition: 'stroke-dashoffset 0.05s linear' }}
              />
              {/* Filled area — fades in with draw */}
              <polygon
                points={PENTAGON}
                fill="currentColor"
                className="text-brand-indigo/15"
                stroke="none"
                style={{ opacity: drawProgress }}
              />
              {/* Center dot */}
              <circle
                cx="100"
                cy="100"
                r="3"
                fill="currentColor"
                className="text-secondary"
                style={{ opacity: drawProgress }}
              />
            </svg>

            {/* Pulsing ring — decorative, disabled under reduced motion (it's a continuous
                large-scale pulse, not a loading spinner the layout depends on). */}
            <div
              aria-hidden
              className="absolute inset-0 animate-ping rounded-full border border-brand-indigo/20 motion-reduce:hidden"
              style={{ animationDuration: '2s', display: settled ? 'none' : undefined }}
            />
          </motion.div>

          <div className="space-y-2 text-center" role="status" aria-live="polite">
            <AnimatePresence mode="wait">
              {settled ? (
                <motion.p
                  key="ready"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: DURATIONS.base }}
                  className="font-mono text-sm tracking-wide text-brand-amber"
                >
                  Profile ready
                </motion.p>
              ) : (
                <motion.p
                  key={phraseIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: DURATIONS.base }}
                  className="font-mono text-sm tracking-wide text-primary"
                >
                  {LOADING_PHRASES[phraseIndex]}
                </motion.p>
              )}
            </AnimatePresence>
            <p className="text-xs text-muted-foreground">
              PM Pathfinder · Personalised assessment
            </p>
          </div>
        </div>
      </QuizShell>
    )
  }

  return (
    <QuizShell
      stage="reveal"
      completed={1}
      positionLabel="Complete"
      align="top"
      width="full"
      transitionKey="reveal"
      eyebrow="Persona profile"
      title={archetype.name}
      subtitle={
        <>
          <span className="block text-base italic text-secondary">
            &ldquo;{archetype.tagline}&rdquo;
          </span>
          <span className="mt-2 block italic text-muted-foreground">
            You are not starting from zero.
          </span>
        </>
      }
      footer={
        <JourneyCTA
          label="See Your Roadmap"
          onClick={handleContinue}
          note="Your full report and personalised learning path await"
        />
      }
    >
      <div className="flex flex-col gap-6">
        <motion.ul
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: DURATIONS.medium, delay: staggerDelay(0, 0.1, 0.15) }}
          className="flex flex-wrap gap-2"
        >
          {archetype.traits.map((trait) => (
            <li
              key={trait}
              className="rounded-full border border-brand-indigo/30 bg-brand-indigo/10 px-3 py-1.5 text-xs font-medium text-foreground"
            >
              {trait}
            </li>
          ))}
        </motion.ul>

        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: DURATIONS.medium, delay: staggerDelay(1, 0.1, 0.15) }}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <div className="rounded-2xl border border-border bg-surface-1 p-card-sm">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Your profile
            </p>
            <p className="text-pretty text-sm leading-relaxed text-card-foreground/85">
              {archetype.description}
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-surface-1 p-card-sm">
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              5-dimension scan
            </p>
            <div className="flex flex-col gap-2.5">
              {scores &&
                (Object.entries(scores) as [Dimension, number][]).map(
                  ([dim, score], i) => (
                    <DimensionBar
                      key={dim}
                      label={DIMENSION_LABELS[dim]}
                      score={score}
                      display={score.toFixed(0)}
                      valueClassName="text-primary"
                      animateFill
                      delay={staggerDelay(i, 0.08, 0.7)}
                    />
                  )
                )}
            </div>
          </div>
        </motion.div>

        <motion.div
          variants={fadeUpVariants}
          initial="hidden"
          animate="visible"
          transition={{ duration: DURATIONS.medium, delay: staggerDelay(2, 0.1, 0.15) }}
        >
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
            Typically comes from
          </p>
          <ul className="flex flex-wrap gap-2">
            {archetype.comesFrom.map((role) => (
              <li
                key={role}
                className="rounded-full border border-brand-amber/25 bg-brand-amber/10 px-3 py-1 text-xs text-brand-amber"
              >
                {role}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </QuizShell>
  )
}
