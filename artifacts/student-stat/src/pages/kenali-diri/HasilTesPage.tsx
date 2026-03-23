import React from 'react'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import FilterTabs, { TabType } from '@/components/kenali-diri/FilterTabs'
import MahasiswaHasilTestDataTable from '@/components/kenali-diri/MahasiswaHasilTestTable'
import { useKenaliDiriHistory } from '@/hooks/kenali-diri/useKenaliDiriHistory'
import { KenaliDiriHistoryItem } from '@/types/kenali-diri'

type TestStatus = 'Selesai' | 'Berjalan' | 'Dihentikan'

const mapStatus = (status: 'completed' | 'in_progress' | 'abandoned'): TestStatus => {
  switch (status) {
    case 'completed': return 'Selesai'
    case 'in_progress': return 'Berjalan'
    case 'abandoned': return 'Dihentikan'
    default: return 'Berjalan'
  }
}

export default function HasilTesPage() {
  const { data, isLoading } = useKenaliDiriHistory({ page: 1, per_page: 1000 })

  const [activeTab, setActiveTab] = React.useState<TabType>('Semua Data')
  const [search, setSearch] = React.useState('')
  const [isFilterOpen, setIsFilterOpen] = React.useState(false)

  const filteredData = React.useMemo(() => {
    const rawData: KenaliDiriHistoryItem[] = data?.data?.data ?? []
    let result = [...rawData]

    if (activeTab !== 'Semua Data') {
      result = result.filter((item) => mapStatus(item.status) === activeTab)
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(
        (item) =>
          item.user_name.toLowerCase().includes(q) ||
          item.test_id.toLowerCase().includes(q) ||
          item.category_name.toLowerCase().includes(q),
      )
    }

    return result
  }, [data, activeTab, search])

  return (
    <DashboardLayout>
      <div className="flex min-h-screen bg-white p-6">
        <div className="w-full max-w-7xl mx-auto space-y-6">
          <FilterTabs
            activeTab={activeTab}
            search={search}
            onTabChange={setActiveTab}
            onSearchChange={setSearch}
            onFilterClick={() => setIsFilterOpen(!isFilterOpen)}
          />

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
            </div>
          ) : (
            <MahasiswaHasilTestDataTable tableData={filteredData} />
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
