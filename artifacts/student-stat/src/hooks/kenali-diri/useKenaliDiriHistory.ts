import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import authApi from '@/lib/authApi'
import { ApiResponse, PaginatedResponse, KenaliDiriHistoryItem } from '@/types/kenali-diri'

export const useKenaliDiriHistory = (params?: {
  page?: number
  per_page?: number
  status?: string
}) => {
  return useQuery<ApiResponse<PaginatedResponse<KenaliDiriHistoryItem>>, AxiosError>({
    queryKey: ['kenali-diri-history', params],
    queryFn: async () => {
      const res = await authApi.get<ApiResponse<PaginatedResponse<KenaliDiriHistoryItem>>>(
        '/api/v1/admin/kenali-diri/history',
        { params },
      )
      return res.data
    },
  })
}
