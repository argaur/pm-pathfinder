import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock } from 'lucide-react'
import { slugToTopic } from '@/lib/data/topics'
import { DIMENSION_LABELS } from '@/lib/scoring/engine'

export default async function TopicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const topic = slugToTopic(slug)
  if (!topic) notFound()

  return (
    <div className="max-w-2xl mx-auto">
      {/* Back */}
      <Link
        href="/deep-dive"
        className="inline-flex items-center gap-1.5 text-xs text-[#918fa1] hover:text-[#c7c4d8] transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to Deep Dive
      </Link>

      {/* Header */}
      <div className="mb-8">
        <span className="inline-block text-[10px] uppercase tracking-widest text-indigo-400 font-mono mb-2">
          {DIMENSION_LABELS[topic.dimension]}
        </span>
        <h1 className="text-2xl font-bold text-[#dae2fd] font-[family-name:var(--font-space-grotesk)] mb-1">
          {topic.title}
        </h1>
        <p className="text-sm text-[#918fa1]">{topic.tagline}</p>
      </div>

      {/* Coming Soon banner */}
      <div className="flex items-center gap-2.5 bg-teal-500/5 border border-teal-500/15 rounded-xl px-4 py-3 mb-8">
        <Clock className="w-4 h-4 text-teal-400 flex-shrink-0" />
        <div>
          <p className="text-xs font-medium text-teal-300">Full content coming soon</p>
          <p className="text-[11px] text-[#918fa1] mt-0.5">
            Frameworks, practice exercises, and curated resources are being prepared for this topic.
          </p>
        </div>
      </div>

      {/* Concept — visible */}
      <div className="bg-[#171f33] border border-white/[0.06] rounded-2xl p-6 mb-4">
        <p className="text-[10px] uppercase tracking-widest text-[#918fa1] font-mono mb-3">The Concept</p>
        <p className="text-sm text-[#c7c4d8] leading-relaxed">{topic.concept}</p>
      </div>

      {/* Framework — faded teaser */}
      <div className="relative mb-4">
        <div className="bg-[#171f33] border border-white/[0.06] rounded-2xl p-6 opacity-25 pointer-events-none select-none blur-[1.5px]">
          <p className="text-[10px] uppercase tracking-widest text-[#918fa1] font-mono mb-3">Framework</p>
          <ul className="flex flex-col gap-2.5">
            {topic.framework.map((point, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-[#c7c4d8]">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0 mt-1.5" />
                {point}
              </li>
            ))}
          </ul>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[11px] font-mono text-teal-400 bg-[#0b1326]/85 px-3 py-1.5 rounded-full border border-teal-500/20">
            Coming soon
          </span>
        </div>
      </div>

      {/* Practice Exercise — faded teaser */}
      <div className="relative mb-6">
        <div className="bg-[#171f33] border border-white/[0.06] rounded-2xl p-6 opacity-25 pointer-events-none select-none blur-[1.5px]">
          <p className="text-[10px] uppercase tracking-widest text-[#918fa1] font-mono mb-3">Practice Exercise</p>
          <p className="text-sm text-[#c7c4d8] leading-relaxed">{topic.exercise}</p>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-[11px] font-mono text-teal-400 bg-[#0b1326]/85 px-3 py-1.5 rounded-full border border-teal-500/20">
            Coming soon
          </span>
        </div>
      </div>

      {/* Embedded Video */}
      <div className="mb-6">
        <p className="text-[10px] uppercase tracking-widest text-[#918fa1] font-mono mb-3">Watch</p>
        <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-[#0f1729] aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${topic.videoId}?rel=0&modestbranding=1`}
            title={`${topic.title} — video`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      </div>

      {/* Back CTA */}
      <Link
        href="/deep-dive"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl border border-white/[0.06] bg-[#171f33] text-sm text-[#c7c4d8] hover:border-indigo-500/30 hover:text-[#dae2fd] transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Deep Dive
      </Link>
    </div>
  )
}
