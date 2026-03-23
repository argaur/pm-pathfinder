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
      <main className="min-h-screen flex items-center justify-center px-6 bg-slate-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md text-center"
        >
          <div className="text-5xl mb-6">
            {currentChunk === 1 ? '🎯' : currentChunk === 2 ? '⚡' : currentChunk === 3 ? '🔧' : '🤝'}
          </div>
          <p className="text-xs uppercase tracking-widest text-indigo-400 font-medium mb-2">
            Section {CHUNK_ORDER.indexOf(currentChunk) + 1} of 4
          </p>
          <h2 className="text-xl font-semibold text-white mb-3">
            {CHUNK_LABELS[currentChunk]}
          </h2>
          <p className="text-sm text-slate-400 mb-8">
            {currentChunk === 1 && 'How you approach problems and make decisions.'}
            {currentChunk === 2 && 'How you plan, deliver, and communicate under pressure.'}
            {currentChunk === 3 && 'How you engage with technology and engineering.'}
            {currentChunk === 4 && 'How you listen to users and influence others.'}
          </p>
          <Button
            onClick={() => setShowChunkIntro(false)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white h-12 px-8 rounded-xl"
          >
            Start section
          </Button>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex flex-col bg-slate-950">
      {/* Top bar */}
      <div className="flex items-center gap-4 px-6 pt-6 pb-4">
        <div className="flex-1">
          <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-indigo-500 to-teal-500 rounded-full"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
        <span className="text-xs font-mono text-slate-500 w-12 text-right">
          {currentIndex + 1}/{TOTAL_QUESTIONS}
        </span>
        <button
          onClick={() => router.push('/')}
          className="text-slate-600 hover:text-slate-400 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Question */}
      <div className="flex-1 flex items-center justify-center px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg"
          >
            <p className="text-xs uppercase tracking-widest text-indigo-400 font-medium mb-4">
              {CHUNK_LABELS[currentChunk]}
            </p>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 mb-6">
              <p className="text-base font-medium text-white leading-relaxed">
                {currentQuestion.text}
              </p>
            </div>

            <div className="flex flex-col gap-2.5">
              {currentQuestion.options.map((option, i) => {
                const optionKeys = ['A', 'B', 'C', 'D']
                const isSelected = selectedOption === option.id
                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelect(option.id)}
                    className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all duration-150 flex items-start gap-3 ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-950/60 text-white'
                        : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                    }`}
                  >
                    <span
                      className={`flex-shrink-0 w-6 h-6 rounded-md border text-xs font-bold flex items-center justify-center ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-600 text-white'
                          : 'border-slate-700 text-slate-600'
                      }`}
                    >
                      {optionKeys[i]}
                    </span>
                    {option.text}
                  </button>
                )
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div className="px-6 pb-8">
        <Button
          onClick={handleNext}
          disabled={!selectedOption || saving}
          className="w-full max-w-lg mx-auto flex h-12 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-medium rounded-xl"
        >
          {saving
            ? 'Analysing...'
            : currentIndex === TOTAL_QUESTIONS - 1
            ? 'See my results'
            : 'Next question'}
        </Button>
      </div>
    </main>
  )
}
