'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight, Users, Zap, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/button'

const PAIN_POINTS = [
  {
    quote: "I've been preparing for months but still don't feel ready to apply.",
    role: 'Senior Engineer → Aspiring PM',
  },
  {
    quote: "Every resource I find is generic. Nothing speaks to my background.",
    role: 'UX Designer → Aspiring PM',
  },
  {
    quote: "I don't know if I'm qualified. There's no way to measure where I stand.",
    role: 'Business Analyst → Aspiring PM',
  },
]

const HOW_IT_WORKS = [
  {
    step: '01',
    icon: Zap,
    title: 'Take the Assessment',
    description: '10 scenario-based questions. No PM jargon required. Takes 8 minutes.',
  },
  {
    step: '02',
    icon: Users,
    title: 'Get Your PM Archetype',
    description: 'One of 6 archetypes based on your background and mindset. Built on primary research.',
  },
  {
    step: '03',
    icon: MapPin,
    title: 'Follow Your Path',
    description: 'A roadmap targeting your specific skill gaps. Video + text resources, week by week.',
  },
]

export default function LandingPage() {
  return (
    <main className="flex flex-col min-h-screen">
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center px-6 pt-24 pb-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-slate-950 to-teal-950 -z-10" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(79,70,229,0.15),transparent_70%)] -z-10" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <div className="inline-block text-xs font-medium tracking-widest uppercase text-indigo-400 bg-indigo-950/60 border border-indigo-800/50 px-3 py-1 rounded-full mb-6">
            Built for career switchers
          </div>

          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight mb-4">
            Discover Your{' '}
            <span className="bg-gradient-to-r from-indigo-400 to-teal-400 bg-clip-text text-transparent">
              PM Archetype
            </span>
          </h1>

          <p className="text-lg text-slate-400 mb-8 leading-relaxed">
            Take a 10-minute assessment. Get your personalised career roadmap — built from{' '}
            <span className="text-slate-300">your background</span>, not a generic template.
          </p>

          <Link href="/quiz">
            <Button
              size="lg"
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-base h-14 px-8 rounded-xl shadow-lg shadow-amber-900/30 transition-all"
            >
              Assess Where You Are
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>

          <p className="mt-4 text-sm text-slate-500">
            Free · No credit card required · 2,847 assessments completed
          </p>
        </motion.div>
      </section>

      {/* ── Pain Point Mirror ───────────────────────────────── */}
      <section className="px-6 py-16 max-w-5xl mx-auto w-full">
        <p className="text-center text-xs uppercase tracking-widest text-slate-500 mb-10">
          We hear this all the time
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PAIN_POINTS.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 backdrop-blur-sm"
            >
              <p className="text-slate-300 text-sm leading-relaxed mb-4 italic">
                &ldquo;{item.quote}&rdquo;
              </p>
              <p className="text-xs text-slate-500">{item.role}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────── */}
      <section className="px-6 py-16 max-w-3xl mx-auto w-full">
        <p className="text-center text-xs uppercase tracking-widest text-slate-500 mb-10">
          How it works
        </p>
        <div className="flex flex-col gap-6">
          {HOW_IT_WORKS.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-5"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-950/60 border border-indigo-800/50 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <div className="text-xs font-mono text-indigo-500 mb-1">{item.step}</div>
                  <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-400">{item.description}</p>
                </div>
              </motion.div>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <Link href="/quiz">
            <Button
              size="lg"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold h-12 px-8 rounded-xl"
            >
              Start the Assessment
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="mt-auto border-t border-slate-900 px-6 py-8 text-center text-sm text-slate-600">
        Built for career switchers, by career switchers.
      </footer>
    </main>
  )
}
