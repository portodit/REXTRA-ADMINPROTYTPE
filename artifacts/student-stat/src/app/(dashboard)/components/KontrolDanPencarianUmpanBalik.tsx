'use client'

import React, { useCallback } from 'react'
import { SelectFilter } from './SelectFilter'
import Typography from '@/components/Typography'
import { SearchBar } from './Searchbar'

export interface UmpanBalikFilters {
  search: string
  test_category: string // empty string = no filter
  sort: string // e.g. 'latest' | 'oldest'
  status: string // e.g. 'semua' | 'has_suggestion' | etc.
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

interface KontrolPencarianUmpanBalikProps {
  filters: UmpanBalikFilters
  onFiltersChange: (filters: UmpanBalikFilters) => void
}

export default function KontrolPencarianUmpanBalik({
  filters,
  onFiltersChange,
}: KontrolPencarianUmpanBalikProps) {
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
      onFiltersChange({
        ...filters,
        test_category: value === ALL_VALUE ? '' : value,
      })
    },
    [filters, onFiltersChange],
  )

  const handleStatusChange = useCallback(
    (value: string) => {
      onFiltersChange({ ...filters, status: value === ALL_VALUE ? '' : value })
    },
    [filters, onFiltersChange],
  )

  // Convert empty string → sentinel so Radix Select never gets value=""
  const sortValue = filters.sort || 'latest'
  const categoryValue = filters.test_category || ALL_VALUE
  const statusValue = filters.status || ALL_VALUE

  return (
    <div className="w-full bg-white border border-gray-200 rounded-2xl p-6 flex flex-col gap-6 mb-12">
      {/* Title (mobile only) */}
      <Typography variant="t2" weight="medium" className="text-gray-900">
        Kontrol dan Pencarian Data
      </Typography>

      {/* Input Row */}
      <div className="w-full flex flex-col xl:grid xl:grid-cols-[1fr_2fr_1fr_1fr] items-start xl:items-center justify-between gap-6">
        {/* Category */}
        <SelectFilter
          placeholder="Semua Kategori"
          options={TEST_CATEGORY_OPTIONS}
          value={categoryValue}
          onChange={handleCategoryChange}
        />

        {/* Search */}
        <SearchBar value={filters.search} onSearch={handleSearchChange} />

        {/* Sort */}
        <SelectFilter
          placeholder="Feedback Terbaru"
          options={SORT_OPTIONS}
          value={sortValue}
          onChange={handleSortChange}
        />

        {/* Status */}
        <SelectFilter
          placeholder="Semua"
          options={STATUS_OPTIONS}
          value={statusValue}
          onChange={handleStatusChange}
        />
      </div>
    </div>
  )
}
