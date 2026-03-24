'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

const LETTERS = ['R', 'I', 'A', 'S', 'E', 'C'] as const
type RiasecLetter = typeof LETTERS[number]

const LETTER_NAMES: Record<RiasecLetter, string> = {
  R: 'Realistic',
  I: 'Investigative',
  A: 'Artistic',
  S: 'Social',
  E: 'Enterprising',
  C: 'Conventional',
}

type RiasecEntry = {
  id: string
  letters: RiasecLetter[]
  name: string
  type: '1-huruf' | '2-huruf' | '3-huruf'
}

function generateData(): RiasecEntry[] {
  const entries: RiasecEntry[] = []
  let idCounter = 1

  const fmt = (n: number) => `#${String(n).padStart(3, '0')}`

  for (const l of LETTERS) {
    entries.push({
      id: fmt(idCounter++),
      letters: [l],
      name: LETTER_NAMES[l],
      type: '1-huruf',
    })
  }

  for (const l1 of LETTERS) {
    for (const l2 of LETTERS) {
      if (l1 === l2) continue
      entries.push({
        id: fmt(idCounter++),
        letters: [l1, l2],
        name: `${LETTER_NAMES[l1]} - ${LETTER_NAMES[l2]}`,
        type: '2-huruf',
      })
    }
  }

  for (const l1 of LETTERS) {
    for (const l2 of LETTERS) {
      if (l1 === l2) continue
      for (const l3 of LETTERS) {
        if (l3 === l1 || l3 === l2) continue
        entries.push({
          id: fmt(idCounter++),
          letters: [l1, l2, l3],
          name: `${LETTER_NAMES[l1]} - ${LETTER_NAMES[l2]} - ${LETTER_NAMES[l3]}`,
          type: '3-huruf',
        })
      }
    }
  }

  return entries
}

const ALL_DATA = generateData()

type TabKey = 'profil-kode-riasec' | 'kategori-tes-lain'
type FilterKey = 'semua' | '1-huruf' | '2-huruf' | '3-huruf'

const FILTER_LABELS: Record<FilterKey, string> = {
  'semua': 'Semua',
  '1-huruf': '1 Huruf',
  '2-huruf': '2 Huruf',
  '3-huruf': '3 Huruf',
}

function RiasecBadge({ letter, size = 48 }: { letter: RiasecLetter; size?: number }) {
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <Image
        src={`/images/riasec/${letter}.svg`}
        alt={LETTER_NAMES[letter]}
        fill
        className="object-contain"
        unoptimized
      />
    </div>
  )
}

function RiasecCard({ entry }: { entry: RiasecEntry }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-1.5">
          {entry.letters.map((l, i) => (
            <RiasecBadge key={i} letter={l} size={entry.letters.length === 3 ? 40 : 48} />
          ))}
        </div>
        <span className="text-xs text-gray-400 font-medium shrink-0 mt-1">ID {entry.id}</span>
      </div>
      <div className="flex items-end justify-between gap-2">
        <p className="text-sm font-medium text-gray-700 leading-snug">{entry.name}</p>
        <button className="shrink-0 bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap">
          Lihat detail
        </button>
      </div>
    </div>
  )
}

export default function MasterDataPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('profil-kode-riasec')
  const [activeFilter, setActiveFilter] = useState<FilterKey>('semua')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')

  const filterCounts: Record<FilterKey, number> = {
    'semua': ALL_DATA.length,
    '1-huruf': ALL_DATA.filter(d => d.type === '1-huruf').length,
    '2-huruf': ALL_DATA.filter(d => d.type === '2-huruf').length,
    '3-huruf': ALL_DATA.filter(d => d.type === '3-huruf').length,
  }

  const filtered = useMemo(() => {
    let data = ALL_DATA
    if (activeFilter !== 'semua') {
      data = data.filter(d => d.type === activeFilter)
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      data = data.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.letters.join('').toLowerCase().includes(q) ||
        d.id.toLowerCase().includes(q),
      )
    }
    return data
  }, [activeFilter, search])

  const handleSearch = () => setSearch(searchInput)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Master Data Profil Kode RIASEC</h1>
          <p className="text-sm text-gray-500 mt-1">
            Menyajikan {ALL_DATA.length} profil kode RIASEC yang terdiri dari kombinasi 1 hingga 3 huruf.
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Ketikkan kode RIASEC"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              className="pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-lg w-56 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={handleSearch}
            className="bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Cari
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-0">
          {([
            { key: 'profil-kode-riasec', label: 'Profil Kode RIASEC' },
            { key: 'kategori-tes-lain', label: 'Kategori Tes Lain' },
          ] as const).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={cn(
                'px-4 py-3 text-sm font-semibold border-b-2 transition-colors',
                activeTab === tab.key
                  ? 'border-[#1D4ED8] text-[#1D4ED8]'
                  : 'border-transparent text-gray-500 hover:text-gray-700',
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'profil-kode-riasec' ? (
        <>
          {/* Filter chips */}
          <div className="flex flex-wrap gap-2">
            {(Object.keys(FILTER_LABELS) as FilterKey[]).map(key => (
              <button
                key={key}
                onClick={() => setActiveFilter(key)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
                  activeFilter === key
                    ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400',
                )}
              >
                {FILTER_LABELS[key]}
                <span
                  className={cn(
                    'text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[22px] text-center',
                    activeFilter === key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500',
                  )}
                >
                  {filterCounts[key]}
                </span>
              </button>
            ))}
          </div>

          {/* Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg font-medium">Tidak ada data ditemukan</p>
              <p className="text-sm mt-1">Coba ubah pencarian atau filter</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map(entry => (
                <RiasecCard key={entry.id} entry={entry} />
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 text-gray-400">
          <p className="text-lg font-medium">Kategori Tes Lain</p>
          <p className="text-sm mt-1">Belum ada data yang tersedia</p>
        </div>
      )}
    </div>
  )
}
