import { create } from 'zustand'
import { removeTokens } from '@/lib/cookiesUtil'

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
  token?: string
}

interface AuthState {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (user: AuthUser) => void
  logout: () => void
}

const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: (user) => set({ user, isAuthenticated: true }),
  logout: () => {
    removeTokens()
    set({ user: null, isAuthenticated: false })
  },
}))

export default useAuthStore
