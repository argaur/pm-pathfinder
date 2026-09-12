'use client'

import type { ReactNode } from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * The single forward action of any assessment screen.
 *
 * Two tones, and the split is meaning, not decoration:
 *   - `advance` (teal) moves you along the journey. It matches the rail's
 *     current-stage fill and the selected answer state, so "the teal thing" is
 *     always "the next step of this thing you are already doing".
 *   - `convert` (amber) is the one moment the journey asks for something back —
 *     signing up on /quiz/results. Amber is the landing page's conversion
 *     colour, so it stays rare and keeps its meaning.
 *
 * Measured contrast, do not "fix": amber carries text-slate-950 (11.87:1);
 * never light text on amber. Teal carries secondary-foreground (#003731).
 */

export type JourneyCTATone = 'advance' | 'convert'

export interface JourneyCTAProps {
  label: string
  onClick: () => void
  tone?: JourneyCTATone
  disabled?: boolean
  /** When true the button shows `loadingLabel` and is not clickable. */
  loading?: boolean
  loadingLabel?: string
  /** Small line under the button, e.g. "~8 minutes · 10 questions". */
  note?: ReactNode
  /** Trailing arrow. Defaults to on. */
  trailingIcon?: boolean
}

const TONES: Record<JourneyCTATone, string> = {
  advance:
    'bg-secondary text-secondary-foreground shadow-[0_0_32px_rgba(79,219,200,0.2)] hover:bg-teal-300 focus-visible:outline-secondary',
  convert:
    'bg-brand-amber text-slate-950 shadow-glow-amber hover:bg-amber-400 focus-visible:outline-brand-amber',
}

export default function JourneyCTA({
  label,
  onClick,
  tone = 'advance',
  disabled,
  loading,
  loadingLabel,
  note,
  trailingIcon = true,
}: JourneyCTAProps) {
  const isDisabled = Boolean(disabled || loading)

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={onClick}
        disabled={isDisabled}
        className={cn(
          'flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-base font-semibold transition-all active:scale-[0.98]',
          'focus-visible:outline-2 focus-visible:outline-offset-2',
          isDisabled
            ? 'bg-surface-2 text-muted-foreground shadow-none active:scale-100'
            : TONES[tone]
        )}
      >
        {loading ? (loadingLabel ?? label) : label}
        {!loading && trailingIcon && <ArrowRight className="h-4 w-4" aria-hidden />}
      </button>
      {note && (
        <p className="text-center text-xs text-muted-foreground">{note}</p>
      )}
    </div>
  )
}
