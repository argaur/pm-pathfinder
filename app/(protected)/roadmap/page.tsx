import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { LEARNING_CHAPTERS } from '@/lib/data/learning-path'
import { ARCHETYPE_CHAPTERS } from '@/lib/data/archetype-content'
import { Dimension } from '@/lib/data/questions'
import LearningPathClient from './LearningPathClient'
import { getIsPro } from '@/lib/user/getIsPro'

export default async function LearningPathPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: assessment } = await supabase
    .from('assessments')
    .select('archetype, tiers')
    .eq('user_id', user.id)
    .order('taken_at', { ascending: false })
    .limit(1)
    .single()

  if (!assessment) redirect('/quiz')

  const tiers = (assessment.tiers ?? {}) as Record<Dimension, 'growth' | 'neutral' | 'strength'>

  // Pick archetype-specific chapters; fall back to generic if archetype not found
  const baseChapters = ARCHETYPE_CHAPTERS[assessment.archetype ?? ''] ?? LEARNING_CHAPTERS

  // Sort chapters: growth first (biggest gap), neutral second, strength last
  const tierOrder = { growth: 0, neutral: 1, strength: 2 }
  const sortedChapters = [...baseChapters].sort((a, b) => {
    const ta = tierOrder[tiers[a.dimension] ?? 'neutral']
    const tb = tierOrder[tiers[b.dimension] ?? 'neutral']
    return ta - tb
  })

  // Fetch progress — table may not exist yet, fall back to empty
  let progressMap: Record<string, string> = {}
  try {
    const { data: progress } = await supabase
      .from('learning_path_progress')
      .select('step_id, mode, status')
      .eq('user_id', user.id)

    progressMap = Object.fromEntries(
      (progress ?? []).map((p) => [`${p.step_id}-${p.mode}`, p.status])
    )
  } catch {
    // Table not yet created — progress starts empty
  }

  const isPro = await getIsPro(user.id)

  return (
    <LearningPathClient
      chapters={sortedChapters}
      tiers={tiers}
      progressMap={progressMap}
      userId={user.id}
      isPro={isPro}
    />
  )
}
