import React, { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import toast from "react-hot-toast"
import { Eye, EyeOff } from "lucide-react"
import { registerUser } from "../api/apiService"

const RegisterPage = () => {
  const navigate = useNavigate()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    if (password !== passwordConfirmation) {
      toast.error("Password tidak cocok!")
      return
    }
    setIsLoading(true)
    try {
      const response = await registerUser({ name, email, password, passwordConfirmation })
      toast.success(
        response.message || "Pendaftaran berhasil! Silakan cek email Anda untuk verifikasi."
      )
      navigate("/check-email")
    } catch (error: any) {
      const errorMessage = error.message || "Pendaftaran gagal. Silakan coba lagi."
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
        <h1 className="text-3xl font-bold text-center mb-2 text-primary">Buat Akun Baru</h1>
        <p className="text-center text-gray-400 mb-6">Daftar untuk mulai memesan tiket.</p>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Nama Lengkap</label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              required
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
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
          <div>
            <label className="block text-sm font-medium text-gray-300">Konfirmasi Password</label>
            <input
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              type="password"
              required
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {isLoading ? "Mendaftar..." : "Daftar"}
          </button>
        </div>
        <p className="mt-6 text-center text-sm text-gray-400">
          Sudah punya akun?{" "}
          <Link to="/login" className="font-medium text-primary hover:text-primary-light">
            Login di sini
          </Link>
        </p>
      </form>
    </div>
  )
}

export default RegisterPage
