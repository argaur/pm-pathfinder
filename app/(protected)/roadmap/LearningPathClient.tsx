'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, Circle, Play, BookOpen, ChevronDown, ChevronRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { LearningChapter } from '@/lib/data/learning-path'
import { Dimension } from '@/lib/data/questions'
import { TIER_CONFIG, DIMENSION_LABELS } from '@/lib/scoring/engine'
import BlurGate from '@/components/ui/BlurGate'

const FREE_CHAPTERS = 1

type Mode = 'video' | 'text'

interface Props {
  chapters: LearningChapter[]
  tiers: Record<Dimension, 'growth' | 'neutral' | 'strength'>
  progressMap: Record<string, string>
  userId: string
  isPro: boolean
}

export default function LearningPathClient({ chapters, tiers, progressMap: initial, userId, isPro }: Props) {
  const [progress, setProgress] = useState(initial)
  const [expandedStep, setExpandedStep] = useState<string | null>(null)
  const [stepModes, setStepModes] = useState<Record<string, Mode>>({})
  const [saving, setSaving] = useState<string | null>(null)

  const allSteps = chapters.flatMap((c) => c.steps)

  const isStepDone = (stepId: string, p = progress) =>
    p[`${stepId}-video`] === 'complete' || p[`${stepId}-text`] === 'complete'

  const firstIncompleteId = allSteps.find((s) => !isStepDone(s.id))?.id ?? null

  // Auto-expand first incomplete step on mount
  useEffect(() => {
    setExpandedStep(firstIncompleteId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const doneCount = allSteps.filter((s) => isStepDone(s.id)).length
  const totalSteps = allSteps.length

  const markDone = async (stepId: string) => {
    const mode = stepModes[stepId] ?? 'video'
    const key = `${stepId}-${mode}`
    if (progress[key] === 'complete') return

    setSaving(stepId)
    const next = { ...progress, [key]: 'complete' }
    setProgress(next)

    try {
      const supabase = createClient()
      await supabase.from('learning_path_progress').upsert({
        user_id: userId,
        step_id: stepId,
        mode,
        status: 'complete',
        marked_done_at: new Date().toISOString(),
      })
    } catch {
      // Table not yet created — UI still updates
    }
    setSaving(null)

    // Auto-advance to next incomplete step
    const currentIdx = allSteps.findIndex((s) => s.id === stepId)
    const nextStep = allSteps.slice(currentIdx + 1).find((s) => !isStepDone(s.id, next))
    if (nextStep) setExpandedStep(nextStep.id)
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-indigo-400 font-mono mb-1">Learning Path</p>
        <h1 className="text-2xl font-bold text-[#dae2fd] mb-1">Your PM Growth Roadmap</h1>
        <p className="text-sm text-[#918fa1]">
          {doneCount} of {totalSteps} steps complete · Ordered by your assessment gaps
        </p>
        <div className="h-1 bg-[#222a3d] rounded-full mt-4 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-teal-400 rounded-full transition-all duration-700"
            style={{ width: `${(doneCount / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {/* Chapters */}
      <div className="flex flex-col gap-12">
        {chapters.map((chapter, ci) => {
          const tier = tiers[chapter.dimension] ?? 'neutral'
          const tierCfg = TIER_CONFIG[tier]
          const chapterDone = chapter.steps.every((s) => isStepDone(s.id))

          return (
            <div key={chapter.id}>
              {/* Chapter header */}
              <div className="flex items-start gap-3 mb-4">
                <div className="flex flex-col items-center pt-0.5">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold border ${tierCfg.bg} ${tierCfg.color} ${tierCfg.border}`}
                  >
                    {ci + 1}
                  </div>
                  <div className="w-px bg-[#222a3d] mt-2" style={{ height: 20 }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${tierCfg.bg} ${tierCfg.color} ${tierCfg.border}`}
                    >
                      {tierCfg.label}
                    </span>
                    <span className="text-xs text-[#918fa1]">{DIMENSION_LABELS[chapter.dimension]}</span>
                  </div>
                  <h2 className="text-lg font-bold text-[#dae2fd] leading-tight">{chapter.title}</h2>
                  <p className="text-xs text-[#918fa1] mt-0.5">{chapter.subtitle}</p>
                </div>
              </div>

              {/* Before → After cards */}
              <div className="ml-11 mb-5 grid grid-cols-2 gap-3">
                <div className="bg-[#171f33] rounded-xl p-4 relative overflow-hidden">
                  <span className="absolute top-1 right-3 text-[38px] font-black text-white/[0.04] leading-none select-none pointer-events-none">
                    BEFORE
                  </span>
                  <p className="text-[10px] uppercase tracking-widest text-rose-400/60 font-mono mb-1.5">Before</p>
                  <p className="text-sm font-semibold text-[#c7c4d8]">{chapter.beforeState}</p>
                  <p className="text-xs text-[#918fa1] mt-1.5 leading-relaxed">{chapter.beforeDesc}</p>
                </div>
                <div className="bg-[#171f33] rounded-xl p-4 relative overflow-hidden border border-teal-500/10">
                  <span className="absolute top-1 right-3 text-[38px] font-black text-white/[0.04] leading-none select-none pointer-events-none">
                    AFTER
                  </span>
                  <p className="text-[10px] uppercase tracking-widest text-teal-400/60 font-mono mb-1.5">After</p>
                  <p className="text-sm font-semibold text-[#c7c4d8]">{chapter.afterState}</p>
                  <p className="text-xs text-[#918fa1] mt-1.5 leading-relaxed">{chapter.afterDesc}</p>
                </div>
              </div>

              {/* Steps */}
              <BlurGate locked={!isPro && ci >= FREE_CHAPTERS} label="Pro — unlock full learning path">
              <div className="ml-11 flex flex-col gap-2">
                {chapter.steps.map((step, si) => {
                  const done = isStepDone(step.id)
                  const isActive = !done && step.id === firstIncompleteId
                  const isExpanded = expandedStep === step.id
                  const mode = stepModes[step.id] ?? 'video'

                  return (
                    <div
                      key={step.id}
                      className={`rounded-2xl overflow-hidden border transition-all ${
                        done
                          ? 'bg-[#0d1e2e] border-teal-900/20'
                          : isActive
                          ? 'bg-[#171f33] border-[#4fdbc8]/25 shadow-[0_0_20px_rgba(79,219,200,0.05)]'
                          : 'bg-[#171f33] border-white/[0.05]'
                      }`}
                    >
                      {/* Step header */}
                      <button
                        onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                        className="w-full flex items-center gap-3 p-4 text-left"
                      >
                        <span className="flex-shrink-0">
                          {done ? (
                            <CheckCircle className="w-5 h-5 text-teal-400" />
                          ) : isActive ? (
                            <span className="w-5 h-5 rounded-full border-2 border-[#4fdbc8] bg-[#4fdbc8]/10 animate-pulse block" />
                          ) : (
                            <Circle className="w-5 h-5 text-[#918fa1]" />
                          )}
                        </span>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="text-xs font-mono text-[#918fa1]">
                              {ci + 1}.{si + 1}
                            </span>
                            {done && (
                              <span className="text-[10px] font-mono text-teal-400/60">done</span>
                            )}
                          </div>
                          <p
                            className={`text-sm font-medium ${
                              done ? 'text-[#918fa1] line-through decoration-[#918fa1]/40' : 'text-[#dae2fd]'
                            }`}
                          >
                            {step.title}
                          </p>
                        </div>

                        {isExpanded ? (
                          <ChevronDown className="w-4 h-4 text-[#918fa1] flex-shrink-0" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-[#918fa1] flex-shrink-0" />
                        )}
                      </button>

                      {/* Expanded content */}
                      {isExpanded && (
                        <div className="px-4 pb-5 border-t border-white/[0.04]">
                          {/* Why in path */}
                          <p className="text-xs text-[#4fdbc8]/75 italic mt-4 mb-4 leading-relaxed">
                            {step.whyInPath}
                          </p>

                          {/* Mode toggle */}
                          <div className="flex gap-2 mb-4">
                            <button
                              onClick={() => setStepModes((p) => ({ ...p, [step.id]: 'video' }))}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                mode === 'video'
                                  ? 'bg-indigo-500/20 text-[#c3c0ff] border border-indigo-500/30'
                                  : 'bg-[#222a3d] text-[#918fa1] border border-transparent hover:text-[#c7c4d8]'
                              }`}
                            >
                              <Play className="w-3 h-3" />
                              Watch · {step.videoDuration}
                            </button>
                            <button
                              onClick={() => setStepModes((p) => ({ ...p, [step.id]: 'text' }))}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                                mode === 'text'
                                  ? 'bg-teal-500/20 text-[#4fdbc8] border border-teal-500/30'
                                  : 'bg-[#222a3d] text-[#918fa1] border border-transparent hover:text-[#c7c4d8]'
                              }`}
                            >
                              <BookOpen className="w-3 h-3" />
                              Read · {step.textDuration}
                            </button>
                          </div>

                          {/* Content area */}
                          {mode === 'video' ? (
                            <div className="aspect-video bg-[#222a3d] rounded-xl overflow-hidden mb-4">
                              <iframe
                                src={`https://www.youtube.com/embed/${step.videoId}`}
                                title={step.title}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                              />
                            </div>
                          ) : (
                            <div className="flex flex-col gap-3 mb-4">
                              <div className="bg-[#222a3d] rounded-xl p-4">
                                <p className="text-[10px] uppercase tracking-widest text-indigo-400 font-mono mb-2">
                                  Concept
                                </p>
                                <p className="text-sm text-[#c7c4d8] leading-relaxed">{step.concept}</p>
                              </div>
                              <div className="bg-[#222a3d] rounded-xl p-4">
                                <p className="text-[10px] uppercase tracking-widest text-teal-400 font-mono mb-2">
                                  Framework
                                </p>
                                <p className="text-sm text-[#c7c4d8] leading-relaxed">{step.framework}</p>
                              </div>
                              <div className="bg-[#0d1e2e] rounded-xl p-4 border border-amber-500/10">
                                <p className="text-[10px] uppercase tracking-widest text-amber-400/70 font-mono mb-2">
                                  Exercise
                                </p>
                                <p className="text-sm text-[#c7c4d8] leading-relaxed">{step.exercise}</p>
                              </div>
                            </div>
                          )}

                          {/* Mark done */}
                          {!done && (
                            <button
                              onClick={() => markDone(step.id)}
                              disabled={saving === step.id}
                              className="w-full h-11 bg-[#4fdbc8] hover:bg-teal-400 text-slate-950 font-bold text-sm rounded-xl transition-all active:scale-[0.98] disabled:opacity-60"
                            >
                              {saving === step.id
                                ? 'Saving…'
                                : `Mark as Done · ${mode === 'video' ? 'Watched' : 'Read'}`}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* Chapter complete badge */}
                {chapterDone && (
                  <div className="mt-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20">
                      <CheckCircle className="w-3.5 h-3.5 text-teal-400" />
                      <span className="text-xs font-mono text-teal-400">Chapter complete</span>
                    </div>
                  </div>
                )}
              </div>
              </BlurGate>
            </div>
          )
        })}
      </div>

      {/* All done */}
      {doneCount === totalSteps && totalSteps > 0 && (
        <div className="mt-12 text-center">
          <div className="inline-flex flex-col items-center gap-3 px-8 py-6 rounded-2xl bg-teal-500/10 border border-teal-500/20">
            <CheckCircle className="w-8 h-8 text-teal-400" />
            <p className="text-base font-bold text-[#dae2fd]">Path complete</p>
            <p className="text-sm text-[#918fa1]">You&apos;ve finished every step. Time for a Deep Dive.</p>
          </div>
        </div>
      )}
    </div>
  )
}
