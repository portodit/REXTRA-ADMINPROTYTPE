import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export default function HelperText({
  children,
  helperTextClassName,
}: {
  children: ReactNode
  helperTextClassName?: string
}) {
  return (
    <p className={cn('text-xs text-gray-500 mt-1', helperTextClassName)}>
      {children}
    </p>
  )
}
