'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  BACKGROUND_OPTIONS,
  INDUSTRY_OPTIONS,
  classifyBackground,
} from '@/lib/classifiers/background'
import {
  saveOnboardingAnswers,
  getOrCreateSessionToken,
} from '@/lib/utils/session'
import { createClient } from '@/lib/supabase/client'
import QuizShell from '@/components/quiz/QuizShell'
import OptionButton from '@/components/quiz/OptionButton'
import JourneyCTA from '@/components/quiz/JourneyCTA'

/**
 * Stage 1 of the assessment journey — three questions about who you are.
 *
 * Presentation only lives here now: the shell owns the frame, the rail, the
 * type scale and the step-to-step slide. What this page still owns is exactly
 * what it owned before — the same localStorage write, the same quiz_sessions
 * upsert, the same push to /quiz/insights.
 */

const YEARS_OPTIONS = ['< 1 year', '1–3 years', '3–5 years', '5–8 years', '8+ years']

interface Step {
  id: number
  question: string
  subtext?: string
  field: 'background' | 'yearsExperience' | 'industry'
  options: string[]
}

const STEPS: Step[] = [
  {
    id: 1,
    question: "What's your current background?",
    subtext: 'Pick the one that fits best — even if it\'s not a perfect match.',
    field: 'background',
    options: BACKGROUND_OPTIONS.map((o) => o.value),
  },
  {
    id: 2,
    question: 'How many years of professional experience do you have?',
    subtext: 'Total experience, not just in your current role.',
    field: 'yearsExperience',
    options: YEARS_OPTIONS,
  },
  {
    id: 3,
    question: 'Which industry have you spent most of your career in?',
    subtext: "This helps us tailor examples to a domain you'll recognise.",
    field: 'industry',
    options: INDUSTRY_OPTIONS,
  },
]

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [selected, setSelected] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const step = STEPS[currentStep]
  const isLastStep = currentStep === STEPS.length - 1

  const handleSelect = (option: string) => {
    setSelected(option)
  }

  const handleNext = async () => {
    if (!selected) return

    const updatedAnswers = { ...answers, [step.field]: selected }
    setAnswers(updatedAnswers)

    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1)
      setSelected(null)
      return
    }

    // Final step — save + navigate
    setLoading(true)
    try {
      const onboardingAnswers = {
        background: updatedAnswers.background,
        yearsExperience: updatedAnswers.yearsExperience,
        industry: updatedAnswers.industry,
      }

      saveOnboardingAnswers(onboardingAnswers)

      const backgroundAxis = classifyBackground(
        updatedAnswers.background,
        updatedAnswers.industry
      )

      const sessionToken = getOrCreateSessionToken()
      const supabase = createClient()

      await supabase.from('quiz_sessions').upsert({
        session_token: sessionToken,
        onboarding_answers: onboardingAnswers,
        background_axis: backgroundAxis,
      })

      router.push('/quiz/insights')
    } catch (err) {
      console.error('Failed to save onboarding:', err)
      // Still navigate — local storage is the backup
      router.push('/quiz/insights')
    } finally {
      setLoading(false)
    }
  }

  return (
    <QuizShell
      stage="onboarding"
      completed={currentStep}
      transitionKey={currentStep}
      transition="slide"
      eyebrow="About you"
      title={step.question}
      subtitle={step.subtext}
      footer={
        <JourneyCTA
          label={isLastStep ? 'Show my insights' : 'Continue'}
          onClick={handleNext}
          disabled={!selected}
          loading={loading}
          loadingLabel="Saving..."
        />
      }
    >
      <div className="flex flex-col gap-2.5">
        {step.options.map((option) => (
          <OptionButton
            key={option}
            selected={selected === option}
            onSelect={() => handleSelect(option)}
          >
            {option}
          </OptionButton>
        ))}
      </div>
    </QuizShell>
  )
}
