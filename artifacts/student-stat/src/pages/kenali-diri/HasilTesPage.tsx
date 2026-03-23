import React, { useState, useMemo } from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { ExportDataDialog } from '@/components/shared/ExportDataDialog'
import { BulkDeleteDialog } from '@/components/shared/BulkDeleteDialog'
import { SingleDeleteDialog } from '@/components/shared/SingleDeleteDialog'
import { TestDetailModal } from '@/components/kenali-diri/TestDetailModal'
import {
  Download,
  Search,
  Eye,
  Trash2,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  SlidersHorizontal,
} from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

const DUMMY_DATA = [
  { id: 'KD-001', name: 'Budi Santoso', category: 'Tes Profil Karier', status: 'Selesai', result: 'RIA', startDate: '2025-12-18', endDate: '2025-12-18' },
  { id: 'KD-002', name: 'Siti Rahayu', category: 'Tes Profil Karier', status: 'Selesai', result: 'SEC', startDate: '2025-12-18', endDate: '2025-12-18' },
  { id: 'KD-003', name: 'Ahmad Wijaya', category: 'Tes Profil Karier', status: 'Sedang Berjalan', result: '-', startDate: '2025-12-17', endDate: '-' },
  { id: 'KD-004', name: 'Dewi Lestari', category: 'Tes Profil Karier', status: 'Selesai', result: 'AIR', startDate: '2025-12-17', endDate: '2025-12-17' },
  { id: 'KD-005', name: 'Rizky Pratama', category: 'Tes Profil Karier', status: 'Dihentikan', result: '-', startDate: '2025-12-16', endDate: '2025-12-16' },
  { id: 'KD-006', name: 'Anisa Putri', category: 'Tes Profil Karier', status: 'Selesai', result: 'CRE', startDate: '2025-12-16', endDate: '2025-12-16' },
  { id: 'KD-007', name: 'Fajar Nugroho', category: 'Tes Profil Karier', status: 'Selesai', result: 'IAS', startDate: '2025-12-15', endDate: '2025-12-15' },
  { id: 'KD-008', name: 'Rina Marlina', category: 'Tes Profil Karier', status: 'Sedang Berjalan', result: '-', startDate: '2025-12-15', endDate: '-' },
  { id: 'KD-009', name: 'Hendro Kusuma', category: 'Tes Profil Karier', status: 'Selesai', result: 'ESC', startDate: '2025-12-14', endDate: '2025-12-14' },
  { id: 'KD-010', name: 'Maya Sari', category: 'Tes Profil Karier', status: 'Selesai', result: 'RCS', startDate: '2025-12-14', endDate: '2025-12-14' },
  { id: 'KD-011', name: 'Yoga Permana', category: 'Tes Profil Karier', status: 'Dihentikan', result: '-', startDate: '2025-12-13', endDate: '2025-12-13' },
  { id: 'KD-012', name: 'Lina Kartika', category: 'Tes Profil Karier', status: 'Selesai', result: 'ARI', startDate: '2025-12-13', endDate: '2025-12-13' },
  { id: 'KD-013', name: 'Dito Setiawan', category: 'Tes Profil Karier', status: 'Selesai', result: 'RIA', startDate: '2025-12-12', endDate: '2025-12-12' },
  { id: 'KD-014', name: 'Nadia Putri', category: 'Tes Profil Karier', status: 'Selesai', result: 'SEC', startDate: '2025-12-11', endDate: '2025-12-11' },
  { id: 'KD-015', name: 'Bagas Prasetyo', category: 'Tes Profil Karier', status: 'Dihentikan', result: '-', startDate: '2025-12-10', endDate: '2025-12-10' },
]

const tabs = [
  { id: 'semua', label: 'Semua Data' },
  { id: 'selesai', label: 'Selesai' },
  { id: 'berjalan', label: 'Berjalan' },
  { id: 'dihentikan', label: 'Dihentikan' },
]

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Selesai': return 'bg-emerald-50 text-emerald-600 border border-emerald-200'
    case 'Sedang Berjalan': return 'bg-amber-50 text-amber-600 border border-amber-200'
    case 'Dihentikan': return 'bg-red-50 text-red-500 border border-red-200'
    default: return 'bg-muted text-muted-foreground'
  }
}

