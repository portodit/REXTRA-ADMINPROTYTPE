import React from 'react'
import ProfilKodeRIASECTab from './ProfilKodeRIASECTab'
import { RIASECItem } from '../../expert/kenali-diri/master-data/page'

type Props = {
  data: RIASECItem[]
  counts: {
    all: number
    one: number
    two: number
    three: number
  }
  activeFilter: 'all' | 1 | 2 | 3
  onFilterChange: (value: 'all' | 1 | 2 | 3) => void
}

export default function DataTabsMasterData({
  data,
  counts,
  activeFilter,
  onFilterChange,
}: Props) {
  return (
    <ProfilKodeRIASECTab
      data={data}
      counts={counts}
      activeFilter={activeFilter}
      onFilterChange={onFilterChange}
    />
  )
}
