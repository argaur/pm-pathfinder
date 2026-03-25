'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { DIMENSION_LABELS, TIER_CONFIG } from '@/lib/scoring/engine'
import { Dimension } from '@/lib/data/questions'
import BlurGate from '@/components/ui/BlurGate'
import { getIsPro } from '@/lib/user/getIsPro'

// Static coaching insight shown per sub-category on completion card
const SUBCATEGORY_INSIGHTS: Record<string, string> = {
  // thinking_strategy
  Prioritisation:       'Strong prioritisation is where PM credibility is built. The best PMs pair data signals with stakeholder context — neither alone is enough.',
  'Problem Framing':    'Before jumping to solutions, great PMs define the right problem. Ambiguous briefs are an opportunity to earn trust by bringing clarity.',
  'Trade-off Decisions':'Trade-off calls are where PM judgment shows. Define a minimum quality bar, ship, measure, and iterate — that\'s the pattern that compounds.',
  // execution
  'Sprint Planning':    'Aligning on sprint goal before individual stories keeps the team focused on outcomes, not outputs. Goal-first planning reduces mid-sprint chaos.',
  'Stakeholder Alignment': 'How you respond to mid-sprint changes defines whether stakeholders trust your process — or learn to bypass it.',
  'Delivery Tracking':  'Proactive visibility lets you catch slippage early. Waiting for the review to surface surprises means it\'s already too late.',
  // technical_fluency
  'Architecture Awareness': 'Asking about rollback and data volume is exactly the risk awareness engineers respect. It signals you see delivery risk, not just the feature.',
  'API Literacy':        'Checking SLA and rate limits before committing to a third-party integration is how PMs prevent 2am incidents from becoming product failures.',
  'Tech Debt Awareness': 'Negotiating a % of each sprint for debt (vs a separate backlog) is the most durable model — it keeps engineering trust intact over time.',
  // user_research
  'Research Methods':   'Choosing the right method for the question is a core PM skill. Interviews validate the why; A/B tests validate what scales — both serve different needs.',
  'Insight Synthesis':  'Themes across sessions beat memorable quotes. Affinity mapping forces you to find patterns instead of cherry-picking confirming evidence.',
  'Metrics + Qual Balance': 'Qual explains what quant can\'t. When they conflict, it\'s almost always a context gap — run more research before making a directional bet.',
  // communication
  'Upward Communication':   'Starting with business outcome anchors leadership to what they care about. Everything else becomes supporting evidence, not a pitch.',
  'Cross-functional Influence': 'Framing tech work as risk reduction with business impact is the translation layer engineers can\'t always provide — and where PM adds real value.',
  'Conflict Resolution': 'Finding the common goal beneath conflicting asks resolves 80% of stakeholder conflicts without escalating or building the wrong thing.',
}

const FREE_DIMENSIONS = 1
const DIMENSION_ORDER: Dimension[] = ['thinking_strategy', 'execution', 'technical_fluency', 'user_research', 'communication']

