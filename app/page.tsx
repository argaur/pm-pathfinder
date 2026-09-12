'use client'

import type { ReactNode } from 'react'
import Link from 'next/link'
import { motion, MotionConfig } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import Hero from '@/components/marketing/Hero'
import { DURATIONS, EASINGS, REDUCED_MOTION, fadeUpVariants, staggerDelay } from '@/lib/motion'

/**
 * Product landing page — the second consumer of components/marketing/Hero.
 *
 * The page leads with what the product does and the evidence behind it, in that
 * order: a claim, then the research the claim came from, then the mechanism,
 * then an honest note that the whole thing is free.
 *
 * Colour rules (measured, do not "fix"):
 *   - brand-indigo is 2.94:1 as text on dark and fails AA. Fill only — button
 *     background, ring, wash. Never text.
 *   - the amber CTA always carries text-slate-950 (11.87:1). Never light text
 *     on amber.
 *
 * All colour, spacing and motion values come from app/globals.css tokens and
 * lib/motion.ts. No raw hex, no inline timing numbers.
 */

const BARRIERS = [
  { id: 'Proof gap', desc: 'Cannot credibly demonstrate PM capability without a PM title.' },
  { id: 'Access gap', desc: 'PM hiring runs on referrals. Cold applications get a 1.5 to 2.7% response.' },
  { id: 'Theory-practice gap', desc: 'Content gets consumed but never converted into applicable skill.' },
  { id: 'Feedback vacuum', desc: 'No structured feedback outside of actual interviews.' },
  { id: 'Jargon barrier', desc: 'PM education is built by PMs for PMs, which shuts out career switchers.' },
]

const PAIN_POINTS = [
  {
    quote: 'I just have a resume. I do not have a portfolio to showcase.',
    name: 'Ankit',
    context: '3 years as PM, could not break into general PM roles',
  },
  {
    quote: 'I used to not see where do I stand. How can I measure myself?',
    name: 'Rishi',
    context: '8 years in BA and PM-adjacent roles',
  },
  {
    quote: 'That structured guidance which is customized to where do I stand, not the generic one.',
    name: 'Kriti',
    context: '14 years experience, 4.5 as PM',
  },
]

const STEPS = [
  {
    num: '01',
    title: 'Find out where you actually stand',
    desc: '10 scenario questions mapped across 5 PM dimensions. No jargon required. It takes about 8 minutes.',
  },
  {
    num: '02',
    title: 'Get your PM archetype',
    desc: 'One of 6 archetypes, from your background and your mindset. You learn what kind of PM you are built to be, and which gap to close first.',
  },
  {
    num: '03',
    title: 'Follow a path built for you',
    desc: 'A chapter-by-chapter roadmap aimed at your gaps, not a generic course. Concepts, frameworks and practice in the order you need them.',
  },
]

const ARCHETYPES = [
  { name: 'The Builder', background: 'Technical', mindset: 'Execution', from: 'SWE, DevOps' },
  { name: 'The Architect', background: 'Technical', mindset: 'Strategy', from: 'Tech lead, solutions architect' },
  { name: 'The Storyteller', background: 'Human-centered', mindset: 'Strategy', from: 'Designer, UX researcher' },
  { name: 'The Advocate', background: 'Human-centered', mindset: 'Execution', from: 'CX, support lead' },
  { name: 'The Operator', background: 'Business', mindset: 'Execution', from: 'Ops, BA, consultant' },
  { name: 'The Strategist', background: 'Business', mindset: 'Strategy', from: 'Strategy, finance, growth' },
]

const FEATURES = [
  {
    title: 'PM archetype assessment',
    desc: '10 scenario questions mapping your background against your mindset to one of 6 archetypes.',
  },
  {
    title: 'Skill gap report',
    desc: 'A 5-dimension breakdown of where you stand on thinking, execution, technical fluency, user research and communication.',
  },
  {
    title: 'Personalised learning path',
    desc: 'A roadmap ordered by your gaps. Watch or read, mark done, track progress.',
  },
  {
    title: 'Interview readiness score',
    desc: 'A 0 to 100 score benchmarked against APM, PM and Senior PM roles, with a breakdown of what to fix.',
  },
  {
    title: 'Deep dive per dimension',
    desc: 'Sub-category scoring inside any dimension, so a low score tells you which part of it is low.',
  },
  {
    title: 'Public PM portfolio',
    desc: 'A shareable case-study page backed by your assessed skills, at a link you can send to a recruiter.',
  },
]

const SAMPLE_SCORES = [
  { label: 'TECHNICAL DEPTH', value: 82, bar: 'bg-primary' },
  { label: 'PRODUCT STRATEGY', value: 64, bar: 'bg-secondary' },
  { label: 'USER EMPATHY', value: 91, bar: 'bg-brand-amber' },
]

function SectionHeading({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string
  title: string
  lede?: string
}) {
  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: DURATIONS.long, ease: EASINGS.easeOutExpo }}
      className="mb-12 flex flex-col gap-3"
    >
      <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground">
        {eyebrow}
      </p>
      <h2 className="text-balance font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {title}
      </h2>
      {lede && (
        <p className="max-w-2xl text-pretty text-sm leading-relaxed text-card-foreground/80">
          {lede}
        </p>
      )}
    </motion.div>
  )
}

