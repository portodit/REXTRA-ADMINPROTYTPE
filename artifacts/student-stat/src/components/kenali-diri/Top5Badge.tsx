import React from 'react'
import { cn } from '@/lib/utils'
import Typography from '@/components/Typography'

export type Top5Status = 'P1' | 'P2' | 'P3-5' | 'Tidak Muncul'

interface Top5BadgeProps {
  value: Top5Status
}

export const Top5Badge: React.FC<Top5BadgeProps> = ({ value }) => {
  const styles: Record<Top5Status, string> = {
    P1: 'border-[#16A34A] text-[#16A34A] bg-[#E3FFEE]',
    P2: 'border-[#2563EB] text-[#2563EB] bg-[#E0EAFF]',
    'P3-5': 'border-[#FF7409] text-[#FF7409] bg-[#FFF1E3]',
    'Tidak Muncul': 'border-[#9CA3AF] text-[#6B7280] bg-[#F3F4F6]',
  }

  return (
    <div
      className={cn(
        'flex w-full items-center justify-center px-4 py-1.5 rounded-lg border',
        styles[value],
      )}
    >
      <Typography variant="l1" weight="medium">
        {value}
      </Typography>
    </div>
  )
}
