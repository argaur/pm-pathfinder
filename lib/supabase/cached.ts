import { cache } from 'react'
import { createClient } from './server'

// React's cache() dedupes these per server-request across layout + page +
// any helper (e.g. getIsPro) that calls them — same args in, one network
// round-trip out, no matter how many components ask for it.

export const getCachedUser = cache(async () => {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
})

export const getCachedProfile = cache(async (userId: string) => {
  const supabase = await createClient()
  const { data } = await supabase.from('profiles').select('*').eq('id', userId).single()
  return data
})
