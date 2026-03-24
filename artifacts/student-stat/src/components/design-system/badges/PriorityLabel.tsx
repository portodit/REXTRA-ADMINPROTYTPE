'use client'

import { cn } from '@/lib/utils'

/**
 * Rextra PriorityLabel — matches Figma "Priority label" component (node 8444:16219)
 *
 * Small label showing content requirement priority.
 *
 * Variants:
 *   Dianjurkan     → white bg, gray text
 *   Wajib          → #ccddff bg, #0046cc text (blue)
 *   Umum Digunakan → white bg, gray text
 *
 * Usage:
 *   <PriorityLabel priority="Wajib" />
 *   <PriorityLabel priority="Dianjurkan" />
 */

type Priority = 'Dianjurkan' | 'Wajib' | 'Umum Digunakan'

interface PriorityLabelProps {
  priority: Priority
  className?: string
}

export function PriorityLabel({ priority, className }: PriorityLabelProps) {
  const isWajib = priority === 'Wajib'
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center px-[2px] py-[6px] rounded-[5px]',
        'text-[12px] font-normal text-center leading-normal whitespace-nowrap',
        isWajib
          ? 'bg-[#ccddff] text-[#0046cc]'
          : 'bg-white text-[#6b6f70]',
        className,
      )}
    >
      {priority}
    </span>
  )
}
