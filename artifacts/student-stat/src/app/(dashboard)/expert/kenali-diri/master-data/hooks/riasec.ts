'use client'

import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'

import api from '@/lib/authApi'
import { ApiResponse } from '@/types/api'
import { RiasecResponse } from '@/types/entity/riasec'

type Params = {
  code_type?: string
  search?: string
}

export const useRiasecCodesQuery = (params: Params) => {
  return useQuery<ApiResponse<RiasecResponse>, AxiosError>({
    queryKey: ['riasec-codes', params.code_type, params.search],
    queryFn: async () => {
      const res = await api.get<ApiResponse<RiasecResponse>>(
        '/api/v1/admin/kenali-diri/riasec-codes',
        {
          params,
        },
      )

      return res.data
    },
  })
}
