'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface AuthContextType {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // 固定の認証情報
  const FIXED_EMAIL = 'lpadmin@example.com'
  const FIXED_PASSWORD = 'password0'

  useEffect(() => {
    // セッションストレージから認証状態を確認
    const authStatus = sessionStorage.getItem('lp-admin-auth')
    if (authStatus === 'authenticated') {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    // 固定の認証情報と照合
    if (email === FIXED_EMAIL && password === FIXED_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem('lp-admin-auth', 'authenticated')
      return true
    }
    return false
  }

  const logout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem('lp-admin-auth')
    router.push('/admin/login')
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
