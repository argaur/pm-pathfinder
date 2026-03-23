import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ARCHETYPES } from '@/lib/data/archetypes'
import { DIMENSION_LABELS, TIER_CONFIG } from '@/lib/scoring/engine'
import { Dimension } from '@/lib/data/questions'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const PLACEHOLDER_CONTENT = [
  {
    id: 'placeholder-1',
    dimension: 'user_research',
    skill_category: 'User Interview Techniques',
    concept: 'Structured user interviews reveal the gap between what users say they want and what they actually need. The goal is not validation — it\'s discovery.',
    framework: 'TEDW Question Framework: Tell me... Explain to me... Describe to me... Walk me through...',
    exercise: 'Conduct 3 x 20-minute interviews with people in your target segment using only open-ended questions. No yes/no questions allowed. Synthesise 3 core insights.',
    reading: null,
    priority_level: 'growth',
  },
  {
    id: 'placeholder-2',
    dimension: 'technical_fluency',
    skill_category: 'API & System Design Literacy',
    concept: 'PMs don\'t need to write code. They need to speak engineering. Understanding REST APIs, database concepts, and system boundaries removes the translation layer between product and eng.',
    framework: 'The PM Tech Stack Mental Model: (1) Data layer → what persists, (2) Logic layer → what transforms, (3) Interface layer → what the user sees. Map every feature to all three.',
    exercise: 'Take one feature you own. Draw its data flow from user action → API call → DB → response. Share with your tech lead and ask: \'What did I miss?\'',
    reading: null,
    priority_level: 'growth',
  },
  {
    id: 'placeholder-3',
    dimension: 'execution',
    skill_category: 'Sprint Planning & Delivery',
    concept: 'Sprint planning is where strategy dies or survives. The PM\'s job is to ensure every story in the sprint connects to a measurable outcome, not just a deliverable.',
    framework: 'The Story Readiness Checklist: (1) Problem statement clear, (2) Acceptance criteria defined, (3) Dependencies flagged, (4) Design ready, (5) Estimated by engineering.',
    exercise: 'For your next sprint, write the sprint goal FIRST before selecting stories. Then retrospectively check: do the selected stories actually serve that goal?',
    reading: null,
    priority_level: 'growth',
  },
]

