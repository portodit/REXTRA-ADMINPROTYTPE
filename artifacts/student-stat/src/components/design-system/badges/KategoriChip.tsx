'use client'

import { cn } from '@/lib/utils'
import {
  Code, PenTool, Megaphone, Settings, BarChart3, Palette,
} from 'lucide-react'

/**
 * Rextra KategoriChip — matches Figma "Kategori" component (node 8444:16167)
 *
 * Displays a career category as a text label with a small icon.
 * Used inline within table cells and detail pages.
 *
 * Usage:
 *   <KategoriChip kategori="Teknologi" />
 *   <KategoriChip kategori="Desain" />
 */

export type KategoriValue =
  | 'Bisnis'
  | 'Konten'
  | 'Teknologi'
  | 'Marketing'
  | 'Desain'
  | 'Manajemen'

interface KategoriChipProps {
  kategori: KategoriValue
  className?: string
}

const KATEGORI_CONFIG: Record<KategoriValue, { icon: React.ElementType; color: string }> = {
  Bisnis:    { icon: BarChart3, color: 'text-[#16a34a]' },
  Konten:    { icon: PenTool,  color: 'text-[#1cb0b4]' },
  Teknologi: { icon: Code,     color: 'text-[#0046cc]' },
  Marketing: { icon: Megaphone, color: 'text-[#ff7409]' },
  Desain:    { icon: Palette,  color: 'text-[#dc2626]' },
  Manajemen: { icon: Settings, color: 'text-[#212729]' },
}

export function KategoriChip({ kategori, className }: KategoriChipProps) {
  const { icon: Icon, color } = KATEGORI_CONFIG[kategori]
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <Icon className={cn('w-4 h-4 shrink-0', color)} />
      <span className="text-[14px] text-[#212729] leading-[1.55]">{kategori}</span>
    </span>
  )
}
