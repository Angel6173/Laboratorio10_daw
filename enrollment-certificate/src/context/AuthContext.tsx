import { createContext, useContext, useState, type ReactNode } from 'react'
import { saveTokens, clearTokens, isAuthenticated as checkAuth } from '../api/authApi'

interface AuthContextType {
  isAuthenticated: boolean
  login: (access: string, refresh: string) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(checkAuth)

  function login(access: string, refresh: string) {
    saveTokens(access, refresh)
    setAuthenticated(true)
  }

  function logout() {
    clearTokens()
    setAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: authenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return ctx
}
