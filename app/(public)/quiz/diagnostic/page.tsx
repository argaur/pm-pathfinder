'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import QuizShell from '@/components/quiz/QuizShell'
import OptionButton from '@/components/quiz/OptionButton'
import JourneyCTA from '@/components/quiz/JourneyCTA'

/**
 * Stage 3 — the ten-question diagnostic, the long middle of the journey.
 *
 * The section intro and the question screen are now the same shell with the
 * same rail, so crossing a section boundary no longer looks like leaving the
 * quiz. The rail keeps counting from the onboarding steps rather than
 * restarting at zero.
 *
 * Scoring and persistence are untouched: same runFullScoring call, same
 * localStorage write, same quiz_sessions update keyed on session_token, same
 * push to /quiz/results on success and on failure.
 */

const CHUNK_ORDER = [1, 2, 3, 4]

const CHUNK_INTROS: Record<number, { icon: string; blurb: string }> = {
  1: { icon: '🎯', blurb: 'How you approach problems and make decisions under ambiguity.' },
  2: { icon: '⚡', blurb: 'How you plan, deliver, and communicate under pressure.' },
  3: { icon: '🔧', blurb: 'How you engage with technology and engineering teams.' },
  4: { icon: '🤝', blurb: 'How you listen to users and build influence without authority.' },
}

const OPTION_KEYS = ['A', 'B', 'C', 'D']

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
  const selectedOption = answers[currentQuestion.id]

  const handleSelect = (optionId: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionId }))
  }

  const handleExit = () => {
    if (window.confirm('Exit the quiz? Your progress will be lost.')) {
      router.push('/')
    }
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

  // Section intro — same shell, same rail, just a different thing in the column.
  if (showChunkIntro && isFirstInChunk) {
    const sectionNumber = CHUNK_ORDER.indexOf(currentChunk) + 1
    const intro = CHUNK_INTROS[currentChunk]

    return (
      <QuizShell
        stage="diagnostic"
        completed={answeredCount}
        positionLabel={`Section ${sectionNumber} of ${CHUNK_ORDER.length}`}
        transitionKey={`section-${currentChunk}`}
        width="wide"
        onExit={handleExit}
        footer={
          <JourneyCTA
            label="Start section"
            onClick={() => setShowChunkIntro(false)}
          />
        }
      >
        <div className="flex flex-col items-center text-center">
          <span aria-hidden className="mb-6 text-5xl">
            {intro.icon}
          </span>
          <p className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-secondary">
            Section {sectionNumber} of {CHUNK_ORDER.length}
          </p>
          <h1 className="text-balance font-heading text-2xl font-bold leading-tight tracking-tight text-foreground sm:text-3xl">
            {CHUNK_LABELS[currentChunk]}
          </h1>
          <p className="mt-3 max-w-sm text-pretty text-sm leading-relaxed text-card-foreground/80">
            {intro.blurb}
          </p>
        </div>
      </QuizShell>
    )
  }

  return (
    <QuizShell
      stage="diagnostic"
      completed={answeredCount}
      positionLabel={`Question ${currentIndex + 1} of ${TOTAL_QUESTIONS}`}
      transitionKey={currentQuestion.id}
      transition="slide"
      width="wide"
      onExit={handleExit}
      eyebrow={CHUNK_LABELS[currentChunk]}
      title={currentQuestion.text}
      footer={
        <JourneyCTA
          label={currentIndex === TOTAL_QUESTIONS - 1 ? 'See my results' : 'Continue'}
          onClick={handleNext}
          disabled={!selectedOption}
          loading={saving}
          loadingLabel="Analysing your profile..."
        />
      }
    >
      <div className="flex flex-col gap-3">
        {currentQuestion.options.map((option, i) => (
          <OptionButton
            key={option.id}
            selected={selectedOption === option.id}
            onSelect={() => handleSelect(option.id)}
            marker={OPTION_KEYS[i]}
          >
            {option.text}
          </OptionButton>
        ))}
      </div>
    </QuizShell>
  )
}
