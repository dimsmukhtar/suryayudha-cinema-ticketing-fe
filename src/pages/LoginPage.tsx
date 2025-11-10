import React, { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { useNavigate, Link, useLocation } from "react-router-dom"
import toast from "react-hot-toast"
import { Eye, EyeOff } from "lucide-react"

const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || "/"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await login({ email, password })
      toast.success(response.message || "Login berhasil!")
      navigate(from, { replace: true })
    } catch (error: any) {
      const errorMessage = error.message || "Email atau password salah."
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-white p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg shadow-2xl"
      >
        <h1 className="text-3xl font-bold text-center mb-2 text-primary">Selamat Datang Kembali</h1>
        <p className="text-center text-gray-400 mb-6">Silakan masuk untuk melanjutkan.</p>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              required
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Password</label>
            <div className="relative mt-1">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPassword ? "text" : "password"}
                required
                className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-primary focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 cursor-pointer"
          >
            {isLoading ? "Loading..." : "Login"}
          </button>
          {/* Tambahkan di bawah tombol login utama */}
          <div className="mt-6">
            <div className="flex items-center justify-center mb-4">
              <span className="text-gray-400 text-sm">Atau masuk dengan</span>
            </div>
            <div className="flex flex-col gap-3">
              <button
                type="button"
                onClick={() =>
                  (window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`)
                }
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-white text-gray-800 font-medium hover:bg-gray-200 transition-colors cursor-pointer"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="w-5 h-5"
                />
                Masuk dengan Google
              </button>

              <button
                type="button"
                onClick={() =>
                  (window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/facebook`)
                }
                className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-md bg-[#1877F2] text-white font-medium hover:bg-[#0f5ad0] transition-colors cursor-pointer"
              >
                <img
                  src="https://www.svgrepo.com/show/448224/facebook.svg"
                  alt="Facebook"
                  className="w-5 h-5"
                />
                Masuk dengan Facebook
              </button>
            </div>
          </div>
        </div>
        <Link
          to="/forgot-password"
          className="text-sm font-medium text-primary hover:text-primary-light"
        >
          Lupa Password?
        </Link>
        <p className="mt-6 text-center text-sm text-gray-400">
          Belum punya akun?{" "}
          <Link to="/register" className="font-medium text-primary hover:text-primary-light">
            Daftar di sini
          </Link>
        </p>
      </form>
    </div>
  )
}

export default LoginPage
