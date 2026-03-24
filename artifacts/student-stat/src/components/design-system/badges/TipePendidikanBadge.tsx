'use client'

import { cn } from '@/lib/utils'

/**
 * Rextra TipePendidikanBadge — matches Figma "Tipe/Pendidikan Non Formal" component (node 8444:16232)
 *
 * Badge for showing non-formal education types in career profiles.
 *
 * Variants:
 *   Bootcamp    → bg-[#ccddff] text-[#0046cc]
 *   Sertifikasi → bg-[#ccddff] text-[#0046cc]
 *   Kursus      → bg-[#ccddff] text-[#0046cc]
 *   Gaji        → bg-[rgba(211,212,212,0.25)] text-[#16a34a]  (salary range badge)
 *
 * Usage:
 *   <TipePendidikanBadge tipe="Bootcamp" />
 *   <TipePendidikanBadge tipe="Gaji" label="Rp. 7 - 12 Juta" />
 */

type TipePendidikan = 'Bootcamp' | 'Sertifikasi' | 'Kursus' | 'Gaji'

interface TipePendidikanBadgeProps {
  tipe: TipePendidikan
  label?: string
  className?: string
}

export function TipePendidikanBadge({ tipe, label, className }: TipePendidikanBadgeProps) {
  const isGaji = tipe === 'Gaji'
  const displayLabel = label ?? (isGaji ? 'Rp. 7 - 12 Juta' : tipe)

  return (
    <span
      className={cn(
        'inline-flex items-center justify-center h-[26px] px-[10px] rounded-[10px]',
        'text-[12px] font-normal text-center whitespace-nowrap leading-normal',
        isGaji
          ? 'bg-[rgba(211,212,212,0.25)] text-[#16a34a]'
          : 'bg-[#ccddff] text-[#0046cc]',
        className,
      )}
    >
      {displayLabel}
    </span>
  )
}
