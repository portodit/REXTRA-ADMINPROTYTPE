'use client'

import { cn } from '@/lib/utils'

/**
 * Rextra ColorBadge — matches Figma "Badge" component (node 8444:16025)
 *
 * Generic colored status badge used across content items.
 * Distinct from StatusBadge (test completion) and ActiveBadge (item active status).
 *
 * Variants:
 *   Orange   → warm orange  (#fff1e3 bg, #ff7409 border+text)
 *   Green    → success green (#e3ffee bg, #16a34a border+text)
 *   red      → danger red   (#f8d4d4 bg, #dc2626 border+text)
 *   blue light → teal-cyan (#d3f8f9 bg, #1cb0b4 border+text)
 *   Disabled → muted gray  (rgba(211,212,212,0.5) bg, #212729 border+text)
 *
 * Usage:
 *   <ColorBadge variant="Green">Selesai</ColorBadge>
 *   <ColorBadge variant="Orange">Menunggu</ColorBadge>
 */

type ColorBadgeVariant = 'Orange' | 'Green' | 'red' | 'blue light' | 'Disabled'

interface ColorBadgeProps {
  variant?: ColorBadgeVariant
  children: React.ReactNode
  className?: string
}

const STYLES: Record<ColorBadgeVariant, string> = {
  Orange:       'bg-[#fff1e3] border-[#ff7409] text-[#ff7409]',
  Green:        'bg-[#e3ffee] border-[#16a34a] text-[#16a34a]',
  red:          'bg-[#f8d4d4] border-[#dc2626] text-[#dc2626]',
  'blue light': 'bg-[#d3f8f9] border-[#1cb0b4] text-[#1cb0b4]',
  Disabled:     'bg-[rgba(211,212,212,0.5)] border-[#212729] text-[#212729]',
}

export function ColorBadge({ variant = 'Orange', children, className }: ColorBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center gap-1',
        'px-[9px] py-[4px] rounded-[6px] border',
        'text-[12px] font-semibold leading-[1.55] whitespace-nowrap',
        STYLES[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}
