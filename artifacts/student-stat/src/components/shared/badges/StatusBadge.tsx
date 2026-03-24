'use client'

import { cn } from '@/lib/utils'

/**
 * Rextra Status Badge — matches Figma Component UI design
 *
 * Accepts both backend values ('completed' | 'in_progress' | 'abandoned')
 * and display labels ('Selesai' | 'Berjalan' | 'Sedang Berjalan' | 'Dihentikan').
 *
 * Usage:
 *   <StatusBadge value="completed" />
 *   <StatusBadge value="Selesai" />
 */

type BackendStatus = 'completed' | 'in_progress' | 'abandoned'
type DisplayStatus = 'Selesai' | 'Berjalan' | 'Sedang Berjalan' | 'Dihentikan'
export type StatusValue = BackendStatus | DisplayStatus

interface StatusBadgeProps {
  value: StatusValue
  className?: string
}

const DISPLAY_MAP: Record<BackendStatus, DisplayStatus> = {
  completed:   'Selesai',
  in_progress: 'Berjalan',
  abandoned:   'Dihentikan',
}

const STYLE_MAP: Record<DisplayStatus, string> = {
  'Selesai':        'bg-[#e3ffee] border-[#16a34a] text-[#16a34a]',
  'Berjalan':       'bg-[#fff1e3] border-[#ff7409] text-[#ff7409]',
  'Sedang Berjalan':'bg-[#fff1e3] border-[#ff7409] text-[#ff7409]',
  'Dihentikan':     'bg-[rgba(248,212,212,0.25)] border-[#dc2626] text-[#dc2626]',
}

function resolveLabel(value: StatusValue): DisplayStatus {
  if (value in DISPLAY_MAP) return DISPLAY_MAP[value as BackendStatus]
  return value as DisplayStatus
}

export function StatusBadge({ value, className }: StatusBadgeProps) {
  const label = resolveLabel(value)
  const style = STYLE_MAP[label] ?? 'bg-gray-50 border-gray-400 text-gray-600'

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center px-3 py-[3px] rounded-[6px] border text-xs font-semibold whitespace-nowrap',
        style,
        className,
      )}
    >
      {label}
    </span>
  )
}
