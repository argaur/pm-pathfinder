import { createClient } from '@/lib/supabase/server'

export async function getIsPro(userId: string): Promise<boolean> {
  const supabase = await createClient()
  const { data } = await supabase
    .from('profiles')
    .select('is_pro')
    .eq('id', userId)
    .single()
  return data?.is_pro === true
}
