'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DIAGNOSTIC_QUESTIONS,
  CHUNK_LABELS,
  TOTAL_QUESTIONS,
  DiagnosticQuestion,
} from '@/lib/data/questions'
import {
  saveDiagnosticAnswers,
  getOrCreateSessionToken,
  getOnboardingAnswers,
} from '@/lib/utils/session'
import { classifyBackground } from '@/lib/classifiers/background'
import { runFullScoring } from '@/lib/scoring/engine'
import { createClient } from '@/lib/supabase/client'

const CHUNK_ORDER = [1, 2, 3, 4]

export default function DiagnosticPage() {
  const router = useRouter()
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showChunkIntro, setShowChunkIntro] = useState(true)
  const [saving, setSaving] = useState(false)

  const currentQuestion: DiagnosticQuestion = DIAGNOSTIC_QUESTIONS[currentIndex]
  const currentChunk = currentQuestion.chunk
  const isFirstInChunk = DIAGNOSTIC_QUESTIONS[currentIndex - 1]?.chunk !== currentChunk || currentIndex === 0
  const answeredCount = Object.keys(answers).length
  const progress = Math.round((answeredCount / TOTAL_QUESTIONS) * 100)
  const selectedOption = answers[currentQuestion.id]

  const handleSelect = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }))
  }

  const handleNext = async () => {
    if (!selectedOption) return

    const isLast = currentIndex === DIAGNOSTIC_QUESTIONS.length - 1

    if (isLast) {
      await handleSubmit()
      return
    }

    const nextQuestion = DIAGNOSTIC_QUESTIONS[currentIndex + 1]
    const crossingChunk = nextQuestion.chunk !== currentChunk

    setCurrentIndex((prev) => prev + 1)

    if (crossingChunk) {
      setShowChunkIntro(true)
    }
  }

  const handleSubmit = async () => {
    setSaving(true)
    try {
      const onboarding = getOnboardingAnswers()
      const backgroundAxis = classifyBackground(
        onboarding?.background ?? '',
        onboarding?.industry
      )

      const result = runFullScoring(answers, backgroundAxis)
      saveDiagnosticAnswers(answers)

      const sessionToken = getOrCreateSessionToken()
      const supabase = createClient()

      await supabase
        .from('quiz_sessions')
        .update({
          diagnostic_answers: answers,
          dimension_scores: result.dimensionScores,
          archetype: result.archetype,
        })
        .eq('session_token', sessionToken)

      router.push('/quiz/results')
    } catch (err) {
      console.error('Failed to save diagnostic:', err)
      router.push('/quiz/results')
    } finally {
      setSaving(false)
    }
  }

  // Chunk intro card
  if (showChunkIntro && isFirstInChunk) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 relative overflow-hidden">
        {/* Atmospheric orbs */}
        <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="fixed top-0 left-0 w-[400px] h-[400px] bg-teal-500/[0.07] rounded-full blur-[100px] pointer-events-none -z-10" />

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-md text-center"
        >
          <div className="text-5xl mb-6">
            {currentChunk === 1 ? '🎯' : currentChunk === 2 ? '⚡' : currentChunk === 3 ? '🔧' : '🤝'}
          </div>
          <p className="text-xs uppercase tracking-widest text-teal-400 font-mono mb-3">
            Section {CHUNK_ORDER.indexOf(currentChunk) + 1} of 4
          </p>
          <h2 className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] text-[#dae2fd] mb-3 tracking-tight">
            {CHUNK_LABELS[currentChunk]}
          </h2>
          <p className="text-sm text-[#c7c4d8] leading-relaxed mb-10 max-w-sm mx-auto">
            {currentChunk === 1 && 'How you approach problems and make decisions under ambiguity.'}
            {currentChunk === 2 && 'How you plan, deliver, and communicate under pressure.'}
            {currentChunk === 3 && 'How you engage with technology and engineering teams.'}
            {currentChunk === 4 && 'How you listen to users and build influence without authority.'}
          </p>
          <Button
            onClick={() => setShowChunkIntro(false)}
            className="bg-[#4fdbc8] hover:bg-teal-400 text-slate-950 font-semibold h-12 px-10 rounded-full shadow-[0_0_24px_rgba(79,219,200,0.25)] transition-all active:scale-95"
          >
            Start section
          </Button>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Atmospheric orbs */}
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed top-0 left-0 w-[400px] h-[400px] bg-teal-500/[0.07] rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Progress bar */}
      <div className="flex items-center gap-4 px-6 pt-6 pb-4">
        <div className="flex-1">
          <div className="h-1 bg-[#222a3d] rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-teal-400 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
        <span className="text-xs font-mono text-[#918fa1]">
          {currentIndex + 1} / {TOTAL_QUESTIONS}
        </span>
        <button
          onClick={() => router.push('/')}
          className="text-[#918fa1] hover:text-[#c7c4d8] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Question + options */}
      <div className="flex-1 flex items-center justify-center px-6 pb-32">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-xl"
          >
            {/* Chunk label */}
            <p className="text-xs uppercase tracking-widest text-teal-400 font-mono mb-5">
              {CHUNK_LABELS[currentChunk]}
            </p>

            {/* Question text — no card wrapper */}
            <h2 className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] text-[#dae2fd] leading-snug tracking-tight mb-8">
              {currentQuestion.text}
            </h2>

            {/* Options */}
            <div className="flex flex-col gap-3">
              {currentQuestion.options.map((option, i) => {
                const optionKeys = ['A', 'B', 'C', 'D']
                const isSelected = selectedOption === option.id
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
                    className={`w-full text-left p-5 rounded-2xl transition-all duration-150 flex items-start gap-4 ${
                      isSelected
                        ? 'border-2 border-[#4fdbc8] bg-[#222a3d] shadow-[0_0_20px_rgba(79,219,200,0.1)] text-[#dae2fd]'
                        : 'border border-white/5 bg-[#171f33] text-[#c7c4d8] hover:bg-[#1a2236] hover:border-white/10'
                    }`}
                  >
                    <span
                      className={`flex-shrink-0 w-10 h-10 rounded-xl text-sm font-bold font-mono flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[#4fdbc8] text-slate-950'
                          : 'bg-[#222a3d] text-[#918fa1]'
                      }`}
                    >
                      {optionKeys[i]}
                    </span>
                    <span className="pt-2 text-sm leading-relaxed">{option.text}</span>
                  </button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Fixed footer CTA */}
      <div className="fixed bottom-0 inset-x-0 bg-gradient-to-t from-[#0b1326] via-[#0b1326]/95 to-transparent px-6 pt-6 pb-8">
        <div className="max-w-xl mx-auto">
          <Button
            onClick={handleNext}
            disabled={!selectedOption || saving}
            className="w-full h-14 bg-[#4fdbc8] hover:bg-teal-400 disabled:bg-[#222a3d] disabled:text-[#918fa1] text-slate-950 font-semibold text-base rounded-2xl shadow-[0_0_32px_rgba(79,219,200,0.2)] disabled:shadow-none transition-all active:scale-[0.98]"
          >
            {saving
              ? 'Analysing your profile...'
              : currentIndex === TOTAL_QUESTIONS - 1
              ? 'See my results'
              : 'Continue'}
          </Button>
        </div>
      </div>
    </main>
  )
}
