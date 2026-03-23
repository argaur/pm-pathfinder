import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ARCHETYPES } from '@/lib/data/archetypes'
import { DIMENSION_LABELS, TIER_CONFIG } from '@/lib/scoring/engine'
import { Dimension } from '@/lib/data/questions'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

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
        <h1 className="text-2xl font-bold text-white mb-1">{archetype.name} Study Plan</h1>
        <p className="text-sm text-slate-400">
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
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border ${config.bg} ${config.color} ${config.border}`}
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
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center">
          <p className="text-slate-500 text-sm mb-2">Content library coming soon</p>
          <p className="text-xs text-slate-600">
            Your archetype study content is being prepared. Check back after the content seeding step.
          </p>
        </div>
      ) : (
        <Tabs defaultValue="growth">
          <TabsList className="bg-slate-900 border border-slate-800 mb-6">
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
                  <p className="text-slate-500 text-sm py-4">No content in this tier yet.</p>
                ) : (
                  <Accordion multiple className="flex flex-col gap-2">
                    {tierContent.map((item) => (
                      <AccordionItem
                        key={item.id}
                        value={item.id}
                        className="bg-slate-900/60 border border-slate-800 rounded-xl px-5 py-1 data-[state=open]:border-indigo-900/60"
                      >
                        <AccordionTrigger className="text-sm font-medium text-white hover:no-underline py-4">
                          <div className="flex items-center gap-3 text-left">
                            <span className="text-xs text-indigo-500 uppercase tracking-wider w-32 flex-shrink-0">
                              {item.dimension?.replace('_', ' ')}
                            </span>
                            {item.skill_category}
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4">
                          <div className="flex flex-col gap-4 pt-2">
                            {item.concept && (
                              <div>
                                <p className="text-xs uppercase tracking-widest text-slate-600 mb-1.5">Concept</p>
                                <p className="text-sm text-slate-300 leading-relaxed">{item.concept}</p>
                              </div>
                            )}
                            {item.framework && (
                              <div>
                                <p className="text-xs uppercase tracking-widest text-slate-600 mb-1.5">Framework</p>
                                <p className="text-sm text-slate-300 leading-relaxed">{item.framework}</p>
                              </div>
                            )}
                            {item.exercise && (
                              <div className="bg-indigo-950/30 border border-indigo-900/40 rounded-lg p-4">
                                <p className="text-xs uppercase tracking-widest text-indigo-500 mb-1.5">Exercise</p>
                                <p className="text-sm text-slate-300 leading-relaxed">{item.exercise}</p>
                              </div>
                            )}
                            {item.reading && (
                              <div>
                                <p className="text-xs uppercase tracking-widest text-slate-600 mb-1.5">Reading</p>
                                <p className="text-sm text-slate-400">{item.reading}</p>
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
