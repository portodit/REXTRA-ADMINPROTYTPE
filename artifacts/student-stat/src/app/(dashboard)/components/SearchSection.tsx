// components/search/SearchSection.tsx
import Typography from '@/components/Typography'
import React from 'react'

interface SearchSectionProps {
  label: string
  children: React.ReactNode
  className?: string
}

export const SearchSection: React.FC<SearchSectionProps> = ({
  label,
  children,
  className,
}) => {
  return (
    <div className={`flex flex-col gap-2 w-fit ${className}`}>
      <Typography
        variant="l1"
        weight="medium"
        className="text-gray-900 xl:block hidden"
      >
        {label}
      </Typography>
      <div className="w-full">{children}</div>
    </div>
  )
}
