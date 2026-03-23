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

  return (
    <div className="w-full bg-white rounded-2xl p-6 border border-gray-200">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <Typography variant="h6" weight="bold" className="text-gray-900">
            Riwayat Tes
          </Typography>
          <Typography variant="l1" className="text-gray-500 mt-1">
            Menampilkan {Math.min(perPage, totalData)} dari {totalData} data
          </Typography>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border border-red-400 bg-red-50 rounded-lg text-red-600 hover:bg-red-100 text-sm font-medium">
            <Trash2 className="w-4 h-4" />
            Hapus Data
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200">
              <TableHead className="w-10"></TableHead>
              <TableHead>
                <Typography variant="l1" weight="medium" className="text-gray-700">ID Tes</Typography>
              </TableHead>
              <TableHead>
                <Typography variant="l1" weight="medium" className="text-gray-700">Nama Pengguna</Typography>
              </TableHead>
              <TableHead>
                <Typography variant="l1" weight="medium" className="text-gray-700">Kategori</Typography>
              </TableHead>
              <TableHead className="text-center">
                <Typography variant="l1" weight="medium" className="text-gray-700">Status</Typography>
              </TableHead>
              <TableHead className="text-center">
                <Typography variant="l1" weight="medium" className="text-gray-700">Hasil</Typography>
              </TableHead>
              <TableHead>
                <Typography variant="l1" weight="medium" className="text-gray-700">Mulai</Typography>
              </TableHead>
              <TableHead>
                <Typography variant="l1" weight="medium" className="text-gray-700">Selesai</Typography>
              </TableHead>
              <TableHead className="text-center">
                <Typography variant="l1" weight="medium" className="text-gray-700">Aksi</Typography>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10">
                  <Typography variant="l1" className="text-gray-400">Tidak ada data</Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((item) => (
                <TableRow key={item.test_id} className="border-gray-100 hover:bg-gray-50">
                  <TableCell>
                    <Checkbox
                      checked={selected.has(item.test_id)}
                      onCheckedChange={() => toggleSelect(item.test_id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="l1" weight="medium" className="text-blue-600">
                      {item.test_id}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="l1" className="text-gray-800">
                      {item.user_name}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="l1" className="text-gray-600">
                      {item.category_name}
                    </Typography>
                  </TableCell>
                  <TableCell className="text-center">
                    <StatusBadge status={item.status} />
                  </TableCell>
                  <TableCell className="text-center">
                    <Typography variant="l1" weight="semibold" className="text-gray-800">
                      {item.result_code || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="l2" className="text-gray-500">
                      {item.started_at}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="l2" className="text-gray-500">
                      {item.completed_at || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell className="text-center">
                    <button className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-blue-600 transition">
                      <Pencil className="w-4 h-4" />
                    </button>
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
