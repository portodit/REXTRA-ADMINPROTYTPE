'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronDown, ChevronUp, Plus } from 'lucide-react'
import { getRiasecProfile, ProfileItem } from '@/data/riasec-dummy'

const SECTIONS: Array<{
  key: 'kekuatanProfil' | 'tantanganProfil' | 'strategiPengembangan' | 'gayaInteraksi' | 'lingkunganKerjaIdeal'
  label: string
  iconBg: string
  badgeBg: string
  badgeText: string
  iconEl: React.ReactNode
}> = [
  {
    key: 'kekuatanProfil',
    label: 'Kekuatan Profil',
    iconBg: 'bg-[#d0eddb]',
    badgeBg: 'bg-[#d0eddb]',
    badgeText: 'text-[#16a34a]',
    iconEl: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="8" cy="8" r="7" stroke="#16a34a" strokeWidth="1.5"/>
        <path d="M5 8l2 2 4-4" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    key: 'tantanganProfil',
    label: 'Tantangan Profil',
    iconBg: 'bg-[#fff1e3]',
    badgeBg: 'bg-[#fff1e3]',
    badgeText: 'text-[#ff7409]',
    iconEl: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M8 2L14 13H2L8 2Z" stroke="#ff7409" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M8 6v3.5" stroke="#ff7409" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="8" cy="11.5" r="0.75" fill="#ff7409"/>
      </svg>
    ),
  },
  {
    key: 'strategiPengembangan',
    label: 'Strategi Pengembangan Diri',
    iconBg: 'bg-[#ccddff]',
    badgeBg: 'bg-[#ccddff]',
    badgeText: 'text-[#2563eb]',
    iconEl: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="8" cy="5.5" r="3" stroke="#2563eb" strokeWidth="1.5"/>
        <path d="M6.5 9.5L8 14L9.5 9.5" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  {
    key: 'gayaInteraksi',
    label: 'Gaya Interaksi & Kolaborasi',
    iconBg: 'bg-[#e0f2fe]',
    badgeBg: 'bg-[#d3d4d4]',
    badgeText: 'text-[#374151]',
    iconEl: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <circle cx="5.5" cy="5" r="2.5" stroke="#0284c7" strokeWidth="1.5"/>
        <circle cx="10.5" cy="5" r="2" stroke="#0284c7" strokeWidth="1.5"/>
        <path d="M1 13c0-2.5 1.8-4 4.5-4s4.5 1.5 4.5 4" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M10.5 9.5c1.8 0 3.5 1 3.5 3.5" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  {
    key: 'lingkunganKerjaIdeal',
    label: 'Lingkungan Kerja Ideal',
    iconBg: 'bg-[#f1f5f9]',
    badgeBg: 'bg-[#d3d4d4]',
    badgeText: 'text-[#374151]',
    iconEl: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
        <path d="M2 14V7l6-5 6 5v7H2Z" stroke="#475569" strokeWidth="1.5" strokeLinejoin="round"/>
        <rect x="5.5" y="9" width="2" height="5" rx="0.5" stroke="#475569" strokeWidth="1.5"/>
        <rect x="8.5" y="9" width="2" height="3" rx="0.5" stroke="#475569" strokeWidth="1.5"/>
      </svg>
    ),
  },
]

