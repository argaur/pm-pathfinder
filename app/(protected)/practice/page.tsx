import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ARCHETYPE_CHAPTERS } from '@/lib/data/archetype-content'
import { LEARNING_CHAPTERS } from '@/lib/data/learning-path'
import { getIsPro } from '@/lib/user/getIsPro'
import { Dimension } from '@/lib/data/questions'
import PracticeClient from './PracticeClient'

export default async function PracticePage() {
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
  const chapters = ARCHETYPE_CHAPTERS[assessment.archetype ?? ''] ?? LEARNING_CHAPTERS

  // Sort growth-first — same order as the learning path
  const tierOrder = { growth: 0, neutral: 1, strength: 2 }
  const sortedChapters = [...chapters].sort((a, b) => {
    const ta = tierOrder[tiers[a.dimension] ?? 'neutral']
    const tb = tierOrder[tiers[b.dimension] ?? 'neutral']
    return ta - tb
  })

  const isPro = await getIsPro(user.id)

  return (
    <PracticeClient
      chapters={sortedChapters}
      tiers={tiers}
      isPro={isPro}
    />
  )
}
