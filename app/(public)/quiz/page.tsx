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
    <main className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Atmospheric orbs */}
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed top-0 left-0 w-[400px] h-[400px] bg-teal-500/[0.07] rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Progress dots */}
      <div className="flex gap-2 justify-center pt-10 pb-6 flex-shrink-0">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${
              i <= currentStep ? 'w-8 bg-teal-400' : 'w-4 bg-[#222a3d]'
            }`}
          />
        ))}
      </div>

      {/* Centred content — pb-28 gives clearance above fixed CTA */}
      <div className="flex-1 flex flex-col justify-center px-6 pb-28">
        <div className="w-full max-w-lg mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.25 }}
            >
              <div className="mb-8">
                <p className="text-xs uppercase tracking-widest text-teal-400 font-mono mb-3">
                  Step {currentStep + 1} of {STEPS.length}
                </p>
                <h2 className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] text-[#dae2fd] tracking-tight mb-2">
                  {step.question}
                </h2>
                {step.subtext && (
                  <p className="text-sm text-[#918fa1] leading-relaxed">{step.subtext}</p>
                )}
              </div>

              <div className="flex flex-col gap-2.5">
                {step.options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelect(option)}
                    className={`w-full text-left px-5 py-4 rounded-2xl text-sm transition-all duration-150 ${
                      selected === option
                        ? 'border-2 border-[#4fdbc8] bg-[#222a3d] text-[#dae2fd] shadow-[0_0_20px_rgba(79,219,200,0.1)]'
                        : 'border border-white/5 bg-[#171f33] text-[#c7c4d8] hover:bg-[#1a2236] hover:border-white/10'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Fixed footer CTA */}
      <div className="fixed bottom-0 inset-x-0 bg-gradient-to-t from-[#0b1326] via-[#0b1326]/95 to-transparent px-6 pt-6 pb-8">
        <div className="max-w-lg mx-auto">
          <Button
            onClick={handleNext}
            disabled={!selected || loading}
            className="w-full h-14 bg-[#4fdbc8] hover:bg-teal-400 disabled:bg-[#222a3d] disabled:text-[#918fa1] text-slate-950 font-semibold text-base rounded-2xl shadow-[0_0_32px_rgba(79,219,200,0.2)] disabled:shadow-none transition-all active:scale-[0.98]"
          >
            {loading ? 'Saving...' : currentStep < STEPS.length - 1 ? 'Continue' : 'Show my insights'}
            {!loading && <ArrowRight className="ml-2 w-4 h-4" />}
          </Button>
        </div>
      </div>
    </main>
  )
}
