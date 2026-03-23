import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Trigger session migration via API route
      // The session token is in localStorage (client-side) so migration
      // happens client-side after redirect — see dashboard/page.tsx
      return NextResponse.redirect(`${origin}${next}?migrated=1`)
    }
  }

  return NextResponse.redirect(`${origin}/auth?error=callback_failed`)
}
