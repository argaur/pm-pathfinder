'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

const BARRIERS = [
  { id: 'Proof Gap',            desc: 'Cannot credibly demonstrate PM capability without a PM title.' },
  { id: 'Access Gap',           desc: 'PM hiring runs on referrals. Cold applications get 1.5–2.7% response.' },
  { id: 'Theory-Practice Gap',  desc: 'Content consumed but not converted into applicable skill.' },
  { id: 'Feedback Vacuum',      desc: 'No structured feedback outside of actual interviews.' },
  { id: 'Jargon Barrier',       desc: 'PM education built by PMs for PMs — alienates career switchers.' },
]

const ARCHETYPES = [
  { name: 'The Builder',    bg: 'Technical',      mindset: 'Execution',  color: 'text-indigo-400',  border: 'border-indigo-500/20', bg2: 'bg-indigo-500/5',  from: 'SWE, DevOps' },
  { name: 'The Architect',  bg: 'Technical',      mindset: 'Strategy',   color: 'text-teal-400',    border: 'border-teal-500/20',   bg2: 'bg-teal-500/5',    from: 'Tech Lead, Solutions Architect' },
  { name: 'The Storyteller',bg: 'Human-Centered', mindset: 'Strategy',   color: 'text-violet-400',  border: 'border-violet-500/20', bg2: 'bg-violet-500/5',  from: 'Designer, UX Researcher' },
  { name: 'The Advocate',   bg: 'Human-Centered', mindset: 'Execution',  color: 'text-rose-400',    border: 'border-rose-500/20',   bg2: 'bg-rose-500/5',    from: 'CX, Support Lead' },
  { name: 'The Operator',   bg: 'Business',       mindset: 'Execution',  color: 'text-amber-400',   border: 'border-amber-500/20',  bg2: 'bg-amber-500/5',   from: 'Ops, BA, Consultant' },
  { name: 'The Strategist', bg: 'Business',       mindset: 'Strategy',   color: 'text-emerald-400', border: 'border-emerald-500/20',bg2: 'bg-emerald-500/5', from: 'Strategy, Finance, Growth' },
]

const PAIN_POINTS = [
  {
    quote: "I just have a resume. I do not have a portfolio to showcase.",
    name: 'Ankit',
    context: '3 years as PM · couldn\'t break into general PM roles',
    accent: { bg: 'bg-indigo-500/10', text: 'text-indigo-400', line: 'bg-indigo-500/40' },
  },
  {
    quote: "I used to not see where do I stand. How can I measure myself?",
    name: 'Rishi',
    context: '8 years in BA / PM-adjacent roles',
    accent: { bg: 'bg-teal-500/10', text: 'text-teal-400', line: 'bg-teal-500/40' },
  },
  {
    quote: "That structured guidance which is customized to where do I stand, not the generic one.",
    name: 'Kriti',
    context: '14 years experience · 4.5 as PM',
    accent: { bg: 'bg-amber-500/10', text: 'text-amber-400', line: 'bg-amber-500/40' },
  },
]

