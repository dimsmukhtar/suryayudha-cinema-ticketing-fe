import React, { createContext, useState, useEffect, type ReactNode, useContext } from "react"
import {
  logout as apiLogoutUser,
  getMyProfile,
  loginUser,
  registerUser,
  loginAdmin as apiLoginAdmin,
} from "../api/apiService"
import { type User } from "../types/user.types"
import toast from "react-hot-toast"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (credentials: { email: string; password: string }) => Promise<any>
  adminLogin: (credentials: { email: string; password: string }) => Promise<any>
  register: (credentials: {
    name: string
    email: string
    password: string
    passwordConfirmation: string
  }) => Promise<any>
  logout: () => void
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const profile = await getMyProfile()
        setUser(profile)
        console.log(profile)
      } catch (error) {
        console.log("Tidak ada sesi login yang aktif.")
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }
    checkUserStatus()
  }, [])

  const login = async (credentials: { email: string; password: string }) => {
    try {
      const response = await loginUser(credentials)
      const profile = await getMyProfile()
      setUser(profile)
      return response
    } catch (error) {
      setUser(null)
      throw error
    }
  }

  const adminLogin = async (credentials: any) => {
    try {
      const response = await apiLoginAdmin(credentials)
      const profile = await getMyProfile()
      setUser(profile)
      return response
    } catch (error) {
      setUser(null)
      throw error
    }
  }
  const register = async (credentials: {
    name: string
    email: string
    password: string
    passwordConfirmation: string
  }) => {
    try {
      const response = await registerUser(credentials)
      return response
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      await apiLogoutUser()
      toast.success("Logout berhasil!")
    } catch (error) {
      console.error("Logout gagal:", error)
    } finally {
      setUser(null)
    }
  }

  const value = { user, login, adminLogin, register, isLoading, logout, setUser }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
