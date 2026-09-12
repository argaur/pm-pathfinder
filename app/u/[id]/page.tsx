import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowRight, Check } from 'lucide-react'
import type { Metadata } from 'next'
import Hero from '@/components/marketing/Hero'
import CaseStudy from '@/components/marketing/CaseStudy'

interface Props {
  params: Promise<{ id: string }>
}

/**
 * Public, no-login case-study page.
 *
 * The work leads. Case studies are the page's main content and sit directly
 * under a compact identity header; the profile material (PM story, verified
 * strengths) follows as context for the work rather than preceding it.
 *
 * Server component on purpose — the two Supabase reads stay here, and the only
 * client code is the presentational motion inside Hero/CaseStudy.
 */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()

  const { data: portfolio } = await supabase
    .from('portfolio_profiles')
    .select('display_name, archetype')
    .eq('user_id', id)
    .eq('is_public', true)
    .single()

  if (!portfolio?.display_name) return {}

  const title = portfolio.archetype
    ? `${portfolio.display_name} — ${portfolio.archetype} | PM Pathfinder`
    : `${portfolio.display_name} | PM Pathfinder`

  return {
    title,
    description: `PM case studies and verified skills for ${portfolio.display_name}, built with PM Pathfinder.`,
  }
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
  const studies = caseStudies ?? []
  const hasStudies = studies.length > 0

  const displayName: string = portfolio.display_name ?? 'PM Pathfinder member'
  const background = (portfolio.background_axis ?? '').replace('_', '-')

  const meta: string[] = []
  if (background) meta.push(`${background} background`)
  meta.push(hasStudies ? `${studies.length} case ${studies.length === 1 ? 'study' : 'studies'}` : 'Case studies in progress')

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      {/* Nav — a sibling of <main>, not nested inside it: this is site chrome, not the page's
          primary content region. */}
      <nav className="flex h-14 items-center justify-between border-b border-border px-6">
        <Link
          href="/"
          className="rounded-md font-heading text-sm font-bold text-primary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          PM Pathfinder
        </Link>
        <Link
          href="/quiz"
          className="rounded-md text-xs text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
        >
          Get your own archetype →
        </Link>
      </nav>

      <main id="main-content" className="min-h-screen bg-surface-0">
      <Hero
        eyebrow={portfolio.archetype ? `${portfolio.archetype} · PM Archetype` : 'PM Archetype'}
        title={displayName}
        meta={meta}
        badges={traits}
        actions={
          hasStudies
            ? [{ label: 'Read the case studies', href: '#case-studies', variant: 'indigo' }]
            : []
        }
        aside={
          <div
            aria-hidden
            className="flex h-20 w-20 items-center justify-center rounded-2xl bg-brand-indigo/20 ring-1 ring-brand-indigo/40 font-heading text-3xl font-bold text-foreground"
          >
            {displayName.charAt(0).toUpperCase()}
          </div>
        }
      />

      <div className="mx-auto max-w-4xl px-6">
        {/* The work — main content */}
        <section id="case-studies" className="scroll-mt-16 py-16 sm:py-section">
          <div className="mb-8 flex items-baseline justify-between gap-4">
            <h2 className="font-heading text-2xl font-bold tracking-tight text-foreground">
              Selected work
            </h2>
            {hasStudies && (
              <span className="font-mono text-xs text-muted-foreground">
                {studies.length} {studies.length === 1 ? 'study' : 'studies'}
              </span>
            )}
          </div>

          {hasStudies ? (
            <div className="flex flex-col gap-6">
              {studies.map((cs, i) => (
                <CaseStudy
                  key={cs.id}
                  index={i}
                  title={cs.title || `Case study ${i + 1}`}
                  problem={cs.problem}
                  approach={cs.approach}
                  outcome={cs.outcome}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-surface-1 p-card-sm">
              <p className="text-sm leading-relaxed text-card-foreground/80">
                {displayName} hasn&apos;t published a case study yet. The skills below are
                scored from a completed PM Pathfinder diagnostic.
              </p>
            </div>
          )}
        </section>

        {/* Context for the work */}
        <section className="border-t border-border py-16 sm:py-section">
          <h2 className="mb-8 font-heading text-2xl font-bold tracking-tight text-foreground">
            Context
          </h2>

          <div className="flex flex-col gap-6">
            {portfolio.pm_story && (
              <div className="rounded-2xl border border-border bg-surface-1 p-card-sm">
                <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  How {displayName} works
                </p>
                <p className="text-pretty text-sm leading-relaxed text-card-foreground/85">
                  {portfolio.pm_story}
                </p>
              </div>
            )}

            {strengths.length > 0 && (
              <div className="rounded-2xl border border-border bg-surface-1 p-card-sm">
                <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                  PM skills — verified via PM Pathfinder assessment
                </p>
                <ul className="flex flex-col gap-2.5">
                  {strengths.map((s: string) => (
                    <li key={s} className="flex items-start gap-2.5 text-sm text-foreground">
                      <Check
                        className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400"
                        aria-hidden
                      />
                      <span className="text-pretty leading-relaxed">{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-border py-16 sm:py-section">
          <div className="rounded-2xl border border-brand-indigo/30 bg-surface-1 p-card-sm text-center sm:p-card">
            <h2 className="font-heading text-xl font-bold text-foreground">
              Want to know your PM Archetype?
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-card-foreground/80">
              Take a free 10-minute assessment and get your personalised career roadmap.
            </p>
            <Link
              href="/quiz"
              className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-brand-amber px-6 text-sm font-semibold text-slate-950 shadow-glow-amber transition-colors hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-amber"
            >
              Take the Assessment
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </section>
      </div>
      </main>
    </>
  )
}
