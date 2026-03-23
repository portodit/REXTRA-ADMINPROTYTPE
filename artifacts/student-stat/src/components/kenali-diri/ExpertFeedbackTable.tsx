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
import { Button } from '@/components/ui/button'
import { TablePagination } from './TablePagination'
import Typography from '@/components/Typography'
import { Top5Badge } from './Top5Badge'
import type { Top5Status } from './Top5Badge'
import { cn } from '@/lib/utils'
import { ExpertFeedbackItem } from '@/types/kenali-diri'

const VALID_TOP5: Top5Status[] = ['P1', 'P2', 'P3-5', 'Tidak Muncul']
function toTop5(val: string | undefined): Top5Status {
  return VALID_TOP5.includes(val as Top5Status) ? (val as Top5Status) : 'Tidak Muncul'
}

const ScoreBadge = ({ value }: { value: number }) => {
  const color =
    value >= 6
      ? 'bg-green-100 text-green-700 border-green-300'
      : value >= 4
        ? 'bg-orange-100 text-orange-700 border-orange-300'
        : 'bg-red-100 text-red-700 border-red-300'
  return (
    <div className={`px-2 py-0.5 rounded-full border ${color} text-center`}>
      <Typography variant="l1" weight="medium">{value}/7</Typography>
    </div>
  )
}

const KendalaCell = ({ labels }: { labels: string[] }) => {
  if (labels.length === 0) {
    return (
      <div className="w-full max-w-[200px] mx-auto px-3 py-1.5 rounded-lg border text-center bg-white border-[#B5B7B8]">
        <Typography variant="l1" weight="medium">—</Typography>
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-1 max-w-[200px] mx-auto">
      {labels.slice(0, 2).map((item, i) => (
        <div key={i} className={cn('px-3 py-1.5 rounded-lg border text-center text-xs break-words whitespace-normal', 'bg-blue-50 border-blue-200 text-blue-700')}>
          <Typography variant="l1" weight="medium">{item}</Typography>
        </div>
      ))}
      {labels.length > 2 && (
        <Typography variant="l2" className="text-gray-400 text-center">+{labels.length - 2} lainnya</Typography>
      )}
    </div>
  )
}

interface Props {
  tableData: ExpertFeedbackItem[]
}

export default function ExpertFeedbackTable({ tableData }: Props) {
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
            Menampilkan {Math.min(perPage, totalData)} dari {totalData} data umpan balik expert
          </Typography>
        </div>
        <div className="flex gap-3">
          <Button className="border-[#E24A4A] border-1 hover:bg-red-100 bg-[#F8D4D4]/25 text-[#E24A4A] gap-2">
            <Trash2 className="w-4 h-4" />
            <Typography variant="l1" weight="medium" className="text-red-600">Hapus Data</Typography>
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200">
              <TableHead className="w-10"></TableHead>
              <TableHead><Typography variant="l1" weight="medium" className="text-gray-700">ID</Typography></TableHead>
              <TableHead><Typography variant="l1" weight="medium" className="text-gray-700">Expert</Typography></TableHead>
              <TableHead className="text-center"><Typography variant="l1" weight="medium" className="text-gray-700">Top-N</Typography></TableHead>
              <TableHead className="text-center"><Typography variant="l1" weight="medium" className="text-gray-700">Kemudahan</Typography></TableHead>
              <TableHead className="text-center"><Typography variant="l1" weight="medium" className="text-gray-700">Relevansi</Typography></TableHead>
              <TableHead className="text-center"><Typography variant="l1" weight="medium" className="text-gray-700">Kepuasan</Typography></TableHead>
              <TableHead><Typography variant="l1" weight="medium" className="text-gray-700">Kendala</Typography></TableHead>
              <TableHead className="text-center"><Typography variant="l1" weight="medium" className="text-gray-700">Aksi</Typography></TableHead>
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
              paginatedData.map((row) => (
                <TableRow key={row.id} className="border-gray-100 hover:bg-gray-50">
                  <TableCell><Checkbox /></TableCell>
                  <TableCell>
                    <Typography variant="l1" weight="medium" className="text-blue-600">#{row.id}</Typography>
                  </TableCell>
                  <TableCell>
                    <div>
                      <Typography variant="l1" weight="medium" className="text-gray-800">{row.expert.name}</Typography>
                      <Typography variant="l2" className="text-gray-500">{row.expert.email}</Typography>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Top5Badge value={toTop5(row.top5_status)} />
                  </TableCell>
                  <TableCell className="text-center"><ScoreBadge value={row.scores.ease} /></TableCell>
                  <TableCell className="text-center"><ScoreBadge value={row.scores.relevance} /></TableCell>
                  <TableCell className="text-center"><ScoreBadge value={row.scores.satisfaction} /></TableCell>
                  <TableCell>
                    <KendalaCell labels={row.obstacles.map((o) => o.label)} />
                  </TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-blue-400 hover:text-blue-600 hover:bg-blue-50">
                        <Pencil className="w-4 h-4" />
                      </Button>
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
