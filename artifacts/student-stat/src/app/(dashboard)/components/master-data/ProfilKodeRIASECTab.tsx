'use client'

import React from 'react'
import Typography from '@/components/Typography'
import MasterDataCard from './MasterDataCard'
import { RIASECType, RIASECTypeBubble } from './RIASECTypeBubble'

type Props = {
  data: {
    id: number
    types: RIASECType[]
  }[]
  counts: {
    all: number
    one: number
    two: number
    three: number
  }
  activeFilter: 'all' | 1 | 2 | 3
  onFilterChange: (value: 'all' | 1 | 2 | 3) => void
}

const ProfilKodeRIASECTab = ({
  data,
  counts,
  activeFilter,
  onFilterChange,
}: Props) => {
  return (
    <div className="flex flex-col gap-y-5 ">
      {/* FILTER HEADER */}
      <div
        className="
          flex gap-2 w-full overflow-x-auto flex-nowrap scrollbar-hidebg-[#D3D4D4]/15 outline outline-1 outline-[#B5B7B8] rounded-lg py-2 px-5"
      >
        {/* Semua */}
        <FilterItem
          label="Semua"
          count={counts.all}
          active={activeFilter === 'all'}
          onClick={() => onFilterChange('all')}
        />

        {/* 1 Huruf */}
        <FilterItem
          label="1 Huruf"
          count={counts.one}
          active={activeFilter === 1}
          onClick={() => onFilterChange(1)}
        />

        {/* 2 Huruf */}
        <FilterItem
          label="2 Huruf"
          count={counts.two}
          active={activeFilter === 2}
          onClick={() => onFilterChange(2)}
        />

        {/* 3 Huruf */}
        <FilterItem
          label="3 Huruf"
          count={counts.three}
          active={activeFilter === 3}
          onClick={() => onFilterChange(3)}
        />
      </div>

      {/* CARDS */}
      <div className="flex flex-col xl:grid xl:grid-cols-3 gap-4 mt-12">
        {data.map((item) => (
          <MasterDataCard key={item.id} id={item.id}>
            {item.types.map((t, i) => (
              <RIASECTypeBubble key={i} type={t} />
            ))}
          </MasterDataCard>
        ))}
      </div>
    </div>
  )
}

export default ProfilKodeRIASECTab

const FilterItem = ({
  label,
  count,
  active,
  onClick,
}: {
  label: string
  count: number
  active: boolean
  onClick: () => void
}) => {
  return (
    <div
      onClick={onClick}
      className="flex flex-row gap-x-2 items-center cursor-pointer"
    >
      <Typography
        variant="l2"
        className={
          active
            ? 'text-[#003499] font-bold whitespace-nowrap'
            : 'text-[#003499] inline-flex whitespace-nowrap'
        }
      >
        {label}
      </Typography>

      <div className="bg-[#0046CC] rounded-xl">
        <Typography variant="l2" weight="bold" className="py-1 px-3 text-white">
          {count}
        </Typography>
      </div>
    </div>
  )
}
