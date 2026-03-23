import React from 'react'
import { Search } from 'lucide-react'

interface SearchBarProps {
  value?: string
  onSearch?: (value: string) => void
  className?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value = '',
  onSearch,
  className = '',
}) => {
  return (
    <div className={`flex w-full items-center ${className}`}>
      <div className="flex w-full items-center gap-3 px-4 h-[40px] rounded-lg border border-gray-300 bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
        <Search className="h-5 w-5 text-gray-400 flex-shrink-0" />
        <input
          type="text"
          value={value}
          onChange={(e) => onSearch?.(e.target.value)}
          placeholder="Ketikkan nama pengguna atau kode tes"
          className="flex-1 bg-transparent outline-none text-gray-700 placeholder:text-gray-400 text-sm"
        />
      </div>
    </div>
  )
}
