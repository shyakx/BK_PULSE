import React, { createContext, useContext, useMemo, useState, useEffect } from 'react'
import { getRoleConfig, getRoleFeatures, hasPermission, canAccessData, canAccessPII, canExportData } from '../utils/roles.js'

// Type definitions
const AuthContext = createContext(null)

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('bk_pulse_auth_user')
    if (stored) {
      try {
        const userData = JSON.parse(stored)
        setUser(userData)
      } catch {}
    }
  }, [])

  const login = (email, _password, rememberMe, role = 'agent') => {
    const roleConfig = getRoleConfig(role)
    const nextUser = { 
      email, 
      role,
      name: email.split('@')[0].replace('.', ' '),
      department: roleConfig?.description || 'Unknown',
      permissions: roleConfig?.permissions || [],
      dataAccess: roleConfig?.dataAccess || {},
      features: getRoleFeatures(role),
      loginTime: new Date().toISOString()
    }
    setUser(nextUser)
    // Always persist user during session, only remove on logout
    localStorage.setItem('bk_pulse_auth_user', JSON.stringify(nextUser))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('bk_pulse_auth_user')
  }

  // Enhanced role-based functions
  const hasUserPermission = (permission) => {
    return user ? hasPermission(user.role, permission) : false
  }

  const canUserAccessData = (dataLevel) => {
    return user ? canAccessData(user.role, dataLevel) : false
  }

  const canUserAccessPII = () => {
    return user ? canAccessPII(user.role) : false
  }

  const canUserExportData = () => {
    return user ? canExportData(user.role) : false
  }

  const getUserRoleConfig = () => {
    return user ? getRoleConfig(user.role) : null
  }

  const getUserFeatures = () => {
    return user ? getRoleFeatures(user.role) : {}
  }

  const value = useMemo(
    () => ({ 
      user, 
      isAuthenticated: Boolean(user), 
      login, 
      logout,
      hasPermission: hasUserPermission,
      canAccessData: canUserAccessData,
      canAccessPII: canUserAccessPII,
      canExportData: canUserExportData,
      getRoleConfig: getUserRoleConfig,
      getFeatures: getUserFeatures
    }),
    [user]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}


