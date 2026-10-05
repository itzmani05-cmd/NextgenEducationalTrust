import { createContext, useCallback, useContext, useState } from 'react'
import { STAFF_TOKEN_KEY, staffLogin } from '../utils/staffApi.js'

const MUST_CHANGE_KEY = 'ngc_staff_must_change'
const StaffAuthContext = createContext(null)

function read(key) {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function write(key, value) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {
  }
}

export function StaffAuthProvider({ children }) {
  const [token, setToken] = useState(() => read(STAFF_TOKEN_KEY))
  const [mustChangePassword, setMustChange] = useState(() => read(MUST_CHANGE_KEY) === '1')

  const setSession = useCallback((newToken, mustChange) => {
    setToken(newToken)
    setMustChange(!!mustChange)
    write(STAFF_TOKEN_KEY, newToken)
    write(MUST_CHANGE_KEY, mustChange ? '1' : null)
  }, [])

  const login = async (staffCode, password) => {
    const { token: newToken, mustChangePassword: mustChange } = await staffLogin(staffCode, password)
    setSession(newToken, mustChange)
  }

  const logout = useCallback(() => setSession(null, false), [setSession])

  return (
    <StaffAuthContext.Provider value={{ token, mustChangePassword, login, logout, setSession }}>
      {children}
    </StaffAuthContext.Provider>
  )
}

export function useStaffAuth() {
  const ctx = useContext(StaffAuthContext)
  if (!ctx) throw new Error('useStaffAuth must be used within StaffAuthProvider')
  return ctx
}