// Sub-category questions per dimension
const DEEP_DIVE_QUESTIONS: Record<Dimension, { subCategory: string; question: string; options: string[] }[]> = {
  thinking_strategy: [
    { subCategory: 'Prioritisation', question: 'How do you typically decide what goes on the roadmap next?', options: ['Data and metrics drive it', 'Stakeholder input balanced with user research', 'Business goals top-down', 'Customer feedback direct'] },
    { subCategory: 'Problem Framing', question: 'When given a vague brief, your first instinct is:', options: ['Define success metrics first', 'Map the user journey end to end', 'Benchmark against competitors', 'Talk to 3-5 users immediately'] },
    { subCategory: 'Trade-off Decisions', question: 'When speed vs quality conflict, you typically:', options: ['Define a minimum bar for quality and ship', 'Ship and measure, fix fast', 'Take the extra time — quality is non-negotiable', 'Escalate the decision'] },
  ],
  execution: [
    { subCategory: 'Sprint Planning', question: 'At the start of a sprint, you make sure to:', options: ['Have every story refined and pointed', 'Align on sprint goal first, then stories', 'Review the roadmap alignment', 'Let the team pull their own work'] },
    { subCategory: 'Stakeholder Alignment', question: 'When a stakeholder changes requirements mid-sprint:', options: ['Evaluate impact and decide in the sprint review', 'Protect the sprint — log it for next cycle', 'Assess urgency and decide case-by-case', 'Always accommodate the change'] },
    { subCategory: 'Delivery Tracking', question: 'How do you track whether the sprint is on track?', options: ['Daily standup + burndown chart', 'Weekly check-in with tech lead', 'I wait for the sprint review', 'Slack check-ins with the team'] },
  ],
  technical_fluency: [
    { subCategory: 'Architecture Awareness', question: 'When your team says "this requires a DB migration", you:', options: ['Ask about data volume and rollback plan', 'Understand it means risk — flag it', 'Trust the engineers to handle it', 'Ask if we can avoid it entirely'] },
    { subCategory: 'API Literacy', question: 'When evaluating a third-party integration, you:', options: ['Review API docs + ask for a spike', 'Check uptime SLA and rate limits', 'Defer to engineering judgement', 'Just try it in production'] },
    { subCategory: 'Tech Debt Awareness', question: 'When engineers raise tech debt concerns on your roadmap item:', options: ['Negotiate a % of each sprint for debt', 'Add it to backlog for future', 'Weigh it against customer impact', 'Block roadmap item until resolved'] },
  ],
  user_research: [
    { subCategory: 'Research Methods', question: 'For validating a new feature hypothesis, you prefer:', options: ['5-7 user interviews + synthesis', 'A/B test in production', 'Survey at scale', 'Prototype and usability test'] },
    { subCategory: 'Insight Synthesis', question: 'After 8 user interviews, you:', options: ['Look for themes across sessions', 'Pick the most compelling quotes', 'Build an affinity diagram', 'Share raw notes with the team'] },
    { subCategory: 'Metrics + Qual Balance', question: 'When quant data and qual feedback conflict:', options: ['Run more research to understand why', 'Trust the data — sample sizes matter', 'Trust the qual — it explains the why', 'Present both and let leadership decide'] },
  ],
  communication: [
    { subCategory: 'Upward Communication', question: 'When presenting a roadmap to leadership, you:', options: ['Start with the business outcome, then the plan', 'Present the full feature list with reasoning', 'Focus on the problem, let them ask about solutions', 'Share a pre-read doc first, then discuss'] },
    { subCategory: 'Cross-functional Influence', question: 'Getting engineering to prioritise technical work alongside features:', options: ['Frame it as risk reduction with business impact', 'Negotiate: 1 tech item per 2 features', 'Let engineering advocate for it themselves', 'Only raise it when it becomes a blocker'] },
    { subCategory: 'Conflict Resolution', question: 'When two stakeholders want conflicting things:', options: ['Surface the trade-off and let data decide', 'Find the common goal beneath both asks', 'Escalate to someone senior', 'Build both if feasible'] },
  ],
}

