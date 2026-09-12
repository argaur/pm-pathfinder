'use client'

import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

/**
 * The one answer affordance in the assessment.
 *
 * /quiz drew a plain text row and /quiz/diagnostic drew a lettered row, with
 * different radii, padding and selected states. They are the same control, so
 * this is one component with an optional `marker` — the letter is a prop, not
 * a different button.
 *
 * The selected state is teal (--color-secondary) because teal is the journey's
 * "you are here / you chose this" colour throughout the rail and the primary
 * action. Touch target is 44px minimum.
 */

export interface OptionButtonProps {
  /** Answer text. */
  children: ReactNode
  selected: boolean
  onSelect: () => void
  /** Optional leading key, e.g. "A". Omit for a plain row. */
  marker?: ReactNode
  disabled?: boolean
}

export default function OptionButton({
  children,
  selected,
  onSelect,
  marker,
  disabled,
}: OptionButtonProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      aria-pressed={selected}
      className={cn(
        'flex w-full min-h-[44px] items-start gap-4 rounded-2xl p-4 text-left text-sm leading-relaxed transition-colors',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary',
        'disabled:pointer-events-none disabled:opacity-50',
        selected
          ? 'border-2 border-secondary bg-surface-2 text-foreground'
          : 'border border-border bg-surface-1 text-card-foreground/85 hover:border-white/15 hover:bg-surface-2'
      )}
    >
      {marker && (
        <span
          aria-hidden
          className={cn(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-mono text-sm font-bold transition-colors',
            selected
              ? 'bg-secondary text-secondary-foreground'
              : 'bg-surface-2 text-muted-foreground'
          )}
        >
          {marker}
        </span>
      )}
      <span className={cn('text-pretty', marker && 'pt-1.5')}>{children}</span>
    </button>
  )
}
