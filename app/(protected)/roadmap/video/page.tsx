import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ARCHETYPES } from '@/lib/data/archetypes'
import VideoRoadmapClient from './VideoRoadmapClient'

// Placeholder YouTube content per archetype
// Replace video IDs with actual Rethink YouTube content in Phase 9
const ROADMAP_CONTENT: Record<string, Record<number, { weeks: { week: number; title: string; videoId: string; dimension: string }[] }>> = {
  builder: {
    1: { weeks: [
      { week: 1, title: 'From Engineering to Product Thinking', videoId: 'dQw4w9WgXcQ', dimension: 'Thinking & Strategy' },
      { week: 2, title: 'Writing Product Requirements That Engineers Love', videoId: 'dQw4w9WgXcQ', dimension: 'Execution' },
      { week: 3, title: 'Stakeholder Communication for Technical PMs', videoId: 'dQw4w9WgXcQ', dimension: 'Communication' },
      { week: 4, title: 'User Research for People Who Love Data', videoId: 'dQw4w9WgXcQ', dimension: 'User & Research' },
    ]},
    3: { weeks: [
      { week: 1, title: 'From Engineering to Product Thinking', videoId: 'dQw4w9WgXcQ', dimension: 'Thinking & Strategy' },
      { week: 2, title: 'Writing Product Requirements That Engineers Love', videoId: 'dQw4w9WgXcQ', dimension: 'Execution' },
      { week: 3, title: 'Stakeholder Communication for Technical PMs', videoId: 'dQw4w9WgXcQ', dimension: 'Communication' },
      { week: 4, title: 'User Research for People Who Love Data', videoId: 'dQw4w9WgXcQ', dimension: 'User & Research' },
      { week: 5, title: 'Prioritisation Frameworks: RICE, ICE, MoSCoW', videoId: 'dQw4w9WgXcQ', dimension: 'Thinking & Strategy' },
      { week: 6, title: 'Building Your PM Story', videoId: 'dQw4w9WgXcQ', dimension: 'Communication' },
      { week: 7, title: 'Product Metrics and Analytics', videoId: 'dQw4w9WgXcQ', dimension: 'Thinking & Strategy' },
      { week: 8, title: 'Sprint Planning and Agile for PMs', videoId: 'dQw4w9WgXcQ', dimension: 'Execution' },
    ]},
    6: { weeks: Array.from({ length: 16 }, (_, i) => ({
      week: i + 1,
      title: `Week ${i + 1}: PM Fundamentals Module ${i + 1}`,
      videoId: 'dQw4w9WgXcQ',
      dimension: ['Thinking & Strategy', 'Execution', 'Communication', 'User & Research', 'Technical Fluency'][i % 5],
    }))},
  },
  strategist: {
    1: { weeks: [
      { week: 1, title: 'Translating Business Strategy into Product Roadmaps', videoId: 'dQw4w9WgXcQ', dimension: 'Thinking & Strategy' },
      { week: 2, title: 'User Empathy for Strategy-Focused PMs', videoId: 'dQw4w9WgXcQ', dimension: 'User & Research' },
      { week: 3, title: 'Getting Technical: What PMs Need to Know', videoId: 'dQw4w9WgXcQ', dimension: 'Technical Fluency' },
      { week: 4, title: 'Sprint Execution and Delivery', videoId: 'dQw4w9WgXcQ', dimension: 'Execution' },
    ]},
    3: { weeks: Array.from({ length: 8 }, (_, i) => ({
      week: i + 1,
      title: `Strategist Path: Week ${i + 1}`,
      videoId: 'dQw4w9WgXcQ',
      dimension: ['Thinking & Strategy', 'User & Research', 'Technical Fluency', 'Execution', 'Communication'][i % 5],
    }))},
    6: { weeks: Array.from({ length: 16 }, (_, i) => ({
      week: i + 1,
      title: `Strategist Path: Week ${i + 1}`,
      videoId: 'dQw4w9WgXcQ',
      dimension: ['Thinking & Strategy', 'User & Research', 'Technical Fluency', 'Execution', 'Communication'][i % 5],
    }))},
  },
}

// Generate fallback content for any archetype
function getRoadmapContent(archetype: string, months: number) {
  if (ROADMAP_CONTENT[archetype]?.[months]) {
    return ROADMAP_CONTENT[archetype][months].weeks
  }
  const count = months === 1 ? 4 : months === 3 ? 8 : 16
  return Array.from({ length: count }, (_, i) => ({
    week: i + 1,
    title: `Week ${i + 1}: PM Fundamentals`,
    videoId: 'dQw4w9WgXcQ',
    dimension: ['Thinking & Strategy', 'Execution', 'Communication', 'User & Research', 'Technical Fluency'][i % 5],
  }))
}

export default async function VideoRoadmapPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: assessment } = await supabase
    .from('assessments')
    .select('archetype')
    .eq('user_id', user.id)
    .order('taken_at', { ascending: false })
    .limit(1)
    .single()

  if (!assessment) redirect('/quiz')

  const archetype = ARCHETYPES[assessment.archetype as keyof typeof ARCHETYPES]

  const { data: progress } = await supabase
    .from('roadmap_progress')
    .select('week_number, timeline_months, status')
    .eq('user_id', user.id)
    .eq('archetype', assessment.archetype)

  const progressMap = new Map(
    (progress ?? []).map((p) => [`${p.week_number}-${p.timeline_months}`, p.status])
  )

  return (
    <VideoRoadmapClient
      archetype={archetype}
      getRoadmapContent={getRoadmapContent}
      progressMap={Object.fromEntries(progressMap)}
      userId={user.id}
    />
  )
}
