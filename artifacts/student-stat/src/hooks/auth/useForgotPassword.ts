import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import authApi from '@/lib/authApi'

interface ForgotPasswordResponse {
  success: boolean
  message: string
  _dev_token?: string
  _dev_reset_url?: string
}

export const useForgotPassword = () => {
  const navigate = useNavigate()

  const { mutate, isPending } = useMutation<ForgotPasswordResponse, AxiosError, { email: string }>({
    mutationFn: async (data) => {
      const res = await authApi.post<ForgotPasswordResponse>('/api/v1/auth/forgot-password', data)
      return res.data
    },
    onSuccess: (data) => {
      // In dev mode the backend returns the reset token directly so we can test the full flow
      if (data._dev_token) {
        toast.success('Token reset ditemukan. Mengarahkan ke halaman ubah kata sandi...')
        navigate(`/change-password?token=${data._dev_token}`)
      } else {
        toast.success('Tautan reset kata sandi telah dikirim ke email Anda.')
        navigate('/verifikasi-akun/terkirim')
      }
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
