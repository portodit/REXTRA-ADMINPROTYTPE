// components/search/DetailedSearchInfo.tsx
import React from 'react'
import { SelectFilter } from './SelectFilter'
import Typography from '@/components/Typography'

export default function KontrolVisualisasi() {
  return (
    // 1. Main Container: Fixed to 'flex-col' to stack Inputs (Top) and Actions (Bottom)
    <div className="w-full  bg-white border border-gray-200 rounded-2xl p-6  flex flex-col gap-6 mb-12">
      {/* 2. Top Section: Inputs (Row on Desktop, Col on Mobile) */}
      <Typography variant="t2" weight="medium" className="text-gray-900">
        Kontrol Visualisasi
      </Typography>
      <div className="w-1/4 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-3">
        {/* Section 2: Kategori Tes */}
        <SelectFilter
          placeholder="Tes Profil Karir"
          options={[
            { label: 'Tes Profil Karir', value: 'career' },
            { label: 'Tes IQ', value: 'iq' },
          ]}
        />
        <SelectFilter
          placeholder="Mingguan"
          options={[
            { label: 'Mingguan', value: 'mingguan' },
            { label: 'Bulanan', value: 'bulanan' },
            { label: 'Tahunan', value: 'tahunan' },
          ]}
        />
      </div>
    </div>
  )
}
