import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DIMENSION_LABELS } from '@/lib/scoring/engine'
import { Dimension } from '@/lib/data/questions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'

export default async function ReEvaluatePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const { data: assessments } = await supabase
    .from('assessments')
    .select('*')
    .eq('user_id', user.id)
    .order('taken_at', { ascending: false })
    .limit(5)

  if (!assessments || assessments.length === 0) redirect('/quiz')

  const latest = assessments[0]
  const previous = assessments[1] ?? null

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-indigo-400 font-medium mb-1">Re-evaluation</p>
        <h1 className="text-2xl font-bold text-white mb-2">Track your progress</h1>
        <p className="text-sm text-slate-400">
          Retake the diagnostic to see how your scores have shifted since you started.
        </p>
      </div>

      {/* Score history */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 mb-6">
        <p className="text-xs uppercase tracking-widest text-slate-500 font-medium mb-4">Score History</p>

        {assessments.map((a, i) => (
          <div key={a.id} className="mb-4 last:mb-0">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-slate-500">
                {i === 0 ? 'Latest' : `Assessment ${assessments.length - i}`}
                {' · '}
                {new Date(a.taken_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
              <span className="text-xs text-indigo-400 capitalize">{a.archetype}</span>
            </div>

            <div className="flex flex-col gap-1.5">
              {(Object.entries(a.dimension_scores as Record<Dimension, number>) as [Dimension, number][]).map(([dim, score]) => {
                const prevScore = previous?.dimension_scores?.[dim] ?? null
                const delta = prevScore !== null && i === 0 ? score - prevScore : null

                return (
                  <div key={dim} className="flex items-center gap-3">
                    <span className="text-xs text-slate-600 w-36 flex-shrink-0">{DIMENSION_LABELS[dim]}</span>
                    <div className="flex-1 h-1 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-teal-500"
                        style={{ width: `${score * 10}%` }}
                      />
                    </div>
                    <span className="text-xs font-mono text-slate-500 w-8 text-right">{score.toFixed(1)}</span>
                    {delta !== null && (
                      <span className={`text-xs font-mono w-10 text-right ${delta > 0 ? 'text-emerald-400' : delta < 0 ? 'text-rose-400' : 'text-slate-600'}`}>
                        {delta > 0 ? `+${delta.toFixed(1)}` : delta.toFixed(1)}
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-indigo-950/30 border border-indigo-900/60 rounded-2xl p-6 text-center">
        <p className="text-sm font-medium text-white mb-1">Ready to measure your growth?</p>
        <p className="text-xs text-slate-400 mb-5">
          Retake the diagnostic to update your scores. Best done after completing a roadmap milestone.
        </p>
        <Link href="/quiz/diagnostic">
          <Button className="bg-indigo-600 hover:bg-indigo-500 text-white h-11 px-8 rounded-xl">
            Retake the diagnostic
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
