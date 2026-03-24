'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  User, Briefcase, TrendingUp, FileText, Upload,
  ArrowRight, Plus, Trash2, Link as LinkIcon, Copy, Check, Globe, Lock,
} from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Dimension } from '@/lib/data/questions'
import BlurGate from '@/components/ui/BlurGate'

type Tab = 'overview' | 'portfolio' | 'evaluations'

interface ProfileProps {
  userId: string
  profile: {
    displayName: string
    email: string
    avatarUrl: string | null
    currentRole: string
    industry: string
    yearsExperience: string
  }
  archetype: {
    name: string
    tagline: string
    background: string
    mindset: string
    traits: string[]
    strengths: string[]
  }
  evaluationHistory: {
    id: string
    version: number
    archetype: string
    taken_at: string
    scores: Record<Dimension, number>
    deltas: Record<Dimension, number | null>
  }[]
  dimensionLabels: Record<Dimension, string>
  isPro: boolean
}

interface CaseStudy {
  id: string
  title: string
  problem: string
  approach: string
  outcome: string
}

export default function ProfileClient({
  userId,
  profile,
  archetype,
  evaluationHistory,
  dimensionLabels,
  isPro,
}: ProfileProps) {
  const [activeTab, setActiveTab] = useState<Tab>('overview')
  const [resumeFile, setResumeFile] = useState<string | null>(null)
  const [pmStory, setPmStory] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState(false)
  const [portfolioLoaded, setPortfolioLoaded] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const publicUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://pm-pathfinder.vercel.app'}/u/${userId}`

  // Load portfolio from API on mount
  useEffect(() => {
    fetch('/api/portfolio')
      .then((r) => r.json())
      .then(({ portfolio, caseStudies: cs }) => {
        if (portfolio) {
          setPmStory(portfolio.pm_story ?? '')
          setIsPublic(portfolio.is_public ?? false)
        }
        if (cs?.length) {
          setCaseStudies(cs.map((c: CaseStudy & { id: string }) => ({
            id: c.id,
            title: c.title ?? '',
            problem: c.problem ?? '',
            approach: c.approach ?? '',
            outcome: c.outcome ?? '',
          })))
        }
        setPortfolioLoaded(true)
      })
      .catch(() => setPortfolioLoaded(true))

    // Resume from localStorage (file stays local — no cloud upload yet)
    const resume = localStorage.getItem('pm_resume_name')
    if (resume) setResumeFile(resume)
  }, [])

  const savePortfolio = useCallback(async () => {
    setSaving(true)
    try {
      await fetch('/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pmStory, isPublic, caseStudies }),
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      // silent
    }
    setSaving(false)
  }, [pmStory, isPublic, caseStudies])

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    localStorage.setItem('pm_resume_name', file.name)
    setResumeFile(file.name)
  }

  const addCaseStudy = () => {
    if (caseStudies.length >= 3) return
    setCaseStudies((p) => [...p, { id: Date.now().toString(), title: '', problem: '', approach: '', outcome: '' }])
  }

  const updateCaseStudy = (id: string, field: keyof CaseStudy, value: string) => {
    setCaseStudies((p) => p.map((c) => c.id === id ? { ...c, [field]: value } : c))
  }

  const deleteCaseStudy = (id: string) => {
    setCaseStudies((p) => p.filter((c) => c.id !== id))
  }

  const copyLink = () => {
    navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const dimensions = Object.keys(evaluationHistory[0]?.scores ?? {}) as Dimension[]

  const TABS: { id: Tab; label: string; icon: typeof User }[] = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'evaluations', label: 'Evaluations', icon: TrendingUp },
  ]

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <p className="text-xs uppercase tracking-widest text-indigo-400 font-medium mb-1">Profile</p>
        <h1 className="text-2xl font-bold text-[#dae2fd] font-[family-name:var(--font-space-grotesk)]">
          {profile.displayName}
        </h1>
      </div>

      {/* Avatar + archetype row */}
      <div className="bg-[#171f33] border border-white/[0.06] rounded-2xl p-6 mb-6 flex items-center gap-5">
        {profile.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.avatarUrl} alt={profile.displayName}
            className="w-16 h-16 rounded-full ring-2 ring-indigo-500/30 flex-shrink-0" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-indigo-500/15 ring-2 ring-indigo-500/30 flex items-center justify-center text-2xl font-bold text-[#c3c0ff] flex-shrink-0">
            {profile.displayName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-base font-semibold text-[#dae2fd]">{profile.displayName}</p>
          <p className="text-sm text-[#918fa1]">{profile.email}</p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className="text-xs px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300">
              {archetype.name}
            </span>
            <span className="text-xs font-mono text-[#918fa1] bg-[#222a3d] px-2.5 py-1 rounded-lg capitalize">
              {archetype.background.replace('_', '-')} × {archetype.mindset}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-[#131b2e] rounded-xl p-1 border border-white/[0.06]">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm transition-all ${
              activeTab === id ? 'bg-[#1e2d45] text-[#dae2fd] font-medium' : 'text-[#918fa1] hover:text-[#c7c4d8]'
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}
        >
          {/* ── Overview ── */}
          {activeTab === 'overview' && (
            <div className="flex flex-col gap-4">
              <div className="bg-[#171f33] border border-white/[0.06] rounded-2xl p-6">
                <p className="text-[10px] uppercase tracking-widest text-[#918fa1] mb-4">Profile Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Background', value: profile.currentRole.replace(/_/g, ' ') || '—' },
                    { label: 'Industry', value: profile.industry || '—' },
                    { label: 'Experience', value: profile.yearsExperience ? `${profile.yearsExperience} years` : '—' },
                    { label: 'Member since', value: evaluationHistory.length > 0
                      ? new Date(evaluationHistory[evaluationHistory.length - 1].taken_at)
                          .toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }) : '—' },
                  ].map(({ label, value }) => (
                    <div key={label}>
                      <p className="text-[10px] text-[#918fa1] uppercase tracking-widest mb-1">{label}</p>
                      <p className="text-sm text-[#dae2fd] capitalize">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#171f33] border border-white/[0.06] rounded-2xl p-6">
                <p className="text-[10px] uppercase tracking-widest text-[#918fa1] mb-3">
                  PM Identity — {archetype.name}
                </p>
                <p className="text-sm text-[#c7c4d8] mb-4">{archetype.tagline}</p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {archetype.traits.map((t) => (
                    <span key={t} className="text-xs px-3 py-1.5 rounded-full bg-[#222a3d] border border-white/10 text-[#c3c0ff]">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-emerald-500 uppercase tracking-widest mb-2">Your Strengths</p>
                <ul className="flex flex-col gap-1.5">
                  {archetype.strengths.map((s) => (
                    <li key={s} className="text-sm text-[#dae2fd] flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">✓</span>{s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Resume */}
              <div className="bg-[#171f33] border border-white/[0.06] rounded-2xl p-6">
                <p className="text-[10px] uppercase tracking-widest text-[#918fa1] mb-4">Resume</p>
                {resumeFile ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                        <FileText className="w-4 h-4 text-indigo-400" />
                      </div>
                      <div>
                        <p className="text-sm text-[#dae2fd]">{resumeFile}</p>
                        <p className="text-[11px] text-[#918fa1]">Uploaded</p>
                      </div>
                    </div>
                    <button onClick={() => fileRef.current?.click()}
                      className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                      Replace
                    </button>
                  </div>
                ) : (
                  <button onClick={() => fileRef.current?.click()}
                    className="w-full border border-dashed border-white/20 hover:border-indigo-500/40 rounded-xl p-5 flex flex-col items-center gap-2 transition-all group">
                    <Upload className="w-5 h-5 text-[#918fa1] group-hover:text-indigo-400 transition-colors" />
                    <p className="text-sm text-[#918fa1] group-hover:text-[#c7c4d8] transition-colors">
                      Upload your resume
                    </p>
                    <p className="text-[11px] text-[#918fa1]">PDF, DOCX — max 5MB</p>
                  </button>
                )}
                <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={handleResumeUpload} />
              </div>

              {/* Re-evaluate CTA */}
              <div className="bg-[#222a3d] border border-white/10 rounded-2xl p-6 flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-[#dae2fd] mb-1">Ready to measure your growth?</p>
                  <p className="text-xs text-[#918fa1]">Retake the diagnostic after completing a Learning Path milestone.</p>
                </div>
                <Link href="/quiz/diagnostic">
                  <Button className="bg-[#4fdbc8] hover:bg-teal-400 text-slate-950 font-semibold h-10 px-6 rounded-xl whitespace-nowrap">
                    Re-evaluate <ArrowRight className="ml-2 w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          )}

          {/* ── Portfolio ── */}
          {activeTab === 'portfolio' && (
            <div className="flex flex-col gap-4">
              {/* Public toggle + shareable link */}
              <BlurGate locked={!isPro} label="Shareable portfolio link — Pro feature">
                <div className="bg-[#171f33] border border-white/[0.06] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {isPublic
                        ? <Globe className="w-4 h-4 text-teal-400" />
                        : <Lock className="w-4 h-4 text-[#918fa1]" />}
                      <span className="text-sm font-medium text-[#dae2fd]">
                        {isPublic ? 'Portfolio is public' : 'Portfolio is private'}
                      </span>
                    </div>
                    <button
                      onClick={() => setIsPublic((p) => !p)}
                      className={`w-10 h-5.5 rounded-full transition-all relative ${isPublic ? 'bg-teal-500' : 'bg-[#3d4a60]'}`}
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${isPublic ? 'left-5.5' : 'left-0.5'}`} />
                    </button>
                  </div>
                  {isPublic && (
                    <div className="flex items-center gap-3 bg-[#0f1729] rounded-xl p-3">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <LinkIcon className="w-3.5 h-3.5 text-teal-400 flex-shrink-0" />
                        <p className="text-xs font-mono text-[#dae2fd] truncate">{publicUrl}</p>
                      </div>
                      <button onClick={copyLink}
                        className="flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 transition-colors flex-shrink-0">
                        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        {copied ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  )}
                </div>
              </BlurGate>

              {/* PM Story */}
              <div className="bg-[#171f33] border border-white/[0.06] rounded-2xl p-6">
                <p className="text-[10px] uppercase tracking-widest text-[#918fa1] mb-1">PM Story</p>
                <p className="text-[11px] text-[#918fa1] mb-3">
                  2–3 sentences: what you bring, what you&apos;ve done, what you&apos;re building toward.
                </p>
                <textarea
                  value={pmStory}
                  onChange={(e) => setPmStory(e.target.value)}
                  placeholder="I bring 5 years of engineering experience to product management, with a track record of translating technical complexity into products users actually want..."
                  rows={4}
                  className="w-full bg-[#0f1729] border border-white/10 rounded-xl p-4 text-sm text-[#dae2fd] placeholder:text-[#3d4a60] focus:outline-none focus:border-indigo-500/40 resize-none"
                />
                <div className="flex justify-between mt-1.5">
                  <span className={`text-[11px] ${pmStory.length > 300 ? 'text-amber-400' : 'text-[#918fa1]'}`}>
                    {pmStory.length} / 300 chars
                  </span>
                </div>
              </div>

              {/* Case Studies */}
              <div className="bg-[#171f33] border border-white/[0.06] rounded-2xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-[#918fa1]">Case Studies</p>
                    <p className="text-[11px] text-[#918fa1] mt-0.5">Up to 3 entries</p>
                  </div>
                  {caseStudies.length < 3 && (
                    <button onClick={addCaseStudy}
                      className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                      <Plus className="w-3.5 h-3.5" /> Add case study
                    </button>
                  )}
                </div>

                {!portfolioLoaded ? (
                  <p className="text-sm text-[#918fa1]">Loading…</p>
                ) : caseStudies.length === 0 ? (
                  <div className="text-center py-6 border border-dashed border-white/10 rounded-xl">
                    <p className="text-sm text-[#918fa1]">No case studies yet</p>
                    <button onClick={addCaseStudy}
                      className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1 mx-auto">
                      <Plus className="w-3 h-3" /> Add your first one
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {caseStudies.map((cs) => (
                      <div key={cs.id} className="bg-[#0f1729] border border-white/[0.06] rounded-xl p-4">
                        <div className="flex items-center justify-between mb-3">
                          <input value={cs.title}
                            onChange={(e) => updateCaseStudy(cs.id, 'title', e.target.value)}
                            placeholder="Project title"
                            className="flex-1 bg-transparent text-sm font-medium text-[#dae2fd] placeholder:text-[#3d4a60] focus:outline-none" />
                          <button onClick={() => deleteCaseStudy(cs.id)}
                            className="text-[#918fa1] hover:text-rose-400 transition-colors ml-2">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        {(['problem', 'approach', 'outcome'] as const).map((field) => (
                          <div key={field} className="mb-2.5 last:mb-0">
                            <p className="text-[10px] uppercase tracking-widest text-[#918fa1] mb-1 capitalize">
                              {field === 'approach' ? 'Approach & PM Skills Used' : field}
                            </p>
                            <textarea value={cs[field]}
                              onChange={(e) => updateCaseStudy(cs.id, field, e.target.value)}
                              placeholder={
                                field === 'problem' ? 'What problem were you solving?'
                                : field === 'approach' ? 'How did you approach it? What PM skills did you apply?'
                                : 'What changed? Include metrics if possible.'
                              }
                              rows={2}
                              className="w-full bg-[#131b2e] border border-white/[0.06] rounded-lg p-3 text-xs text-[#c7c4d8] placeholder:text-[#3d4a60] focus:outline-none focus:border-indigo-500/30 resize-none" />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Skills card */}
              <div className="bg-[#171f33] border border-white/[0.06] rounded-2xl p-5">
                <p className="text-[10px] uppercase tracking-widest text-[#918fa1] mb-3">
                  Skills Card — auto-generated
                </p>
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-xs px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-medium">
                    {archetype.name}
                  </span>
                  <span className="text-[11px] text-[#918fa1]">Verified via PM Pathfinder</span>
                </div>
                <ul className="flex flex-col gap-1.5">
                  {archetype.strengths.slice(0, 2).map((s) => (
                    <li key={s} className="text-sm text-[#dae2fd] flex items-start gap-2">
                      <span className="text-emerald-500 mt-0.5">✓</span>{s}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Save button */}
              <button
                onClick={savePortfolio}
                disabled={saving}
                className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2"
              >
                {saving ? 'Saving…' : saved ? <><Check className="w-4 h-4" /> Saved</> : 'Save Portfolio'}
              </button>
            </div>
          )}

          {/* ── Evaluations ── */}
          {activeTab === 'evaluations' && (
            <div className="flex flex-col gap-4">
              {evaluationHistory.map((eval_, i) => (
                <div key={eval_.id} className="bg-[#171f33] border border-white/[0.06] rounded-2xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        {i === 0 && (
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
                            Latest
                          </span>
                        )}
                        <span className="text-sm font-medium text-[#dae2fd] capitalize">{eval_.archetype}</span>
                      </div>
                      <p className="text-xs text-[#918fa1]">
                        {new Date(eval_.taken_at).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'long', year: 'numeric',
                        })}
                      </p>
                    </div>
                    <span className="text-xs text-[#918fa1] font-mono">v{eval_.version}</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    {dimensions.map((dim) => {
                      const score = eval_.scores[dim]
                      const delta = eval_.deltas[dim]
                      return (
                        <div key={dim} className="flex items-center gap-3">
                          <span className="text-[11px] text-[#918fa1] w-32 flex-shrink-0 truncate">
                            {dimensionLabels[dim]}
                          </span>
                          <div className="flex-1 h-1 bg-[#222a3d] rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-teal-500"
                              style={{ width: `${score * 10}%` }} />
                          </div>
                          <span className="text-[11px] font-mono text-[#918fa1] w-8 text-right">{score.toFixed(1)}</span>
                          {delta !== null && (
                            <span className={`text-[11px] font-mono w-10 text-right ${
                              delta > 0 ? 'text-emerald-400' : delta < 0 ? 'text-rose-400' : 'text-[#918fa1]'
                            }`}>
                              {delta > 0 ? `+${delta}` : delta === 0 ? '—' : delta}
                            </span>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}

              <div className="bg-[#222a3d] border border-white/10 rounded-2xl p-5 text-center">
                <p className="text-sm font-medium text-[#dae2fd] mb-1">Retake the diagnostic to track your progress</p>
                <p className="text-xs text-[#918fa1] mb-4">Best done after completing a Learning Path milestone.</p>
                <Link href="/quiz/diagnostic">
                  <Button className="bg-[#4fdbc8] hover:bg-teal-400 text-slate-950 font-semibold h-10 px-6 rounded-xl">
                    Retake diagnostic <ArrowRight className="ml-2 w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
