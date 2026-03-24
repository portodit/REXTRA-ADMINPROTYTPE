'use client'

import React from 'react'
import { SearchSection } from './SearchSection'
import { DateTrigger } from './DateTrigger'
import { SelectFilter } from './SelectFilter'
import Typography from '@/components/Typography'

/* ============================= */
/* ========= FILTER TYPE ======= */
/* ============================= */

export interface Filters {
  startDate?: Date
  endDate?: Date
  category?: string
  result?: string
  sort?: string
}

/* ============================= */
/* ========= PROPS TYPE ======== */
/* ============================= */

interface DetailedSearchInfoProps {
  filters: Filters
  onChange: <K extends keyof Filters>(field: K, value: Filters[K]) => void
}

/* ============================= */
/* ========= COMPONENT ========= */
/* ============================= */

export default function DetailedSearchInfo({
  filters,
  onChange,
}: DetailedSearchInfoProps) {
  return (
    <>
      {/* ================= DESKTOP ================= */}
      <div className="w-full hidden xl:grid bg-white border border-gray-200 rounded-2xl grid-cols-[2fr_1fr_1fr_1fr] gap-6">
        {/* DATE RANGE */}
        <div className="p-6 border-r border-gray-200 ">
          <SearchSection label="Rentang Tanggal" className="w-full">
            <div className="flex flex-row gap-3">
              <DateTrigger
                placeholder="Mulai"
                value={filters.startDate}
                onChange={(date) => onChange('startDate', date)}
                className=" w-full rounded-xl border-gray-200"
              />
              <DateTrigger
                placeholder="Selesai"
                value={filters.endDate}
                onChange={(date) => onChange('endDate', date)}
                className="w-full rounded-xl border-gray-200"
              />
            </div>
          </SearchSection>
        </div>

        {/* CATEGORY */}
        <div className="p-6 border-r border-gray-200">
          <SearchSection label="Kategori Tes" className="w-full">
            <SelectFilter
              placeholder="Kategori Tes"
              value={filters.category}
              onChange={(value) => onChange('category', value)}
              options={[
                { label: 'Semua Kategori', value: 'all' },
                { label: 'Tes Profil Karir', value: 'career' },
                { label: 'Tes Minat Bakat', value: 'minat_bakat' },
                { label: 'Tes Kepribadian', value: 'kepribadian' },
              ]}
            />
          </SearchSection>
        </div>

        {/* RESULT */}
        <div className="p-6 border-r border-gray-200">
          <SearchSection label="Hasil Tes" className="w-full">
            <SelectFilter
              placeholder="Hasil Tes"
              value={filters.result}
              onChange={(value) => onChange('result', value)}
              options={[
                { label: 'Semua Hasil', value: 'all' },
                { label: 'SEC', value: 'sec' },
                { label: 'RIA', value: 'ria' },
              ]}
            />
          </SearchSection>
        </div>

        {/* SORT */}
        <div className="p-6">
          <SearchSection label="Urutkan Berdasarkan" className="w-full">
            <SelectFilter
              placeholder="Urutkan Data"
              value={filters.sort}
              onChange={(value) => onChange('sort', value)}
              options={[
                { label: 'Nama A-Z', value: 'az' },
                { label: 'Nama Z-A', value: 'za' },
                { label: 'Terbaru', value: 'newest' },
              ]}
            />
          </SearchSection>
        </div>
      </div>

      {/* ================= MOBILE ================= */}
      <div className="w-full xl:hidden bg-white border border-gray-200 rounded-2xl p-6 space-y-6">
        <Typography variant="h6" weight="medium">
          Kontrol dan Pencarian Data
        </Typography>

        <SearchSection label="Rentang Tanggal" className="w-full">
          <div className="flex flex-col gap-3">
            <DateTrigger
              placeholder="Mulai"
              value={filters.startDate}
              onChange={(date) => onChange('startDate', date)}
            />
            <DateTrigger
              placeholder="Selesai"
              value={filters.endDate}
              onChange={(date) => onChange('endDate', date)}
            />
          </div>
        </SearchSection>

        <SearchSection label="Kategori Tes" className="w-full">
          <SelectFilter
            placeholder="Kategori Tes"
            value={filters.category}
            onChange={(value) => onChange('category', value)}
            options={[
              { label: 'Semua Kategori', value: 'all' },
              { label: 'Tes Profil Karir', value: 'career' },
              { label: 'Tes Minat Bakat', value: 'minat_bakat' },
              { label: 'Tes Kepribadian', value: 'kepribadian' },
            ]}
          />
        </SearchSection>

        <SearchSection label="Hasil Tes" className="w-full">
          <SelectFilter
            placeholder="Hasil Tes"
            value={filters.result}
            onChange={(value) => onChange('result', value)}
            options={[
              { label: 'Semua Hasil', value: 'all' },
              { label: 'SEC', value: 'sec' },
              { label: 'RIA', value: 'ria' },
            ]}
          />
        </SearchSection>

        <SearchSection label="Urutkan Berdasarkan" className="w-full">
          <SelectFilter
            placeholder="Urutkan Data"
            value={filters.sort}
            onChange={(value) => onChange('sort', value)}
            options={[
              { label: 'Nama A-Z', value: 'az' },
              { label: 'Nama Z-A', value: 'za' },
              { label: 'Terbaru', value: 'newest' },
            ]}
          />
        </SearchSection>
      </div>
    </>
  )
}
