import * as React from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import Typography from '@/components/Typography'

interface DateTriggerProps {
  className?: string
  placeholder: string
  value?: Date
  onChange?: (date: Date | undefined) => void
}

export const DateTrigger: React.FC<DateTriggerProps> = ({
  className,
  placeholder,
  value,
  onChange,
}) => {
  const [open, setOpen] = React.useState(false)
  const wrapperRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <Button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'bg-white shadow-none border w-full justify-start text-left font-normal h-auto hover:bg-gray-200/25 rounded-xl border-gray-200',
          !value && 'text-muted-foreground',
          className,
        )}
      >
        <CalendarIcon className="mr-2 h-4 w-4 text-gray-500" />
        <Typography variant="l1" className="text-gray-600">
          {value ? format(value, 'dd MMM yyyy') : placeholder}
        </Typography>
      </Button>

      {open && (
        <div className="absolute z-50 mt-2 bg-white border rounded-xl shadow-lg p-3">
          <Calendar
            mode="single"
            className="text-black bg-white"
            selected={value}
            onSelect={(date) => {
              onChange?.(date)
              setOpen(false)
            }}
            initialFocus
          />
        </div>
      )}
    </div>
  )
}