const STEPS = [
  {
    num: '01',
    title: 'Understand where you actually stand',
    desc: '10 scenario-based questions mapped across 5 PM dimensions. No jargon required. Takes 8 minutes.',
    color: 'bg-indigo-600',
    glow: 'shadow-[0_0_24px_rgba(79,70,229,0.5)]',
  },
  {
    num: '02',
    title: 'Get your PM Archetype',
    desc: 'One of 6 archetypes based on your background and mindset. Know exactly what kind of PM you\'re built to be — and what gap to close first.',
    color: 'bg-teal-500',
    glow: 'shadow-[0_0_24px_rgba(79,219,200,0.5)]',
  },
  {
    num: '03',
    title: 'Follow a path built for you',
    desc: 'A chapter-by-chapter roadmap targeting your exact skill gaps — not a generic course. Concepts, frameworks, and practice exercises in the order you need them.',
    color: 'bg-[#ffb95f]',
    glow: 'shadow-[0_0_24px_rgba(255,185,95,0.5)]',
  },
]

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen overflow-x-hidden">
      {/* Atmosphere */}
      <div className="fixed -top-40 -right-40 w-[700px] h-[700px] bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 -left-40 w-[500px] h-[500px] bg-teal-500/[0.06] rounded-full blur-[120px] pointer-events-none -z-10" />

      {/* Nav */}
      <nav className="fixed top-0 w-full z-50 bg-[#0b1326]/80 backdrop-blur-xl border-b border-white/5 px-8 h-16 flex items-center justify-between">
        <span className="text-xl font-bold tracking-tighter text-[#dae2fd] font-[family-name:var(--font-space-grotesk)]">
          PM Pathfinder
        </span>
        <div className="flex items-center gap-6">
          <Link href="/auth?next=/dashboard">
            <button className="text-sm text-[#918fa1] hover:text-[#c7c4d8] transition-colors">
              Sign in
            </button>
          </Link>
          <Link href="/quiz">
            <button className="text-sm text-[#c7c4d8] hover:text-[#dae2fd] transition-colors">
              Take the assessment →
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-36 pb-28 px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-[#c3c0ff] text-xs font-mono tracking-widest uppercase">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400" />
              </span>
              Built on 9 user interviews
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-[family-name:var(--font-space-grotesk)] leading-[1.05] tracking-tighter text-[#dae2fd]">
              You&apos;re Closer to PM{' '}
              <br className="hidden sm:block" />
              Than You Think.{' '}
              <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#c3c0ff] to-[#4fdbc8]">
                Find Out What&apos;s Missing.
              </span>
            </h1>

            <p className="text-xl text-[#c7c4d8] font-light max-w-lg leading-relaxed">
              Take a 10-minute assessment. Get your personalised career roadmap built from{' '}
              <span className="text-[#dae2fd] font-medium">your background</span>, not a generic template.
            </p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Link href="/quiz">
                <button className="px-10 py-5 bg-[#ffb95f] hover:bg-amber-400 text-slate-950 font-bold text-lg rounded-full transition-all active:scale-95 shadow-[0_0_32px_rgba(255,185,95,0.3)]">
                  Assess Where You Are
                </button>
              </Link>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-medium text-[#dae2fd]">Free. No credit card required.</span>
                <span className="text-xs text-[#918fa1] font-mono">2,847 assessments completed</span>
              </div>
            </div>
          </motion.div>

          {/* Right — preview card */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="absolute -inset-6 bg-gradient-to-br from-indigo-600/20 to-teal-500/20 rounded-3xl blur-3xl" />
            <div className="relative bg-[#131b2e] border border-white/8 rounded-2xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="font-[family-name:var(--font-space-grotesk)] font-bold text-xl text-[#dae2fd]">
                    Current Trajectory
                  </h3>
                  <p className="text-xs text-[#918fa1] uppercase tracking-widest font-mono mt-1">
                    Navigator Analytics
                  </p>
                </div>
                <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center text-xl">
                  📊
                </div>
              </div>
              <div className="space-y-4">
                {[
                  { label: 'TECHNICAL DEPTH', value: 82, bar: 'bg-[#c3c0ff]', val: 'text-[#c3c0ff]' },
                  { label: 'PRODUCT STRATEGY', value: 64, bar: 'bg-[#4fdbc8]', val: 'text-[#4fdbc8]' },
                  { label: 'USER EMPATHY', value: 91, bar: 'bg-[#ffb95f]', val: 'text-[#ffb95f]' },
                ].map((item) => (
                  <div key={item.label} className="bg-[#171f33] p-4 rounded-xl space-y-2.5">
                    <div className="flex justify-between text-xs font-mono">
                      <span className="text-[#918fa1]">{item.label}</span>
                      <span className={item.val}>{item.value}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-[#222a3d] rounded-full overflow-hidden">
                      <div className={`h-full ${item.bar} rounded-full`} style={{ width: `${item.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs text-[#918fa1] font-mono">ARCHETYPE MATCH</span>
                <span className="text-sm font-bold text-[#dae2fd] font-[family-name:var(--font-space-grotesk)]">
                  The Strategist
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pain Points */}
      <section className="py-24 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-bold font-[family-name:var(--font-space-grotesk)] text-[#dae2fd] tracking-tight">
              The Career Gap is Real
            </h2>
            <p className="text-[#c7c4d8] max-w-2xl mx-auto leading-relaxed">
              From 9 user interviews across engineering, design, and consulting backgrounds — three patterns kept surfacing.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PAIN_POINTS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-8 rounded-2xl bg-[#131b2e] border border-white/5 hover:bg-[#171f33] hover:border-white/10 transition-all duration-500"
              >
                <p className="text-lg font-medium text-[#dae2fd] italic leading-relaxed mb-6">
                  &ldquo;{item.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className={`h-px w-10 ${item.accent.line}`} />
                  <div>
                    <p className={`text-xs font-mono font-semibold uppercase tracking-tighter ${item.accent.text}`}>
                      {item.name}
                    </p>
                    <p className="text-xs text-[#918fa1] mt-0.5">{item.context}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Research Foundation */}
      <section className="py-24 bg-[#060e20]/60 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 space-y-3">
            <p className="text-xs font-mono uppercase tracking-widest text-teal-400">Primary research</p>
            <h2 className="text-4xl font-bold font-[family-name:var(--font-space-grotesk)] text-[#dae2fd] tracking-tight">
              5 structural barriers to PM transition
            </h2>
            <p className="text-[#c7c4d8] max-w-xl mx-auto text-sm leading-relaxed">
              Validated across 9 interviews with professionals transitioning from engineering, consulting, design, and operations.
            </p>
          </div>

          {/* Barriers grid — 3 + 2 centred */}
          <div className="flex flex-col gap-3 mb-14">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {BARRIERS.slice(0, 3).map((b, i) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-[#131b2e] border border-white/5 rounded-2xl px-5 py-5"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-xs font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <p className="text-sm font-semibold text-[#dae2fd]">{b.id}</p>
                  </div>
                  <p className="text-sm text-[#918fa1] leading-relaxed">{b.desc}</p>
                </motion.div>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:w-2/3 sm:mx-auto">
              {BARRIERS.slice(3).map((b, i) => (
                <motion.div
                  key={b.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: (i + 3) * 0.07 }}
                  className="bg-[#131b2e] border border-white/5 rounded-2xl px-5 py-5"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="text-xs font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded-full">
                      {String(i + 4).padStart(2, '0')}
                    </span>
                    <p className="text-sm font-semibold text-[#dae2fd]">{b.id}</p>
                  </div>
                  <p className="text-sm text-[#918fa1] leading-relaxed">{b.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* User quote */}
          <div className="max-w-2xl mx-auto bg-[#131b2e] border border-teal-500/15 rounded-2xl px-8 py-7">
            <p className="text-lg text-[#dae2fd] leading-relaxed italic mb-5">
              &ldquo;A tool which kind of tailors the entire program according to me only. It sort of analyses me and then presents its solution.&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-teal-500/20" />
              <span className="text-xs font-mono text-[#918fa1] uppercase tracking-widest">
                Gaurav · 7 years in product · research participant
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-[#060e20]/60">
        <div className="max-w-5xl mx-auto px-8">
          <div className="text-center mb-20 space-y-3">
            <p className="text-xs font-mono uppercase tracking-widest text-indigo-400">The journey</p>
            <h2 className="text-4xl font-bold font-[family-name:var(--font-space-grotesk)] text-[#dae2fd] tracking-tight">
              From career switcher to hired PM
            </h2>
            <p className="text-[#c7c4d8] max-w-lg mx-auto text-sm leading-relaxed">
              Three steps. No generic advice. A path that starts from where you are — not where everyone else is.
            </p>
          </div>
          <div className="relative">
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-500 via-teal-500 to-transparent -translate-x-1/2 hidden md:block" />
            <div className="space-y-20">
              {STEPS.map((step, i) => (
                <div
                  key={i}
                  className={`relative flex flex-col ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-0`}
                >
                  <div className={`md:w-1/2 ${i % 2 === 0 ? 'md:pr-24 md:text-right' : 'md:pl-24'}`}>
                    <h3 className="text-2xl font-bold font-[family-name:var(--font-space-grotesk)] text-[#dae2fd] mb-3">
                      {step.title}
                    </h3>
                    <p className="text-[#c7c4d8] leading-relaxed">{step.desc}</p>
                  </div>
                  <div className={`z-10 w-16 h-16 rounded-full ${step.color} flex items-center justify-center font-bold text-slate-950 text-base font-mono ${step.glow}`}>
                    {step.num}
                  </div>
                  <div className={`md:w-1/2 ${i % 2 === 0 ? 'md:pl-24' : 'md:pr-24 md:text-right'} hidden md:block`}>
                    <span className="text-8xl font-bold font-[family-name:var(--font-space-grotesk)] text-[#dae2fd]/5 select-none">
                      {step.num}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-20 text-center">
            <Link href="/quiz">
              <button className="px-10 py-5 bg-[#ffb95f] hover:bg-amber-400 text-slate-950 font-bold text-lg rounded-full transition-all active:scale-95 shadow-[0_0_32px_rgba(255,185,95,0.3)]">
                Start the Assessment
                <ArrowRight className="inline ml-2 w-5 h-5" />
              </button>
            </Link>

            {/* Destination */}
            <div className="mt-12 max-w-xl mx-auto bg-gradient-to-br from-teal-500/10 to-indigo-500/10 border border-teal-500/20 rounded-2xl px-8 py-6 text-left">
              <p className="text-xs font-mono uppercase tracking-widest text-teal-400 mb-3">The destination</p>
              <p className="text-base font-semibold text-[#dae2fd] leading-relaxed mb-2">
                You walk into your PM interview knowing your archetype, your strengths, and exactly how you closed the gap.
              </p>
              <p className="text-sm text-[#918fa1] leading-relaxed">
                Not just prepared — positioned. You can speak to your background as an asset, not a liability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Archetype Preview */}
      <section className="py-24 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14 space-y-3">
            <p className="text-xs font-mono uppercase tracking-widest text-indigo-400">The framework</p>
            <h2 className="text-4xl font-bold font-[family-name:var(--font-space-grotesk)] text-[#dae2fd] tracking-tight">
              6 PM archetypes. Which one are you?
            </h2>
            <p className="text-[#c7c4d8] max-w-lg mx-auto text-sm leading-relaxed">
              Mapped across two axes: your professional background and your natural mindset — execution-first or strategy-first.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
            {ARCHETYPES.map((a, i) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`p-5 rounded-2xl border ${a.border} ${a.bg2}`}
              >
                <h3 className={`text-base font-bold font-[family-name:var(--font-space-grotesk)] ${a.color} mb-2`}>
                  {a.name}
                </h3>
                <div className="flex flex-wrap gap-1.5 mb-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-[#918fa1]">
                    {a.bg}
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-[#918fa1]">
                    {a.mindset}
                  </span>
                </div>
                <p className="text-xs text-[#918fa1]">Comes from: {a.from}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/quiz">
              <button className="px-8 py-4 border border-indigo-500/30 hover:bg-indigo-500/10 text-indigo-300 text-sm font-semibold rounded-xl transition-all">
                Find out what's holding you back →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <p className="text-xs font-mono uppercase tracking-widest text-indigo-400">Everything included</p>
            <h2 className="text-4xl font-bold font-[family-name:var(--font-space-grotesk)] text-[#dae2fd] tracking-tight">
              Built end-to-end for PM transition
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              {
                icon: '🧭',
                title: 'PM Archetype Assessment',
                desc: '10 scenario-based questions mapping your background × mindset to one of 6 archetypes. No jargon. No generic advice.',
                accent: 'border-indigo-500/20 bg-indigo-500/5',
                badge: 'Free',
                badgeStyle: 'bg-indigo-500/10 text-indigo-400',
              },
              {
                icon: '📊',
                title: 'Skill Gap Report',
                desc: '5-dimension radar chart showing exactly where you stand on thinking, execution, technical fluency, user research, and communication.',
                accent: 'border-teal-500/20 bg-teal-500/5',
                badge: 'Free',
                badgeStyle: 'bg-teal-500/10 text-teal-400',
              },
              {
                icon: '🗺️',
                title: 'Personalised Learning Path',
                desc: 'Chapter-by-chapter roadmap ordered by your gaps. Watch or read. Mark done. Track progress. Not a one-size-fits-all course.',
                accent: 'border-amber-500/20 bg-amber-500/5',
                badge: 'Pro',
                badgeStyle: 'bg-amber-500/10 text-amber-400',
              },
              {
                icon: '🎯',
                title: 'Interview Readiness Score',
                desc: 'A 0–100 composite score benchmarked against APM, PM, and Senior PM roles — with a breakdown of exactly what to fix.',
                accent: 'border-rose-500/20 bg-rose-500/5',
                badge: 'Pro',
                badgeStyle: 'bg-rose-500/10 text-rose-400',
              },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`p-6 rounded-2xl border ${f.accent}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-2xl">{f.icon}</span>
                  <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full ${f.badgeStyle}`}>
                    {f.badge}
                  </span>
                </div>
                <h3 className="text-base font-semibold text-[#dae2fd] mb-2">{f.title}</h3>
                <p className="text-sm text-[#918fa1] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-[#060e20]/60 px-8" id="pricing">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <p className="text-xs font-mono uppercase tracking-widest text-indigo-400">Simple pricing</p>
            <h2 className="text-4xl font-bold font-[family-name:var(--font-space-grotesk)] text-[#dae2fd] tracking-tight">
              Start free. Go Pro when you&apos;re ready.
            </h2>
            <p className="text-[#918fa1] max-w-md mx-auto">
              Assessment and report are always free. Unlock the full path when you&apos;re serious about landing the role.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
            {/* Free */}
            <div className="bg-[#131b2e] border border-white/8 rounded-2xl p-8">
              <p className="text-xs font-mono uppercase tracking-widest text-[#918fa1] mb-3">Free</p>
              <p className="text-4xl font-bold text-[#dae2fd] mb-1">₹0</p>
              <p className="text-xs text-[#918fa1] mb-8">Forever free</p>
              <ul className="flex flex-col gap-3 mb-8">
                {['PM Archetype Assessment', '5-dimension skill report', 'Chapter 1 of Learning Path', 'Basic Deep Dive (1 dimension)'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[#c7c4d8]">
                    <span className="text-teal-400 flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/quiz">
                <button className="w-full py-3 rounded-xl border border-white/10 text-sm text-[#c7c4d8] hover:bg-white/5 transition-all">
                  Get started free
                </button>
              </Link>
            </div>

            {/* Pro */}
            <div className="relative bg-[#131b2e] border border-indigo-500/30 rounded-2xl p-8 shadow-[0_0_40px_rgba(99,102,241,0.1)]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span className="px-3 py-1 text-[10px] font-mono uppercase tracking-widest bg-indigo-600 text-white rounded-full">
                  Most popular
                </span>
              </div>
              <p className="text-xs font-mono uppercase tracking-widest text-indigo-400 mb-3">Pro</p>
              <div className="mb-1">
                <span className="text-4xl font-bold text-[#dae2fd]">₹799</span>
                <span className="text-sm text-[#918fa1]"> / month</span>
              </div>
              <p className="text-xs text-[#918fa1] mb-1">or ₹5,999/year <span className="text-teal-400">· save 37%</span></p>
              <p className="text-xs text-indigo-300 mb-8">₹16,999 lifetime access</p>
              <ul className="flex flex-col gap-3 mb-8">
                {[
                  'Everything in Free',
                  'Full Learning Path (all chapters)',
                  'Deep Dive on all 5 dimensions',
                  'Interview Readiness Score + breakdown',
                  'Public PM Portfolio page',
                  'Progress tracking across re-evaluations',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-[#c7c4d8]">
                    <span className="text-indigo-400 flex-shrink-0">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/quiz">
                <button className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all">
                  Start with Pro
                  <ArrowRight className="inline ml-2 w-4 h-4" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="mt-auto border-t border-white/5 px-8 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-[#918fa1]">
          <span className="font-[family-name:var(--font-space-grotesk)] font-semibold text-[#dae2fd]">PM Pathfinder</span>
          <span>Built on primary research with 9 professionals navigating the PM transition.</span>
          <span className="font-mono text-xs">Rethink AI MPM Cohort 7</span>
        </div>
      </footer>
    </main>
  )
}
