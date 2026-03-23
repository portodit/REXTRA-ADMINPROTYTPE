'use client'

import { useRef, useState, useEffect } from 'react'
import { Bell, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import useAuthStore from '@/store/useAuthStore'
import { useRouter } from 'next/navigation'

interface TopNavbarProps {
  className?: string
}

export function TopNavbar({ className }: TopNavbarProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const { user, logout } = useAuthStore()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header
      className={cn(
        'h-20 bg-white border-b border-[#B5B7B8] flex items-center justify-between px-8 w-full',
        className,
      )}
    >
      <div />

      <div className="flex items-center gap-6">
        <button className="relative p-2 rounded-xl hover:bg-gray-50 transition-colors">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <Bell size={20} />
          </div>
          <span className="absolute top-2 right-3 w-2.5 h-2.5 bg-blue-600 border-2 border-white rounded-full" />
        </button>

        <div className="h-8 w-px bg-gray-200 mx-1 hidden md:block" />

        <div className="relative" ref={ref}>
          <div
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gray-100">
              <img
                src="/images/dashboard/Gajah.jpg"
                alt="User Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="text-sm font-bold text-gray-800">
                {user?.name ?? 'Admin User'}
              </span>
              <span className="text-xs text-gray-500">
                {user?.email ?? ''}
              </span>
            </div>
          </div>

          {open && (
            <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
              <div className="sm:hidden px-4 py-3 border-b border-gray-100">
                <p className="text-sm font-semibold text-gray-800">{user?.name ?? 'Admin User'}</p>
                <p className="text-xs text-gray-500">{user?.email ?? ''}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
