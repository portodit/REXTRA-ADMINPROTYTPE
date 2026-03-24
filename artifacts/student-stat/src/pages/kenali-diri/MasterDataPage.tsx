'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getAllEntries, RiasecLetter, LETTER_NAMES } from '@/data/riasec-dummy'

const ALL_DATA = getAllEntries()
const PAGE_SIZE = 30

type TabKey = 'profil-kode-riasec' | 'kategori-tes-lain'
type FilterKey = 'semua' | '1-huruf' | '2-huruf' | '3-huruf'

const FILTER_LABELS: Record<FilterKey, string> = {
  'semua': 'Semua',
  '1-huruf': '1 Huruf',
  '2-huruf': '2 Huruf',
  '3-huruf': '3 Huruf',
}

/* ── CSS letter badge (no image loading) ─────────────── */
const LETTER_COLORS: Record<RiasecLetter, { bg: string; border: string; text: string }> = {
  R: { bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-700' },
  I: { bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-700' },
  A: { bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-700' },
  S: { bg: 'bg-teal-100', border: 'border-teal-300', text: 'text-teal-700' },
  E: { bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-700' },
  C: { bg: 'bg-slate-100', border: 'border-slate-300', text: 'text-slate-700' },
}

function LetterChip({ letter, size = 'md' }: { letter: RiasecLetter; size?: 'sm' | 'md' }) {
  const c = LETTER_COLORS[letter]
  const dim = size === 'sm' ? 'w-9 h-9 text-base' : 'w-11 h-11 text-lg'
  return (
    <div className={cn('rounded-xl border-2 flex items-center justify-center font-bold shrink-0', dim, c.bg, c.border, c.text)}>
      {letter}
    </div>
  )
}

function RiasecCard({ entry }: { entry: ReturnType<typeof getAllEntries>[number] }) {
  const size = entry.letters.length === 3 ? 'sm' : 'md'
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 flex flex-col gap-3 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-1.5">
          {entry.letters.map((l, i) => <LetterChip key={i} letter={l} size={size} />)}
        </div>
        <span className="text-xs text-gray-400 font-medium shrink-0 mt-1">ID {entry.id}</span>
      </div>
      <div className="flex items-end justify-between gap-2">
        <p className="text-sm font-medium text-gray-700 leading-snug">{entry.name}</p>
        <Link
          href={`/kenali-diri/master-data/${entry.code}`}
          className="shrink-0 bg-[#1D4ED8] hover:bg-[#1e40af] text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
        >
          Lihat detail
        </Link>
      </div>
    </div>
  )
}

export default function MasterDataPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('profil-kode-riasec')
  const [activeFilter, setActiveFilter] = useState<FilterKey>('semua')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)

  const filterCounts: Record<FilterKey, number> = {
    'semua': ALL_DATA.length,
    '1-huruf': ALL_DATA.filter(d => d.type === '1-huruf').length,
    '2-huruf': ALL_DATA.filter(d => d.type === '2-huruf').length,
    '3-huruf': ALL_DATA.filter(d => d.type === '3-huruf').length,
  }

  const filtered = useMemo(() => {
    let data = ALL_DATA
    if (activeFilter !== 'semua') data = data.filter(d => d.type === activeFilter)
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

  const visibleCount = page * PAGE_SIZE
  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  const handleSearch = () => { setSearch(searchInput); setPage(1) }
  const handleFilter = (key: FilterKey) => { setActiveFilter(key); setPage(1) }

  return (
    <div className="flex flex-col gap-6">
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
          <div className="flex flex-wrap gap-2">
            {(Object.keys(FILTER_LABELS) as FilterKey[]).map(key => (
              <button
                key={key}
                onClick={() => handleFilter(key)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-all',
                  activeFilter === key
                    ? 'bg-[#1D4ED8] text-white border-[#1D4ED8]'
                    : 'bg-white text-gray-600 border-gray-300 hover:border-gray-400',
                )}
              >
                {FILTER_LABELS[key]}
                <span className={cn(
                  'text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[22px] text-center',
                  activeFilter === key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500',
                )}>
                  {filterCounts[key]}
                </span>
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-lg font-medium">Tidak ada data ditemukan</p>
              <p className="text-sm mt-1">Coba ubah pencarian atau filter</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {visible.map(entry => <RiasecCard key={entry.id} entry={entry} />)}
              </div>
              {hasMore && (
                <div className="flex flex-col items-center gap-1 pt-2">
                  <button
                    onClick={() => setPage(p => p + 1)}
                    className="bg-white border border-gray-300 hover:border-[#1D4ED8] hover:text-[#1D4ED8] text-gray-600 text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
                  >
                    Muat lebih banyak
                  </button>
                  <span className="text-xs text-gray-400">
                    Menampilkan {visible.length} dari {filtered.length} profil
                  </span>
                </div>
              )}
            </>
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
