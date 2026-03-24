'use client'

import { cn } from '@/lib/utils'
import {
  Code, PenTool, Megaphone, Settings, BarChart3, Palette,
} from 'lucide-react'
import type { KategoriValue } from './KategoriChip'

/**
 * Rextra KategoriLabel — matches Figma "Label" component (node 8444:16206)
 *
 * Colored pill-shaped label for career categories.
 * Each category has a unique background + text color combination.
 *
 * Colors:
 *   Teknologi → bg-[#ccddff]  text-[#0046cc]
 *   Bisnis    → bg-[#d0eddb]  text-[#16a34a]
 *   Konten    → bg-[#d3f8f9]  text-[#1cb0b4]
 *   Marketing → bg-[#fff1e3]  text-[#ff7409]
 *   Desain    → bg-[#f8d4d4]  text-[#dc2626]
 *   Manajemen → bg-[#d3d4d4]  text-[#212729]
 *
 * Usage:
 *   <KategoriLabel kategori="Teknologi" />
 */

interface KategoriLabelProps {
  kategori: KategoriValue
  className?: string
}

const LABEL_CONFIG: Record<KategoriValue, {
  icon: React.ElementType
  bg: string
  text: string
}> = {
  Teknologi: { icon: Code,     bg: 'bg-[#ccddff]', text: 'text-[#0046cc]' },
  Bisnis:    { icon: BarChart3, bg: 'bg-[#d0eddb]', text: 'text-[#16a34a]' },
  Konten:    { icon: PenTool,  bg: 'bg-[#d3f8f9]', text: 'text-[#1cb0b4]' },
  Marketing: { icon: Megaphone, bg: 'bg-[#fff1e3]', text: 'text-[#ff7409]' },
  Desain:    { icon: Palette,  bg: 'bg-[#f8d4d4]', text: 'text-[#dc2626]' },
  Manajemen: { icon: Settings, bg: 'bg-[#d3d4d4]', text: 'text-[#212729]' },
}

export function KategoriLabel({ kategori, className }: KategoriLabelProps) {
  const { icon: Icon, bg, text } = LABEL_CONFIG[kategori]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 h-[36px] px-[10px] rounded-[12px]',
        bg,
        className,
      )}
    >
      <Icon className={cn('w-4 h-4 shrink-0', text)} />
      <span className={cn('text-[14px] font-normal leading-[1.55]', text)}>{kategori}</span>
    </span>
  )
}
