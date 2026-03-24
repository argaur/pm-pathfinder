import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getIsPro } from '@/lib/user/getIsPro'
import ChatClient from './ChatClient'

export default async function ChatPage() {
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

  const isPro = await getIsPro(user.id)

  return (
    <ChatClient
      archetype={assessment?.archetype ?? null}
      isPro={isPro}
    />
  )
}