function Reveal({
  index = 0,
  children,
  className,
}: {
  index?: number
  children: ReactNode
  className?: string
}) {
  return (
    <motion.div
      variants={fadeUpVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: DURATIONS.long,
        delay: staggerDelay(index),
        ease: EASINGS.easeOutExpo,
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default function LandingPage() {
  return (
    <MotionConfig reducedMotion={REDUCED_MOTION}>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      {/* Nav — a sibling of <main>, not nested inside it: this is site chrome, not the page's
          primary content region. */}
      <nav className="flex h-14 items-center justify-between border-b border-border px-6">
        <span className="font-heading text-sm font-bold text-primary">PM Pathfinder</span>
        <div className="flex items-center gap-5">
          <Link
            href="/auth?next=/dashboard"
            className="rounded-md text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            Sign in
          </Link>
          <Link
            href="/quiz"
            className="rounded-md text-xs text-foreground/80 transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus-ring"
          >
            Take the assessment →
          </Link>
        </div>
      </nav>

      <main id="main-content" className="min-h-screen bg-surface-0">
      <Hero
        eyebrow="PM career diagnostic"
        title="You are closer to PM than you think. Find out what is missing."
        lede="Take a 10-minute assessment. Get a career roadmap built from your background, not from a generic template."
        meta={['9 user interviews', '6 archetypes', '10 questions', 'about 8 minutes']}
        badges={['Free', 'No card', 'Everything unlocked']}
        actions={[
          { label: 'Assess where you are', href: '/quiz', variant: 'amber' },
          { label: 'Sign in', href: '/auth?next=/dashboard', variant: 'ghost' },
        ]}
      >
        {/* Illustrative sample of the report, labelled as such. */}
        <figure className="rounded-2xl border border-border bg-surface-1 p-card-sm">
          <figcaption className="mb-5 flex items-baseline justify-between gap-4">
            <span className="font-heading text-sm font-semibold text-foreground">
              What the report looks like
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Sample, not real data
            </span>
          </figcaption>
          <div className="flex flex-col gap-3">
            {SAMPLE_SCORES.map((item) => (
              <div key={item.label} className="flex flex-col gap-2 rounded-xl bg-surface-2 p-3">
                <div className="flex justify-between font-mono text-[11px]">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="text-foreground">{item.value}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-0">
                  <div
                    className={`h-full rounded-full ${item.bar}`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
              Archetype match
            </span>
            <span className="font-heading text-sm font-semibold text-foreground">
              The Strategist
            </span>
          </div>
        </figure>
      </Hero>

      <div className="mx-auto max-w-4xl px-6">
        {/* Research — what people actually said */}
        <section className="py-16 sm:py-section">
          <SectionHeading
            eyebrow="Primary research"
            title="The career gap is real"
            lede="Nine interviews with people moving into PM from engineering, design, consulting and operations. Three patterns kept surfacing."
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {PAIN_POINTS.map((item, i) => (
              <Reveal key={item.name} index={i}>
                <figure className="h-full rounded-2xl border border-border bg-surface-1 p-card-sm">
                  <blockquote className="text-pretty text-sm leading-relaxed text-card-foreground/85">
                    &ldquo;{item.quote}&rdquo;
                  </blockquote>
                  <figcaption className="mt-5 flex items-start gap-3">
                    <span aria-hidden className="mt-2 h-px w-6 shrink-0 bg-brand-amber" />
                    <span>
                      <span className="block font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground">
                        {item.name}
                      </span>
                      <span className="mt-0.5 block text-xs text-muted-foreground">
                        {item.context}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Research — the barriers */}
        <section className="border-t border-border py-16 sm:py-section">
          <SectionHeading
            eyebrow="What the interviews found"
            title="Five structural barriers to a PM transition"
            lede="Each one is a thing the product has to answer. The assessment and the roadmap are built directly against this list."
          />

          <ol className="flex flex-col gap-3">
            {BARRIERS.map((b, i) => (
              <Reveal key={b.id} index={i}>
                <li className="flex items-start gap-4 rounded-2xl border border-border bg-surface-1 p-card-sm">
                  <span
                    aria-hidden
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-indigo/20 font-mono text-xs font-semibold text-foreground"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="min-w-0">
                    <span className="block text-sm font-semibold text-foreground">{b.id}</span>
                    <span className="mt-1 block text-pretty text-sm leading-relaxed text-card-foreground/80">
                      {b.desc}
                    </span>
                  </span>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal className="mt-8">
            <figure className="rounded-2xl border border-border bg-surface-1 p-card-sm">
              <blockquote className="text-pretty text-base leading-relaxed text-card-foreground/85">
                &ldquo;A tool which kind of tailors the entire program according to me only. It
                sort of analyses me and then presents its solution.&rdquo;
              </blockquote>
              <figcaption className="mt-4 font-mono text-xs text-muted-foreground">
                Research participant · 7 years in product
              </figcaption>
            </figure>
          </Reveal>
        </section>

        {/* How it works */}
        <section className="border-t border-border py-16 sm:py-section">
          <SectionHeading
            eyebrow="How it works"
            title="From career switcher to a PM who can prove it"
            lede="Three steps. The path starts from where you are, not from where everyone else is."
          />

          <ol className="flex flex-col gap-6">
            {STEPS.map((step, i) => (
              <Reveal key={step.num} index={i}>
                <li className="flex items-start gap-5 rounded-2xl border border-border bg-surface-1 p-card-sm sm:p-card">
                  <span
                    aria-hidden
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-indigo/20 font-mono text-xs font-semibold text-foreground"
                  >
                    {step.num}
                  </span>
                  <span className="min-w-0">
                    <span className="block font-heading text-lg font-semibold leading-snug text-foreground">
                      {step.title}
                    </span>
                    <span className="mt-2 block text-pretty text-sm leading-relaxed text-card-foreground/80">
                      {step.desc}
                    </span>
                  </span>
                </li>
              </Reveal>
            ))}
          </ol>

          <Reveal className="mt-8">
            <div className="rounded-2xl border border-brand-indigo/30 bg-surface-1 p-card-sm">
              <p className="text-[10px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Where it lands
              </p>
              <p className="mt-3 text-pretty text-base font-semibold leading-relaxed text-foreground">
                You walk into the interview knowing your archetype, your strengths, and exactly
                how you closed the gap.
              </p>
              <p className="mt-2 text-pretty text-sm leading-relaxed text-card-foreground/80">
                Not just prepared. Positioned. You can talk about your background as an asset
                instead of a liability.
              </p>
            </div>
          </Reveal>
        </section>

        {/* Archetypes */}
        <section className="border-t border-border py-16 sm:py-section">
          <SectionHeading
            eyebrow="The framework"
            title="Six PM archetypes. Which one are you?"
            lede="Mapped on two axes: the background you are coming from, and whether you think execution-first or strategy-first."
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {ARCHETYPES.map((a, i) => (
              <Reveal key={a.name} index={i}>
                <article className="h-full rounded-2xl border border-border bg-surface-1 p-card-sm">
                  <h3 className="font-heading text-base font-bold text-foreground">{a.name}</h3>
                  <ul className="mt-3 flex flex-wrap gap-1.5">
                    {[a.background, a.mindset].map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-brand-indigo/30 bg-brand-indigo/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.1em] text-foreground"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    Comes from: {a.from}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-8">
            <Link
              href="/quiz"
              className="inline-flex min-h-[44px] items-center gap-2 rounded-xl border border-border bg-transparent px-6 text-sm font-semibold text-foreground transition-colors hover:bg-surface-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
            >
              Find out which one you are
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Reveal>
        </section>

        {/* What is included */}
        <section className="border-t border-border py-16 sm:py-section">
          <SectionHeading
            eyebrow="What is included"
            title="Built end to end for the PM transition"
            lede="Six pieces, all of them live. Nothing on this list is a waitlist or a teaser."
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {FEATURES.map((f, i) => (
              <Reveal key={f.title} index={i}>
                <article className="h-full rounded-2xl border border-border bg-surface-1 p-card-sm">
                  <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
                  <p className="mt-2 text-pretty text-sm leading-relaxed text-card-foreground/80">
                    {f.desc}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>
        </section>

        {/*
          Replaces the old pricing section. Pro gating is permanently off and
          payment integration is out of scope, so a priced tier here would be a
          false claim. No pricing, upgrade or payment UI belongs on this page.
        */}
        <section id="cost" className="border-t border-border py-16 sm:py-section">
          <SectionHeading eyebrow="What this costs" title="Nothing. Everything is unlocked." />

          <Reveal>
            <div className="rounded-2xl border border-brand-indigo/30 bg-surface-1 p-card-sm sm:p-card">
              <p className="text-pretty text-base leading-relaxed text-card-foreground/85">
                PM Pathfinder is a portfolio project, not a business. There is no paid tier, no
                card to enter, and nothing held back behind an upgrade. Every feature on this
                page is open to every account: the assessment, the full report, the roadmap, the
                readiness score, and the public portfolio page.
              </p>
              <p className="mt-4 text-pretty text-base leading-relaxed text-card-foreground/85">
                It was built to show that a product can be researched, designed and shipped end
                to end. It stays free for as long as it stays up.
              </p>
              <Link
                href="/quiz"
                className="mt-6 inline-flex min-h-[44px] items-center gap-2 rounded-xl bg-brand-amber px-6 text-sm font-semibold text-slate-950 shadow-glow-amber transition-colors hover:bg-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-amber"
              >
                Start the assessment
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </Reveal>
        </section>
      </div>

      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-4xl flex-col gap-2 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span className="font-heading text-sm font-semibold text-foreground">PM Pathfinder</span>
          <span>Built on primary research with 9 people navigating the PM transition.</span>
          <span className="font-mono">Rethink AI MPM Cohort 7</span>
        </div>
      </footer>
      </main>
    </MotionConfig>
  )
}
