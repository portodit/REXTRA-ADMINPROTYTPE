// components/search/SelectFilter.tsx
import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import Typography from '@/components/Typography'

interface SelectFilterProps {
  placeholder: string
  options: { label: string; value: string }[]
  value?: string
  onChange?: (value: string) => void
}

export const SelectFilter: React.FC<SelectFilterProps> = ({
  placeholder,
  options,
  value,
  onChange,
}) => {
  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-full h-[46px] rounded-xl border-gray-200">
        <Typography variant="l1" className="text-gray-600 truncate">
          <SelectValue placeholder={placeholder} />
        </Typography>
      </SelectTrigger>
      <SelectContent className="bg-white">
        {options.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            <Typography variant="l1">{option.label}</Typography>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
