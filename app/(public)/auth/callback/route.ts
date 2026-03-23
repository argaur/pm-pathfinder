import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/migrate'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${origin}${next}?migrated=1`)
    }

    console.error('[auth/callback] exchangeCodeForSession error:', error.message, error)
    return NextResponse.redirect(`${origin}/auth?error=callback_failed&detail=${encodeURIComponent(error.message)}`)
  }

  return NextResponse.redirect(`${origin}/auth?error=callback_failed&detail=no_code`)
}