export default function DeepDivePage() {
  const router = useRouter()
  const [selectedDimension, setSelectedDimension] = useState<Dimension | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentQ, setCurrentQ] = useState(0)
  const [done, setDone] = useState(false)
  const [tiers, setTiers] = useState<Record<Dimension, string> | null>(null)
  const [isPro, setIsPro] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const [{ data: assessment }, { data: profile }] = await Promise.all([
        supabase
          .from('assessments')
          .select('tiers')
          .eq('user_id', user.id)
          .order('taken_at', { ascending: false })
          .limit(1)
          .single(),
        supabase.from('profiles').select('is_pro').eq('id', user.id).single(),
      ])
      if (assessment?.tiers) setTiers(assessment.tiers as Record<Dimension, string>)
      if (profile?.is_pro) setIsPro(true)
    })
  }, [])

  const handleAnswer = async (answer: string) => {
    if (!selectedDimension) return
    const questions = DEEP_DIVE_QUESTIONS[selectedDimension]
    const qKey = `${selectedDimension}_${currentQ}`
    const updated = { ...answers, [qKey]: answer }
    setAnswers(updated)

    if (currentQ < questions.length - 1) {
      setCurrentQ((p) => p + 1)
    } else {
      // Save to Supabase
      try {
        await fetch('/api/deep-dive', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dimension: selectedDimension, answers: updated }),
        })
      } catch {
        // Non-blocking
      }
      setDone(true)
    }
  }

  if (done && selectedDimension) {
    const completedQuestions = DEEP_DIVE_QUESTIONS[selectedDimension]
    return (
      <div className="max-w-2xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-teal-500/20 flex items-center justify-center">
              <svg className="w-4 h-4 text-[#4fdbc8]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-xs uppercase tracking-widest text-[#4fdbc8] font-mono">Analysis complete</p>
              <h2 className="text-xl font-bold font-[family-name:var(--font-space-grotesk)] text-[#dae2fd]">
                {DIMENSION_LABELS[selectedDimension]} — sub-category breakdown
              </h2>
            </div>
          </div>

          {/* Per sub-category insight cards */}
          <div className="flex flex-col gap-3 mb-6">
            {completedQuestions.map((q) => {
              const insight = SUBCATEGORY_INSIGHTS[q.subCategory]
              return (
                <motion.div
                  key={q.subCategory}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#171f33] rounded-2xl px-5 py-4 border border-white/5"
                >
                  <p className="text-xs uppercase tracking-widest text-indigo-400 font-mono mb-1">{q.subCategory}</p>
                  <p className="text-sm text-[#c7c4d8] leading-relaxed">{insight}</p>
                </motion.div>
              )
            })}
          </div>

          {/* CTAs */}
          <div className="flex gap-3">
            <Button onClick={() => { setDone(false); setSelectedDimension(null); setCurrentQ(0); setAnswers({}) }}
              variant="outline" className="border-white/10 text-[#c7c4d8] rounded-xl flex-1">
              Dive into another dimension
            </Button>
            <Button onClick={() => router.push('/roadmap')}
              className="bg-[#4fdbc8] hover:bg-teal-400 text-slate-950 font-semibold rounded-xl flex-1">
              See my roadmap
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  if (selectedDimension) {
    const questions = DEEP_DIVE_QUESTIONS[selectedDimension]
    const q = questions[currentQ]
    const progress = Math.round(((currentQ) / questions.length) * 100)

    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <div className="flex-1 h-1.5 bg-[#222a3d] rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-teal-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
          <span className="text-xs font-mono text-[#918fa1]">{currentQ + 1}/{questions.length}</span>
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={currentQ} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.2 }}>
            <p className="text-xs uppercase tracking-widest text-teal-400 font-mono mb-4">{q.subCategory}</p>
            <h2 className="text-xl font-bold font-[family-name:var(--font-space-grotesk)] text-[#dae2fd] tracking-tight mb-7 leading-snug">
              {q.question}
            </h2>
            <div className="flex flex-col gap-2.5">
              {q.options.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(opt)}
                  className="w-full text-left px-5 py-4 rounded-2xl border border-white/5 bg-[#171f33] text-[#c7c4d8] hover:bg-[#1a2236] hover:border-white/10 text-sm transition-all">
                  {opt}
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-indigo-400 font-medium mb-1">Deep Dive</p>
        <h1 className="text-2xl font-bold text-[#dae2fd] mb-2">Go deeper on a dimension</h1>
        <p className="text-sm text-[#c7c4d8]">
          Pick a dimension to break down your sub-category strengths and gaps with 3 targeted questions.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {DIMENSION_ORDER.map((dim, di) => {
          const tier = tiers?.[dim]
          const config = tier ? TIER_CONFIG[tier as keyof typeof TIER_CONFIG] : TIER_CONFIG.neutral
          const locked = !isPro && di >= FREE_DIMENSIONS

          const button = (
            <button key={dim} onClick={locked ? undefined : () => { setSelectedDimension(dim); setCurrentQ(0); setAnswers({}) }}
              className="w-full text-left flex items-center justify-between px-5 py-4 rounded-2xl border border-white/5 bg-[#171f33] hover:bg-[#1a2236] hover:border-white/10 transition-all group">
              <div>
                <p className="text-sm font-medium text-[#dae2fd]">{DIMENSION_LABELS[dim]}</p>
                {tier && <p className={`text-xs mt-0.5 ${config.color}`}>{config.label}</p>}
              </div>
              <ArrowRight className="w-4 h-4 text-[#918fa1] group-hover:text-indigo-400 transition-colors" />
            </button>
          )

          if (locked) {
            return (
              <BlurGate key={dim} locked label="Pro — unlock all dimensions">
                {button}
              </BlurGate>
            )
          }
          return button
        })}
      </div>
    </div>
  )
}
