import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import authApi from '@/lib/authApi'

export const useResendVerificationEmail = () => {
  const { mutate, isPending } = useMutation<unknown, AxiosError, { email: string }>({
    mutationFn: async (data) => {
      const res = await authApi.post('/api/v1/auth/resend-verification', data)
      return res.data
    },
    onSuccess: () => {
      toast.success('Email verifikasi telah dikirim ulang!')
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
