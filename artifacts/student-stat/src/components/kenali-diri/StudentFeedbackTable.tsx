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
import { Trash2, UploadCloud } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TablePagination } from './TablePagination'
import Typography from '@/components/Typography'
import { StudentFeedbackItem } from '@/types/kenali-diri'

export const ScoreBadge = ({ value }: { value: number }) => {
  const color =
    value >= 6
      ? 'bg-green-100 text-green-700 border-green-300'
      : value >= 4
        ? 'bg-orange-100 text-orange-700 border-orange-300'
        : 'bg-red-100 text-red-700 border-red-300'

  return (
    <div className={`px-2 py-0.5 rounded-full border ${color} text-center`}>
      <Typography variant="l1" weight="medium">
        {value}/7
      </Typography>
    </div>
  )
}

interface Props {
  tableData: StudentFeedbackItem[]
}

export default function StudentFeedbackTable({ tableData }: Props) {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(10)

  const totalData = tableData.length
  const totalPages = Math.ceil(totalData / perPage)

  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * perPage
    return tableData.slice(start, start + perPage)
  }, [tableData, currentPage, perPage])

  React.useEffect(() => setCurrentPage(1), [tableData])

  return (
    <div className="w-full bg-white rounded-2xl p-6 border border-gray-200">
      <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4">
        <div>
          <Typography variant="h6" weight="bold" className="text-gray-900">
            List Data
          </Typography>
          <Typography variant="l1" className="text-gray-500 mt-1">
            Menampilkan {Math.min(perPage, totalData)} dari {totalData} data umpan balik
          </Typography>
        </div>
        <div className="flex gap-3">
          <Button className="border-[#E24A4A] border-1 hover:bg-red-100 bg-[#F8D4D4]/25 text-[#E24A4A] gap-2">
            <Trash2 className="w-4 h-4" />
            <Typography variant="l1" weight="medium" className="text-red-600">Hapus Data</Typography>
          </Button>
          <Button className="border-[#0046CC] border-1 bg-[#CCDDFF]/25 hover:bg-blue-100 gap-2">
            <Typography variant="l1" weight="medium" className="text-blue-600">Ekspor Data</Typography>
            <UploadCloud className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200">
              <TableHead className="w-10"></TableHead>
              <TableHead><Typography variant="l1" weight="medium" className="text-gray-700">ID</Typography></TableHead>
              <TableHead><Typography variant="l1" weight="medium" className="text-gray-700">Pengguna</Typography></TableHead>
              <TableHead className="text-center"><Typography variant="l1" weight="medium" className="text-gray-700">Kemudahan</Typography></TableHead>
              <TableHead className="text-center"><Typography variant="l1" weight="medium" className="text-gray-700">Relevansi</Typography></TableHead>
              <TableHead className="text-center"><Typography variant="l1" weight="medium" className="text-gray-700">Kepuasan</Typography></TableHead>
              <TableHead><Typography variant="l1" weight="medium" className="text-gray-700">Kategori</Typography></TableHead>
              <TableHead><Typography variant="l1" weight="medium" className="text-gray-700">Pesan</Typography></TableHead>
              <TableHead><Typography variant="l1" weight="medium" className="text-gray-700">Tanggal</Typography></TableHead>
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
                <TableRow key={item.id} className="border-gray-100 hover:bg-gray-50">
                  <TableCell><Checkbox /></TableCell>
                  <TableCell>
                    <Typography variant="l1" weight="medium" className="text-blue-600">#{item.id}</Typography>
                  </TableCell>
                  <TableCell>
                    <div>
                      <Typography variant="l1" weight="medium" className="text-gray-800">{item.student.name}</Typography>
                      <Typography variant="l2" className="text-gray-500">{item.student.email}</Typography>
                    </div>
                  </TableCell>
                  <TableCell className="text-center"><ScoreBadge value={item.scores.ease} /></TableCell>
                  <TableCell className="text-center"><ScoreBadge value={item.scores.relevance} /></TableCell>
                  <TableCell className="text-center"><ScoreBadge value={item.scores.satisfaction} /></TableCell>
                  <TableCell>
                    <Typography variant="l2" className="text-gray-600">{item.test_category}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="l2" className="text-gray-500 max-w-[150px] truncate">
                      {item.message_to_team || '-'}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="l2" className="text-gray-500">{item.submitted_at}</Typography>
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
