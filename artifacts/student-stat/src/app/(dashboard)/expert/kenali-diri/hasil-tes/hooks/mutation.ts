'use client'

import { useMutation, useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import api from '@/lib/authApi'
import { ApiErrorResponse } from '@/types/api'

import {
  ApiResponse,
  BulkDeleteRequest,
  BulkDeleteResponse,
  ExportHistoryRequest,
  KenaliDiriHistoryItem,
  PaginatedResponse,
} from '@/types/kenali-diri'

export const useKenaliDiriHistory = (params?: {
  page?: number
  per_page?: number
  status?: string
}) => {
  return useQuery<
    ApiResponse<PaginatedResponse<KenaliDiriHistoryItem>>,
    AxiosError
  >({
    queryKey: ['kenali-diri-history', params],
    queryFn: async () => {
      const res = await api.get<
        ApiResponse<PaginatedResponse<KenaliDiriHistoryItem>>
      >('/api/v1/admin/kenali-diri/history', {
        params,
      })

      return res.data
    },
  })
}

export const useKenaliDiriDetail = (id: number) => {
  return useQuery<ApiResponse<KenaliDiriHistoryItem>, AxiosError>({
    queryKey: ['kenali-diri-detail', id],
    queryFn: async () => {
      const res = await api.get<ApiResponse<KenaliDiriHistoryItem>>(
        `/api/v1/admin/kenali-diri/history/${id}`,
      )

      return res.data
    },
    enabled: !!id,
  })
}

export const useBulkDeleteKenaliDiri = () => {
  const { mutate, isPending } = useMutation<
    BulkDeleteResponse,
    AxiosError<ApiErrorResponse>,
    BulkDeleteRequest
  >({
    mutationFn: async (payload: BulkDeleteRequest) => {
      const res = await api.delete<ApiResponse<null>>(
        '/api/v1/admin/kenali-diri/history',
        {
          data: payload,
        },
      )

      return {
        success: res.data.success,
        message: res.data.message,
      }
    },
    onSuccess: (res) => {
      toast.success(res.message)
    },
    onError: (error) => {
      const message = error.response?.data?.message ?? 'Failed to delete data'
      toast.error(message)
    },
  })

  return { mutate, isPending }
}

export const useExportKenaliDiri = () => {
  const { mutate, isPending } = useMutation<
    Blob,
    AxiosError,
    ExportHistoryRequest
  >({
    mutationFn: async (payload: ExportHistoryRequest) => {
      const res = await api.post(
        '/api/v1/admin/kenali-diri/history/export',
        payload,
        {
          responseType: 'blob',
        },
      )

      return res.data
    },
    onSuccess: (blob) => {
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = 'kenali-diri-history.csv'
      link.click()
      toast.success('Export successful')
    },
    onError: () => {
      toast.error('Failed to export data')
    },
  })

  return { mutate, isPending }
}
