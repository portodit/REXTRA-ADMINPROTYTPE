import { useEffect, useState } from 'react'
import useAuthStore from '@/store/useAuthStore'
import { getAccessToken, removeTokens } from '@/lib/cookiesUtil'
import authApi from '@/lib/authApi'

interface UserResponse {
  success: boolean
  data: { id: string; name: string; email: string; role: string }
}

export function useRestoreAuth() {
  const [isRestoring, setIsRestoring] = useState(true)
  const { login, isAuthenticated } = useAuthStore()

  useEffect(() => {
    if (isAuthenticated) {
      setIsRestoring(false)
      return
    }

    const token = getAccessToken()

    if (!token) {
      setIsRestoring(false)
      return
    }

    authApi
      .get<UserResponse>('/api/v1/auth/me', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data?.success && res.data.data) {
          login({ ...res.data.data, token })
        } else {
          removeTokens()
        }
      })
      .catch(() => {
        removeTokens()
      })
      .finally(() => {
        setIsRestoring(false)
      })
  }, [])

  return { isRestoring }
}
