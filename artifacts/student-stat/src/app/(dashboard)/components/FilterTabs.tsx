'use client'
import { Button } from '@/components/ui/button'
import Typography from '@/components/Typography'
import { SearchBar } from './Searchbar'
import { SlidersHorizontal } from 'lucide-react'
// import { useState } from 'react'

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
      {/* TITLE */}
      <div className="flex flex-col gap-1">
        <Typography variant="h5" weight="bold" font="Poppins">
          Riwayat Tes Kenali Diri
        </Typography>
        <Typography variant="l1" className="text-gray-500" font="Poppins">
          Menyajikan 120 data hasil tes Kenali Diri user REXTRA.
        </Typography>
      </div>

      {/* FILTER + SEARCH */}
      <div className="flex flex-col xl:flex-row xl:items-center gap-4 w-full">
        {/* TABS */}
        <div
          className="
            flex gap-2
            w-full xl:w-4/5
            overflow-x-auto
            scrollbar-hide
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
                  whitespace-nowrap
                  rounded-lg
                  shadow-none
                  ${
                    isActive
                      ? 'bg-[#CCDDFF] text-white border-1 border-[#669AFF]'
                      : 'bg-transparent text-[#669AFF] hover:bg-[#CCDDFF] hover:border hover:border-[#669AFF]'
                  }
                `}
              >
                <Typography variant="l2">{t}</Typography>
              </Button>
            )
          })}
        </div>

        {/* SEARCH */}
        <div className="w-full flex flex-row gap-x-5">
          <SearchBar value={search} onSearch={onSearchChange} />

          {/* Filter Button */}
          <Button
            onClick={onFilterClick}
            className="h-[40px] px-8 rounded-lg bg-blue-600 hover:bg-blue-700 flex items-center gap-x-2"
          >
            <Typography variant="bt" weight="medium" className="text-white">
              Filter
            </Typography>
            <SlidersHorizontal className="h-5 w-5 text-white" />
          </Button>
        </div>
      </div>
    </div>
  )
}
