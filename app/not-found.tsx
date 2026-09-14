import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-surface-0 px-6 text-center">
      <span className="font-heading text-xs font-bold tracking-tight text-primary">
        PM Pathfinder
      </span>
      <h1 className="mt-6 font-heading text-3xl font-bold tracking-tight text-foreground">
        Page not found
      </h1>
      <p className="mt-3 max-w-sm text-sm leading-relaxed text-card-foreground/80">
        This page doesn&apos;t exist, or the link you followed is out of date.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-brand-amber px-6 text-sm font-semibold text-slate-950 shadow-glow-amber transition-colors hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-amber"
      >
        Back to PM Pathfinder
        <ArrowRight className="h-4 w-4" aria-hidden />
      </Link>
    </main>
  )
}
