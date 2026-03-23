import axios, { AxiosError } from 'axios'
import { getAccessToken, removeTokens } from './cookiesUtil'

export const authApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
})

authApi.interceptors.request.use((config) => {
  const token = getAccessToken()
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

authApi.interceptors.response.use(
  (res) => res,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      removeTokens()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default authApi
