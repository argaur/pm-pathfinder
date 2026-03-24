import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

interface Props {
  params: Promise<{ id: string }>
}

export default async function PublicPortfolioPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()

  // Read only from portfolio_profiles (public RLS allows is_public = true)
  const [{ data: portfolio }, { data: caseStudies }] = await Promise.all([
    supabase
      .from('portfolio_profiles')
      .select('*')
      .eq('user_id', id)
      .eq('is_public', true)
      .single(),
    supabase
      .from('portfolio_case_studies')
      .select('*')
      .eq('user_id', id)
      .order('order_index'),
  ])

  if (!portfolio) notFound()

  const traits: string[] = Array.isArray(portfolio.traits) ? portfolio.traits : []
  const strengths: string[] = Array.isArray(portfolio.strengths) ? portfolio.strengths : []

  return (
    <main className="min-h-screen bg-[#0b1326]">
      {/* Atmosphere */}
      <div className="fixed -top-40 -right-40 w-[600px] h-[600px] bg-indigo-600/8 rounded-full blur-[130px] pointer-events-none -z-10" />

      {/* Nav */}
      <nav className="border-b border-white/5 px-6 h-14 flex items-center justify-between">
        <Link href="/">
          <span className="text-sm font-bold text-[#c3c0ff] font-[family-name:var(--font-space-grotesk)]">
            PM Pathfinder
          </span>
        </Link>
        <Link href="/quiz">
          <button className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
            Get your own archetype →
          </button>
        </Link>
      </nav>

      <div className="max-w-2xl mx-auto px-6 py-12">
        {/* Profile header */}
        <div className="mb-10">
          <div className="w-16 h-16 rounded-full bg-indigo-500/15 ring-2 ring-indigo-500/30 flex items-center justify-center text-2xl font-bold text-[#c3c0ff] mb-4">
            {(portfolio.display_name ?? '?').charAt(0).toUpperCase()}
          </div>
          <h1 className="text-2xl font-bold text-[#dae2fd] mb-1">
            {portfolio.display_name}
          </h1>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
              {portfolio.archetype}
            </span>
            <span className="text-xs font-mono text-[#918fa1] capitalize">
              {(portfolio.background_axis ?? '').replace('_', '-')} background
            </span>
          </div>
        </div>

        {/* PM Story */}
        {portfolio.pm_story && (
          <div className="bg-[#171f33] border border-white/[0.06] rounded-2xl p-6 mb-6">
            <p className="text-[10px] uppercase tracking-widest text-[#918fa1] mb-3">About</p>
            <p className="text-sm text-[#c7c4d8] leading-relaxed">{portfolio.pm_story}</p>
          </div>
        )}

        {/* Skills card */}
        <div className="bg-[#171f33] border border-white/[0.06] rounded-2xl p-6 mb-6">
          <p className="text-[10px] uppercase tracking-widest text-[#918fa1] mb-3">
            PM Skills — verified via PM Pathfinder assessment
          </p>
          {traits.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {traits.map((t: string) => (
                <span key={t} className="text-xs px-3 py-1.5 rounded-full bg-[#222a3d] border border-white/10 text-[#c3c0ff]">
                  {t}
                </span>
              ))}
            </div>
          )}
          {strengths.length > 0 && (
            <ul className="flex flex-col gap-2">
              {strengths.map((s: string) => (
                <li key={s} className="text-sm text-[#dae2fd] flex items-start gap-2">
                  <span className="text-emerald-500 mt-0.5">✓</span>
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Case studies */}
        {caseStudies && caseStudies.length > 0 && (
          <div className="mb-10">
            <p className="text-[10px] uppercase tracking-widest text-[#918fa1] mb-3">
              Case Studies
            </p>
            <div className="flex flex-col gap-4">
              {caseStudies.map((cs) => (
                <div key={cs.id} className="bg-[#171f33] border border-white/[0.06] rounded-2xl p-6">
                  <h3 className="text-sm font-semibold text-[#dae2fd] mb-4">{cs.title}</h3>
                  {[
                    { label: 'Problem', value: cs.problem },
                    { label: 'Approach', value: cs.approach },
                    { label: 'Outcome', value: cs.outcome },
                  ].map(({ label, value }) =>
                    value ? (
                      <div key={label} className="mb-3 last:mb-0">
                        <p className="text-[10px] uppercase tracking-widest text-[#918fa1] mb-1">
                          {label}
                        </p>
                        <p className="text-sm text-[#c7c4d8] leading-relaxed">{value}</p>
                      </div>
                    ) : null
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="bg-[#171f33] border border-indigo-500/20 rounded-2xl p-6 text-center">
          <p className="text-sm font-medium text-[#dae2fd] mb-1">
            Want to know your PM Archetype?
          </p>
          <p className="text-xs text-[#918fa1] mb-4">
            Take a free 10-minute assessment and get your personalised career roadmap.
          </p>
          <Link href="/quiz">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-xl transition-all">
              Take the Assessment
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </main>
  )
}
