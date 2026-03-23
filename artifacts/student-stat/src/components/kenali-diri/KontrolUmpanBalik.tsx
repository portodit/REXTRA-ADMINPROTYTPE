import React, { useCallback } from 'react'
import { SelectFilter } from './SelectFilter'
import Typography from '@/components/Typography'
import { SearchBar } from './SearchBar'

export interface UmpanBalikFilters {
  search: string
  test_category: string
  sort: string
  status: string
}

const ALL_VALUE = 'ALL'

const SORT_OPTIONS = [
  { label: 'Feedback Terbaru', value: 'latest' },
  { label: 'Feedback Terlama', value: 'oldest' },
]

const TEST_CATEGORY_OPTIONS = [
  { label: 'Semua Tes', value: ALL_VALUE },
  { label: 'Tes Profil Karir', value: 'CAREER_PROFILE' },
  { label: 'Tes Kepribadian', value: 'PERSONALITY' },
  { label: 'Tes Minat', value: 'INTEREST' },
]

const STATUS_OPTIONS = [
  { label: 'Semua', value: ALL_VALUE },
  { label: 'Ada Saran', value: 'has_suggestion' },
  { label: 'Tanpa Saran', value: 'no_suggestion' },
]

interface Props {
  filters: UmpanBalikFilters
  onFiltersChange: (filters: UmpanBalikFilters) => void
}

export default function KontrolUmpanBalik({ filters, onFiltersChange }: Props) {
  const handleSearchChange = useCallback(
    (value: string) => {
      onFiltersChange({ ...filters, search: value })
    },
    [filters, onFiltersChange],
  )

  const handleSortChange = useCallback(
    (value: string) => {
      onFiltersChange({ ...filters, sort: value === ALL_VALUE ? '' : value })
    },
    [filters, onFiltersChange],
  )

  const handleCategoryChange = useCallback(
    (value: string) => {
      onFiltersChange({ ...filters, test_category: value === ALL_VALUE ? '' : value })
    },
    [filters, onFiltersChange],
  )

  const handleStatusChange = useCallback(
    (value: string) => {
      onFiltersChange({ ...filters, status: value === ALL_VALUE ? '' : value })
    },
    [filters, onFiltersChange],
  )

  return (
    <div className="w-full flex flex-col xl:flex-row gap-4 bg-white border border-gray-200 rounded-2xl p-4">
      <div className="flex-1">
        <Typography variant="l1" weight="medium" className="text-gray-700 mb-2">
          Cari
        </Typography>
        <SearchBar value={filters.search} onSearch={handleSearchChange} />
      </div>
      <div className="flex-1">
        <Typography variant="l1" weight="medium" className="text-gray-700 mb-2">
          Kategori Tes
        </Typography>
        <SelectFilter
          placeholder="Semua Tes"
          value={filters.test_category || ALL_VALUE}
          onChange={handleCategoryChange}
          options={TEST_CATEGORY_OPTIONS}
        />
      </div>
      <div className="flex-1">
        <Typography variant="l1" weight="medium" className="text-gray-700 mb-2">
          Status
        </Typography>
        <SelectFilter
          placeholder="Semua"
          value={filters.status || ALL_VALUE}
          onChange={handleStatusChange}
          options={STATUS_OPTIONS}
        />
      </div>
      <div className="flex-1">
        <Typography variant="l1" weight="medium" className="text-gray-700 mb-2">
          Urutkan
        </Typography>
        <SelectFilter
          placeholder="Urutkan Data"
          value={filters.sort || ALL_VALUE}
          onChange={handleSortChange}
          options={SORT_OPTIONS}
        />
      </div>
    </div>
  )
}
