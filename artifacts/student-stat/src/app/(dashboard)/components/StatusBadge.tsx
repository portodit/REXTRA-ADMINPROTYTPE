// components/table/StatusBadge.tsx
import React from 'react'
import { cn } from '@/lib/utils'
import Typography from '@/components/Typography'

type StatusType = 'Selesai' | 'Berjalan' | 'Dihentikan' | 'Sedang_Berjalan'

interface StatusBadgeProps {
  status: StatusType
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const styles = {
    Selesai: 'border-[#16A34A] text-[#16A34A] bg-[#E3FFEE]',
    Berjalan: 'border-[#FF7409] text-[#FF7409] bg-[#FFF1E3]',
    Dihentikan: 'border-[#B72020] text-[#B72020] bg-[#F8D4D4]',
    Sedang_Berjalan: 'border-[#B72020] text-[#B72020] bg-[#F8D4D4]',
  }

  return (
    <div
      className={cn(
        'flex w-full items-center justify-center px-4 py-1.5 rounded-lg border',
        styles[status],
      )}
    >
      <Typography variant="l1" weight="medium" className="currentColor">
        {status}
      </Typography>
    </div>
  )
}
