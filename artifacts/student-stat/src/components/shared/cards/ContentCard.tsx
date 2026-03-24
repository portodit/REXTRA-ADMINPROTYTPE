'use client'

import { cn } from '@/lib/utils'

/**
 * Rextra ContentCard — matches Figma "Container Content large" component (node 30:9509)
 *
 * A hoverable content card used for displaying content items in list/grid views.
 * Has Default and Hover states (hover highlights with blue-tinted border and bg).
 *
 * Usage:
 *   <ContentCard onClick={...}>
 *     <ContentCard.Title>Card Title</ContentCard.Title>
 *     <ContentCard.Body>Card body content</ContentCard.Body>
 *   </ContentCard>
 *
 * Or flat:
 *   <ContentCard title="My Card" subtitle="Subtitle" onClick={...} />
 */

interface ContentCardProps {
  title?: string
  subtitle?: string
  badge?: React.ReactNode
  children?: React.ReactNode
  onClick?: () => void
  active?: boolean
  className?: string
}

export function ContentCard({
  title,
  subtitle,
  badge,
  children,
  onClick,
  active,
  className,
}: ContentCardProps) {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick() } : undefined}
      className={cn(
        'w-full bg-white border rounded-xl px-5 py-4 transition-all duration-150',
        onClick && 'cursor-pointer',
        active
          ? 'border-[#669aff] bg-[#f0f4ff] shadow-sm'
          : 'border-[#e9eaec] hover:border-[#669aff] hover:bg-[#f8f9fb]',
        className,
      )}
    >
      {(title || badge) && (
        <div className="flex items-start gap-2 mb-1">
          {title && (
            <p className="flex-1 text-sm font-semibold text-[#14181f] leading-snug min-w-0">
              {title}
            </p>
          )}
          {badge && <span className="shrink-0">{badge}</span>}
        </div>
      )}
      {subtitle && (
        <p className="text-xs text-[#676f7e] leading-relaxed mb-2">{subtitle}</p>
      )}
      {children}
    </div>
  )
}
