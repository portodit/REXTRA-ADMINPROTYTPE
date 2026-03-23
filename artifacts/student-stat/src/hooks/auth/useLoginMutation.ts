import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '@/store/useAuthStore'
import authApi from '@/lib/authApi'
import { setAccessToken, setRefreshToken } from '@/lib/cookiesUtil'
import { z } from 'zod'
import { LoginSchema } from '@/validation/login'

interface LoginResponse {
  success: boolean
  message: string
  data: { role: string; access_token: string; refresh_token: string }
}

interface UserResponse {
  success: boolean
  data: { id: string; name: string; email: string; role: string }
}

export const useLoginMutation = () => {
  const { login } = useAuthStore()
  const navigate = useNavigate()

  const { mutate, isPending } = useMutation<
    LoginResponse,
    AxiosError,
    z.infer<typeof LoginSchema>
  >({
    mutationFn: async (data) => {
      const res = await authApi.post<LoginResponse>('/api/v1/auth/login', data)
      const { access_token, refresh_token } = res.data.data

      setAccessToken(access_token)
      setRefreshToken(refresh_token)

      const userRes = await authApi.get<UserResponse>('/api/v1/auth/me')
      if (userRes.data) {
        login({ ...userRes.data.data, token: access_token })
      }

      return res.data
    },
    onSuccess: (res) => {
      toast.success('Berhasil masuk!')
      setTimeout(() => {
        if (res.data.role === 'ADMIN') {
          navigate('/')
        } else {
          navigate('/')
        }
      }, 1000)
    },
    onError: (error) => {
      const res = error.response?.data as { message?: string }
      toast.error(
        typeof res?.message === 'string' ? res.message : 'Terjadi kesalahan',
      )
    },
  })

  return { mutate, isPending }
}
