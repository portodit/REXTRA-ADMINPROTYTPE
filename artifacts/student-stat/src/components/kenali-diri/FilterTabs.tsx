import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import Typography from '@/components/Typography'
import { SearchBar } from './SearchBar'
import { SlidersHorizontal, X } from 'lucide-react'

const tabs = ['Semua Data', 'Selesai', 'Berjalan', 'Dihentikan'] as const
type TabType = (typeof tabs)[number]

interface FilterTabsProps {
  activeTab: TabType
  search: string
  onTabChange: (tab: TabType) => void
  onSearchChange: (value: string) => void
  onFilterClick?: () => void
}

const KATEGORI_OPTIONS = ['Semua Kategori', 'Tes Profil Karier', 'Tes Minat Bakat', 'Tes Kepribadian']
const HASIL_OPTIONS = ['Semua Hasil', 'RIA', 'SEC', 'AIR', 'CRE', 'IAS', 'ESC', 'RCS', 'ARI']
const URUTAN_OPTIONS = ['Nama A-Z', 'Nama Z-A', 'Terbaru', 'Terlama']

export default function FilterTabs({
  activeTab,
  search,
  onTabChange,
  onSearchChange,
}: FilterTabsProps) {
  const [showFilter, setShowFilter] = useState(false)
  const [filterKategori, setFilterKategori] = useState(KATEGORI_OPTIONS[0])
  const [filterHasil, setFilterHasil] = useState(HASIL_OPTIONS[0])
  const [filterUrutan, setFilterUrutan] = useState(URUTAN_OPTIONS[0])

  const hasActiveFilter =
    filterKategori !== KATEGORI_OPTIONS[0] ||
    filterHasil !== HASIL_OPTIONS[0] ||
    filterUrutan !== URUTAN_OPTIONS[0]

  const resetFilter = () => {
    setFilterKategori(KATEGORI_OPTIONS[0])
    setFilterHasil(HASIL_OPTIONS[0])
    setFilterUrutan(URUTAN_OPTIONS[0])
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Title */}
      <div className="flex flex-col gap-1">
        <Typography variant="h5" weight="bold" font="Poppins">
          Riwayat Tes Kenali Diri
        </Typography>
        <Typography variant="l1" className="text-gray-500" font="Poppins">
          Menyajikan data hasil tes Kenali Diri user REXTRA.
        </Typography>
      </div>

      {/* Row 1: Status tabs (full width) */}
      <div
        className="
          flex gap-2 w-full
          bg-[#D3D4D4]/15
          outline outline-1 outline-[#B5B7B8]
          rounded-lg p-1
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

      {/* Row 2: Search + Filter toggle */}
      <div className="flex items-center gap-3">
        <SearchBar
          value={search}
          onSearch={onSearchChange}
          className="flex-1 min-w-0"
        />
        <button
          onClick={() => setShowFilter((v) => !v)}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg border text-sm whitespace-nowrap shrink-0 transition-colors
            ${
              showFilter || hasActiveFilter
                ? 'border-blue-400 bg-blue-50 text-blue-700'
                : 'border-gray-300 bg-white hover:bg-gray-50 text-gray-600'
            }
          `}
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filter
          {hasActiveFilter && (
            <span className="ml-1 w-2 h-2 rounded-full bg-blue-500 inline-block" />
          )}
        </button>
      </div>

      {/* Row 3: Filter panel (expandable) */}
      {showFilter && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Typography variant="l1" weight="semibold" className="text-gray-800">
              Filter Data
            </Typography>
            <button
              onClick={() => setShowFilter(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Kategori Tes</label>
              <select
                value={filterKategori}
                onChange={(e) => setFilterKategori(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {KATEGORI_OPTIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Hasil Tes</label>
              <select
                value={filterHasil}
                onChange={(e) => setFilterHasil(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {HASIL_OPTIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-600">Urutkan</label>
              <select
                value={filterUrutan}
                onChange={(e) => setFilterUrutan(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                {URUTAN_OPTIONS.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-2 mt-4">
            <button className="px-4 py-2 rounded-lg bg-[#003499] text-white text-sm font-medium hover:bg-blue-800 transition-colors">
              Terapkan Filter
            </button>
            {hasActiveFilter && (
              <button
                onClick={resetFilter}
                className="px-4 py-2 rounded-lg border border-red-300 text-red-500 text-sm font-medium hover:bg-red-50 transition-colors"
              >
                Reset Filter
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export type { TabType }
