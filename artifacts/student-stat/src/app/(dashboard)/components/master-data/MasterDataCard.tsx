'use client'
import React from 'react'
import Typography from '@/components/Typography'

/* =======================
   RIASEC CONSTANTS
======================= */

const RIASEC_VALUES = ['R', 'I', 'A', 'S', 'E', 'C'] as const
type RIASECValue = (typeof RIASEC_VALUES)[number]

/* =======================
   RIASEC TYPE
======================= */

export type RIASECType = {
  type: RIASECValue
}

/* =======================
   RIASEC TYPE BUBBLE
======================= */

export const RIASECTypeBubble = ({ type }: RIASECType) => {
  let color = ''
  let textColor = ''

  if (type === 'R') {
    color = 'bg-[#F97316]/15 outline outline-1 outline-[#FB923C]'
    textColor = 'text-[#FB923C]'
  } else if (type === 'I') {
    color = 'bg-[#3B82F6]/15 outline outline-1 outline-[#60A5FA]'
    textColor = 'text-[#60A5FA]'
  } else if (type === 'A') {
    color = 'bg-[#A855F7]/15 outline outline-1 outline-[#C084FC]'
    textColor = 'text-[#C084FC]'
  } else if (type === 'S') {
    color = 'bg-[#10B981]/15 outline outline-1 outline-[#34D399]'
    textColor = 'text-[#34D399]'
  } else if (type === 'E') {
    color = 'bg-[#F59E0B]/15 outline outline-1 outline-[#FBBF24]'
    textColor = 'text-[#FBBF24]'
  } else if (type === 'C') {
    color = 'bg-[#06B6D4]/15 outline outline-1 outline-[#22D3EE]'
    textColor = 'text-[#22D3EE]'
  }

  return (
    <div
      className={`p-3 w-14 h-14 ${color} rounded-xl flex items-center justify-center`}
    >
      <Typography variant="h6" className={textColor}>
        {type}
      </Typography>
    </div>
  )
}

/* =======================
   TYPE GUARD
======================= */

const isRIASECTypeBubble = (
  child: React.ReactNode,
): child is React.ReactElement<RIASECType> => {
  return (
    React.isValidElement(child) &&
    child.props !== null &&
    typeof child.props === 'object' &&
    'type' in child.props &&
    typeof child.props.type === 'string' &&
    RIASEC_VALUES.includes(child.props.type as RIASECValue)
  )
}

/* =======================
   MASTER DATA CARD
======================= */

interface MasterDataCardProps {
  children: React.ReactNode
  id: number
  onClick?: () => void
}

const RIASEC_LABEL_MAP: Record<RIASECValue, string> = {
  R: 'Realistic',
  I: 'Investigative',
  A: 'Artistic',
  S: 'Social',
  E: 'Enterprising',
  C: 'Conventional',
}

const MasterDataCard = ({ children, id }: MasterDataCardProps) => {
  const bubbles = React.Children.toArray(children).filter(isRIASECTypeBubble)

  const riasecText = bubbles
    .map((child) => RIASEC_LABEL_MAP[child.props.type])
    .join(' - ')

  return (
    <div
      className="flex flex-col p-6 rounded-xl
      bg-[url(/images/dashboard/MasterCardBG.png)]
      bg-[length:110%_110%] bg-center
      outline outline-1 outline-[#B5B7B8]"
    >
      {/* Top Row */}
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-x-3">{bubbles}</div>

        <div className="flex bg-[#EDEFF2] rounded-xl w-auto h-fit py-1 px-3">
          <Typography variant="l2" className="text-[#676F7E]">
            ID: #{id}
          </Typography>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="flex flex-row justify-between mt-5">
        <Typography variant="l2" className="text-[#676F7E]">
          {riasecText}
        </Typography>

        <div
          className="rounded-xl bg-[#2662D9] py-1 px-3 hover:cursor-pointer"
          onClick={() => onclick}
        >
          <Typography variant="l2" className="text-white">
            Lihat Detail
          </Typography>
        </div>
      </div>
    </div>
  )
}

export default MasterDataCard
