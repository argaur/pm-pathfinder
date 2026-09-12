import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getCachedUser } from '@/lib/supabase/cached'
import { toReportViewModel } from '@/lib/report/transform'
import ReportBody from '@/components/report/ReportBody'

export default async function ReportPage() {
  const user = await getCachedUser()
  if (!user) redirect('/auth')

  const supabase = await createClient()

  const { data: assessment } = await supabase
    .from('assessments')
    .select('*')
    .eq('user_id', user.id)
    .order('taken_at', { ascending: false })
    .limit(1)
    .single()

  if (!assessment) redirect('/quiz')

  const { archetype, dimensionScores, tiers, radarData, dimensions } = toReportViewModel(assessment)

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <p className="text-xs uppercase tracking-widest text-indigo-400 font-medium mb-1">
          Diagnostic Report
        </p>
        <h1 className="text-2xl font-bold text-foreground font-[family-name:var(--font-space-grotesk)]">
          Your Complete Profile
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
  )
}
