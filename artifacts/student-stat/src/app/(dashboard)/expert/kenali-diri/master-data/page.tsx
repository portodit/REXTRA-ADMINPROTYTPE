'use client'

import React, { useMemo, useState } from 'react'
import DataTabsMasterData from '@/app/(dashboard)/components/master-data/DataTabsMasterData'
import MasterDataHead from '@/app/(dashboard)/components/master-data/MasterDataHead'
import { RIASECType } from '@/app/(dashboard)/components/master-data/RIASECTypeBubble'
import { useRiasecCodesQuery } from './hooks/riasec'

export type RIASECItem = {
  id: number
  types: RIASECType[]
}

export default function MasterData() {
  const [filter, setFilter] = useState<'all' | 1 | 2 | 3>('all')
  const [search, setSearch] = useState('')

  const codeTypeMap = {
    all: '',
    1: 'single',
    2: 'double',
    3: 'triple',
  }

  const { data: res, isLoading } = useRiasecCodesQuery({
    code_type: codeTypeMap[filter],
    search,
  })

  const data: RIASECItem[] = useMemo(() => {
    if (!res?.data?.data) return []

    return res.data.data.map((item) => ({
      id: item.id,
      types: item.code.split('') as RIASECType[],
    }))
  }, [res])

  const counts = useMemo(() => {
    const one = data.filter((d) => d.types.length === 1).length
    const two = data.filter((d) => d.types.length === 2).length
    const three = data.filter((d) => d.types.length === 3).length

    return {
      all: data.length,
      one,
      two,
      three,
    }
  }, [data])

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="flex min-h-screen bg-white p-6">
      <div className="w-full max-w-7xl mx-auto space-y-6">
        <MasterDataHead search={search} onSearchChange={setSearch} />

        <DataTabsMasterData
          data={data}
          counts={counts}
          activeFilter={filter}
          onFilterChange={setFilter}
        />
      </div>
    </div>
  )
}
