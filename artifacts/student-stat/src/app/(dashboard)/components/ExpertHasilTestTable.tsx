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
import { KenaliDiriHistoryItem } from '@/types/kenali-diri'
import { cn } from '@/lib/utils'

interface TestDataTableProps {
  tableData: KenaliDiriHistoryItem[]
}

/* =======================================================
   HELPER: STATUS BADGE RENDERER
======================================================= */
const StatusBadge = ({
  status,
}: {
  status: KenaliDiriHistoryItem['status']
}) => {
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

export default function ExpertHasilTestMahasiswaDataTable({
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

  React.useEffect(() => {
    setCurrentPage(1)
  }, [tableData])

  return (
    <div className="w-full bg-white rounded-2xl p-6 border border-gray-200">
      {/* Table Section */}
      <div className="flex flex-col  mb-6 gap-4">
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
            hasil tes
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
                    ID Test
                  </Typography>
                </TableHead>
                <TableHead>
                  <Typography
                    variant="l1"
                    weight="medium"
                    className="text-gray-700 text-center"
                  >
                    Nama
                  </Typography>
                </TableHead>
                <TableHead>
                  <Typography
                    variant="l1"
                    weight="medium"
                    className="text-gray-700 text-center"
                  >
                    Kategori
                  </Typography>
                </TableHead>
                <TableHead>
                  <Typography
                    variant="l1"
                    weight="medium"
                    className="text-gray-700 text-center"
                  >
                    Status
                  </Typography>
                </TableHead>
                <TableHead>
                  <Typography
                    variant="l1"
                    weight="medium"
                    className="text-gray-700 text-center"
                  >
                    Hasil
                  </Typography>
                </TableHead>
                <TableHead>
                  <Typography
                    variant="l1"
                    weight="medium"
                    className="text-gray-700 text-center"
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
                    colSpan={7}
                    className="text-center py-16 text-gray-400"
                  >
                    <Typography variant="l1" font="Poppins">
                      Tidak ada data ditemukan.
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedData.map((row, index) => (
                  <TableRow
                    key={index}
                    className="border-b border-gray-100 hover:bg-gray-50/50"
                  >
                    {/* Checkbox */}
                    <TableCell className="text-center">
                      <Checkbox />
                    </TableCell>

                    {/* ID Test */}
                    <TableCell className="text-center">
                      <Typography variant="l1" className="text-gray-600">
                        {row.test_id}
                      </Typography>
                    </TableCell>

                    {/* Nama */}
                    <TableCell className="text-center">
                      <Typography
                        variant="l1"
                        weight="medium"
                        className="text-gray-900"
                      >
                        {row.user_name}
                      </Typography>
                    </TableCell>

                    {/* Kategori */}
                    <TableCell className="text-center">
                      <Typography variant="l1" className="text-gray-600">
                        {row.category_name}
                      </Typography>
                    </TableCell>

                    {/* Status */}
                    <TableCell className="text-center">
                      <StatusBadge status={row.status} />
                    </TableCell>

                    {/* Hasil */}
                    <TableCell className="text-center">
                      <Typography
                        variant="l1"
                        weight="medium"
                        className="text-gray-700"
                      >
                        {row.result_code || '-'}
                      </Typography>
                    </TableCell>

                    {/* Aksi */}
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
