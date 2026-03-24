'use client'

import { useState } from 'react'
import { CheckCircle, ChevronRight, Lightbulb, RotateCcw, Dumbbell } from 'lucide-react'
import { LearningChapter, LearningStep } from '@/lib/data/learning-path'
import { Dimension } from '@/lib/data/questions'
import { TIER_CONFIG, DIMENSION_LABELS } from '@/lib/scoring/engine'
import BlurGate from '@/components/ui/BlurGate'

interface Props {
  chapters: LearningChapter[]
  tiers: Record<Dimension, 'growth' | 'neutral' | 'strength'>
  isPro: boolean
}

type StepState = 'idle' | 'writing' | 'revealed'

export default function PracticeClient({ chapters, tiers, isPro }: Props) {
  const [selectedChapter, setSelectedChapter] = useState(chapters[0]?.id ?? '')
  const [selectedStep, setSelectedStep] = useState<LearningStep | null>(
    chapters[0]?.steps[0] ?? null
  )
  const [response, setResponse] = useState('')
  const [stepState, setStepState] = useState<StepState>('idle')

  const chapter = chapters.find((c) => c.id === selectedChapter) ?? chapters[0]

  function selectStep(step: LearningStep) {
    setSelectedStep(step)
    setResponse('')
    setStepState('idle')
  }

  function handleSubmit() {
    if (response.trim().length < 20) return
    setStepState('revealed')
  }

  function handleReset() {
    setResponse('')
    setStepState('idle')
  }

  const allSteps = chapters.flatMap((c) => c.steps)
  const totalExercises = allSteps.length

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-widest text-indigo-400 font-medium mb-0.5">
            Practice
          </p>
          <h1 className="text-2xl font-bold text-[#dae2fd] font-[family-name:var(--font-space-grotesk)]">
            PM Challenge Arena
          </h1>
          <p className="text-sm text-[#918fa1] mt-1">
            Apply frameworks to real scenarios — {totalExercises} challenges from your learning path
          </p>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-[10px] uppercase tracking-widest text-[#918fa1]">Session</p>
          <p className="text-xs font-mono text-[#c7c4d8]">Ephemeral · Not saved</p>
        </div>
      </div>

      <BlurGate locked={!isPro} label="Practice is a Pro feature">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Left panel — chapter + step picker */}
          <div className="md:col-span-1 flex flex-col gap-3">
            {/* Chapter tabs */}
            <div className="bg-[#171f33] border border-white/[0.06] rounded-2xl p-4">
              <p className="text-[10px] uppercase tracking-widest text-[#918fa1] mb-3">
                Chapters
              </p>
              <div className="flex flex-col gap-1">
                {chapters.map((c) => {
                  const tier = tiers[c.dimension] ?? 'neutral'
                  const cfg = TIER_CONFIG[tier]
                  const active = c.id === selectedChapter
                  return (
                    <button
                      key={c.id}
                      onClick={() => {
                        setSelectedChapter(c.id)
                        selectStep(c.steps[0])
                      }}
                      className={`flex items-center justify-between px-3 py-2 rounded-xl text-left text-sm transition-all ${
                        active
                          ? 'bg-indigo-500/10 border border-indigo-500/20 text-[#c3c0ff]'
                          : 'text-[#918fa1] hover:text-[#c7c4d8] hover:bg-white/[0.04]'
                      }`}
                    >
                      <span className="truncate">{c.title}</span>
                      <span
                        className={`text-[9px] px-1.5 py-0.5 rounded-full border border-white/10 ml-2 flex-shrink-0 ${cfg.bg} ${cfg.color}`}
                      >
                        {cfg.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Step list for selected chapter */}
            {chapter && (
              <div className="bg-[#171f33] border border-white/[0.06] rounded-2xl p-4">
                <p className="text-[10px] uppercase tracking-widest text-[#918fa1] mb-3">
                  Challenges
                </p>
                <div className="flex flex-col gap-1">
                  {chapter.steps.map((step) => {
                    const active = selectedStep?.id === step.id
                    return (
                      <button
                        key={step.id}
                        onClick={() => selectStep(step)}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-left text-sm transition-all ${
                          active
                            ? 'bg-teal-500/10 border border-teal-500/20 text-[#4fdbc8]'
                            : 'text-[#918fa1] hover:text-[#c7c4d8] hover:bg-white/[0.04]'
                        }`}
                      >
                        <Dumbbell className={`w-3.5 h-3.5 flex-shrink-0 ${active ? 'text-teal-400' : ''}`} />
                        <span className="truncate">{step.title}</span>
                        <ChevronRight className="w-3 h-3 ml-auto flex-shrink-0 opacity-40" />
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right panel — exercise workspace */}
          <div className="md:col-span-2 flex flex-col gap-4">
            {selectedStep ? (
              <>
                {/* Step header */}
                <div className="bg-[#171f33] border border-white/[0.06] rounded-2xl p-5">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-widest text-teal-400 font-medium mb-1">
                        {DIMENSION_LABELS[chapter.dimension]}
                      </p>
                      <h2 className="text-lg font-bold text-[#dae2fd] font-[family-name:var(--font-space-grotesk)]">
                        {selectedStep.title}
                      </h2>
                    </div>
                    <span className="text-[10px] font-mono text-[#918fa1] bg-white/5 border border-white/10 px-2 py-1 rounded-lg whitespace-nowrap flex-shrink-0">
                      {selectedStep.textDuration} read
                    </span>
                  </div>
                  <p className="text-xs text-[#918fa1] italic leading-relaxed">
                    {selectedStep.whyInPath}
                  </p>
                </div>

                {/* Exercise prompt */}
                <div className="bg-[#171f33] border border-white/[0.06] rounded-2xl p-5">
                  <p className="text-[10px] uppercase tracking-widest text-amber-400 font-medium mb-3">
                    The Challenge
                  </p>
                  <p className="text-sm text-[#c7c4d8] leading-relaxed whitespace-pre-line">
                    {selectedStep.exercise}
                  </p>
                </div>

                {/* Response area */}
                {stepState !== 'revealed' ? (
                  <div className="bg-[#171f33] border border-white/[0.06] rounded-2xl p-5">
                    <p className="text-[10px] uppercase tracking-widest text-[#918fa1] mb-3">
                      Your Approach
                    </p>
                    <textarea
                      value={response}
                      onChange={(e) => {
                        setResponse(e.target.value)
                        if (stepState === 'idle' && e.target.value.length > 0) {
                          setStepState('writing')
                        }
                      }}
                      placeholder="Write your approach here. Think out loud — describe your reasoning, which frameworks you'd apply, and what outcome you'd aim for..."
                      className="w-full h-36 bg-[#222a3d] border border-white/[0.08] rounded-xl px-4 py-3 text-sm text-[#c7c4d8] placeholder:text-[#3d4a60] resize-none focus:outline-none focus:border-teal-500/40 transition-colors"
                    />
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-[11px] text-[#918fa1]">
                        {response.length < 20
                          ? `${20 - response.length} more characters to unlock model answer`
                          : 'Ready to reveal model approach'}
                      </p>
                      <button
                        onClick={handleSubmit}
                        disabled={response.trim().length < 20}
                        className="px-4 py-2 rounded-xl text-sm font-medium bg-teal-500 text-slate-950 hover:bg-teal-400 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        See Model Approach
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Model answer revealed */
                  <div className="flex flex-col gap-3">
                    {/* User's response (greyed) */}
                    <div className="bg-[#171f33] border border-white/[0.06] rounded-2xl p-5">
                      <p className="text-[10px] uppercase tracking-widest text-[#918fa1] mb-2">
                        Your Response
                      </p>
                      <p className="text-sm text-[#918fa1] leading-relaxed whitespace-pre-line">
                        {response}
                      </p>
                    </div>

                    {/* Model approach */}
                    <div className="bg-[#171f33] border border-teal-500/20 rounded-2xl p-5">
                      <div className="flex items-center gap-2 mb-3">
                        <Lightbulb className="w-4 h-4 text-teal-400" />
                        <p className="text-[10px] uppercase tracking-widest text-teal-400 font-medium">
                          Model Approach
                        </p>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-[#918fa1] mb-1.5">
                            Core Concept
                          </p>
                          <p className="text-sm text-[#c7c4d8] leading-relaxed">
                            {selectedStep.concept}
                          </p>
                        </div>
                        <div className="border-t border-white/[0.05] pt-4">
                          <p className="text-[10px] uppercase tracking-widest text-[#918fa1] mb-1.5">
                            Framework to Apply
                          </p>
                          <p className="text-sm text-[#c7c4d8] leading-relaxed">
                            {selectedStep.framework}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Self-assess + actions */}
                    <div className="bg-[#171f33] border border-white/[0.06] rounded-2xl p-5">
                      <p className="text-[10px] uppercase tracking-widest text-[#918fa1] mb-3">
                        How did you do?
                      </p>
                      <p className="text-xs text-[#918fa1] mb-4 leading-relaxed">
                        Compare your approach to the model. Did you identify the right framework?
                        Did you define the problem before jumping to solutions?
                      </p>
                      <div className="flex gap-3 flex-wrap">
                        <button
                          onClick={handleReset}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-white/10 text-[#918fa1] hover:text-[#c7c4d8] hover:border-white/20 transition-all"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          Try Again
                        </button>
                        {chapter.steps.filter((s) => s.id !== selectedStep.id).map((next) => (
                          <button
                            key={next.id}
                            onClick={() => selectStep(next)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 hover:bg-indigo-500/15 transition-all"
                          >
                            <CheckCircle className="w-3.5 h-3.5" />
                            Next: {next.title}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-[#171f33] border border-white/[0.06] rounded-2xl p-10 flex items-center justify-center">
                <p className="text-sm text-[#918fa1]">Select a challenge from the left to begin.</p>
              </div>
            )}
          </div>
        </div>
      </BlurGate>
    </div>
  )
}
