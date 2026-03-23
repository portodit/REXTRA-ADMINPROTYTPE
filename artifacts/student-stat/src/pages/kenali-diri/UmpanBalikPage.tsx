import { useState, useMemo } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Search, Download, Eye, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MahasiswaFeedback {
  id: string
  userName: string
  kemudahanTes: number
  relevansiRekomendasi: number
  kepuasanFitur: number
  kendala: string[]
  masukan?: string
  tanggal?: string
  programStudi?: string
  angkatan?: string
}

const MAHASISWA_DATA: MahasiswaFeedback[] = [
  { id: 'MHS001', userName: 'Siti Nurhaliza', kemudahanTes: 6, relevansiRekomendasi: 5, kepuasanFitur: 6, kendala: ['Waktu loading lama', 'Tampilan kurang responsif'], masukan: 'Secara keseluruhan tes ini cukup membantu.', tanggal: '10 Des 2025', programStudi: 'Teknik Informatika', angkatan: '2021' },
  { id: 'MHS002', userName: 'Budi Santoso', kemudahanTes: 7, relevansiRekomendasi: 7, kepuasanFitur: 6, kendala: [], masukan: 'Sangat membantu!', tanggal: '09 Des 2025', programStudi: 'Manajemen', angkatan: '2022' },
  { id: 'MHS003', userName: 'Rina Wulandari', kemudahanTes: 4, relevansiRekomendasi: 3, kepuasanFitur: 4, kendala: ['Pertanyaan membingungkan', 'Hasil kurang akurat'], masukan: 'Beberapa pertanyaan kurang jelas maksudnya.', tanggal: '08 Des 2025', programStudi: 'Psikologi', angkatan: '2020' },
  { id: 'MHS004', userName: 'Andi Pratama', kemudahanTes: 5, relevansiRekomendasi: 6, kepuasanFitur: 5, kendala: ['Navigasi kurang jelas'], tanggal: '07 Des 2025', programStudi: 'Teknik Elektro', angkatan: '2021' },
  { id: 'MHS005', userName: 'Dewi Lestari', kemudahanTes: 7, relevansiRekomendasi: 6, kepuasanFitur: 7, kendala: [], masukan: 'Fitur ini sangat bermanfaat untuk mahasiswa.', tanggal: '06 Des 2025', programStudi: 'Akuntansi', angkatan: '2022' },
  { id: 'MHS006', userName: 'Ahmad Rizki', kemudahanTes: 6, relevansiRekomendasi: 5, kepuasanFitur: 6, kendala: ['Loading terlalu lama'], tanggal: '05 Des 2025', programStudi: 'Sistem Informasi', angkatan: '2021' },
  { id: 'MHS007', userName: 'Putri Handayani', kemudahanTes: 3, relevansiRekomendasi: 4, kepuasanFitur: 3, kendala: ['Error saat submit', 'Halaman tidak responsive'], masukan: 'Pengalaman kurang baik karena banyak error.', tanggal: '04 Des 2025', programStudi: 'Desain Komunikasi Visual', angkatan: '2020' },
  { id: 'MHS008', userName: 'Fajar Nugroho', kemudahanTes: 6, relevansiRekomendasi: 7, kepuasanFitur: 6, kendala: [], tanggal: '03 Des 2025', programStudi: 'Teknik Mesin', angkatan: '2021' },
  { id: 'MHS009', userName: 'Maya Sari', kemudahanTes: 5, relevansiRekomendasi: 5, kepuasanFitur: 5, kendala: ['Font terlalu kecil'], masukan: 'Ukuran font sebaiknya diperbesar.', tanggal: '02 Des 2025', programStudi: 'Ilmu Komunikasi', angkatan: '2022' },
  { id: 'MHS010', userName: 'Reza Firmansyah', kemudahanTes: 7, relevansiRekomendasi: 6, kepuasanFitur: 7, kendala: [], masukan: 'Sangat bagus! Rekomendasi profesinya akurat.', tanggal: '01 Des 2025', programStudi: 'Teknik Informatika', angkatan: '2021' },
]

interface ExpertFeedback {
  id: string
  nama: string
  profesi: string
  gelar?: string
  top5Recommendations: string[]
  topNStatus: 'P1' | 'P2' | 'P3-5' | 'Tidak muncul'
  akurasi: number
  logika: number
  manfaat: number
  kendala: string[]
  masukan: string
  tanggal: string
}

