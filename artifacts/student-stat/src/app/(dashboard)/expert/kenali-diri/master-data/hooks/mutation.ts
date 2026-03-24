import axios, { AxiosInstance } from 'axios'

const apiClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface BaseApiResponse<T> {
  success: boolean
  message: string
  data: T
}

export type RIASECCodeType = 'single' | 'dual' | 'triple'

export interface RIASECListItem {
  id: number
  code: string
  title: string
  code_type: RIASECCodeType
}

export interface RIASECListData {
  data: RIASECListItem[]
  total_codes: number
}

export type GetAllRIASECResponse = BaseApiResponse<RIASECListData>

export interface RIASECDetail {
  id: number
  code: string
  title: string
  description: string
  strengths: string[]
  challenges: string[]
  strategies: string[]
  work_environments: string[]
  interaction_styles: string[]
}

export type GetRIASECByIdResponse = BaseApiResponse<RIASECDetail>

export interface UpdateRIASECRequest {
  riasec_title: string
  riasec_description: string
  strengths: string[]
  challenges: string[]
  strategies: string[]
  work_environments: string[]
  interaction_styles: string[]
}

export interface UpdateRIASECResponse {
  success: boolean
  message: string
}

export interface GetAllRIASECParams {
  code_type?: RIASECCodeType | ''
  search?: string
}

export const getAllRIASEC = async (
  params: GetAllRIASECParams,
): Promise<GetAllRIASECResponse> => {
  const response = await apiClient.get<GetAllRIASECResponse>(
    '/api/v1/admin/kenali-diri/riasec-codes',
    { params },
  )
  return response.data
}

export const getRIASECById = async (
  id: number,
): Promise<GetRIASECByIdResponse> => {
  const response = await apiClient.get<GetRIASECByIdResponse>(
    `/api/v1/admin/kenali-diri/riasec-codes/${id}`,
  )
  return response.data
}

export const updateRIASEC = async (
  id: number,
  payload: UpdateRIASECRequest,
): Promise<UpdateRIASECResponse> => {
  const response = await apiClient.put<UpdateRIASECResponse>(
    `/api/v1/admin/kenali-diri/riasec-codes/${id}`,
    payload,
  )
  return response.data
}
