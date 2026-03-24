// components/search/SearchInput.tsx
import React from 'react'
import { Search } from 'lucide-react'
// import { Input } from '@/components/ui/input' // Assuming you have a shadcn/base input or standard input
import { cn } from '@/lib/utils'

interface SearchInputProps {
  placeholder?: string
  className?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder,
  className,
  onChange,
}) => {
  return (
    <div className={cn('relative w-full', className)}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
      <input
        type="text"
        placeholder={placeholder}
        onChange={onChange}
        className="w-full h-[49px] pl-10 pr-4 rounded-xl border border-gray-200 text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-1 focus:ring-gray-300 text-[14px] or-l1"
      />
    </div>
  )
}
