'use client'

import * as React from 'react'
import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import Typography from '@/components/Typography'
import { format } from 'date-fns'
import { DateRange } from 'react-day-picker'

interface Props {
  label: string
}

export default function DateRangePicker({ label }: Props) {
  const [range, setRange] = React.useState<DateRange | undefined>()

  return (
    <div>
      <Typography variant="l2">{label}</Typography>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-start text-left">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <Typography variant="l2">
              {range?.from
                ? range.to
                  ? `${format(range.from, 'dd MMM')} - ${format(range.to, 'dd MMM')}`
                  : format(range.from, 'dd MMM yyyy')
                : 'Pilih tanggal'}
            </Typography>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="p-0 w-auto" align="start">
          <Calendar
            mode="range"
            selected={range}
            onSelect={setRange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
