import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

// POST /api/session/migrate
// Called client-side after OAuth callback to migrate anonymous quiz session
// to the authenticated user's account
export async function POST(request: NextRequest) {
  try {
    const { sessionToken } = await request.json()

    if (!sessionToken) {
      return NextResponse.json({ error: 'Missing session token' }, { status: 400 })
    }

    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Use admin client to bypass RLS — anonymous sessions have user_id = NULL
    // so the anon key can never read them after the user authenticates
    const admin = createAdminClient()
    const { data: session, error: fetchError } = await admin
      .from('quiz_sessions')
      .select('*')
      .eq('session_token', sessionToken)
      .eq('migrated', false)
      .single()

    if (fetchError || !session) {
      return NextResponse.json({ error: 'Session not found or already migrated' }, { status: 404 })
    }

    if (!session.dimension_scores || !session.archetype) {
      return NextResponse.json({ error: 'Session incomplete — no diagnostic results' }, { status: 400 })
    }

    // Write to assessments table
    const tiers = computeTiers(session.dimension_scores)
    const { data: assessment, error: insertError } = await supabase
      .from('assessments')
      .insert({
        user_id: user.id,
        session_id: session.id,
        dimension_scores: session.dimension_scores,
        archetype: session.archetype,
        background_axis: session.background_axis,
        onboarding_answers: session.onboarding_answers,
        tiers,
        version: 1,
      })
      .select()
      .single()

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }

    // Update profile
    await supabase
      .from('profiles')
      .update({
        archetype: session.archetype,
        background_axis: session.background_axis,
        years_experience: session.onboarding_answers?.yearsExperience,
        industry: session.onboarding_answers?.industry,
        updated_at: new Date().toISOString(),
      })
      .eq('id', user.id)

    // Mark session as migrated (admin client — same RLS issue on UPDATE)
    await admin
      .from('quiz_sessions')
      .update({ migrated: true, user_id: user.id })
      .eq('id', session.id)

    return NextResponse.json({ success: true, assessmentId: assessment.id })
  } catch (err) {
    console.error('Session migration error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Compute dimension tiers from scores
function computeTiers(scores: Record<string, number>) {
  const tiers: Record<string, string> = {}
  for (const [dim, score] of Object.entries(scores)) {
    if (score < 4) tiers[dim] = 'growth'
    else if (score < 7) tiers[dim] = 'neutral'
    else tiers[dim] = 'strength'
  }
  return tiers
}
