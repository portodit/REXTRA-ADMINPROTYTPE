// components/table/TablePagination.tsx
'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'
import Typography from '@/components/Typography'
import { cn } from '@/lib/utils'

interface TablePaginationProps {
  currentPage: number
  totalPages: number
  perPage: number
  totalData: number
  onPageChange: (page: number) => void
  onPerPageChange: (value: number) => void
}

export const TablePagination = ({
  currentPage,
  totalPages,
  perPage,
  totalData,
  onPageChange,
  onPerPageChange,
}: TablePaginationProps) => {
  const pagesToShow = 3
  const startPage = Math.max(1, currentPage - 1)
  const endPage = Math.min(totalPages, startPage + pagesToShow - 1)

  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4 mt-4">
      {/* PAGE NUMBERS */}
      <div className="flex items-center gap-1">
        {/* First */}
        <Button
          variant="pagination"
          size="icon"
          disabled={currentPage === 1}
          className="h-8 w-8 text-gray-500 hover:text-white"
          onClick={() => onPageChange(1)}
        >
          <ChevronsLeft className="h-4 w-4" />
        </Button>

        {/* Prev */}
        <Button
          variant="pagination"
          size="icon"
          disabled={currentPage === 1}
          className="h-8 w-8 text-gray-500 hover:text-white"
          onClick={() => onPageChange(currentPage - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page Numbers */}
        {Array.from(
          { length: endPage - startPage + 1 },
          (_, i) => startPage + i,
        ).map((page) => {
          const isActive = page === currentPage

          return (
            <Button
              key={page}
              variant="pagination"
              size="icon"
              onClick={() => onPageChange(page)}
              className={cn(
                'h-8 w-8',
                isActive
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'text-gray-600 hover:bg-blue-700 hover:text-white',
              )}
            >
              <Typography
                variant="l2"
                className={cn('font-semibold', isActive ? 'text-white' : '')}
              >
                {page}
              </Typography>
            </Button>
          )
        })}

        {endPage < totalPages && (
          <span className="px-2 text-gray-400">...</span>
        )}

        {/* Next */}
        <Button
          variant="pagination"
          size="icon"
          disabled={currentPage === totalPages}
          className="h-8 w-8 text-gray-500 hover:text-white"
          onClick={() => onPageChange(currentPage + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Last */}
        <Button
          variant="pagination"
          size="icon"
          disabled={currentPage === totalPages}
          className="h-8 w-8 text-gray-500 hover:text-white"
          onClick={() => onPageChange(totalPages)}
        >
          <ChevronsRight className="h-4 w-4" />
        </Button>
      </div>

      {/* ROWS PER PAGE */}
      <div className="flex items-center gap-3">
        <Typography variant="l1" className="text-gray-600">
          Halaman
        </Typography>

        <Select
          value={String(perPage)}
          onValueChange={(v) => onPerPageChange(Number(v))}
        >
          <SelectTrigger className="w-[70px] h-9 border border-gray-200">
            <Typography variant="l1">
              <SelectValue />
            </Typography>
          </SelectTrigger>
          <SelectContent>
            {[10, 20, 50].map((v) => (
              <SelectItem key={v} value={String(v)}>
                {v}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Typography variant="l1" className="text-gray-600">
          dari {totalData}
        </Typography>
      </div>
    </div>
  )
}
