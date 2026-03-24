'use client'

import React from 'react'
import { TestStatus } from '@/app/(dashboard)/components/TestTable'
import FilterTabs from '@/app/(dashboard)/components/FilterTabs'
import DetailedSearchInfo, {
  Filters,
} from '@/app/(dashboard)/components/DetailedSearchInfo'
import { useKenaliDiriHistory } from './hooks/mutation'
import { KenaliDiriHistoryItem } from '@/types/kenali-diri'
import MahasiswaHasilTestTable from '@/app/(dashboard)/components/MahasiswaHasilTestTable'

type PageFilters = Filters & {
  tab: 'Semua Data' | 'Selesai' | 'Berjalan' | 'Dihentikan'
  search?: string
}

const mapStatus = (
  status: 'completed' | 'in_progress' | 'abandoned',
): TestStatus => {
  switch (status) {
    case 'completed':
      return 'Selesai'
    case 'in_progress':
      return 'Berjalan'
    case 'abandoned':
      return 'Dihentikan'
    default:
      return 'Berjalan'
  }
}

export default function HasilTes() {
  const { data, isLoading } = useKenaliDiriHistory({
    page: 1,
    per_page: 1000,
  })

  const [filters, setFilters] = React.useState<PageFilters>({
    tab: 'Semua Data',
    search: '',
    startDate: undefined,
    endDate: undefined,
    category: undefined,
    result: undefined,
    sort: undefined,
  })

  const [isFilterOpen, setIsFilterOpen] = React.useState(false)

  const filteredData = React.useMemo(() => {
    const rawData: KenaliDiriHistoryItem[] = data?.data?.data ?? []
    let result = [...rawData]

    if (filters.tab !== 'Semua Data') {
      result = result.filter((item) => mapStatus(item.status) === filters.tab)
    }

    if (filters.search?.trim()) {
      const searchLower = filters.search.toLowerCase()
      result = result.filter((item) => {
        const userName = String(item?.user_name ?? '').toLowerCase()
        const testId = String(item?.test_id ?? '').toLowerCase()
        return userName.includes(searchLower) || testId.includes(searchLower)
      })
    }

    if (filters.startDate) {
      result = result.filter(
        (item) => new Date(item?.started_at ?? 0) >= filters.startDate!,
      )
    }

    if (filters.endDate) {
      result = result.filter(
        (item) =>
          new Date(item?.completed_at ?? item?.started_at ?? 0) <=
          filters.endDate!,
      )
    }

    if (filters.category && filters.category !== 'all') {
      result = result.filter(
        (item) =>
          item?.category_name?.toLowerCase() ===
          filters.category?.toLowerCase(),
      )
    }

    if (filters.sort === 'az') {
      result.sort((a, b) =>
        String(a?.user_name ?? '').localeCompare(String(b?.user_name ?? '')),
      )
    } else if (filters.sort === 'za') {
      result.sort((a, b) =>
        String(b?.user_name ?? '').localeCompare(String(a?.user_name ?? '')),
      )
    } else if (filters.sort === 'newest') {
      result.sort(
        (a, b) =>
          new Date(b?.started_at ?? 0).getTime() -
          new Date(a?.started_at ?? 0).getTime(),
      )
    }

    return result
  }, [data, filters])

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="w-full max-w-7xl mx-auto space-y-6 p-6">
        <FilterTabs
          activeTab={filters.tab}
          search={filters.search ?? ''}
          onTabChange={(tab) => setFilters((prev) => ({ ...prev, tab }))}
          onSearchChange={(value) =>
            setFilters((prev) => ({ ...prev, search: value }))
          }
          onFilterClick={() => setIsFilterOpen((prev) => !prev)}
        />

        {isFilterOpen && (
          <DetailedSearchInfo
            filters={filters}
            onChange={(field, value) =>
              setFilters((prev) => ({ ...prev, [field]: value }))
            }
          />
        )}

        <MahasiswaHasilTestTable tableData={filteredData} />
      </div>
    </div>
  )
}
