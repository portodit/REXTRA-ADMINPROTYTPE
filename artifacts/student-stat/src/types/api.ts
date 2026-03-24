export type PaginateData<Data> = {
  data_per_page: Data
  meta: {
    page: number
    max_page: number
  }
}

export interface PaginatedApiResponse<DataType> {
  code: number
  status: boolean
  message: string
  data: PaginateData<DataType>
}

export interface ApiErrorResponse {
  success: boolean
  message: string
  errors?: Record<string, string[]>
}

export type ApiResponse<T> = {
  success: boolean
  message: string
  status: boolean
  code: number
  data: T
}

export type ApiError = {
  code: number
  status: boolean | number
  message: string
  error?: string
}

export type UninterceptedApiError = {
  code: number
  status: boolean
  message: string | Record<string, string[]>
}
