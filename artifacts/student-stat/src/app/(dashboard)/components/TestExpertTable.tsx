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
import { cn } from '@/lib/utils'
import { TablePagination } from './TablePagination'
import Typography from '@/components/Typography'
import { Top5Badge } from './Top5Badge'
import type { Top5Status } from './Top5Badge'
import { ExpertFeedbackItem } from '@/types/kenali-diri'

// Re-export so DataTabs and page.tsx can use this alias
export type TestResult = ExpertFeedbackItem

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TOP5_VALID: Top5Status[] = ['P1', 'P2', 'P3-5', 'Tidak Muncul']

function toTop5Status(label: string): Top5Status {
  return TOP5_VALID.includes(label as Top5Status)
    ? (label as Top5Status)
    : 'Tidak Muncul'
}

// ─── Sub-components (same UI as original) ────────────────────────────────────

export const ScoreBadge = ({ value }: { value: number }) => {
  const color =
    value >= 6
      ? 'bg-green-100 text-green-700 border-green-300'
      : value >= 4
        ? 'bg-orange-100 text-orange-700 border-orange-300'
        : 'bg-red-100 text-red-700 border-red-300'

  return (
    <div className={`px-1 py-0.5 rounded-full border ${color}`}>
      <Typography variant="l1" weight="medium" className={color}>
        {value}/7
      </Typography>
    </div>
  )
}

const KendalaCell = ({ labels }: { labels: string[] }) => {
  if (labels.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 w-full max-w-[260px] mx-auto">
        <div className="w-full px-3 py-1.5 text-xs rounded-lg border text-center bg-white border-[#B5B7B8] text-[#212729]">
          <Typography variant="l1" weight="medium">
            —
          </Typography>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-[260px] mx-auto">
      {labels.map((item, i) => {
        const isNoIssue =
          item.toLowerCase().trim() === 'tidak ada kendala (lancar)' ||
          item.toLowerCase().trim() === 'tidak ada kendala'

        return (
          <div
            key={i}
            className={cn(
              'w-full px-3 py-1.5 text-xs rounded-lg border text-center break-words whitespace-normal',
              isNoIssue
                ? 'bg-white border-[#B5B7B8] text-[#212729]'
                : 'bg-blue-50 border-blue-200 text-blue-700',
            )}
          >
            <Typography variant="l1" weight="medium">
              {item}
            </Typography>
          </div>
        )
      })}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

interface TestExpertDataTableProps {
  tableData: TestResult[]
}

export default function TestExpertDataTable({
  tableData,
}: TestExpertDataTableProps) {
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
                  Expert
                </Typography>
              </TableHead>
              <TableHead>
                <Typography
                  variant="l1"
                  weight="medium"
                  className="text-gray-700 text-center"
                >
                  Profesi
                </Typography>
              </TableHead>
              <TableHead className="text-center">
                <Typography
                  variant="l1"
                  weight="medium"
                  className="text-gray-700 text-center"
                >
                  Top 5
                </Typography>
              </TableHead>
              <TableHead className="text-center">
                <Typography
                  variant="l1"
                  weight="medium"
                  className="text-gray-700"
                >
                  Akurasi
                </Typography>
              </TableHead>
              <TableHead className="text-center">
                <Typography
                  variant="l1"
                  weight="medium"
                  className="text-gray-700"
                >
                  Logika
                </Typography>
              </TableHead>
              <TableHead className="text-center">
                <Typography
                  variant="l1"
                  weight="medium"
                  className="text-gray-700"
                >
                  Manfaat
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
                  Saran
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
                      {row.expert.name}
                    </Typography>
                  </TableCell>

                  {/* Profesi */}
                  <TableCell className="text-center">
                    <Typography variant="l1">
                      {row.expert.profession}
                    </Typography>
                  </TableCell>

                  {/* Top 5 */}
                  <TableCell className="text-center">
                    <Top5Badge value={toTop5Status(row.top5_status_label ?? '')} />
                  </TableCell>

                  {/* Akurasi */}
                  <TableCell className="text-center">
                    <ScoreBadge value={row.scores.accuracy ?? 0} />
                  </TableCell>

                  {/* Logika */}
                  <TableCell className="text-center">
                    <ScoreBadge value={row.scores.logic ?? 0} />
                  </TableCell>

                  {/* Manfaat */}
                  <TableCell className="text-center">
                    <ScoreBadge value={row.scores.usefulness ?? 0} />
                  </TableCell>

                  {/* Kendala */}
                  <TableCell>
                    <KendalaCell labels={row.obstacles.map((o) => o.label)} />
                  </TableCell>

                  {/* Saran */}
                  <TableCell className="text-center">
                    <div
                      className={cn(
                        'px-3 py-1 rounded-lg border text-xs inline-block',
                        row.has_suggestion
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'bg-white border-[#B5B7B8] text-[#212729]',
                      )}
                    >
                      <Typography variant="l1" weight="medium">
                        {row.has_suggestion ? 'Ada' : 'Tidak'}
                      </Typography>
                    </div>
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
