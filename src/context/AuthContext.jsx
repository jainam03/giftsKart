import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const AUTH_KEY = 'giftskart_auth'
const USERS_KEY = 'giftskart_users'

// Pre-seeded demo accounts
const DEMO_USERS = [
  { email: 'admin@giftskart.in', password: 'admin123', name: 'Admin User', role: 'admin', company: 'GiftsKart' },
  { email: 'priya@technova.in', password: 'customer123', name: 'Priya Sharma', role: 'customer', company: 'TechNova Solutions' },
  { email: 'vendor@craftworks.in', password: 'vendor123', name: 'Rajesh Kumar', role: 'vendor', company: 'CraftWorks India' },
]

function getStoredUsers() {
  try {
    const stored = localStorage.getItem(USERS_KEY)
    if (stored) return JSON.parse(stored)
    // Seed demo users on first load
    localStorage.setItem(USERS_KEY, JSON.stringify(DEMO_USERS))
    return DEMO_USERS
  } catch { return DEMO_USERS }
}

function getStoredAuth() {
  try {
    const stored = localStorage.getItem(AUTH_KEY)
    return stored ? JSON.parse(stored) : null
  } catch { return null }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredAuth())

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(AUTH_KEY)
    }
  }, [user])

  const login = (email, password) => {
    const users = getStoredUsers()
    const found = users.find(u => u.email === email && u.password === password)
    if (!found) return { success: false, error: 'Invalid email or password' }
    const { password: _, ...userWithoutPw } = found
    setUser(userWithoutPw)
    return { success: true, user: userWithoutPw }
  }

  const register = ({ name, email, password, company, role }) => {
    const users = getStoredUsers()
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'An account with this email already exists' }
    }
    const newUser = { name, email, password, company, role }
    users.push(newUser)
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
    const { password: _, ...userWithoutPw } = newUser
    setUser(userWithoutPw)
    return { success: true, user: userWithoutPw }
  }

  const logout = () => {
    setUser(null)
  }

  const value = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    role: user?.role || null,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export const ROLES = {
  CUSTOMER: 'customer',
  VENDOR: 'vendor',
  ADMIN: 'admin',
}

export const ROLE_LABELS = {
  customer: 'Corporate Customer',
  vendor: 'Vendor',
  admin: 'Admin',
}

export const ROLE_HOME = {
  customer: '/dashboard',
  vendor: '/vendor',
  admin: '/admin',
}
