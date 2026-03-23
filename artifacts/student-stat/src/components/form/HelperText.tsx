import { ReactNode } from 'react'

import Typography from '@/components/Typography'

import { cn } from '@/lib/utils'
export default function HelperText({
  children,
  helperTextClassName,
}: {
  children: ReactNode
  helperTextClassName?: string
}) {
  return (
    <div className="flex space-x-1">
      <Typography
        as="p"
        weight="regular"
        className={cn(
          'text-xs !leading-tight text-gray-900',
          helperTextClassName,
        )}
      >
        {children}
      </Typography>
    </div>
  )
}
