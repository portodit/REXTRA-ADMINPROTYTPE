'use client'

import { X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PriorityLabel } from '../badges/PriorityLabel'

/**
 * Rextra ChipData — matches Figma "Chip data" component (node 8444:16226)
 *
 * A chip/tag used to display selected filter values or data tags.
 * Optionally shows a PriorityLabel and a remove (X) button.
 *
 * Usage:
 *   <ChipData label="Frontend Developer" />
 *   <ChipData label="Bootcamp" priority="Wajib" onRemove={() => {}} />
 */

type Priority = 'Dianjurkan' | 'Wajib' | 'Umum Digunakan'

interface ChipDataProps {
  label: string
  priority?: Priority
  onRemove?: () => void
  className?: string
}

export function ChipData({ label, priority, onRemove, className }: ChipDataProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-[10px]',
        'bg-[rgba(204,221,255,0.25)] px-[8px] py-[8px] rounded-[10px]',
        className,
      )}
    >
      <span className="text-[14px] text-[#212729] text-center leading-[1.55] whitespace-nowrap">
        {label}
      </span>
      {priority && <PriorityLabel priority={priority} />}
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="shrink-0 inline-flex items-center justify-center w-5 h-5 rounded text-[#676f7e] hover:text-[#14181f] transition-colors"
          aria-label="Hapus"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </span>
  )
}
