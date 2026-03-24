'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, ChevronDown, ChevronUp, Plus, X, Trash2, Loader2 } from 'lucide-react'
import { getRiasecProfile } from '@/data/riasec-dummy'
import authApi from '@/lib/authApi'

type ApiItem = { id: string; title: string; description: string }
type SectionKey = 'kekuatanProfil' | 'tantanganProfil' | 'strategiPengembangan' | 'gayaInteraksi' | 'lingkunganKerjaIdeal'

const SECTIONS: Array<{
  key: SectionKey
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

/* ── Add Item Modal ────────────────────────────────────── */
function AddItemModal({
  open,
  sectionLabel,
  onClose,
  onSave,
}: {
  open: boolean
  sectionLabel: string
  onClose: () => void
  onSave: (title: string, description: string) => Promise<void>
}) {
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) { setTitle(''); setDesc(''); setError('') }
  }, [open])

  const handleSave = async () => {
    if (!title.trim()) { setError('Judul wajib diisi'); return }
    setSaving(true)
    setError('')
    try {
      await onSave(title.trim(), desc.trim())
      onClose()
    } catch (e: any) {
      setError(e?.response?.data?.error ?? e?.message ?? 'Gagal menyimpan item')
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#e2e4e9]">
          <h3 className="font-semibold text-[#14181f]">Tambah Item — {sectionLabel}</h3>
          <button onClick={onClose} className="text-[#676f7e] hover:text-[#14181f] transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="p-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-medium text-[#676f7e] mb-1.5">Judul <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="Masukkan judul item"
              className="w-full border border-[#d3d4d4] rounded-xl px-3 py-2 text-sm text-[#14181f] focus:outline-none focus:ring-2 focus:ring-[#0046cc] focus:border-transparent"
              onKeyDown={e => e.key === 'Enter' && !saving && handleSave()}
              autoFocus
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-[#676f7e] mb-1.5">Deskripsi</label>
            <textarea
              value={desc}
              onChange={e => setDesc(e.target.value)}
              placeholder="Masukkan deskripsi item (opsional)"
              rows={4}
              className="w-full border border-[#d3d4d4] rounded-xl px-3 py-2 text-sm text-[#14181f] focus:outline-none focus:ring-2 focus:ring-[#0046cc] focus:border-transparent resize-none"
            />
          </div>
          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
        <div className="flex gap-3 px-5 py-4 border-t border-[#e2e4e9]">
          <button
            onClick={onClose}
            disabled={saving}
            className="flex-1 border border-[#d3d4d4] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#374151] hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 bg-[#0046cc] text-white rounded-xl px-4 py-2.5 text-sm font-semibold hover:bg-[#003ab0] transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            Simpan
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Section Accordion ────────────────────────────────── */
function SectionAccordion({
  section,
  code,
  items,
  onItemAdded,
  onItemDeleted,
}: {
  section: typeof SECTIONS[number]
  code: string
  items: ApiItem[]
  onItemAdded: (sectionKey: SectionKey, item: ApiItem) => void
  onItemDeleted: (sectionKey: SectionKey, id: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const handleAddItem = async (title: string, description: string) => {
    const res = await authApi.post(
      `/api/v1/admin/kenali-diri/riasec/${code}/${section.key}/items`,
      { title, description },
    )
    onItemAdded(section.key, res.data as ApiItem)
  }

  const handleDeleteItem = async (id: string) => {
    setDeletingId(id)
    try {
      await authApi.delete(`/api/v1/admin/kenali-diri/riasec/${code}/${section.key}/items/${id}`)
      onItemDeleted(section.key, id)
    } catch (e) {
      console.error('Gagal menghapus item', e)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <>
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
              {items.length === 0 && (
                <p className="text-sm text-[#676f7e] text-center py-4">Belum ada item. Klik &quot;Tambah Item&quot; untuk menambahkan.</p>
              )}
              {items.map(item => (
                <div key={item.id} className="border border-[#e2e4e9] rounded-xl p-4 flex items-start gap-3 group">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-[#14181f] mb-1">{item.title}</p>
                    <p className="text-sm text-[#676f7e] leading-relaxed">{item.description}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    disabled={deletingId === item.id}
                    title="Hapus item"
                    className="shrink-0 text-[#d3d4d4] hover:text-red-500 transition-colors disabled:opacity-40 mt-0.5"
                  >
                    {deletingId === item.id
                      ? <Loader2 className="w-4 h-4 animate-spin" />
                      : <Trash2 className="w-4 h-4" />}
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-center py-3 px-4 border-t border-[#e2e4e9]">
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="flex items-center gap-2 px-8 py-3 bg-[#d3d4d4] hover:bg-[#bbbcbc] transition-colors rounded-xl text-sm font-semibold text-[#212729]"
              >
                <Plus className="w-5 h-5" />
                Tambah Item
              </button>
            </div>
          </div>
        )}
      </div>

      <AddItemModal
        open={modalOpen}
        sectionLabel={section.label}
        onClose={() => setModalOpen(false)}
        onSave={handleAddItem}
      />
    </>
  )
}

/* ── Main Page ────────────────────────────────────────── */
export default function MasterDataDetailPage({ code }: { code: string }) {
  const router = useRouter()
  const profile = getRiasecProfile(code)

  const [sectionItems, setSectionItems] = useState<Record<SectionKey, ApiItem[]> | null>(null)
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState('')

  const fetchItems = useCallback(async () => {
    setLoading(true)
    setApiError('')
    try {
      const res = await authApi.get(`/api/v1/admin/kenali-diri/riasec/${code.toUpperCase()}`)
      setSectionItems(res.data as Record<SectionKey, ApiItem[]>)
    } catch (e: any) {
      setApiError('Gagal memuat data dari server. Menampilkan data lokal.')
      if (profile) {
        const local: Record<SectionKey, ApiItem[]> = {} as any
        for (const key of ['kekuatanProfil', 'tantanganProfil', 'strategiPengembangan', 'gayaInteraksi', 'lingkunganKerjaIdeal'] as SectionKey[]) {
          local[key] = (profile[key] as any[]).map((item, i) => ({ id: String(i), ...item }))
        }
        setSectionItems(local)
      }
    } finally {
      setLoading(false)
    }
  }, [code, profile])

  useEffect(() => { fetchItems() }, [fetchItems])

  const handleItemAdded = (sectionKey: SectionKey, item: ApiItem) => {
    setSectionItems(prev => prev ? { ...prev, [sectionKey]: [...prev[sectionKey], item] } : prev)
  }

  const handleItemDeleted = (sectionKey: SectionKey, id: string) => {
    setSectionItems(prev => prev ? { ...prev, [sectionKey]: prev[sectionKey].filter(i => i.id !== id) } : prev)
  }

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
      <div className="bg-white border-b border-[#b5b7b8] px-6 h-[64px] flex items-center justify-between shadow-sm sticky top-0 z-20">
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

      <div className="max-w-[1188px] w-full mx-auto px-6 py-8 flex flex-col gap-5">
        {apiError && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-xs text-amber-700">{apiError}</div>
        )}

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
            <div>
              <label className="block text-xs text-[#676f7e] mb-1.5">Deskripsi / Tentang Kode</label>
              <div className="border border-[#e2e4e9] rounded-xl p-4 text-sm text-[#14181f] leading-relaxed min-h-[180px]">
                {profile.description}
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12 gap-2 text-[#676f7e]">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm">Memuat data...</span>
          </div>
        ) : (
          SECTIONS.map(section => (
            <SectionAccordion
              key={section.key}
              section={section}
              code={code.toUpperCase()}
              items={sectionItems?.[section.key] ?? []}
              onItemAdded={handleItemAdded}
              onItemDeleted={handleItemDeleted}
            />
          ))
        )}
      </div>
    </div>
  )
}
