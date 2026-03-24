// components/search/FilterActions.tsx
import React from 'react'
import { Button } from '@/components/ui/button'
import { SlidersHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'
import Typography from '@/components/Typography'

interface FilterActionsProps {
  onApply?: () => void
  onReset?: () => void
  className?: string
}

export const FilterActions: React.FC<FilterActionsProps> = ({
  onApply,
  onReset,
  className,
}) => {
  return (
    <div className={cn('flex w-fit items-center gap-3', className)}>
      {/* Terapkan Filter Button */}
      <Button
        onClick={onApply}
        className="bg-white shadow-none border-1  justify-start text-left font-normal h-[49px] hover:bg-gray-200/25 rounded-xl border-gray-200"
      >
        <Typography variant="l1" weight="medium" className="text-gray-900">
          Terapkan Filter
        </Typography>
        <SlidersHorizontal className="h-4 w-4 text-gray-900" />
      </Button>

      {/* Reset Filter Button */}
      <Button
        onClick={onReset}
        className="bg-white shadow-none border-1 justify-start text-left font-normal h-[49px] hover:bg-gray-200/25 rounded-xl border-red-700"
      >
        <Typography variant="l1" weight="medium" className="text-red-700">
          Reset Filter
        </Typography>
      </Button>
    </div>
  )
}
