/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from "react"
import {
  logout as apiLogoutUser,
  getMyProfile,
  loginUser,
  registerUser,
  loginAdmin as apiLoginAdmin,
} from "../api/apiService"
import { type User } from "../types/user.types"
import toast from "react-hot-toast"
import { attachLogoutHandler } from "../api/axiosClient"
import React, { createContext } from "react"

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

  // CHECK USER ON FIRST LOAD
  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const profile = await getMyProfile()
        setUser(profile)
      } catch {
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkUserStatus()
  }, [])

  // WRAP LOGOUT WITH useCallback
  const logout = useCallback(async () => {
    try {
      await apiLogoutUser()
      toast.success("Logout berhasil!")
    } catch (error) {
      console.error("Logout gagal:", error)
    } finally {
      setUser(null)
    }
  }, [])

  // LOGIN USER
  const login = async (credentials: { email: string; password: string }) => {
    const response = await loginUser(credentials)
    const profile = await getMyProfile()
    setUser(profile)
    return response
  }

  const adminLogin = async (credentials: any) => {
    const response = await apiLoginAdmin(credentials)
    const profile = await getMyProfile()
    setUser(profile)
    return response
  }

  const register = async (credentials: {
    name: string
    email: string
    password: string
    passwordConfirmation: string
  }) => {
    return await registerUser(credentials)
  }

  // ATTACH LOGOUT HANDLER TO AXIOS
  useEffect(() => {
    attachLogoutHandler(logout)
  }, [logout])

  const value = { user, login, adminLogin, register, isLoading, logout, setUser }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
