import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

export default function LabelText({
  children,
  labelTextClasname,
  required,
}: {
  children: ReactNode
  labelTextClasname?: string
  required?: boolean
}) {
  return (
    <label>
      <p className={cn('text-gray-900', labelTextClasname)}>
        {children} {required && <span className="text-red-500">*</span>}
      </p>
    </label>
  )
}