function SectionAccordion({
  section,
  items,
}: {
  section: typeof SECTIONS[number]
  items: ProfileItem[]
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="bg-white border border-[#d3d4d4] rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-3 px-4 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${section.iconBg}`}>
          {section.iconEl}
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-sm font-medium text-[#14181f]">{section.label}</span>
          <span className={`inline-flex items-center justify-center w-6 h-5 rounded-full text-xs font-medium ${section.badgeBg} ${section.badgeText}`}>
            {items.length}
          </span>
        </div>
        {open
          ? <ChevronUp className="w-4 h-4 text-[#676f7e] shrink-0" />
          : <ChevronDown className="w-4 h-4 text-[#676f7e] shrink-0" />}
      </button>

      {open && (
        <div className="border-t border-[#e2e4e9]">
          <div className="p-4 flex flex-col gap-3">
            {items.map((item, idx) => (
              <div key={idx} className="border border-[#e2e4e9] rounded-xl p-4">
                <p className="text-sm font-semibold text-[#14181f] mb-1">{item.title}</p>
                <p className="text-sm text-[#676f7e] leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="flex justify-center py-3 px-4 border-t border-[#e2e4e9]">
            <button
              type="button"
              className="flex items-center gap-2 px-8 py-3 bg-[#d3d4d4] hover:bg-[#bbbcbc] transition-colors rounded-xl text-sm font-semibold text-[#212729]"
            >
              <Plus className="w-5 h-5" />
              Tambah Item
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function MasterDataDetailPage({ code }: { code: string }) {
  const router = useRouter()
  const profile = getRiasecProfile(code)

  if (!profile) {
    return (
      <div className="-m-4 md:-m-6 flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-[#676f7e]">Profil RIASEC &quot;{code}&quot; tidak ditemukan.</p>
        <button
          onClick={() => router.push('/kenali-diri/master-data')}
          className="text-sm text-[#0046cc] hover:underline"
        >
          ← Kembali ke Master Data
        </button>
      </div>
    )
  }

  return (
    <div className="-m-4 md:-m-6 flex flex-col bg-[#f8f9fb] min-h-screen">
      {/* Sub-header: Kembali + Preview */}
      <div className="bg-white border-b border-[#b5b7b8] px-6 py-0 h-[64px] flex items-center justify-between shadow-sm sticky top-0 z-20">
        <button
          onClick={() => router.push('/kenali-diri/master-data')}
          className="flex items-center gap-1.5 text-sm text-[#14181f] hover:text-[#0046cc] transition-colors rounded-lg px-2 py-1.5 -ml-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali
        </button>
        <button
          onClick={() => router.push(`/kenali-diri/master-data/${profile.code}`)}
          className="bg-[#0046cc] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#003ab0] transition-colors shadow-sm"
        >
          Preview
        </button>
      </div>

      {/* Content */}
      <div className="max-w-[1188px] w-full mx-auto px-6 py-8 flex flex-col gap-5">
        {/* Informasi Dasar card */}
        <div className="bg-white border border-[#d3d4d4] rounded-xl overflow-hidden">
          <div className="bg-[#669aff] h-[65px] flex items-center gap-3 px-4">
            <div className="w-8 h-8 bg-white rounded-xl flex items-center justify-center shrink-0">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <rect x="1" y="2" width="14" height="12" rx="2" stroke="#669aff" strokeWidth="1.5"/>
                <path d="M4 6h8M4 9h5" stroke="#669aff" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
            </div>
            <span className="text-sm font-semibold text-white">Informasi Dasar</span>
          </div>

          <div className="p-4 flex flex-col gap-5">
            {/* Kode + Judul row */}
            <div className="flex gap-4">
              <div className="w-[200px] shrink-0">
                <label className="block text-xs text-[#676f7e] mb-1.5">Kode</label>
                <div className="border border-[#6b6f70] opacity-50 rounded-xl px-3 h-9 flex items-center text-sm text-[#14181f] bg-gray-50 select-none">
                  {profile.code}
                </div>
              </div>
              <div className="flex-1">
                <label className="block text-xs text-[#676f7e] mb-1.5">Judul</label>
                <div className="border border-[#6b6f70] rounded-xl px-3 h-9 flex items-center text-sm text-[#14181f]">
                  {profile.name} ({profile.code})
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs text-[#676f7e] mb-1.5">Deskripsi / Tentang Kode</label>
              <div className="border border-[#e2e4e9] rounded-xl p-4 text-sm text-[#14181f] leading-relaxed min-h-[180px] whitespace-pre-wrap">
                {profile.description}
              </div>
            </div>
          </div>
        </div>

        {/* Collapsible sections */}
        {SECTIONS.map(section => (
          <SectionAccordion
            key={section.key}
            section={section}
            items={profile[section.key] as ProfileItem[]}
          />
        ))}
      </div>
    </div>
  )
}