export default async function TextRoadmapPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: assessment } = await supabase
    .from('assessments')
    .select('*')
    .eq('user_id', user.id)
    .order('taken_at', { ascending: false })
    .limit(1)
    .single()

  if (!assessment) redirect('/quiz')

  const archetype = ARCHETYPES[assessment.archetype as keyof typeof ARCHETYPES]
  const tiers = assessment.tiers as Record<Dimension, 'growth' | 'neutral' | 'strength'> | null

  // Fetch content for this archetype — growth areas first
  const { data: content } = await supabase
    .from('content')
    .select('*')
    .eq('archetype', assessment.archetype)
    .order('priority_level', { ascending: true }) // growth sorts first alphabetically
    .limit(60)

  const hasContent = content && content.length > 0

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-indigo-400 font-medium mb-1">Text Roadmap</p>
        <h1 className="text-2xl font-bold text-[#dae2fd] mb-1">{archetype.name} Study Plan</h1>
        <p className="text-sm text-[#c7c4d8]">
          Concepts, frameworks, and exercises — prioritised for your skill gaps.
        </p>
      </div>

      {/* Dimension priority legend */}
      {tiers && (
        <div className="flex flex-wrap gap-2 mb-6">
          {(Object.entries(tiers) as [Dimension, 'growth' | 'neutral' | 'strength'][]).map(([dim, tier]) => {
            const config = TIER_CONFIG[tier]
            return (
              <div
                key={dim}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border border-white/10 ${config.bg} ${config.color}`}
              >
                <span>{DIMENSION_LABELS[dim]}</span>
                <span className="opacity-60">·</span>
                <span>{config.label}</span>
              </div>
            )
          })}
        </div>
      )}

      {!hasContent ? (
        <div>
          <div className="bg-[#222a3d] rounded-xl px-4 py-3 mb-6 flex items-center gap-3">
            <span className="text-xs text-[#c3c0ff] font-medium">Preview</span>
            <span className="text-xs text-[#918fa1]">Showing sample content for your top growth areas. Full library seeds after your first re-evaluation.</span>
          </div>

          <div className="flex flex-col gap-3">
            {PLACEHOLDER_CONTENT.map((item) => (
              <div
                key={item.id}
                className="bg-[#171f33] rounded-xl overflow-hidden"
              >
                <div className="px-5 py-4 flex items-center gap-3">
                  <span className="text-xs text-indigo-400 uppercase tracking-wider w-32 flex-shrink-0">
                    {item.dimension?.replace('_', ' ')}
                  </span>
                  <span className="text-sm font-medium text-[#dae2fd]">{item.skill_category}</span>
                </div>
                <div className="px-5 pb-5 flex flex-col gap-4 border-t border-white/5 pt-4">
                  {item.concept && (
                    <div>
                      <p className="text-xs uppercase tracking-widest text-[#918fa1] mb-1.5">Concept</p>
                      <p className="text-sm text-[#dae2fd] leading-relaxed">{item.concept}</p>
                    </div>
                  )}
                  {item.framework && (
                    <div>
                      <p className="text-xs uppercase tracking-widest text-[#918fa1] mb-1.5">Framework</p>
                      <p className="text-sm text-[#dae2fd] leading-relaxed">{item.framework}</p>
                    </div>
                  )}
                  {item.exercise && (
                    <div className="bg-[#222a3d] border border-white/10 rounded-lg p-4">
                      <p className="text-xs uppercase tracking-widest text-indigo-400 mb-1.5">Exercise</p>
                      <p className="text-sm text-[#dae2fd] leading-relaxed">{item.exercise}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Tabs defaultValue="growth">
          <TabsList className="bg-[#171f33] mb-6">
            <TabsTrigger value="growth" className="text-xs data-[state=active]:bg-rose-950/60 data-[state=active]:text-rose-300">
              Growth Areas
            </TabsTrigger>
            <TabsTrigger value="neutral" className="text-xs data-[state=active]:bg-amber-950/60 data-[state=active]:text-amber-300">
              Building
            </TabsTrigger>
            <TabsTrigger value="strength" className="text-xs data-[state=active]:bg-emerald-950/60 data-[state=active]:text-emerald-300">
              Strengths
            </TabsTrigger>
          </TabsList>

          {(['growth', 'neutral', 'strength'] as const).map((tier) => {
            const tierContent = content.filter((c) => c.priority_level === tier)
            return (
              <TabsContent key={tier} value={tier}>
                {tierContent.length === 0 ? (
                  <p className="text-[#918fa1] text-sm py-4">No content in this tier yet.</p>
                ) : (
                  <Accordion multiple className="flex flex-col gap-2">
                    {tierContent.map((item) => (
                      <AccordionItem
                        key={item.id}
                        value={item.id}
                        className="bg-[#171f33] rounded-xl px-5 py-1 data-[state=open]:border data-[state=open]:border-white/10"
                      >
                        <AccordionTrigger className="text-sm font-medium text-[#dae2fd] hover:no-underline py-4">
                          <div className="flex items-center gap-3 text-left">
                            <span className="text-xs text-indigo-400 uppercase tracking-wider w-32 flex-shrink-0">
                              {item.dimension?.replace('_', ' ')}
                            </span>
                            {item.skill_category}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                          <div className="flex flex-col gap-4 pt-2">
                            {item.concept && (
                              <div>
                                <p className="text-xs uppercase tracking-widest text-[#918fa1] mb-1.5">Concept</p>
                                <p className="text-sm text-[#dae2fd] leading-relaxed">{item.concept}</p>
                              </div>
                            )}
                            {item.framework && (
                              <div>
                                <p className="text-xs uppercase tracking-widest text-[#918fa1] mb-1.5">Framework</p>
                                <p className="text-sm text-[#dae2fd] leading-relaxed">{item.framework}</p>
                              </div>
                            )}
                            {item.exercise && (
                              <div className="bg-[#222a3d] border border-white/10 rounded-lg p-4">
                                <p className="text-xs uppercase tracking-widest text-indigo-400 mb-1.5">Exercise</p>
                                <p className="text-sm text-[#dae2fd] leading-relaxed">{item.exercise}</p>
                              </div>
                            )}
                            {item.reading && (
                              <div>
                                <p className="text-xs uppercase tracking-widest text-[#918fa1] mb-1.5">Reading</p>
                                <p className="text-sm text-[#c7c4d8]">{item.reading}</p>
                              </div>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </TabsContent>
            )
          })}
        </Tabs>
      )}
    </div>
  )
}
