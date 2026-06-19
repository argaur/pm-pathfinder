import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCachedUser } from '@/lib/supabase/cached'
import { Dimension } from '@/lib/data/questions'
import DeepDiveClient from './DeepDiveClient'

export default async function DeepDivePage() {
  const user = await getCachedUser()
  if (!user) redirect('/auth')

  const supabase = await createClient()
  const [{ data: assessment }, { data: completedRows }] = await Promise.all([
    supabase
      .from('assessments')
      .select('tiers')
      .eq('user_id', user.id)
      .order('taken_at', { ascending: false })
      .limit(1)
      .single(),
    supabase.from('deep_dive_results').select('dimension').eq('user_id', user.id),
  ])

  const initialTiers = (assessment?.tiers ?? null) as Record<Dimension, string> | null
  const initialCompleted = completedRows
    ? Array.from(new Set(completedRows.map((r) => r.dimension as Dimension)))
    : []

  return <DeepDiveClient initialTiers={initialTiers} initialCompleted={initialCompleted} />
}
