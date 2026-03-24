'use client'

import { cn } from '@/lib/utils'

/**
 * Rextra ActiveBadge — matches Figma "Tabel" page BadgeActive component
 *
 * Displays item active status in tables.
 * - "Aktif"    → blue  (#0046cc background, #ccddff border+text)
 * - "Nonaktif" → gray  (#f3f4f6 background, #9ca3af border, #6b7280 text)
 *
 * Distinct from StatusBadge (which is for test completion status).
 *
 * Usage:
 *   <ActiveBadge status="Aktif" />
 *   <ActiveBadge status="Nonaktif" />
 */

type ActiveStatus = 'Aktif' | 'Nonaktif'

interface ActiveBadgeProps {
  status: ActiveStatus
  className?: string
}

const STYLES: Record<ActiveStatus, string> = {
  Aktif:    'bg-[#0046cc] border-[#ccddff] text-[#ccddff]',
  Nonaktif: 'bg-[#f3f4f6] border-[#d1d5db] text-[#6b7280]',
}

export function ActiveBadge({ status, className }: ActiveBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center px-[9px] py-[3px]',
        'rounded-[6px] border text-[12px] font-semibold whitespace-nowrap leading-[1.55]',
        STYLES[status],
        className,
      )}
    >
      {status}
    </span>
  )
}
