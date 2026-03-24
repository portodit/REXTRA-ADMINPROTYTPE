'use client'

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
import { Button } from '@/components/ui/button'
import { Trash2, UploadCloud, Pencil } from 'lucide-react'
import { TablePagination } from './TablePagination'
import Typography from '@/components/Typography'
// import { cn } from '@/lib/utils'
// import { Top5Badge } from './Top5Badge'
import {
  // ExpertFeedbackItem,
  StudentFeedbackItem,
} from '@/types/kenali-diri'
import { ScoreBadge } from './TestExpertTable'

export type TestStatus = 'Selesai' | 'Berjalan' | 'Dihentikan'

export type TestResultType = 'SEC' | 'RIA' | string

export type MahasiswaTestTable = StudentFeedbackItem

interface TestDataTableProps {
  tableData: MahasiswaTestTable[]
}

export default function TestMahasiswaDataTable({
  tableData,
}: TestDataTableProps) {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(10)

  const totalData = tableData.length
  const totalPages = Math.ceil(totalData / perPage)

  const paginatedData = React.useMemo(() => {
    const start = (currentPage - 1) * perPage
    return tableData.slice(start, start + perPage)
  }, [tableData, currentPage, perPage])

  // Reset to page 1 whenever the data set changes (e.g. after filtering)
  React.useEffect(() => {
    setCurrentPage(1)
  }, [tableData])

  return (
    <div className="w-full bg-white rounded-2xl p-6 border border-gray-200">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between items-center mb-6 gap-4">
        <div className="w-full">
          <Typography
            variant="h6"
            weight="bold"
            className="text-gray-900 text-center lg:text-start"
          >
            List Data
          </Typography>
          <Typography
            variant="l1"
            className="text-gray-500 mt-1 text-center lg:text-start"
          >
            Menampilkan {Math.min(perPage, totalData)} dari {totalData} data
            umpan balik
          </Typography>
        </div>
        <div className="w-full justify-start lg:justify-end flex gap-3 lg:flex-row flex-col">
          <Button className="border-[#E24A4A] border-1 hover:bg-red-100 bg-[#F8D4D4]/25 text-[#E24A4A] gap-2">
            <Trash2 className="w-4 h-4" />
            <Typography variant="l1" weight="medium" className="text-red-600">
              Hapus Data
            </Typography>
          </Button>
          <Button className="border-[#0046CC] border-1 bg-[#CCDDFF]/25 hover:bg-blue-100 text-[#0046CC] gap-2">
            <Typography variant="l1" weight="medium" className="text-blue-600">
              Ekspor Data
            </Typography>
            <UploadCloud className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="border-gray-200 rounded-xl">
              <TableHead className="text-center"></TableHead>
              <TableHead>
                <Typography
                  variant="l1"
                  weight="medium"
                  className="text-gray-700 text-center"
                >
                  ID
                </Typography>
              </TableHead>
              <TableHead>
                <Typography
                  variant="l1"
                  weight="medium"
                  className="text-gray-700 text-center"
                >
                  Pengguna
                </Typography>
              </TableHead>
              <TableHead>
                <Typography
                  variant="l1"
                  weight="medium"
                  className="text-gray-700 text-center"
                >
                  Kemudahan Tes
                </Typography>
              </TableHead>
              <TableHead className="text-center">
                <Typography
                  variant="l1"
                  weight="medium"
                  className="text-gray-700 text-center"
                >
                  Relevansi Rekomendasi
                </Typography>
              </TableHead>
              <TableHead className="text-center">
                <Typography
                  variant="l1"
                  weight="medium"
                  className="text-gray-700"
                >
                  Kapasitas Fitur
                </Typography>
              </TableHead>
              <TableHead className="text-center">
                <Typography
                  variant="l1"
                  weight="medium"
                  className="text-gray-700"
                >
                  Kendala
                </Typography>
              </TableHead>
              <TableHead className="text-center">
                <Typography
                  variant="l1"
                  weight="medium"
                  className="text-gray-700"
                >
                  Aksi
                </Typography>
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedData.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={11}
                  className="text-center py-16 text-gray-400"
                >
                  <Typography variant="l1" font="Poppins">
                    Tidak ada data ditemukan.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-b border-gray-200 hover:bg-gray-50/50"
                >
                  {/* Checkbox */}
                  <TableCell className="text-center">
                    <Checkbox />
                  </TableCell>

                  {/* ID */}
                  <TableCell className="text-center">
                    <Typography variant="l1" className="text-gray-600">
                      #{String(row.id).padStart(3, '0')}
                    </Typography>
                  </TableCell>

                  {/* Expert */}
                  <TableCell className="text-center">
                    <Typography variant="l1" weight="medium">
                      {row.student.name}
                    </Typography>
                  </TableCell>

                  {/* Profesi */}
                  <TableCell className="text-center">
                    <ScoreBadge value={row.scores.ease} />
                  </TableCell>

                  {/* Top 5 */}
                  <TableCell className="text-center">
                    <ScoreBadge value={row.scores.relevance} />
                  </TableCell>

                  {/* Akurasi */}
                  <TableCell className="text-center">
                    <ScoreBadge value={row.scores.satisfaction} />
                  </TableCell>

                  {/* Logika */}
                  <TableCell className="text-center">
                    <Typography variant="l1" weight="medium">
                      {row.obstacles.map((item, idx) => (
                        <span key={idx}>{item.label}</span>
                      ))}
                    </Typography>
                  </TableCell>

                  {/* Aksi */}
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-blue-500 hover:bg-blue-50"
                      >
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

      {/* Pagination */}
      <TablePagination
        currentPage={currentPage}
        totalPages={totalPages}
        perPage={perPage}
        totalData={totalData}
        onPageChange={setCurrentPage}
        onPerPageChange={(v) => {
          setCurrentPage(1)
          setPerPage(v)
        }}
      />
    </div>
  )
}
