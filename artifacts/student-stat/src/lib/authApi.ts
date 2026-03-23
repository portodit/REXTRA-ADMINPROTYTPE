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
    const url = error.config?.url ?? ''
    // Only auto-redirect for protected routes, NOT for auth endpoints
    // (login/forgot-password returning 401 must show toast, not reload page)
    const isAuthEndpoint = url.includes('/auth/login') ||
      url.includes('/auth/register') ||
      url.includes('/auth/forgot-password') ||
      url.includes('/auth/reset-password') ||
      url.includes('/auth/verify-email')
    if (error.response?.status === 401 && !isAuthEndpoint) {
      removeTokens()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  },
)

export default authApi
