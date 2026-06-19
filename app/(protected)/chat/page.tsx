import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCachedUser } from '@/lib/supabase/cached'
import ChatClient from './ChatClient'

export default async function ChatPage() {
  const user = await getCachedUser()
  if (!user) redirect('/auth')

  const supabase = await createClient()

  const { data: assessment } = await supabase
    .from('assessments')
    .select('archetype')
    .eq('user_id', user.id)
    .order('taken_at', { ascending: false })
    .limit(1)
    .single()

  return (
    <ChatClient
      archetype={assessment?.archetype ?? null}
    />
  )
}
