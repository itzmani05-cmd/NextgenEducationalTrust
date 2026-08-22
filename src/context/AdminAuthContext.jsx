import { createContext, useContext, useState } from 'react'
import { ADMIN_TOKEN_KEY, adminLogin } from '../utils/adminApi.js'

const AdminAuthContext = createContext(null)

export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(ADMIN_TOKEN_KEY)
    } catch {
      return null
    }
  })

  const login = async (password) => {
    const { token: newToken } = await adminLogin(password)
    setToken(newToken)
    try {
      localStorage.setItem(ADMIN_TOKEN_KEY, newToken)
    } catch {
      // ignore
    }
  }

  const logout = () => {
    setToken(null)
    try {
      localStorage.removeItem(ADMIN_TOKEN_KEY)
    } catch {
      // ignore
    }
  }

  return (
    <AdminAuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
