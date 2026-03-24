'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Rextra ExpandableInfoRow — matches Figma "Dropdown Info large" component (node 30:9520)
 *
 * A collapsible info section with a header trigger row and expandable content body.
 * Has two states: Default (collapsed) and Detail (expanded).
 *
 * Used in: career info sections, detail pages, and any accordion-style info display.
 *
 * Usage:
 *   <ExpandableInfoRow title="Profil Profesi" defaultOpen>
 *     <p>Detail content here...</p>
 *   </ExpandableInfoRow>
 */

interface ExpandableInfoRowProps {
  title: string
  subtitle?: string
  icon?: React.ReactNode
  children: React.ReactNode
  defaultOpen?: boolean
  className?: string
  headerClassName?: string
  contentClassName?: string
}

export function ExpandableInfoRow({
  title,
  subtitle,
  icon,
  children,
  defaultOpen = false,
  className,
  headerClassName,
  contentClassName,
}: ExpandableInfoRowProps) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className={cn('w-full border border-[#e9eaec] rounded-xl overflow-hidden bg-white', className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          'w-full flex items-center gap-3 px-5 py-4 text-left transition-colors',
          open ? 'bg-[#f0f4ff]' : 'bg-white hover:bg-[#f8f9fb]',
          headerClassName,
        )}
        aria-expanded={open}
      >
        {icon && (
          <span className="shrink-0 flex items-center justify-center w-8 h-8 rounded-lg bg-[#e8f0ff]">
            {icon}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[#14181f] leading-snug">{title}</p>
          {subtitle && (
            <p className="text-xs text-[#676f7e] mt-0.5 leading-snug">{subtitle}</p>
          )}
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 shrink-0 text-[#676f7e] transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && (
        <div
          className={cn(
            'px-5 py-4 border-t border-[#e9eaec] bg-white',
            contentClassName,
          )}
        >
          {children}
        </div>
      )}
    </div>
  )
}
