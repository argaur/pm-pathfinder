'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-slate-950">
      {/* Progress dots */}
      <div className="flex gap-2 mb-12">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i <= currentStep ? 'w-8 bg-indigo-500' : 'w-4 bg-slate-800'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -24 }}
          transition={{ duration: 0.25 }}
          className="w-full max-w-lg"
        >
          <div className="mb-8">
            <p className="text-xs uppercase tracking-widest text-indigo-400 font-medium mb-3">
              Step {currentStep + 1} of {STEPS.length}
            </p>
            <h2 className="text-2xl font-semibold text-white mb-2">{step.question}</h2>
            {step.subtext && <p className="text-sm text-slate-500">{step.subtext}</p>}
          </div>

          <div className="flex flex-col gap-2 mb-8">
            {step.options.map((option) => (
              <button
                key={option}
                onClick={() => handleSelect(option)}
                className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm transition-all duration-150 ${
                  selected === option
                    ? 'border-indigo-500 bg-indigo-950/60 text-white'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-600 hover:text-slate-300'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          <Button
            onClick={handleNext}
            disabled={!selected || loading}
            className="w-full h-12 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl disabled:opacity-40"
          >
            {loading ? 'Saving...' : currentStep < STEPS.length - 1 ? 'Continue' : 'Show my insights'}
            {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
          </Button>
        </motion.div>
      </AnimatePresence>
    </main>
  )
}
