'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronLeft } from 'lucide-react'
import { getRiasecProfile, ProfileItem, RiasecLetter, LETTER_NAMES } from '@/data/riasec-dummy'

/* ── Icon helpers ─────────────────────────────────────── */
function CheckIcon({ variant = 'default' }: { variant?: 'default' | 'warning' | 'idea' | 'people' | 'building' }) {
  if (variant === 'warning') {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 mt-0.5" aria-hidden>
        <path d="M10 2.5L17.5 16.25H2.5L10 2.5Z" stroke="#ff7409" strokeWidth="1.5" strokeLinejoin="round"/>
        <path d="M10 8v4" stroke="#ff7409" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="10" cy="13.75" r="0.75" fill="#ff7409"/>
      </svg>
    )
  }
  if (variant === 'idea') {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 mt-0.5" aria-hidden>
        <circle cx="10" cy="7.5" r="4" stroke="#2563eb" strokeWidth="1.5"/>
        <path d="M8 12.5L10 17.5L12 12.5" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    )
  }
  if (variant === 'people') {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 mt-0.5" aria-hidden>
        <circle cx="7" cy="6" r="3" stroke="#0284c7" strokeWidth="1.5"/>
        <circle cx="13.5" cy="6.5" r="2.5" stroke="#0284c7" strokeWidth="1.5"/>
        <path d="M1.5 16.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round"/>
        <path d="M13.5 12c2.5 0 5 1.5 5 4.5" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    )
  }
  if (variant === 'building') {
    return (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 mt-0.5" aria-hidden>
        <path d="M2.5 17.5V9L10 3l7.5 6v8.5H2.5Z" stroke="#475569" strokeWidth="1.5" strokeLinejoin="round"/>
        <rect x="7" y="11" width="2.5" height="6.5" rx="0.5" stroke="#475569" strokeWidth="1.5"/>
        <rect x="10.5" y="11" width="2.5" height="4" rx="0.5" stroke="#475569" strokeWidth="1.5"/>
      </svg>
    )
  }
  // default: green circle check
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0 mt-0.5" aria-hidden>
      <circle cx="10" cy="10" r="9" stroke="#16a34a" strokeWidth="1.5"/>
      <path d="M6.5 10l2.5 2.5 5-5" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

/* ── Section card item ────────────────────────────────── */
function SectionItem({ item, iconVariant }: { item: ProfileItem; iconVariant?: 'default' | 'warning' | 'idea' | 'people' | 'building' }) {
  return (
    <div className="flex items-start gap-3">
      <CheckIcon variant={iconVariant} />
      <div className="flex flex-col gap-1 flex-1 min-w-0">
        <p className="text-base font-semibold text-[#14181f] leading-snug">{item.title}</p>
        <p className="text-sm text-[#676f7e] leading-relaxed">{item.description}</p>
      </div>
    </div>
  )
}

/* ── Section card block ───────────────────────────────── */
function SectionCard({
  title,
  subtitle,
  items,
  iconBg,
  iconEl,
  cardBg,
  borderColor,
  iconVariant,
}: {
  title: string
  subtitle?: string
  items: ProfileItem[]
  iconBg: string
  iconEl: React.ReactNode
  cardBg: string
  borderColor: string
  iconVariant?: 'default' | 'warning' | 'idea' | 'people' | 'building'
}) {
  return (
    <div className={`flex flex-col gap-3 rounded-xl border p-6 ${cardBg} ${borderColor} h-full`}>
      <div className="flex items-center gap-2">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
          {iconEl}
        </div>
        <h3 className="text-lg font-semibold text-[#212729]">{title}</h3>
      </div>
      {subtitle && <p className="text-sm text-[#676f7e]">{subtitle}</p>}
      <div className="flex flex-col gap-4 mt-1">
        {items.map((item, i) => (
          <SectionItem key={i} item={item} iconVariant={iconVariant} />
        ))}
      </div>
    </div>
  )
}

/* ── RIASEC letter icon ───────────────────────────────── */
function LetterBadge({ letter, size = 48 }: { letter: RiasecLetter; size?: number }) {
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

/* ── Section icon SVGs ────────────────────────────────── */
const KekuatanIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
    <circle cx="10" cy="10" r="9" stroke="#16a34a" strokeWidth="1.5"/>
    <path d="M6.5 10l2.5 2.5 5-5" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const TantanganIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
    <path d="M10 2.5L17.5 16.25H2.5L10 2.5Z" stroke="#ff7409" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M10 8v4" stroke="#ff7409" strokeWidth="1.5" strokeLinecap="round"/>
    <circle cx="10" cy="13.75" r="0.75" fill="#ff7409"/>
  </svg>
)
const StrategiIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
    <circle cx="10" cy="7.5" r="4" stroke="#2563eb" strokeWidth="1.5"/>
    <path d="M8 12.5L10 17.5L12 12.5" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const GayaIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
    <circle cx="7" cy="6" r="3" stroke="#0284c7" strokeWidth="1.5"/>
    <circle cx="13.5" cy="6.5" r="2.5" stroke="#0284c7" strokeWidth="1.5"/>
    <path d="M1.5 16.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round"/>
    <path d="M13.5 12c2.5 0 5 1.5 5 4.5" stroke="#0284c7" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
)
const LingkunganIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
    <path d="M2.5 17.5V9L10 3l7.5 6v8.5H2.5Z" stroke="#475569" strokeWidth="1.5" strokeLinejoin="round"/>
    <rect x="7" y="11" width="2.5" height="6.5" rx="0.5" stroke="#475569" strokeWidth="1.5"/>
    <rect x="10.5" y="11" width="2.5" height="4" rx="0.5" stroke="#475569" strokeWidth="1.5"/>
  </svg>
)

