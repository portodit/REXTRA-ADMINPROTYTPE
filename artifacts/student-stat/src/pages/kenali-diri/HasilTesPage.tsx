import React from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import FilterTabs, { TabType, FilterValues } from '@/components/kenali-diri/FilterTabs'
import MahasiswaHasilTestDataTable from '@/components/kenali-diri/MahasiswaHasilTestTable'
import { KenaliDiriHistoryItem } from '@/types/kenali-diri'

/* =======================================================
   DUMMY DATA (format KenaliDiriHistoryItem)
======================================================= */

const DUMMY_DATA: KenaliDiriHistoryItem[] = [
  { test_id: 'KD-001', user_name: 'Budi Santoso',    category_name: 'Tes Profil Karier', status: 'completed',  result_code: 'RIA', started_at: '2025-12-18', completed_at: '2025-12-18' },
  { test_id: 'KD-002', user_name: 'Siti Rahayu',     category_name: 'Tes Profil Karier', status: 'completed',  result_code: 'SEC', started_at: '2025-12-18', completed_at: '2025-12-18' },
  { test_id: 'KD-003', user_name: 'Ahmad Wijaya',    category_name: 'Tes Profil Karier', status: 'in_progress',result_code: '',    started_at: '2025-12-17' },
  { test_id: 'KD-004', user_name: 'Dewi Lestari',    category_name: 'Tes Profil Karier', status: 'completed',  result_code: 'AIR', started_at: '2025-12-17', completed_at: '2025-12-17' },
  { test_id: 'KD-005', user_name: 'Rizky Pratama',   category_name: 'Tes Profil Karier', status: 'abandoned',  result_code: '',    started_at: '2025-12-16', completed_at: '2025-12-16' },
  { test_id: 'KD-006', user_name: 'Anisa Putri',     category_name: 'Tes Profil Karier', status: 'completed',  result_code: 'CRE', started_at: '2025-12-16', completed_at: '2025-12-16' },
  { test_id: 'KD-007', user_name: 'Fajar Nugroho',   category_name: 'Tes Profil Karier', status: 'completed',  result_code: 'IAS', started_at: '2025-12-15', completed_at: '2025-12-15' },
  { test_id: 'KD-008', user_name: 'Rina Marlina',    category_name: 'Tes Profil Karier', status: 'in_progress',result_code: '',    started_at: '2025-12-15' },
  { test_id: 'KD-009', user_name: 'Hendro Kusuma',   category_name: 'Tes Profil Karier', status: 'completed',  result_code: 'ESC', started_at: '2025-12-14', completed_at: '2025-12-14' },
  { test_id: 'KD-010', user_name: 'Maya Sari',       category_name: 'Tes Profil Karier', status: 'completed',  result_code: 'RCS', started_at: '2025-12-14', completed_at: '2025-12-14' },
  { test_id: 'KD-011', user_name: 'Yoga Permana',    category_name: 'Tes Profil Karier', status: 'abandoned',  result_code: '',    started_at: '2025-12-13', completed_at: '2025-12-13' },
  { test_id: 'KD-012', user_name: 'Lina Kartika',    category_name: 'Tes Profil Karier', status: 'completed',  result_code: 'ARI', started_at: '2025-12-13', completed_at: '2025-12-13' },
  { test_id: 'KD-013', user_name: 'Dito Setiawan',   category_name: 'Tes Profil Karier', status: 'completed',  result_code: 'RIA', started_at: '2025-12-12', completed_at: '2025-12-12' },
  { test_id: 'KD-014', user_name: 'Nadia Putri',     category_name: 'Tes Profil Karier', status: 'completed',  result_code: 'SEC', started_at: '2025-12-11', completed_at: '2025-12-11' },
  { test_id: 'KD-015', user_name: 'Bagas Prasetyo',  category_name: 'Tes Profil Karier', status: 'abandoned',  result_code: '',    started_at: '2025-12-10', completed_at: '2025-12-10' },
]

/* =======================================================
   STATUS MAPPING (backend status → tab label)
======================================================= */

const mapStatus = (status: KenaliDiriHistoryItem['status']): TabType => {
  switch (status) {
    case 'completed':  return 'Selesai'
    case 'in_progress': return 'Berjalan'
    case 'abandoned':  return 'Dihentikan'
    default:           return 'Berjalan'
  }
}

/* =======================================================
   PAGE COMPONENT
======================================================= */

interface PageFilters {
  tab: TabType
  search: string
  hasil: string
  kategori: string
  urutan: string
}

export default function HasilTesPage() {
  const [data, setData] = React.useState<KenaliDiriHistoryItem[]>(DUMMY_DATA)
  const [filters, setFilters] = React.useState<PageFilters>({
    tab: 'Semua Data',
    search: '',
    hasil: 'Semua Hasil',
    kategori: 'Semua Kategori',
    urutan: 'Nama A-Z',
  })

  const filteredData = React.useMemo(() => {
    let result = [...data]

    // Tab filter
    if (filters.tab !== 'Semua Data') {
      result = result.filter((item) => mapStatus(item.status) === filters.tab)
    }

    // Search filter
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (item) =>
          item.user_name.toLowerCase().includes(q) ||
          item.test_id.toLowerCase().includes(q),
      )
    }

    // RIASEC hasil filter
    if (filters.hasil !== 'Semua Hasil') {
      result = result.filter((item) => item.result_code === filters.hasil)
    }

    // Kategori filter
    if (filters.kategori !== 'Semua Kategori') {
      result = result.filter((item) => item.category_name === filters.kategori)
    }

    // Urutan
    if (filters.urutan === 'Nama A-Z') {
      result.sort((a, b) => a.user_name.localeCompare(b.user_name))
    } else if (filters.urutan === 'Nama Z-A') {
      result.sort((a, b) => b.user_name.localeCompare(a.user_name))
    } else if (filters.urutan === 'Terbaru') {
      result.sort((a, b) => new Date(b.started_at).getTime() - new Date(a.started_at).getTime())
    } else if (filters.urutan === 'Terlama') {
      result.sort((a, b) => new Date(a.started_at).getTime() - new Date(b.started_at).getTime())
    }

    return result
  }, [filters, data])

  const handleDelete = (testId: string) => {
    setData((prev) => prev.filter((item) => item.test_id !== testId))
  }

  return (
    <DashboardLayout>
      <div className="flex min-h-screen bg-gray-50">
        <div className="w-full max-w-7xl mx-auto space-y-6 p-3 sm:p-6">
          <FilterTabs
            activeTab={filters.tab}
            search={filters.search}
            onTabChange={(tab) => setFilters((prev) => ({ ...prev, tab }))}
            onSearchChange={(search) => setFilters((prev) => ({ ...prev, search }))}
            onFilterChange={(f: FilterValues) =>
              setFilters((prev) => ({ ...prev, ...f }))
            }
          />
          <MahasiswaHasilTestDataTable
            tableData={filteredData}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </DashboardLayout>
  )
}
