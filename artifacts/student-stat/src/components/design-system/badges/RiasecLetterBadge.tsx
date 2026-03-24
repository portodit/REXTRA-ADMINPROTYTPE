'use client'

import { cn } from '@/lib/utils'

/**
 * Rextra RiasecLetterBadge — matches Figma "letters" component (node 8444:16052)
 *
 * Displays a single RIASEC personality letter (R/I/A/S/E/C) in a 56×56 rounded badge.
 * Each letter has a unique color from the REXTRA design system.
 *
 * Colors:
 *   R → Orange  (#ea580c text, #fb923c border, rgba(249,115,22,0.15) bg)
 *   I → Blue    (#2563eb text, #60a5fa border, rgba(59,130,246,0.15) bg)
 *   A → Purple  (#9333ea text, #c084fc border, rgba(168,85,247,0.15) bg)
 *   S → Green   (#059669 text, #34d399 border, rgba(16,185,129,0.15) bg)
 *   E → Amber   (#d97706 text, #fbbf24 border, rgba(245,158,11,0.15) bg)
 *   C → Cyan    (#0891b2 text, #22d3ee border, rgba(6,182,212,0.15) bg)
 *
 * Usage:
 *   <RiasecLetterBadge letter="R" />
 *   <RiasecLetterBadge letter="I" size="sm" />
 */

type RiasecLetter = 'R' | 'I' | 'A' | 'S' | 'E' | 'C'

interface RiasecLetterBadgeProps {
  letter: RiasecLetter
  size?: 'sm' | 'md'
  className?: string
}

const LETTER_STYLES: Record<RiasecLetter, { bg: string; border: string; text: string }> = {
  R: { bg: 'bg-[rgba(249,115,22,0.15)]',   border: 'border-[#fb923c]', text: 'text-[#ea580c]' },
  I: { bg: 'bg-[rgba(59,130,246,0.15)]',   border: 'border-[#60a5fa]', text: 'text-[#2563eb]' },
  A: { bg: 'bg-[rgba(168,85,247,0.15)]',   border: 'border-[#c084fc]', text: 'text-[#9333ea]' },
  S: { bg: 'bg-[rgba(16,185,129,0.15)]',   border: 'border-[#34d399]', text: 'text-[#059669]' },
  E: { bg: 'bg-[rgba(245,158,11,0.15)]',   border: 'border-[#fbbf24]', text: 'text-[#d97706]' },
  C: { bg: 'bg-[rgba(6,182,212,0.15)]',    border: 'border-[#22d3ee]', text: 'text-[#0891b2]' },
}

export function RiasecLetterBadge({ letter, size = 'md', className }: RiasecLetterBadgeProps) {
  const { bg, border, text } = LETTER_STYLES[letter]
  const sizeClass = size === 'sm'
    ? 'size-[32px] rounded-[8px] text-[14px]'
    : 'size-[56px] rounded-[12px] text-[20px]'

  return (
    <div
      className={cn(
        'border-2 overflow-clip flex items-center justify-center font-bold',
        bg, border, sizeClass,
        className,
      )}
    >
      <span className={cn('font-bold leading-none', text)}>{letter}</span>
    </div>
  )
}
