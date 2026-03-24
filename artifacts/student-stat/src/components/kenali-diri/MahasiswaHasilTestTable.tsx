import React from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Checkbox } from '@/components/ui/checkbox'
import { Trash2, Pencil } from 'lucide-react'
import { TablePagination } from './TablePagination'
import Typography from '@/components/Typography'
import { KenaliDiriHistoryItem } from '@/types/kenali-diri'
import { TestDetailModal } from './TestDetailModal'
import { StatusBadge } from '@/components/shared/badges/StatusBadge'

interface TestDataTableProps {
  tableData: KenaliDiriHistoryItem[]
  onDelete?: (testId: string) => void
}

const statusLabel: Record<KenaliDiriHistoryItem['status'], 'Selesai' | 'Sedang Berjalan' | 'Dihentikan'> = {
  completed: 'Selesai',
  in_progress: 'Sedang Berjalan',
  abandoned: 'Dihentikan',
}

export default function MahasiswaHasilTestDataTable({ tableData, onDelete }: TestDataTableProps) {
  const [currentPage, setCurrentPage] = React.useState(1)
  const [perPage, setPerPage] = React.useState(10)
  const [selected, setSelected] = React.useState<Set<string>>(new Set())

  const [deleteTarget, setDeleteTarget] = React.useState<KenaliDiriHistoryItem | null>(null)
  const [editTarget, setEditTarget] = React.useState<KenaliDiriHistoryItem | null>(null)

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

  const handleConfirmDelete = () => {
    if (deleteTarget) {
      onDelete?.(deleteTarget.test_id)
      setDeleteTarget(null)
    }
  }

  const editData = editTarget
    ? {
        id: editTarget.test_id,
        userName: editTarget.user_name,
        startTime: editTarget.started_at,
        endTime: editTarget.completed_at ?? '-',
        status: statusLabel[editTarget.status],
        result: editTarget.result_code ? `Profil Kode ${editTarget.result_code}` : '-',
      }
    : undefined

  return (
    <>
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
                      <StatusBadge value={row.status} />
                    </TableCell>
                    <TableCell className="text-center">
                      <Typography variant="l1" weight="medium" className="text-gray-700">
                        {row.result_code || '-'}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={() => setDeleteTarget(row)}
                          className="text-red-400 hover:text-red-600 transition-colors"
                          title="Hapus data tes"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setEditTarget(row)}
                          className="text-blue-400 hover:text-blue-600 transition-colors"
                          title="Lihat / Edit detail tes"
                        >
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
              <Trash2 className="h-7 w-7 text-red-500" />
            </div>
            <AlertDialogTitle className="text-center text-xl">
              Hapus Data Riwayat Tes?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center">
              Anda akan menghapus riwayat tes{' '}
              <span className="font-mono font-medium text-foreground">
                #{deleteTarget?.test_id}
              </span>{' '}
              milik{' '}
              <span className="font-medium text-foreground">{deleteTarget?.user_name}</span>.
              <br />
              <span className="text-red-500">Tindakan ini tidak dapat dibatalkan.</span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
            <AlertDialogCancel className="w-full sm:w-auto">Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="w-full sm:w-auto bg-red-500 text-white hover:bg-red-600"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Detail / Edit Modal (Sheet) */}
      <TestDetailModal
        open={!!editTarget}
        onOpenChange={(open) => !open && setEditTarget(null)}
        testData={editData}
      />
    </>
  )
}
