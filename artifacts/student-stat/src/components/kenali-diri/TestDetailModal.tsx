'use client'

import * as React from 'react'
import { Sheet, SheetContent } from '@/components/ui/sheet'
import { X, Heart, Star, Globe, DollarSign, Check, Circle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatusBadge } from '@/components/shared/badges/StatusBadge'

/* ── Types ──────────────────────────────────────────────── */
export interface TestDetailData {
  id: string
  userName: string
  startTime: string
  endTime: string
  status: 'Selesai' | 'Sedang Berjalan' | 'Dihentikan'
  result: string
}

interface TestDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  testData?: TestDetailData
}

/* ── Dummy RIASEC scores (will replace with real data later) */
const riasecData = [
  { type: 'Realistic',     letter: 'R', score: 40 },
  { type: 'Investigative', letter: 'I', score: 50 },
  { type: 'Artistic',      letter: 'A', score: 60 },
  { type: 'Social',        letter: 'S', score: 85 },
  { type: 'Enterprising',  letter: 'E', score: 80 },
  { type: 'Conventional',  letter: 'C', score: 75 },
]

const ikigaiData = [
  { icon: Heart,  color: 'text-rose-500',    bg: 'bg-rose-50',    border: 'border-rose-200',    title: 'Love (Minat)',           desc: 'Kamu paling antusias saat membuat sesuatu yang visual dan interaktif, terutama desain produk digital.' },
  { icon: Star,   color: 'text-amber-500',   bg: 'bg-amber-50',   border: 'border-amber-200',   title: 'Good At (Keahlian)',      desc: 'Kekuatan utamamu ada pada analisis informasi teknis dan menerjemahkannya menjadi konsep visual.' },
  { icon: Globe,  color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200', title: 'Needs (Kebutuhan Pasar)', desc: 'Industri butuh jembatan antara coding yang rumit dengan tampilan UI yang ramah pengguna.' },
  { icon: DollarSign, color: 'text-blue-500', bg: 'bg-blue-50',   border: 'border-blue-200',    title: 'Paid (Nilai Ekonomi)',    desc: 'Skill prototyping dan logika teknismu punya bayaran tinggi di sektor Tech Startup.' },
]

const recommendationData = [
  { rank: 1, title: 'UI/UX Designer',      matchPercent: 94, isSelected: true,  desc: 'Profesi ini mengakomodasi minat Artistic (Desain) dan Investigative (Riset User), serta sangat dibutuhkan di pasar saat ini.' },
  { rank: 2, title: 'Frontend Developer',  matchPercent: 88, isSelected: false, desc: 'Cocok dengan sisi Realistic (Coding) dan Investigative, namun aspek Love sedikit lebih rendah dibandingkan UI/UX.' },
]

/* ── Info row ────────────────────────────────────────────── */
function InfoRow({ icon, label, children, last }: { icon: React.ReactNode; label: string; children: React.ReactNode; last?: boolean }) {
  return (
    <div className={cn('flex items-center py-3 gap-3 sm:gap-4', !last && 'border-b border-[#e9eaec]')}>
      <div className="flex items-center gap-2 w-[130px] sm:w-[160px] shrink-0 text-[#676f7e]">
        <span className="shrink-0">{icon}</span>
        <span className="text-xs sm:text-sm leading-snug">{label}</span>
      </div>
      <div className="flex-1 text-xs sm:text-sm font-medium text-[#14181f] min-w-0">{children}</div>
    </div>
  )
}

/* ── Rank badge ──────────────────────────────────────────── */
function RankBadge({ rank }: { rank: number }) {
  if (rank === 1) return <span className="inline-flex items-center justify-center w-8 h-6 rounded-md bg-[#ff7409] text-white text-xs font-bold">#{rank}</span>
  if (rank === 2) return <span className="inline-flex items-center justify-center w-8 h-6 rounded-md bg-[#d3d4d4] text-[#374151] text-xs font-bold">#{rank}</span>
  if (rank === 3) return <span className="inline-flex items-center justify-center w-8 h-6 rounded-md bg-[#ffb347] text-white text-xs font-bold">#{rank}</span>
  return <span className="inline-flex items-center justify-center w-8 h-6 rounded-md border border-[#d3d4d4] text-[#676f7e] text-xs font-medium">#{rank}</span>
}

/* ── Computed RIASEC with rank ───────────────────────────── */
function getRankedRiasec() {
  return [...riasecData]
    .map(item => ({ ...item }))
    .sort((a, b) => b.score - a.score)
    .map((item, i) => ({ ...item, rank: i + 1 }))
    .sort((a, b) => riasecData.findIndex(r => r.type === a.type) - riasecData.findIndex(r => r.type === b.type))
}

/* ── RIASEC Tab Content ──────────────────────────────────── */
function RiasecTab() {
  const ranked = getRankedRiasec()
  const maxScore = Math.max(...ranked.map(r => r.score))

  return (
    <div className="space-y-4">
      {/* Penilaian RIASEC */}
      <div className="border border-[#e2e4e9] rounded-xl overflow-hidden">
        <div className="px-5 pt-5 pb-4">
          <h4 className="text-sm font-semibold text-[#14181f] mb-1">Penilaian RIASEC</h4>
          <p className="text-sm text-[#676f7e]">Menampilkan skor dan peringkat tiap tipe kepribadian RIASEC.</p>
        </div>
        <div className="overflow-x-auto">
        <table className="w-full min-w-[360px]">
          <thead>
            <tr className="bg-[#0046cc] text-white">
              <th className="px-5 py-3 text-left text-sm font-semibold">Tipe Kepribadian</th>
              <th className="px-5 py-3 text-center text-sm font-semibold">Nilai Skor</th>
              <th className="px-5 py-3 text-center text-sm font-semibold">Rank</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((item, i) => (
              <tr key={item.type} className={cn('border-t border-[#e2e4e9]', i % 2 === 1 && 'bg-[#f8f9fb]')}>
                <td className="px-5 py-3 text-sm text-[#14181f]">{item.type}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-20 h-2 bg-[#e9eaec] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#0046cc] rounded-full"
                        style={{ width: `${(item.score / maxScore) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-[#14181f] w-6 text-right">{item.score}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-center">
                  <RankBadge rank={item.rank} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {/* Classification Type */}
      <div className="border border-[#e2e4e9] rounded-xl p-5">
        <h4 className="text-sm font-semibold text-[#14181f] mb-1">Classification Type</h4>
        <p className="text-sm text-[#676f7e] mb-4">Klasifikasi tipe kepribadian berdasarkan dominasi skor RIASEC.</p>
        <div className="bg-[#dbe9ff] border border-[#669aff] rounded-xl p-4 flex items-start gap-3">
          <div className="shrink-0 w-10 h-10 bg-[#0046cc] rounded-xl flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
              <circle cx="7" cy="6" r="3" stroke="white" strokeWidth="1.5"/>
              <circle cx="13.5" cy="6.5" r="2.5" stroke="white" strokeWidth="1.5"/>
              <path d="M1.5 16.5c0-3 2.5-5 5.5-5s5.5 2 5.5 5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M13.5 12c2.5 0 5 1.5 5 4.5" stroke="white" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold text-[#0046cc]">Triple</p>
            <p className="text-sm text-[#374151] mt-0.5 leading-relaxed">Anda memiliki profil Kompleks (Triple), yang berarti fleksibilitas tinggi dalam peran teknis, analitis, dan kreatif.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── IKIGAI Tab Content ──────────────────────────────────── */
function IkigaiTab() {
  return (
    <div className="border border-[#e2e4e9] rounded-xl p-5">
      <h4 className="text-sm font-semibold text-[#14181f] mb-1">Hasil Analisis IKIGAI</h4>
      <p className="text-sm text-[#676f7e] mb-4">Menampilkan soft skill dan preferensi pribadi pengguna berdasarkan tes IKIGAI yang mencakup empat aspek utama.</p>
      <div className="grid grid-cols-1 gap-3">
        {ikigaiData.map(item => (
          <div key={item.title} className={cn('p-4 rounded-xl border flex items-start gap-3', item.bg, item.border)}>
            <div className="p-2 rounded-lg bg-white/70 shrink-0">
              <item.icon className={cn('h-5 w-5', item.color)} />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#14181f]">{item.title}</p>
              <p className="text-sm text-[#676f7e] mt-0.5 leading-relaxed">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Rekomendasi Tab Content ─────────────────────────────── */
function RekomendasiTab() {
  return (
    <div className="border border-[#e2e4e9] rounded-xl p-5">
      <h4 className="text-sm font-semibold text-[#14181f] mb-1">Rekomendasi Karier</h4>
      <p className="text-sm text-[#676f7e] mb-4">Dua rekomendasi profesi yang didasarkan pada hasil tes RIASEC dan IKIGAI pengguna.</p>
      <div className="space-y-3">
        {recommendationData.map(rec => (
          <div key={rec.rank} className={cn('p-5 rounded-xl border-2', rec.isSelected ? 'border-[#16a34a] bg-white' : 'border-[#e2e4e9] bg-white')}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-base font-bold text-[#14181f]">{rec.title}</span>
              <span className={cn('inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border', rec.rank === 1 ? 'bg-[#e3ffee] border-[#16a34a] text-[#16a34a]' : 'bg-[#f8f9fb] border-[#d3d4d4] text-[#676f7e]')}>
                {rec.matchPercent}% Match
              </span>
              {rec.rank === 1 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-[#fff1e3] border border-[#ff7409] text-[#ff7409]">
                  Best Match
                </span>
              )}
            </div>
            <p className="text-sm text-[#676f7e] leading-relaxed">{rec.desc}</p>
            <div className="mt-3 pt-3 border-t border-[#e2e4e9]">
              {rec.isSelected ? (
                <div className="flex items-center gap-2 text-[#16a34a]">
                  <Check className="h-4 w-4" />
                  <span className="text-sm font-medium">Dipilih sebagai Rencana Karier</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-[#676f7e]">
                  <Circle className="h-4 w-4" />
                  <span className="text-sm">Tidak Dipilih</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── Icons (Figma-matching SVG icons) ───────────────────── */
const IconHash = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M3 6.75h12M3 11.25h12M7.5 2.25L6 15.75M12 2.25L10.5 15.75" stroke="#676f7e" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
)
const IconUser = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="6" r="3.25" stroke="#676f7e" strokeWidth="1.4"/>
    <path d="M2.25 15.75c0-3.728 3.02-6.75 6.75-6.75s6.75 3.022 6.75 6.75" stroke="#676f7e" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
)
const IconClock = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <circle cx="9" cy="9" r="7" stroke="#676f7e" strokeWidth="1.4"/>
    <path d="M9 5.25V9l2.25 2.25" stroke="#676f7e" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const IconTask = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <rect x="2.25" y="2.25" width="13.5" height="13.5" rx="2.5" stroke="#676f7e" strokeWidth="1.4"/>
    <path d="M6 9l2 2 4-4" stroke="#676f7e" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)
const IconDoc = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M10.5 2.25H5.25A1.5 1.5 0 003.75 3.75v10.5a1.5 1.5 0 001.5 1.5h7.5a1.5 1.5 0 001.5-1.5V6L10.5 2.25z" stroke="#676f7e" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.5 2.25V6h3.75M6.75 9.75h4.5M6.75 12.75h3" stroke="#676f7e" strokeWidth="1.4" strokeLinecap="round"/>
  </svg>
)

/* ── Main Modal ──────────────────────────────────────────── */
type TabKey = 'riasec' | 'ikigai' | 'rekomendasi'
const TABS: { key: TabKey; label: string }[] = [
  { key: 'riasec',      label: 'RIASEC' },
  { key: 'ikigai',      label: 'IKIGAI' },
  { key: 'rekomendasi', label: 'Rekomendasi' },
]

export function TestDetailModal({ open, onOpenChange, testData }: TestDetailModalProps) {
  const [activeTab, setActiveTab] = React.useState<TabKey>('riasec')
  const data: TestDetailData = testData ?? {
    id: 'KD-001',
    userName: 'Natasya Juliana',
    startTime: '10.00 WIB 2025-11-12',
    endTime: '10.00 WIB 2025-11-12',
    status: 'Selesai',
    result: 'Profil Kode SEC',
  }

  React.useEffect(() => {
    if (open) setActiveTab('riasec')
  }, [open])

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[560px] p-0 overflow-hidden flex flex-col bg-white [&>button:last-child]:!hidden"
        style={{ outline: 'none' }}
      >
        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-6 pb-5 border-b border-[#e2e4e9] shrink-0">
          <div>
            <h2 className="text-xl font-bold text-[#14181f]">Detail Hasil Tes Profil Karier</h2>
            <p className="text-sm text-[#676f7e] mt-1">Menampilkan data hasil tes profil karier pangguna</p>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="text-[#676f7e] hover:text-[#14181f] transition-colors shrink-0 ml-4 mt-0.5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Informasi Umum */}
          <div>
            <h3 className="text-base font-semibold text-[#14181f] mb-3">Informasi Umum</h3>
            <div className="border border-[#e2e4e9] rounded-xl px-5 divide-y divide-[#e2e4e9]">
              <InfoRow icon={<IconHash />} label="ID Tes">
                <span className="font-semibold">{data.id}</span>
              </InfoRow>
              <InfoRow icon={<IconUser />} label="Nama Pengguna">
                <span className="font-semibold">{data.userName}</span>
              </InfoRow>
              <InfoRow icon={<IconClock />} label="Waktu Mulai">
                {data.startTime}
              </InfoRow>
              <InfoRow icon={<IconClock />} label="Waktu Selesai">
                {data.endTime}
              </InfoRow>
              <InfoRow icon={<IconTask />} label="Status Tes">
                <StatusBadge value={data.status} />
              </InfoRow>
              <InfoRow icon={<IconDoc />} label="Hasil Tes" last>
                <span className="text-[#0046cc] font-semibold">{data.result}</span>
              </InfoRow>
            </div>
          </div>

          {/* Detail Hasil Tes */}
          <div>
            <h3 className="text-base font-semibold text-[#14181f] mb-3">Detail Hasil Tes</h3>

            {/* Tab bar */}
            <div className="flex items-end gap-6 border-b border-[#e2e4e9] mb-5">
              {TABS.map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={cn(
                    'pb-3 text-base font-medium border-b-2 transition-colors',
                    activeTab === tab.key
                      ? 'border-[#0046cc] text-[#212729]'
                      : 'border-transparent text-[#808080] hover:text-[#374151]',
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeTab === 'riasec'      && <RiasecTab />}
            {activeTab === 'ikigai'      && <IkigaiTab />}
            {activeTab === 'rekomendasi' && <RekomendasiTab />}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
