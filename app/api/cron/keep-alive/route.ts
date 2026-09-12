import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET /api/cron/keep-alive
// Pinged daily by Vercel Cron (see vercel.ts) to stop the free-tier Supabase
// project from auto-pausing after a week of inactivity — see memory/decisions.md
// 2026-09-12. A paused project makes Google sign-in fail with a raw
// "site can't be reached" the moment a user clicks "Continue with Google".
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createAdminClient()
  const { error } = await supabase.from('profiles').select('id').limit(1)

  if (error) {
    console.error('[cron/keep-alive] Supabase ping failed:', error.message)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true, pingedAt: new Date().toISOString() })
}
