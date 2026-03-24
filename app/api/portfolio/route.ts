import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { ARCHETYPES } from '@/lib/data/archetypes'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const [{ data: portfolio }, { data: caseStudies }] = await Promise.all([
      supabase.from('portfolio_profiles').select('*').eq('user_id', user.id).single(),
      supabase.from('portfolio_case_studies').select('*').eq('user_id', user.id).order('order_index'),
    ])

    return NextResponse.json({ portfolio, caseStudies: caseStudies ?? [] })
  } catch {
    return NextResponse.json({ portfolio: null, caseStudies: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { pmStory, isPublic, caseStudies } = await request.json()

    // Get latest archetype data to denormalize into portfolio_profiles
    const { data: assessment } = await supabase
      .from('assessments')
      .select('archetype')
      .eq('user_id', user.id)
      .order('taken_at', { ascending: false })
      .limit(1)
      .single()

    const { data: profile } = await supabase
      .from('profiles')
      .select('display_name')
      .eq('id', user.id)
      .single()

    const archetype = assessment?.archetype
      ? ARCHETYPES[assessment.archetype as keyof typeof ARCHETYPES]
      : null

    // Upsert portfolio_profiles
    await supabase.from('portfolio_profiles').upsert({
      user_id: user.id,
      display_name: profile?.display_name ?? '',
      archetype: archetype?.name ?? '',
      background_axis: archetype?.background ?? '',
      traits: archetype?.traits ?? [],
      strengths: archetype?.strengths ?? [],
      pm_story: pmStory ?? '',
      is_public: isPublic ?? false,
      updated_at: new Date().toISOString(),
    })

    // Replace case studies — delete existing, insert new
    if (Array.isArray(caseStudies)) {
      await supabase.from('portfolio_case_studies').delete().eq('user_id', user.id)
      if (caseStudies.length > 0) {
        await supabase.from('portfolio_case_studies').insert(
          caseStudies.map((cs: { title: string; problem: string; approach: string; outcome: string }, i: number) => ({
            user_id: user.id,
            title: cs.title,
            problem: cs.problem,
            approach: cs.approach,
            outcome: cs.outcome,
            order_index: i,
          }))
        )
      }
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('Portfolio save error:', err)
    return NextResponse.json({ error: 'Save failed' }, { status: 500 })
  }
}
