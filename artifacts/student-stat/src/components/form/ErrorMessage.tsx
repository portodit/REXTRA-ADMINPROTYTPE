import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export default function ErrorMessage({
  children,
  className,
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <p className={cn('text-xs text-red-500 mt-1', className)}>{children}</p>
  )
}
