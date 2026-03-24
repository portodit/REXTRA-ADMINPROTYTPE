'use client'

import { cn } from '@/lib/utils'

/**
 * Rextra TabBar — matches Figma "Default togle" component
 *
 * A horizontal row of tabs for filtering table data by status.
 * Used across Hasil Tes, Umpan Balik, and any similar list pages.
 *
 * Usage:
 *   const TABS = ['Semua Data', 'Selesai', 'Berjalan', 'Dihentikan'] as const
 *   <TabBar tabs={TABS} activeTab={tab} onTabChange={setTab} />
 */

interface TabBarProps<T extends string> {
  tabs: readonly T[]
  activeTab: T
  onTabChange: (tab: T) => void
  className?: string
}

export function TabBar<T extends string>({ tabs, activeTab, onTabChange, className }: TabBarProps<T>) {
  return (
    <div
      className={cn(
        'flex gap-1 sm:gap-2 w-full overflow-x-auto scrollbar-none',
        'bg-[#d3d4d4]/15 outline outline-1 outline-[#b5b7b8] rounded-lg p-1',
        className,
      )}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab
        return (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={cn(
              'shrink-0 sm:flex-1 whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-medium transition-all',
              isActive
                ? 'bg-[#ccddff] border border-[#669aff] text-[#003499]'
                : 'bg-transparent text-[#494848] hover:bg-[#ccddff]/50',
            )}
          >
            {tab}
          </button>
        )
      })}
    </div>
  )
}
