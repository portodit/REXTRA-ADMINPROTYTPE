import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import authApi from '@/lib/authApi'

interface ForgotPasswordResponse {
  success: boolean
  message: string
  _dev_token?: string
  _dev_reset_url?: string
}

export const useForgotPassword = () => {
  const router = useRouter()

  const { mutate, isPending } = useMutation<ForgotPasswordResponse, AxiosError, { email: string }>({
    mutationFn: async (data) => {
      const res = await authApi.post<ForgotPasswordResponse>('/api/v1/auth/forgot-password', data)
      return res.data
    },
    onSuccess: (data) => {
      if (data._dev_token) {
        toast.success('Token reset ditemukan. Mengarahkan ke halaman ubah kata sandi...')
        router.push(`/change-password?token=${data._dev_token}`)
      } else {
        toast.success('Tautan reset kata sandi telah dikirim ke email Anda.')
        router.push('/verifikasi-akun/terkirim')
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
