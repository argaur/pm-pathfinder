import { getCachedProfile } from '@/lib/supabase/cached'

export async function getIsPro(userId: string): Promise<boolean> {
  const profile = await getCachedProfile(userId)
  return profile?.is_pro === true
}
