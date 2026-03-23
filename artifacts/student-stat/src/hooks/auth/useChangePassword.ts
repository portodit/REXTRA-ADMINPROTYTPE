import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import authApi from '@/lib/authApi'

export const useChangePassword = (token: string | null) => {
  const router = useRouter()

  const { mutate, isPending } = useMutation<unknown, AxiosError, string>({
    mutationFn: async (new_password) => {
      const res = await authApi.post('/api/v1/auth/reset-password', {
        token,
        new_password,
      })
      return res.data
    },
    onSuccess: () => {
      toast.success('Kata sandi berhasil diubah!')
      router.push('/change-password/success')
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
