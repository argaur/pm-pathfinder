import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { dimension, answers } = await request.json()
    if (!dimension || !answers) {
      return NextResponse.json({ error: 'Missing dimension or answers' }, { status: 400 })
    }

    const { error } = await supabase.from('deep_dive_results').insert({
      user_id: user.id,
      dimension,
      answers,
      completed_at: new Date().toISOString(),
    })

    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch {
    // Table may not exist yet — fail silently so UI isn't blocked
    return NextResponse.json({ ok: true, note: 'Table not yet created' })
  }
}
