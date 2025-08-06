import React, { createContext, useState, useEffect, type ReactNode, useContext } from "react"
import { logout as apiLogoutUser, checkAuth } from "../api/apiService"

export const AuthContext = createContext({} as any)

export const AuthProvider = ({ children }: any) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const response = await checkAuth()
        if (response.status === 200) {
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.log("Tidak ada sesi login yang aktif.")
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }
    checkUserStatus()
  }, [])

  const logout = async () => {
    try {
      await apiLogoutUser()
    } catch (error) {
      console.error("Logout gagal:", error)
    } finally {
      setIsAuthenticated(false)
    }
  }

  const value = { isAuthenticated, setIsAuthenticated, isLoading, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
