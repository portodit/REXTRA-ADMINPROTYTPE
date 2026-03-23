import React from 'react'
import { Button } from '@/components/ui/button'
import Typography from '@/components/Typography'
import { SearchBar } from './SearchBar'
import { SlidersHorizontal } from 'lucide-react'

const tabs = ['Semua Data', 'Selesai', 'Berjalan', 'Dihentikan'] as const
type TabType = (typeof tabs)[number]

interface FilterTabsProps {
  activeTab: TabType
  search: string
  onTabChange: (tab: TabType) => void
  onSearchChange: (value: string) => void
  onFilterClick: () => void
}

export default function FilterTabs({
  activeTab,
  search,
  onTabChange,
  onSearchChange,
  onFilterClick,
}: FilterTabsProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="flex flex-col gap-1">
        <Typography variant="h5" weight="bold" font="Poppins">
          Riwayat Tes Kenali Diri
        </Typography>
        <Typography variant="l1" className="text-gray-500" font="Poppins">
          Menyajikan data hasil tes Kenali Diri user REXTRA.
        </Typography>
      </div>

      <div className="flex flex-col xl:flex-row xl:items-center gap-4 w-full">
        <div
          className="
            flex gap-2
            w-full xl:w-4/5
            overflow-x-auto
            bg-[#D3D4D4]/15
            outline outline-1 outline-[#B5B7B8]
            rounded-lg
            justify-between
            p-1
          "
        >
          {tabs.map((t) => {
            const isActive = activeTab === t
            return (
              <Button
                key={t}
                onClick={() => onTabChange(t)}
                className={`
                  flex-1 whitespace-nowrap rounded-lg shadow-none transition-all
                  ${
                    isActive
                      ? 'bg-[#CCDDFF] border-[#669AFF] border text-[#003499] hover:bg-[#CCDDFF]'
                      : 'bg-transparent text-[#494848] hover:bg-[#CCDDFF]/50 shadow-none'
                  }
                `}
              >
                <Typography variant="l1" weight={isActive ? 'semibold' : 'regular'}>
                  {t}
                </Typography>
              </Button>
            )
          })}
        </div>

        <div className="flex gap-3 w-full xl:w-1/5 items-center">
          <SearchBar
            value={search}
            onSearch={onSearchChange}
            className="flex-1"
          />
          <button
            onClick={onFilterClick}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-50 text-gray-600 text-sm whitespace-nowrap"
          >
            <SlidersHorizontal className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>
    </div>
  )
}

export type { TabType }