/* ── Main component ───────────────────────────────────── */
export default function MasterDataPreviewPage({ code }: { code: string }) {
  const router = useRouter()
  const profile = getRiasecProfile(code)

  if (!profile) {
    return (
      <div className="-m-4 md:-m-6 flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-[#676f7e]">Profil RIASEC &quot;{code}&quot; tidak ditemukan.</p>
        <button onClick={() => router.push('/kenali-diri/master-data')} className="text-sm text-[#0046cc] hover:underline">
          ← Kembali ke Master Data
        </button>
      </div>
    )
  }

  return (
    <div className="-m-4 md:-m-6 flex flex-col bg-[#f8f9fb] min-h-screen">
      {/* ── Nav bar ─────────────────────────────── */}
      <div className="bg-white border-b border-[#b5b7b8] px-6 h-[64px] flex items-center justify-between shadow-sm sticky top-0 z-20">
        <button
          onClick={() => router.push('/kenali-diri/master-data')}
          className="flex items-center gap-1.5 text-sm text-[#14181f] hover:text-[#0046cc] transition-colors rounded-lg px-2 py-1.5 -ml-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Kembali
        </button>
        <button
          onClick={() => router.push(`/kenali-diri/master-data/${profile.code}/edit`)}
          className="bg-[#0046cc] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#003ab0] transition-colors shadow-sm"
        >
          Edit
        </button>
      </div>

      {/* ── Info strip ──────────────────────────── */}
      <div className="bg-white border-b border-[#e2e4e9] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-[#e3ffee] border border-[#16a34a] rounded-md px-2.5 py-1">
            <span className="text-xs font-semibold text-[#16a34a]">Preview</span>
            <div className="w-2 h-2 rounded-full bg-[#16a34a]" />
          </div>
          <span className="text-xs text-[#676f7e]">Lihat hasil tampilan</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            {profile.letters.map((l, i) => (
              <LetterBadge key={i} letter={l} size={profile.letters.length === 3 ? 36 : 44} />
            ))}
          </div>
          <div className="flex flex-col">
            <span className="text-xs text-[#676f7e]">ID {profile.id}</span>
            <span className="text-base font-semibold text-[#14181f]">{profile.name}</span>
          </div>
        </div>
      </div>

      {/* ── Content ─────────────────────────────── */}
      <div className="max-w-[1190px] w-full mx-auto px-6 py-8 flex flex-col gap-6">

        {/* Tentang Kode */}
        <div className="bg-gradient-to-r from-[rgba(38,98,217,0.05)] via-[rgba(38,98,217,0.1)] to-[rgba(38,98,217,0.05)] rounded-xl p-6 flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <circle cx="10" cy="10" r="9" stroke="#2562d9" strokeWidth="1.5"/>
              <path d="M10 9v6" stroke="#2562d9" strokeWidth="1.5" strokeLinecap="round"/>
              <circle cx="10" cy="6.5" r="0.75" fill="#2562d9"/>
            </svg>
            <h2 className="text-lg font-semibold text-[#14181f]">Tentang Kode</h2>
          </div>
          <p className="text-sm text-[#676f7e] leading-relaxed max-w-4xl">{profile.description}</p>
        </div>

        {/* Row 1: Tantangan (left) + Kekuatan (right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SectionCard
            title="Tantangan Profil"
            subtitle="Beberapa tantangan yang perlu kamu perhatikan dalam proses pengembangan diri:"
            items={profile.tantanganProfil}
            iconBg="bg-[#fff1e3]"
            iconEl={<TantanganIcon />}
            cardBg="bg-[rgba(255,241,227,0.5)]"
            borderColor="border-[#ff7409]"
            iconVariant="warning"
          />
          <SectionCard
            title="Kekuatan Profil"
            subtitle={`Profil ${profile.code} menunjukkan keunggulan kompetitifmu di dunia kerja digital:`}
            items={profile.kekuatanProfil}
            iconBg="bg-[#d0eddb]"
            iconEl={<KekuatanIcon />}
            cardBg="bg-gradient-to-br from-[#ecfdf5] to-[#f0fdf4]"
            borderColor="border-[#a7f3d0]"
            iconVariant="default"
          />
        </div>

        {/* Row 2: Strategi (left) + Gaya Interaksi (right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SectionCard
            title="Strategi Pengembangan Diri"
            subtitle="Untuk menghadapi tantangan dan mengembangkan potensimu:"
            items={profile.strategiPengembangan}
            iconBg="bg-[#dbeafe]"
            iconEl={<StrategiIcon />}
            cardBg="bg-[rgba(204,221,255,0.25)]"
            borderColor="border-[#0046cc]"
            iconVariant="idea"
          />
          <SectionCard
            title="Gaya Interaksi & Kolaborasi"
            subtitle="Bagaimana kamu berinteraksi dan bekerja sama dengan orang lain:"
            items={profile.gayaInteraksi}
            iconBg="bg-[#e0f2fe]"
            iconEl={<GayaIcon />}
            cardBg="bg-[rgba(211,212,212,0.25)]"
            borderColor="border-[#0046cc]"
            iconVariant="people"
          />
        </div>

        {/* Row 3: Lingkungan Kerja Ideal */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SectionCard
            title="Lingkungan Kerja Ideal"
            subtitle="Kondisi kerja yang paling mendukung produktivitasmu:"
            items={profile.lingkunganKerjaIdeal}
            iconBg="bg-[#f1f5f9]"
            iconEl={<LingkunganIcon />}
            cardBg="bg-[rgba(211,212,212,0.15)]"
            borderColor="border-[#94a3b8]"
            iconVariant="building"
          />
        </div>
      </div>
    </div>
  )
}
