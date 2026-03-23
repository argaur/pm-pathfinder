'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { ARCHETYPES } from '@/lib/data/archetypes'
import type { ArchetypeId } from '@/lib/data/archetypes'
import { DIMENSION_LABELS } from '@/lib/scoring/engine'
import { Dimension } from '@/lib/data/questions'

const LOADING_PHRASES = [
  'Analyzing your profile...',
  'Mapping your strengths...',
  'Identifying skill gaps...',
  'Generating your archetype...',
]

// Pentagon vertices for 5 dimensions, centered at 100,100 radius 62
const PENTAGON = '100,38 158.8,79.6 136.3,149.6 63.7,149.6 41.2,79.6'
const PENTAGON_OUTLINE_LENGTH = 330 // approx total perimeter

type Phase = 'loading' | 'reveal'

export default function RevealPage() {
  const router = useRouter()
  const [phase, setPhase] = useState<Phase>('loading')
  const [phraseIndex, setPhraseIndex] = useState(0)
  const [archetype, setArchetype] = useState<(typeof ARCHETYPES)[ArchetypeId] | null>(null)
  const [scores, setScores] = useState<Record<Dimension, number> | null>(null)
  const [drawProgress, setDrawProgress] = useState(0) // 0 → 1
  const dataReady = useRef(false)
  const timerDone = useRef(false)

  // Cycle loading phrases
  useEffect(() => {
    const interval = setInterval(() => {
      setPhraseIndex((i) => (i + 1) % LOADING_PHRASES.length)
    }, 650)
    return () => clearInterval(interval)
  }, [])

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

      // Transition to reveal only after minimum 2.5s
      setTimeout(() => {
        timerDone.current = true
        setPhase('reveal')
      }, 2500)
    })
  }, [router])

  const handleContinue = () => {
    localStorage.setItem('pm_archetype_revealed', '1')
    router.push('/dashboard')
  }

  // Polygon points scaled by dimension score (0-10 → 0-62 radius from center 100,100)
  const getScaledPoints = () => {
    if (!scores) return PENTAGON
    const dims: Dimension[] = ['thinking_strategy', 'execution', 'technical_fluency', 'user_research', 'communication']
    const angles = [-90, -90 + 72, -90 + 144, -90 + 216, -90 + 288]
    return angles
      .map((angle, i) => {
        const score = scores[dims[i]] ?? 5
        const r = (score / 10) * 62
        const rad = (angle * Math.PI) / 180
        return `${(100 + r * Math.cos(rad)).toFixed(1)},${(100 + r * Math.sin(rad)).toFixed(1)}`
      })
      .join(' ')
  }

  const dashOffset = PENTAGON_OUTLINE_LENGTH * (1 - drawProgress)

  return (
    <main className="min-h-screen bg-[#0b1326] flex items-center justify-center px-6 relative overflow-hidden">
      {/* Atmospheric orbs */}
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/[0.07] rounded-full blur-[120px] pointer-events-none" />

      <AnimatePresence mode="wait">

        {/* ── Phase 1: Loading ── */}
        {phase === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col items-center gap-10"
          >
            {/* Animated radar */}
            <div className="relative w-48 h-48">
              <svg viewBox="0 0 200 200" className="w-full h-full">
                {/* Grid rings */}
                {[0.33, 0.66, 1].map((scale, i) => (
                  <polygon
                    key={i}
                    points={PENTAGON}
                    fill="none"
                    stroke="#222a3d"
                    strokeWidth="1"
                    transform={`scale(${scale}) translate(${100 - 100 * scale}, ${100 - 100 * scale})`}
                    style={{ transformOrigin: '100px 100px' }}
                  />
                ))}
                {/* Axis lines */}
                {['100,38', '158.8,79.6', '136.3,149.6', '63.7,149.6', '41.2,79.6'].map((pt, i) => (
                  <line
                    key={i}
                    x1="100" y1="100"
                    x2={pt.split(',')[0]} y2={pt.split(',')[1]}
                    stroke="#222a3d"
                    strokeWidth="1"
                  />
                ))}
                {/* Drawing outline — animates in */}
                <polygon
                  points={PENTAGON}
                  fill="none"
                  stroke="#c3c0ff"
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
                  fill="rgba(79,70,229,0.15)"
                  stroke="none"
                  style={{ opacity: drawProgress }}
                />
                {/* Center dot */}
                <circle cx="100" cy="100" r="3" fill="#4fdbc8" style={{ opacity: drawProgress }} />
              </svg>

              {/* Pulsing ring */}
              <div
                className="absolute inset-0 rounded-full border border-indigo-500/20 animate-ping"
                style={{ animationDuration: '2s' }}
              />
            </div>

            {/* Cycling phrase */}
            <div className="text-center space-y-2">
              <AnimatePresence mode="wait">
                <motion.p
                  key={phraseIndex}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="text-sm font-mono text-[#c3c0ff] tracking-wide"
                >
                  {LOADING_PHRASES[phraseIndex]}
                </motion.p>
              </AnimatePresence>
              <p className="text-xs text-[#918fa1]">PM Pathfinder · Personalised assessment</p>
            </div>
          </motion.div>
        )}

        {/* ── Phase 2: Archetype Reveal ── */}
        {phase === 'reveal' && archetype && (
          <motion.div
            key="reveal"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-2xl"
          >
            {/* Persona label */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 mb-5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
              <span className="text-xs font-mono text-teal-400 tracking-widest uppercase">Persona Profile</span>
            </motion.div>

            {/* Archetype name */}
            <motion.h1
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold font-[family-name:var(--font-space-grotesk)] tracking-tighter text-[#dae2fd] mb-3 leading-[1.05]"
            >
              {archetype.name}
            </motion.h1>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg text-[#4fdbc8] italic font-light mb-2"
            >
              &ldquo;{archetype.tagline}&rdquo;
            </motion.p>

            {/* "You are not starting from zero" */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-[#918fa1] italic mb-6"
            >
              You are not starting from zero.
            </motion.p>

            {/* Trait chips */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="flex flex-wrap gap-2 mb-8"
            >
              {archetype.traits.map((trait) => (
                <span
                  key={trait}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-[#222a3d] text-[#c3c0ff] border border-white/10"
                >
                  {trait}
                </span>
              ))}
            </motion.div>

            {/* Description + scores side by side */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6"
            >
              {/* Description card */}
              <div className="bg-[#171f33] rounded-2xl p-5">
                <p className="text-xs uppercase tracking-widest text-[#918fa1] font-mono mb-3">Your Profile</p>
                <p className="text-sm text-[#c7c4d8] leading-relaxed">{archetype.description}</p>
              </div>

              {/* Dimension scores mini */}
              <div className="bg-[#171f33] rounded-2xl p-5">
                <p className="text-xs uppercase tracking-widest text-[#918fa1] font-mono mb-3">5-Dimension Scan</p>
                <div className="flex flex-col gap-2">
                  {scores && (Object.entries(scores) as [Dimension, number][]).map(([dim, score]) => (
                    <div key={dim} className="flex items-center gap-2">
                      <span className="text-xs text-[#918fa1] w-28 flex-shrink-0 truncate">{DIMENSION_LABELS[dim]}</span>
                      <div className="flex-1 h-1 bg-[#222a3d] rounded-full overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-teal-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${score * 10}%` }}
                          transition={{ delay: 0.7 + Object.keys(scores).indexOf(dim) * 0.08, duration: 0.5 }}
                        />
                      </div>
                      <span className="text-xs font-mono text-[#c3c0ff] w-6 text-right">{score.toFixed(0)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Comes from */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65 }}
              className="mb-8"
            >
              <p className="text-xs uppercase tracking-widest text-[#918fa1] font-mono mb-3">Typically comes from</p>
              <div className="flex flex-wrap gap-2">
                {archetype.comesFrom.map((role) => (
                  <span
                    key={role}
                    className="px-3 py-1 rounded-full text-xs bg-amber-500/10 text-[#ffb95f] border border-amber-500/20"
                  >
                    {role}
                  </span>
                ))}
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
            >
              <button
                onClick={handleContinue}
                className="w-full h-14 bg-[#4fdbc8] hover:bg-teal-400 text-slate-950 font-bold text-base rounded-2xl shadow-[0_0_32px_rgba(79,219,200,0.25)] transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                See Your Roadmap
                <ArrowRight className="w-5 h-5" />
              </button>
              <p className="text-center text-xs text-[#918fa1] mt-3">
                Your full report and personalised learning path await
              </p>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  )
}
