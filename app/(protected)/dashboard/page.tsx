import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ARCHETYPES } from '@/lib/data/archetypes'
import { DIMENSION_LABELS, TIER_CONFIG } from '@/lib/scoring/engine'
import { Dimension } from '@/lib/data/questions'
import { ArrowRight, FileText, PlayCircle, BookOpen, Microscope, RefreshCw } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const [{ data: profile }, { data: latestAssessment }] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', user.id).single(),
    supabase
      .from('assessments')
      .select('*')
      .eq('user_id', user.id)
      .order('taken_at', { ascending: false })
      .limit(1)
      .single(),
  ])

  // No assessment yet — redirect to quiz
  if (!latestAssessment) {
    redirect('/quiz')
  }

  const archetype = ARCHETYPES[latestAssessment.archetype as keyof typeof ARCHETYPES]
  const dimensionScores = latestAssessment.dimension_scores as Record<Dimension, number>
  const tiers = latestAssessment.tiers as Record<Dimension, 'growth' | 'neutral' | 'strength'>

  // Roadmap completion
  const { count: completedVideos } = await supabase
    .from('roadmap_progress')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('status', 'complete')

  const QUICK_LINKS = [
    { href: '/report', icon: FileText, label: 'My Report', desc: 'Full archetype + skill gap map' },
    { href: '/roadmap/video', icon: PlayCircle, label: 'Video Roadmap', desc: 'Week-by-week learning path' },
    { href: '/roadmap/text', icon: BookOpen, label: 'Text Roadmap', desc: 'Concepts, frameworks, exercises' },
    { href: '/deep-dive', icon: Microscope, label: 'Deep Dive', desc: 'Sub-category breakdown' },
    { href: '/re-evaluate', icon: RefreshCw, label: 'Re-evaluate', desc: 'Retake to measure progress' },
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-indigo-400 font-medium mb-1">
          Welcome back
        </p>
        <h1 className="text-2xl font-bold text-[#dae2fd] font-[family-name:var(--font-space-grotesk)]">
          {profile?.display_name?.split(' ')[0] ?? 'Hey'}&apos;s Dashboard
        </h1>
      </div>

      {/* Archetype + score summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="md:col-span-2 bg-[#171f33] rounded-2xl p-6">
          <p className="text-xs text-[#918fa1] uppercase tracking-widest mb-2">Your Archetype</p>
          <h2 className="text-xl font-bold text-[#dae2fd] mb-1">{archetype.name}</h2>
          <p className="text-sm text-[#c7c4d8] mb-4">{archetype.tagline}</p>
          <div className="flex flex-col gap-2">
            {(Object.entries(dimensionScores) as [Dimension, number][]).map(([dim, score]) => {
              const tier = tiers?.[dim] ?? 'neutral'
              const config = TIER_CONFIG[tier]
              return (
                <div key={dim} className="flex items-center gap-3">
                  <span className="text-xs text-[#918fa1] w-36 flex-shrink-0">{DIMENSION_LABELS[dim]}</span>
                  <div className="flex-1 h-1.5 bg-[#222a3d] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-teal-500"
                      style={{ width: `${score * 10}%` }}
                    />
                  </div>
                  <span className={`text-xs font-mono w-10 text-right ${config.color}`}>
                    {score.toFixed(1)}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-[#171f33] rounded-2xl p-5 flex-1">
            <p className="text-xs text-[#918fa1] uppercase tracking-widest mb-2">Videos Done</p>
            <p className="text-3xl font-bold font-mono text-indigo-400">{completedVideos ?? 0}</p>
            <p className="text-xs text-[#918fa1] mt-1">roadmap items completed</p>
          </div>
          <div className="bg-[#171f33] rounded-2xl p-5 flex-1">
            <p className="text-xs text-[#918fa1] uppercase tracking-widest mb-2">Assessments</p>
            <p className="text-3xl font-bold font-mono text-teal-400">
              {latestAssessment.version}
            </p>
            <p className="text-xs text-[#918fa1] mt-1">taken so far</p>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {QUICK_LINKS.map(({ href, icon: Icon, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="bg-[#171f33] rounded-xl p-4 hover:bg-[#222a3d] transition-all group"
          >
            <div className="flex items-center justify-between mb-2">
              <Icon className="w-4 h-4 text-indigo-400" />
              <ArrowRight className="w-3.5 h-3.5 text-[#918fa1] group-hover:text-[#c7c4d8] transition-colors" />
            </div>
            <p className="text-sm font-medium text-[#dae2fd] mb-0.5">{label}</p>
            <p className="text-xs text-[#918fa1]">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
