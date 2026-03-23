import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Checkbox } from '@/components/ui/checkbox'
import { Trash2, Pencil } from 'lucide-react'
import { TablePagination } from './TablePagination'
import Typography from '@/components/Typography'
import { cn } from '@/lib/utils'
import { KenaliDiriHistoryItem } from '@/types/kenali-diri'

interface TestDataTableProps {
  tableData: KenaliDiriHistoryItem[]
}

const StatusBadge = ({ status }: { status: KenaliDiriHistoryItem['status'] }) => {
  const configs = {
    completed: {
      label: 'Selesai',
      className: 'bg-green-50 text-green-600 border-green-200',
    },
    in_progress: {
      label: 'Berjalan',
      className: 'bg-orange-50 text-orange-600 border-orange-200',
    },
    abandoned: {
      label: 'Dihentikan',
      className: 'bg-red-50 text-red-600 border-red-200',
    },
  }

  const config = configs[status] || configs.in_progress

  return (
    <div
      className={cn(
        'inline-flex items-center px-6 py-1 rounded-lg border-[1.5px] text-sm font-medium justify-center min-w-[120px]',
        config.className,
      )}
    >
      {config.label}
    </div>
  )
}

export default function MahasiswaHasilTestDataTable({ tableData }: TestDataTableProps) {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(10)
  const [selected, setSelected] = React.useState<Set<string>>(new Set())

  const totalData = tableData.length
  const totalPages = Math.ceil(totalData / perPage)

  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * perPage
    return tableData.slice(start, start + perPage)
  }, [tableData, currentPage, perPage])

  React.useEffect(() => {
    setCurrentPage(1)
  }, [tableData])

  const toggleSelect = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const toggleAll = () => {
    if (selected.size === paginatedData.length) {
      setSelected(new Set())
    } else {
      setSelected(new Set(paginatedData.map((d) => d.test_id)))
    }
  }

  return (
    <div className="w-full bg-white rounded-2xl p-6 border border-gray-200">
      {/* Header */}
      <div className="flex flex-col mb-6 gap-4">
        <div>
          <Typography variant="h6" weight="bold" className="text-gray-900">
            List Data
          </Typography>
          <Typography variant="l1" className="text-gray-500 mt-1">
            Menampilkan {Math.min(perPage, totalData)} dari {totalData} data hasil tes
          </Typography>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200 rounded-xl">
              <TableHead className="text-center w-10">
                <Checkbox
                  checked={selected.size === paginatedData.length && paginatedData.length > 0}
                  onCheckedChange={toggleAll}
                />
              </TableHead>
              <TableHead>
                <Typography variant="l1" weight="medium" className="text-gray-700 text-center">
                  ID Test
                </Typography>
              </TableHead>
              <TableHead>
                <Typography variant="l1" weight="medium" className="text-gray-700 text-center">
                  Nama
                </Typography>
              </TableHead>
              <TableHead>
                <Typography variant="l1" weight="medium" className="text-gray-700 text-center">
                  Kategori
                </Typography>
              </TableHead>
              <TableHead>
                <Typography variant="l1" weight="medium" className="text-gray-700 text-center">
                  Status
                </Typography>
              </TableHead>
              <TableHead>
                <Typography variant="l1" weight="medium" className="text-gray-700 text-center">
                  Hasil
                </Typography>
              </TableHead>
              <TableHead>
                <Typography variant="l1" weight="medium" className="text-gray-700 text-center">
                  Aksi
                </Typography>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10">
                  <Typography variant="l1" className="text-gray-400">Tidak ada data</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow key={row.test_id} className="border-gray-100 hover:bg-gray-50">
                  <TableCell className="text-center">
                    <Checkbox
                      checked={selected.has(row.test_id)}
                      onCheckedChange={() => toggleSelect(row.test_id)}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Typography variant="l1" weight="medium" className="text-blue-600">
                      #{row.test_id}
                    </Typography>
                  </TableCell>
                  <TableCell className="text-center">
                    <Typography variant="l1" className="text-gray-800">
                      {row.user_name}
                    </Typography>
                  </TableCell>
                  <TableCell className="text-center">
                    <Typography variant="l1" className="text-gray-600">
                      {row.category_name}
                    </Typography>
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={row.status} />
                  </TableCell>
                  <TableCell className="text-center">
                    <Typography variant="l1" weight="medium" className="text-gray-700">
                      {row.result_code || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-3">
                      <button className="text-red-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-5 h-5" />
                      </button>
                      <button className="text-blue-400 hover:text-blue-600 transition-colors">
                        <Pencil className="w-5 h-5" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <TablePagination
        currentPage={currentPage}
        totalPages={Math.max(1, totalPages)}
        perPage={perPage}
        totalData={totalData}
        onPageChange={setCurrentPage}
        onPerPageChange={(v) => { setPerPage(v); setCurrentPage(1) }}
      />
    </div>
  )
}
