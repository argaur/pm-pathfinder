'use client'

import { useState } from 'react'
import { CheckCircle, Circle, Play } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Archetype } from '@/lib/data/archetypes'

type TimelineOption = 1 | 3 | 6

interface Week {
  week: number
  title: string
  videoId: string
  dimension: string
}

interface Props {
  archetype: Archetype
  getRoadmapContent: (archetype: string, months: number) => Week[]
  progressMap: Record<string, string>
  userId: string
}

export default function VideoRoadmapClient({ archetype, getRoadmapContent, progressMap, userId }: Props) {
  const [timeline, setTimeline] = useState<TimelineOption>(3)
  const [progress, setProgress] = useState<Record<string, string>>(progressMap)
  const [activeVideo, setActiveVideo] = useState<string | null>(null)

  const weeks = getRoadmapContent(archetype.id, timeline)
  const completedCount = weeks.filter((w) => progress[`${w.week}-${timeline}`] === 'complete').length

  const toggleDone = async (week: number) => {
    const key = `${week}-${timeline}`
    const current = progress[key] ?? 'pending'
    const next = current === 'complete' ? 'pending' : 'complete'

    setProgress((prev) => ({ ...prev, [key]: next }))

    const supabase = createClient()
    await supabase.from('roadmap_progress').upsert({
      user_id: userId,
      archetype: archetype.id,
      week_number: week,
      timeline_months: timeline,
      status: next,
      marked_done_at: next === 'complete' ? new Date().toISOString() : null,
    })
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-indigo-400 font-medium mb-1">Video Roadmap</p>
        <h1 className="text-2xl font-bold text-[#dae2fd] mb-1">{archetype.name} Path</h1>
        <p className="text-sm text-[#c7c4d8]">
          {completedCount} of {weeks.length} weeks completed
        </p>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-[#222a3d] rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-gradient-to-r from-indigo-500 to-teal-500 rounded-full transition-all duration-500"
          style={{ width: `${(completedCount / weeks.length) * 100}%` }}
        />
      </div>

      {/* Timeline toggle */}
      <div className="flex gap-2 mb-8">
        {([1, 3, 6] as TimelineOption[]).map((m) => (
          <button
            key={m}
            onClick={() => setTimeline(m)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              timeline === m
                ? 'bg-[#4f46e5] text-[#dae2fd]'
                : 'bg-[#171f33] text-[#c7c4d8] hover:bg-[#222a3d]'
            }`}
          >
            {m} month{m > 1 ? 's' : ''}
          </button>
        ))}
      </div>

      {/* Week list */}
      <div className="flex flex-col gap-3">
        {weeks.map((week) => {
          const key = `${week.week}-${timeline}`
          const isDone = progress[key] === 'complete'
          const isActive = activeVideo === week.videoId + week.week

          return (
            <div
              key={week.week}
              className={`rounded-xl overflow-hidden transition-all ${
                isDone ? 'bg-[#0d2b1a]' : 'bg-[#171f33]'
              }`}
            >
              <div className="flex items-center gap-4 p-4">
                <button
                  onClick={() => toggleDone(week.week)}
                  className="flex-shrink-0"
                >
                  {isDone ? (
                    <CheckCircle className="w-5 h-5 text-emerald-500" />
                  ) : (
                    <Circle className="w-5 h-5 text-[#918fa1] hover:text-[#c7c4d8] transition-colors" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-xs font-mono text-[#918fa1]">Week {week.week}</span>
                    <span className="text-xs text-[#918fa1]">·</span>
                    <span className="text-xs text-indigo-500">{week.dimension}</span>
                  </div>
                  <p className={`text-sm font-medium ${isDone ? 'text-[#918fa1] line-through' : 'text-[#dae2fd]'}`}>
                    {week.title}
                  </p>
                </div>

                <button
                  onClick={() => setActiveVideo(isActive ? null : week.videoId + week.week)}
                  className="flex-shrink-0 flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                  {isActive ? 'Close' : 'Watch'}
                </button>
              </div>

              {/* Inline video embed */}
              {isActive && (
                <div className="px-4 pb-4">
                  <div className="aspect-video bg-[#222a3d] rounded-lg overflow-hidden">
                    <iframe
                      src={`https://www.youtube.com/embed/${week.videoId}`}
                      title={week.title}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
