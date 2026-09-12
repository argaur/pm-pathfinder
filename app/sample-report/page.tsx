import Link from 'next/link'
import type { Metadata } from 'next'
import { SAMPLE_REPORT } from '@/lib/data/sample-report'
import { toReportViewModel } from '@/lib/report/transform'
import ReportBody from '@/components/report/ReportBody'

/**
 * Public, no-login sample of the diagnostic report — same pattern as
 * app/u/[id]/page.tsx. Lets a recruiter see the real report product
 * without signing up or taking the quiz. Renders through the exact same
 * ReportBody / RadarChart / DimensionCard as the authenticated report;
 * the only thing unique to this page is the banner below.
 */
export const metadata: Metadata = {
  title: 'Sample Report | PM Pathfinder',
  description:
    'A sample PM Pathfinder diagnostic report — see what the real 5-dimension breakdown and archetype profile look like.',
}

export default function SampleReportPage() {
  const { archetype, dimensionScores, tiers, radarData, dimensions } = toReportViewModel(SAMPLE_REPORT)

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
      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* Sample banner — this page only */}
        <div className="mb-8 flex flex-col gap-3 rounded-2xl border border-brand-indigo/30 bg-surface-1 p-card-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
              Sample report
            </p>
            <p className="text-sm leading-relaxed text-card-foreground/85">
              This is a sample diagnostic report so you can see the real thing before signing up.
              Take the 10-minute assessment to get your own.
            </p>
          </div>
          <Link
            href="/quiz"
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center gap-2 rounded-xl bg-brand-amber px-5 text-sm font-semibold text-slate-950 shadow-glow-amber transition-colors hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-amber"
          >
            Take the real quiz
          </Link>
        </div>

        <div className="mb-8">
          <p className="mb-1 text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
            Diagnostic Report
          </p>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground">
            Sample: Complete Profile
          </h1>
        </div>

        <ReportBody
          archetype={archetype}
          dimensionScores={dimensionScores}
          tiers={tiers}
          radarData={radarData}
          dimensions={dimensions}
        />
      </div>
      </main>
    </>
  )
}
