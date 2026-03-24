'use client'

import React from 'react'
import { Trash2, RotateCcw, SlidersHorizontal, Download, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Rextra Action Buttons — matches Figma Component UI design
 *
 * Components:
 *   HapusButton        — red "Hapus Data" button
 *   ResetFilterButton  — red-outline "Reset Filter" button
 *   FilterButton       — white "Filter" / "Terapkan Filter" button
 *   ExportButton       — green "Export Data" button
 *   NextPageButton     — blue pagination arrow button
 */

type ButtonSize = 'sm' | 'md'

const BASE = 'inline-flex items-center gap-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none'
const SIZE: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
}

/* ── Hapus Data (Delete) ──────────────────────────────── */
interface HapusButtonProps {
  onClick?: () => void
  label?: string
  size?: ButtonSize
  className?: string
  disabled?: boolean
}

export function HapusButton({ onClick, label = 'Hapus Data', size = 'md', className, disabled }: HapusButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(BASE, SIZE[size], 'bg-[#dc2626] hover:bg-[#b91c1c] text-white', className)}
    >
      <Trash2 className="w-4 h-4 shrink-0" />
      {label}
    </button>
  )
}

/* ── Reset Filter ─────────────────────────────────────── */
interface ResetFilterButtonProps {
  onClick?: () => void
  label?: string
  size?: ButtonSize
  className?: string
  disabled?: boolean
}

export function ResetFilterButton({ onClick, label = 'Reset Filter', size = 'md', className, disabled }: ResetFilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(BASE, SIZE[size], 'border border-[#dc2626] text-[#dc2626] bg-white hover:bg-red-50', className)}
    >
      <RotateCcw className="w-4 h-4 shrink-0" />
      {label}
    </button>
  )
}

/* ── Filter / Terapkan Filter ─────────────────────────── */
interface FilterButtonProps {
  onClick?: () => void
  label?: string
  active?: boolean
  hasActiveFilter?: boolean
  size?: ButtonSize
  className?: string
  disabled?: boolean
}

export function FilterButton({ onClick, label = 'Filter', active, hasActiveFilter, size = 'md', className, disabled }: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        BASE, SIZE[size],
        'border',
        active || hasActiveFilter
          ? 'border-blue-400 bg-blue-50 text-blue-700 hover:bg-blue-100'
          : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50',
        className,
      )}
    >
      <SlidersHorizontal className="w-4 h-4 shrink-0" />
      {label}
      {hasActiveFilter && <span className="w-2 h-2 rounded-full bg-blue-500" />}
    </button>
  )
}

/* ── Terapkan Filter (Apply) ──────────────────────────── */
interface TerapkanFilterButtonProps {
  onClick?: () => void
  label?: string
  size?: ButtonSize
  className?: string
  disabled?: boolean
}

export function TerapkanFilterButton({ onClick, label = 'Terapkan Filter', size = 'md', className, disabled }: TerapkanFilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(BASE, SIZE[size], 'bg-[#003499] hover:bg-[#002780] text-white', className)}
    >
      <SlidersHorizontal className="w-4 h-4 shrink-0" />
      {label}
    </button>
  )
}

/* ── Export Data ──────────────────────────────────────── */
interface ExportButtonProps {
  onClick?: () => void
  label?: string
  size?: ButtonSize
  className?: string
  disabled?: boolean
  loading?: boolean
}

export function ExportButton({ onClick, label = 'Export Data', size = 'md', className, disabled, loading }: ExportButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={cn(BASE, SIZE[size], 'bg-[#16a34a] hover:bg-[#15803d] text-white', className)}
    >
      <Download className="w-4 h-4 shrink-0" />
      {loading ? 'Mengekspor...' : label}
    </button>
  )
}

/* ── Next Page (Pagination arrow button) ──────────────── */
interface NextPageButtonProps {
  onClick?: () => void
  label?: string
  size?: ButtonSize
  className?: string
  disabled?: boolean
}

export function NextPageButton({ onClick, label = 'Next Page', size = 'md', className, disabled }: NextPageButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(BASE, SIZE[size], 'bg-[#0046cc] hover:bg-[#003499] text-white', className)}
    >
      {label}
      <ChevronRight className="w-4 h-4 shrink-0" />
    </button>
  )
}
