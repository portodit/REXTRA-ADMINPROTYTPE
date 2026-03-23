import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import authApi from '@/lib/authApi'
import { z } from 'zod'
import { RegisterSchema } from '@/validation/register'

export const useRegisterMutation = () => {
  const router = useRouter()

  const { mutate, isPending } = useMutation<
    unknown,
    AxiosError,
    z.infer<typeof RegisterSchema>
  >({
    mutationFn: async (data) => {
      const { confirmPassword: _, ...payload } = data
      const res = await authApi.post('/api/v1/auth/register', payload)
      localStorage.setItem('verify_email', data.email)
      return res.data
    },
    onSuccess: () => {
      toast.success('Registrasi berhasil! Silakan verifikasi email Anda.')
      router.push('/verifikasi-akun/terkirim')
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