export default function HasilTesPage() {
  const [exportDialogOpen, setExportDialogOpen] = useState(false)
  const [bulkDeleteDialogOpen, setBulkDeleteDialogOpen] = useState(false)
  const [singleDeleteDialogOpen, setSingleDeleteDialogOpen] = useState(false)
  const [deleteItemName, setDeleteItemName] = useState('')
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedDetailItem, setSelectedDetailItem] = useState<(typeof DUMMY_DATA)[0] | null>(null)

  const [activeTab, setActiveTab] = useState('semua')
  const [searchQuery, setSearchQuery] = useState('')
  const [startDate, setStartDate] = useState<Date>()
  const [endDate, setEndDate] = useState<Date>()
  const [categoryFilter, setCategoryFilter] = useState('')
  const [resultFilter, setResultFilter] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [filterPanelOpen, setFilterPanelOpen] = useState(false)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)

  const filteredData = useMemo(() => {
    let data = [...DUMMY_DATA]
    if (searchQuery) data = data.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()))
    if (activeTab !== 'semua') {
      data = data.filter(item => {
        if (activeTab === 'selesai') return item.status === 'Selesai'
        if (activeTab === 'berjalan') return item.status === 'Sedang Berjalan'
        if (activeTab === 'dihentikan') return item.status === 'Dihentikan'
        return true
      })
    }
    if (categoryFilter && categoryFilter !== 'all') data = data.filter(item => item.category === categoryFilter)
    if (resultFilter && resultFilter !== 'all') data = data.filter(item => item.result === resultFilter)
    if (sortBy) {
      switch (sortBy) {
        case 'name-asc': data.sort((a, b) => a.name.localeCompare(b.name)); break
        case 'name-desc': data.sort((a, b) => b.name.localeCompare(a.name)); break
        case 'start-date': data.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()); break
        case 'end-date': data.sort((a, b) => { if (a.endDate === '-') return 1; if (b.endDate === '-') return -1; return new Date(b.endDate).getTime() - new Date(a.endDate).getTime() }); break
      }
    }
    return data
  }, [searchQuery, categoryFilter, resultFilter, sortBy, activeTab])

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  const handleSelectAll = (checked: boolean) => {
    setSelectedItems(checked ? paginatedData.map(item => item.id) : [])
  }
  const handleSelectItem = (id: string, checked: boolean) => {
    setSelectedItems(prev => checked ? [...prev, id] : prev.filter(i => i !== id))
  }
  const handleDelete = (name: string) => { setDeleteItemName(name); setSingleDeleteDialogOpen(true) }
  const handleViewDetail = (item: (typeof DUMMY_DATA)[0]) => { setSelectedDetailItem(item); setDetailModalOpen(true) }
  const handlePageChange = (page: number) => { if (page >= 1 && page <= totalPages) setCurrentPage(page) }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="flex flex-col gap-4 mb-6">
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-xl md:text-2xl font-semibold text-foreground">Riwayat Tes Kenali Diri</h1>
              <span className="inline-flex items-center justify-center h-6 min-w-[40px] px-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                {filteredData.length}
              </span>
            </div>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Menyajikan data hasil tes Kenali Diri user <span className="font-medium text-primary">REXTRA</span>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => setBulkDeleteDialogOpen(true)} className="gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:border-destructive/50">
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Hapus Data Massal</span>
            </Button>
            <Button size="sm" onClick={() => setExportDialogOpen(true)} className="gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Ekspor Data</span>
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0 mb-6">
          <div className="flex items-center gap-1 p-1 bg-muted/50 rounded-lg w-fit min-w-max">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id); setCurrentPage(1) }}
                className={cn(
                  'px-3 md:px-4 py-2 text-sm font-medium rounded-md transition-all whitespace-nowrap',
                  activeTab === tab.id ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Controls Row */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">Total <span className="font-medium text-foreground">{filteredData.length}</span> data</span>
            {selectedItems.length > 0 && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-primary/10 text-primary text-sm font-medium">{selectedItems.length} dipilih</span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 md:gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Ketikkan nama pengguna..." value={searchQuery} onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1) }} className="pl-9 h-9 w-full md:w-[250px] bg-background border-input" />
            </div>
            <Button variant={filterPanelOpen ? 'default' : 'outline'} size="sm" className="h-9 gap-2" onClick={() => setFilterPanelOpen(!filterPanelOpen)}>
              <SlidersHorizontal className="h-4 w-4" />
              <span className="hidden sm:inline">Filter</span>
            </Button>
          </div>
        </div>

        {/* Filter Panel */}
        {filterPanelOpen && (
          <div className="bg-background rounded-xl border border-border p-4 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Rentang Tanggal</label>
                <div className="flex gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className={cn('h-9 flex-1 justify-start text-left font-normal', !startDate && 'text-muted-foreground')}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? format(startDate, 'dd/MM/yy') : 'Mulai'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={startDate} onSelect={setStartDate} initialFocus className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" size="sm" className={cn('h-9 flex-1 justify-start text-left font-normal', !endDate && 'text-muted-foreground')}>
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? format(endDate, 'dd/MM/yy') : 'Selesai'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar mode="single" selected={endDate} onSelect={setEndDate} initialFocus className="p-3 pointer-events-auto" />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Kategori Tes</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="h-9 bg-background"><SelectValue placeholder="Pilih Kategori Tes" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    <SelectItem value="Tes Profil Karier">Tes Profil Karier</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Hasil Tes</label>
                <Select value={resultFilter} onValueChange={setResultFilter}>
                  <SelectTrigger className="h-9 bg-background"><SelectValue placeholder="Pilih Hasil Tes" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Hasil</SelectItem>
                    {['RIA','SEC','AIR','CRE','IAS','ESC','RCS','ARI'].map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Urutkan</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-9 bg-background"><SelectValue placeholder="Urutkan berdasarkan" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name-asc">Nama A-Z</SelectItem>
                    <SelectItem value="name-desc">Nama Z-A</SelectItem>
                    <SelectItem value="start-date">Tanggal Mulai</SelectItem>
                    <SelectItem value="end-date">Tanggal Selesai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4 pt-4 border-t border-border">
              <Button variant="ghost" size="sm" onClick={() => { setStartDate(undefined); setEndDate(undefined); setCategoryFilter(''); setResultFilter(''); setSortBy('') }}>Reset Filter</Button>
              <Button size="sm" onClick={() => setFilterPanelOpen(false)}>Terapkan</Button>
            </div>
          </div>
        )}

        {/* Table */}
        <div className="bg-background rounded-xl border border-border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-4 py-3 text-left w-12">
                    <Checkbox checked={selectedItems.length === paginatedData.length && paginatedData.length > 0} onCheckedChange={handleSelectAll} className="rounded-[4px]" />
                  </th>
                  <th className="px-4 py-3 text-left min-w-[80px]">
                    <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground">ID Tes <ArrowUpDown className="h-3 w-3" /></button>
                  </th>
                  <th className="px-4 py-3 text-left min-w-[160px]">
                    <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground">Nama <ArrowUpDown className="h-3 w-3" /></button>
                  </th>
                  <th className="px-4 py-3 text-left min-w-[140px] hidden md:table-cell">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Kategori</span>
                  </th>
                  <th className="px-4 py-3 text-left min-w-[120px]">
                    <button className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground uppercase tracking-wider hover:text-foreground">Status <ArrowUpDown className="h-3 w-3" /></button>
                  </th>
                  <th className="px-4 py-3 text-left min-w-[70px]">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Hasil</span>
                  </th>
                  <th className="px-4 py-3 text-center w-24">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Aksi</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-16 text-center text-muted-foreground">Tidak ada data yang sesuai dengan filter.</td>
                  </tr>
                ) : paginatedData.map(item => (
                  <tr key={item.id} className={cn('border-b border-border/50 hover:bg-muted/30 transition-colors', selectedItems.includes(item.id) && 'bg-primary/5')}>
                    <td className="px-4 py-3">
                      <Checkbox checked={selectedItems.includes(item.id)} onCheckedChange={checked => handleSelectItem(item.id, checked as boolean)} className="rounded-[4px]" />
                    </td>
                    <td className="px-4 py-3"><span className="text-sm font-medium text-muted-foreground">#{item.id}</span></td>
                    <td className="px-4 py-3"><span className="text-sm font-medium text-foreground">{item.name}</span></td>
                    <td className="px-4 py-3 hidden md:table-cell"><span className="text-sm text-muted-foreground">{item.category}</span></td>
                    <td className="px-4 py-3">
                      <span className={cn('inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium', getStatusStyle(item.status))}>{item.status}</span>
                    </td>
                    <td className="px-4 py-3"><span className="text-sm font-semibold text-foreground">{item.result}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10 rounded-full" onClick={() => handleViewDetail(item)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10 rounded-full" onClick={() => handleDelete(item.name)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-border">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Baris per halaman:</span>
                <Select value={String(itemsPerPage)} onValueChange={v => { setItemsPerPage(Number(v)); setCurrentPage(1) }}>
                  <SelectTrigger className="h-8 w-16 text-sm"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {[10, 25, 50].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredData.length)} dari {filteredData.length}</span>
                <div className="flex gap-1">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}><ChevronLeft className="h-4 w-4" /></Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}><ChevronRight className="h-4 w-4" /></Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <ExportDataDialog open={exportDialogOpen} onOpenChange={setExportDialogOpen} />
      <BulkDeleteDialog open={bulkDeleteDialogOpen} onOpenChange={setBulkDeleteDialogOpen} selectedCount={selectedItems.length} onConfirm={() => { setSelectedItems([]); setBulkDeleteDialogOpen(false) }} />
      <SingleDeleteDialog open={singleDeleteDialogOpen} onOpenChange={setSingleDeleteDialogOpen} itemName={deleteItemName} onConfirm={() => setSingleDeleteDialogOpen(false)} />
      {selectedDetailItem && <TestDetailModal open={detailModalOpen} onOpenChange={setDetailModalOpen} item={selectedDetailItem} />}
    </DashboardLayout>
  )
}
