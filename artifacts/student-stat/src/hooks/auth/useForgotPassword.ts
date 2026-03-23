import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import authApi from '@/lib/authApi'

export const useForgotPassword = () => {
  const navigate = useNavigate()

  const { mutate, isPending } = useMutation<unknown, AxiosError, { email: string }>({
    mutationFn: async (data) => {
      const res = await authApi.post('/api/v1/auth/forgot-password', data)
      return res.data
    },
    onSuccess: () => {
      toast.success('Tautan reset kata sandi telah dikirim ke email Anda.')
      navigate('/verifikasi-akun/terkirim')
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