const EXPERT_DATA: ExpertFeedback[] = [
  { id: '#FBX-00123', nama: 'Dinda Aulia', profesi: 'UI/UX Designer', gelar: 'S.Kom', top5Recommendations: ['UI/UX Designer', 'Product Designer', 'Visual Designer', 'Interaction Designer', 'UX Researcher'], topNStatus: 'P1', akurasi: 6, logika: 7, manfaat: 6, kendala: [], masukan: 'Rekomendasi sangat akurat dan sesuai.', tanggal: '10 Des 2025' },
  { id: '#FBX-00124', nama: 'Budi Hartono', profesi: 'Data Scientist', gelar: 'M.Sc', top5Recommendations: ['Data Analyst', 'Machine Learning Engineer', 'Data Scientist', 'Business Intelligence Analyst', 'AI Researcher'], topNStatus: 'P3-5', akurasi: 5, logika: 5, manfaat: 6, kendala: ['Penjelasan hasil tes terlalu panjang'], masukan: 'Profesi Data Scientist muncul di posisi 3.', tanggal: '09 Des 2025' },
  { id: '#FBX-00125', nama: 'Sari Indah', profesi: 'Marketing Manager', gelar: 'MBA', top5Recommendations: ['Marketing Specialist', 'Brand Manager', 'Marketing Manager', 'Digital Marketing', 'Content Strategist'], topNStatus: 'P3-5', akurasi: 6, logika: 6, manfaat: 7, kendala: [], masukan: 'Rekomendasi cukup baik.', tanggal: '08 Des 2025' },
  { id: '#FBX-00126', nama: 'Ahmad Fauzan', profesi: 'Software Engineer', gelar: 'S.T', top5Recommendations: ['Software Engineer', 'Backend Developer', 'Full Stack Developer', 'DevOps Engineer', 'System Architect'], topNStatus: 'P1', akurasi: 7, logika: 7, manfaat: 7, kendala: [], masukan: 'Sangat akurat! Profesi Software Engineer tepat di urutan pertama.', tanggal: '07 Des 2025' },
  { id: '#FBX-00127', nama: 'Lisa Permata', profesi: 'Financial Analyst', gelar: 'S.E', top5Recommendations: ['Accountant', 'Auditor', 'Tax Consultant', 'Budget Analyst', 'Controller'], topNStatus: 'Tidak muncul', akurasi: 3, logika: 4, manfaat: 4, kendala: ['Ada pertanyaan yang membingungkan'], masukan: 'Profesi Financial Analyst tidak muncul di rekomendasi.', tanggal: '06 Des 2025' },
  { id: '#FBX-00128', nama: 'Rendi Kurniawan', profesi: 'Product Manager', gelar: 'S.Kom', top5Recommendations: ['Business Analyst', 'Product Manager', 'Project Manager', 'Scrum Master', 'Product Owner'], topNStatus: 'P2', akurasi: 6, logika: 6, manfaat: 6, kendala: ['Durasi tes terasa terlalu lama'], masukan: 'Cukup akurat, Product Manager ada di posisi 2.', tanggal: '05 Des 2025' },
]

const TopNBadge = ({ status }: { status: ExpertFeedback['topNStatus'] }) => {
  const styles: Record<string, string> = {
    P1: 'border-emerald-500 text-emerald-600 bg-emerald-50',
    P2: 'border-blue-500 text-blue-600 bg-blue-50',
    'P3-5': 'border-amber-500 text-amber-600 bg-amber-50',
    'Tidak muncul': 'border-gray-300 text-gray-500 bg-gray-50',
  }
  return (
    <div className={cn('inline-flex items-center justify-center px-3 py-1 rounded-lg border-[1.5px] text-xs font-medium', styles[status])}>
      {status}
    </div>
  )
}

const ScoreBadge = ({ score }: { score: number }) => {
  const color = score >= 6 ? 'bg-emerald-50 text-emerald-700 border-emerald-300' : score >= 4 ? 'bg-amber-50 text-amber-700 border-amber-300' : 'bg-red-50 text-red-700 border-red-300'
  return (
    <div className={cn('inline-flex items-center justify-center px-2.5 py-0.5 rounded-full border text-xs font-medium', color)}>
      {score}/7
    </div>
  )
}

const KendalaChips = ({ kendala }: { kendala: string[] }) => {
  if (kendala.length === 0) return <span className="text-xs text-gray-400 italic">Tidak ada kendala</span>
  const visible = kendala.slice(0, 1)
  const hidden = kendala.length - 1
  return (
    <div className="flex flex-col gap-1">
      {visible.map((k, i) => <span key={i} className="inline-flex px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 border border-blue-200 text-xs">{k}</span>)}
      {hidden > 0 && <span className="text-xs text-gray-400">+{hidden} lainnya</span>}
    </div>
  )
}

