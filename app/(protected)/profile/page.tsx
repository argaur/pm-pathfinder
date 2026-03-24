import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ARCHETYPES } from '@/lib/data/archetypes'
import { DIMENSION_LABELS } from '@/lib/scoring/engine'
import { Dimension } from '@/lib/data/questions'
import ProfileClient from './ProfileClient'
import { getIsPro } from '@/lib/user/getIsPro'

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const [{ data: profile }, { data: assessments }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('assessments')
      .select('*')
      .eq('user_id', user.id)
      .order('taken_at', { ascending: false })
      .limit(10),
  ])

  if (!assessments || assessments.length === 0) redirect('/quiz')

  const latest = assessments[0]
  const archetype = ARCHETYPES[latest.archetype as keyof typeof ARCHETYPES]

  // Build evaluation history with deltas
  const evaluationHistory = assessments.map((a, i) => {
    const prev = assessments[i + 1] ?? null
    const scores = a.dimension_scores as Record<Dimension, number>
    const prevScores = prev ? (prev.dimension_scores as Record<Dimension, number>) : null
    const deltas: Record<Dimension, number | null> = {} as Record<Dimension, number | null>
    ;(Object.keys(scores) as Dimension[]).forEach((dim) => {
      deltas[dim] = prevScores ? +(scores[dim] - prevScores[dim]).toFixed(1) : null
    })
    return {
      id: a.id,
      version: a.version,
      archetype: a.archetype,
      taken_at: a.taken_at,
      scores,
      deltas,
    }
  })

  const isPro = await getIsPro(user.id)

  return (
    <ProfileClient
      profile={{
        displayName: profile?.display_name ?? user.email ?? 'User',
        email: user.email ?? '',
        avatarUrl: profile?.avatar_url ?? null,
        currentRole: profile?.background_axis?.replace('_', ' ') ?? '',
        industry: profile?.industry ?? '',
        yearsExperience: profile?.years_experience ?? '',
      }}
      archetype={{
        name: archetype.name,
        tagline: archetype.tagline,
        background: archetype.background,
        mindset: archetype.mindset,
        traits: archetype.traits,
        strengths: archetype.strengths,
      }}
      userId={user.id}
      isPro={isPro}
      evaluationHistory={evaluationHistory}
      dimensionLabels={DIMENSION_LABELS}
    />
  )
}
