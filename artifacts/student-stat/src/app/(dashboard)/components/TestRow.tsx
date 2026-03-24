import Typography from '@/components/Typography'
import { Trash2, Pencil } from 'lucide-react'
import { StatusBadge } from './StatusBadge'

// 1. Define the interface for the props
interface TestRowProps {
  id: string
  name: string
  category: string
  // This matches the union type expected by your StatusBadge component
  status: 'Selesai' | 'Berjalan' | 'Dihentikan'
  result: string
}

// 2. Apply the interface to the component function
export default function TestRow(props: TestRowProps) {
  return (
    <div className="grid grid-cols-6 items-center border-t p-3">
      <Typography variant="l2">{props.id}</Typography>
      <Typography variant="l2">{props.name}</Typography>
      <Typography variant="l2">{props.category}</Typography>
      <StatusBadge status={props.status} />
      <Typography variant="l2">{props.result}</Typography>
      <div className="flex gap-2">
        {/* Added cursor-pointer to make them interactive */}
        <Trash2 className="w-4 text-red-500 cursor-pointer" />
        <Pencil className="w-4 text-blue-500 cursor-pointer" />
      </div>
    </div>
  )
}
