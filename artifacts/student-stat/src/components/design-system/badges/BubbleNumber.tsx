'use client'

import { cn } from '@/lib/utils'

/**
 * Rextra BubbleNumber — matches Figma "Buble Number" component (node 8444:16129)
 *
 * Small circular number bubble used to show ranking or count indicators.
 *
 * Colors:
 *   green  → bg-[#d0eddb]  text-[#16a34a]
 *   blue   → bg-[#ccddff]  text-[#0046cc]
 *   orange → bg-[#fff1e3]  text-[#ff7409]
 *   gray   → bg-[#d3d4d4]  text-[#212729]
 *
 * Usage:
 *   <BubbleNumber value={1} color="green" />
 *   <BubbleNumber value={2} color="blue" />
 */

type BubbleColor = 'green' | 'blue' | 'orange' | 'gray'

interface BubbleNumberProps {
  value: number | string
  color?: BubbleColor
  className?: string
}

const STYLES: Record<BubbleColor, string> = {
  green:  'bg-[#d0eddb] text-[#16a34a]',
  blue:   'bg-[#ccddff] text-[#0046cc]',
  orange: 'bg-[#fff1e3] text-[#ff7409]',
  gray:   'bg-[#d3d4d4] text-[#212729]',
}

export function BubbleNumber({ value, color = 'green', className }: BubbleNumberProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center',
        'min-w-[22px] h-[20px] px-1 rounded-full',
        'text-[12px] font-normal leading-[1.55]',
        STYLES[color],
        className,
      )}
    >
      {value}
    </span>
  )
}