export default function UmpanBalikPage() {
  const [mainTab, setMainTab] = useState<'mahasiswa' | 'validator'>('mahasiswa')
  const [search, setSearch] = useState('')
  const [kendalaFilter, setKendalaFilter] = useState('all')
  const [expertSearch, setExpertSearch] = useState('')
  const [topNFilter, setTopNFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const rowsPerPage = 10

  const filteredMahasiswa = useMemo(() => {
    let d = [...MAHASISWA_DATA]
    if (search) d = d.filter(i => i.userName.toLowerCase().includes(search.toLowerCase()))
    if (kendalaFilter === 'has') d = d.filter(i => i.kendala.length > 0)
    if (kendalaFilter === 'none') d = d.filter(i => i.kendala.length === 0)
    return d
  }, [search, kendalaFilter])

  const filteredExpert = useMemo(() => {
    let d = [...EXPERT_DATA]
    if (expertSearch) d = d.filter(i => i.nama.toLowerCase().includes(expertSearch.toLowerCase()))
    if (topNFilter !== 'all') d = d.filter(i => i.topNStatus === topNFilter)
    return d
  }, [expertSearch, topNFilter])

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-foreground">Umpan Balik Fitur Kenali Diri</h1>
            <p className="text-sm text-muted-foreground mt-1">Menyajikan data respon umpan balik pengguna fitur Kenali Diri</p>
          </div>
          <Button size="sm" className="gap-2 w-fit">
            <Download className="h-4 w-4" />
            Ekspor Data
          </Button>
        </div>

        {/* Main Tabs */}
        <div className="flex gap-1 p-1 bg-muted/40 rounded-lg w-fit mb-6 border border-border">
          {(['mahasiswa', 'validator'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => { setMainTab(tab); setCurrentPage(1) }}
              className={cn(
                'px-5 py-2 text-sm font-medium rounded-md transition-all capitalize',
                mainTab === tab ? 'bg-white text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {tab === 'mahasiswa' ? 'Mahasiswa' : 'Expert'}
            </button>
          ))}
        </div>

        {/* Controls */}
        {mainTab === 'mahasiswa' ? (
          <>
            <div className="flex flex-col md:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Cari nama pengguna..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-9" />
              </div>
              <Select value={kendalaFilter} onValueChange={setKendalaFilter}>
                <SelectTrigger className="h-9 w-full md:w-[200px]"><SelectValue placeholder="Filter Kendala" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="has">Ada Kendala</SelectItem>
                  <SelectItem value="none">Tidak Ada Kendala</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-background rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nama</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Kemudahan</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Relevansi</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Kepuasan</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Kendala</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMahasiswa.length === 0 ? (
                      <tr><td colSpan={7} className="px-4 py-16 text-center text-muted-foreground">Tidak ada data.</td></tr>
                    ) : filteredMahasiswa.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage).map(item => (
                      <tr key={item.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{item.id}</td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-foreground">{item.userName}</p>
                            <p className="text-xs text-muted-foreground">{item.programStudi} · {item.angkatan}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center"><ScoreBadge score={item.kemudahanTes} /></td>
                        <td className="px-4 py-3 text-center"><ScoreBadge score={item.relevansiRekomendasi} /></td>
                        <td className="px-4 py-3 text-center"><ScoreBadge score={item.kepuasanFitur} /></td>
                        <td className="px-4 py-3 hidden lg:table-cell"><KendalaChips kendala={item.kendala} /></td>
                        <td className="px-4 py-3 text-center">
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10 rounded-full">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {Math.ceil(filteredMahasiswa.length / rowsPerPage) > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-border">
                  <span className="text-sm text-muted-foreground">Halaman {currentPage} dari {Math.ceil(filteredMahasiswa.length / rowsPerPage)}</span>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>Sebelumnya</Button>
                    <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(Math.ceil(filteredMahasiswa.length / rowsPerPage), p + 1))} disabled={currentPage === Math.ceil(filteredMahasiswa.length / rowsPerPage)}>Berikutnya</Button>
                  </div>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-3 mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Cari nama expert..." value={expertSearch} onChange={e => setExpertSearch(e.target.value)} className="pl-9 h-9" />
              </div>
              <Select value={topNFilter} onValueChange={setTopNFilter}>
                <SelectTrigger className="h-9 w-full md:w-[200px]"><SelectValue placeholder="Filter Top-N" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="P1">P1 (Profesi tepat di #1)</SelectItem>
                  <SelectItem value="P2">P2 (Profesi di #2)</SelectItem>
                  <SelectItem value="P3-5">P3-5</SelectItem>
                  <SelectItem value="Tidak muncul">Tidak Muncul</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-background rounded-xl border border-border overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID Feedback</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Expert</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Top-N Status</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Akurasi</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Logika</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Manfaat</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Kendala</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredExpert.length === 0 ? (
                      <tr><td colSpan={8} className="px-4 py-16 text-center text-muted-foreground">Tidak ada data.</td></tr>
                    ) : filteredExpert.map(item => (
                      <tr key={item.id} className="border-b border-border/50 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{item.id}</td>
                        <td className="px-4 py-3">
                          <div>
                            <p className="text-sm font-medium text-foreground">{item.nama}</p>
                            <p className="text-xs text-muted-foreground">{item.profesi} · {item.gelar}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-center"><TopNBadge status={item.topNStatus} /></td>
                        <td className="px-4 py-3 text-center"><ScoreBadge score={item.akurasi} /></td>
                        <td className="px-4 py-3 text-center"><ScoreBadge score={item.logika} /></td>
                        <td className="px-4 py-3 text-center"><ScoreBadge score={item.manfaat} /></td>
                        <td className="px-4 py-3 hidden lg:table-cell"><KendalaChips kendala={item.kendala} /></td>
                        <td className="px-4 py-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10 rounded-full"><Eye className="h-4 w-4" /></Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-full"><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
