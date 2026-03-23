'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useAuthStore from '@/store/useAuthStore'

export default function RootPage() {
  const router = useRouter()
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    router.replace(isAuthenticated ? '/persona-rextra' : '/login')
  }, [isAuthenticated, router])

  return (
    <div className="flex min-h-screen items-center justify-center bg-white">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#005DFF] border-t-transparent" />
        <p className="text-sm text-gray-500">Memuat...</p>
      </div>
    </div>
  )
}
