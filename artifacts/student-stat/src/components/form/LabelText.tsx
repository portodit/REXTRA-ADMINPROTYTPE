import { ReactNode } from 'react'

import Typography from '@/components/Typography'

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
      <Typography className={cn('text-gray-900', labelTextClasname)}>
        {children} {required && <span className="text-red-500">*</span>}
      </Typography>
    </label>
  )
}
