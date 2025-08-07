import React, { useState, useEffect } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import toast from "react-hot-toast"
import { resetPassword } from "../api/apiService"
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react"

const ResetPasswordPage = () => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const [token, setToken] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConfirmation, setPasswordConfirmation] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  // Ambil token dan email dari URL saat komponen pertama kali dimuat
  useEffect(() => {
    const urlToken = searchParams.get("token")
    const urlEmail = searchParams.get("email")
    if (urlToken) setToken(urlToken)
    if (urlEmail) setEmail(urlEmail)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== passwordConfirmation) {
      toast.error("Password baru tidak cocok.")
      return
    }
    if (password.length < 6) {
      toast.error("Password baru minimal 6 karakter.")
      return
    }

    setIsSubmitting(true)
    const loadingToast = toast.loading("Mereset password...")

    try {
      const response = await resetPassword({
        email,
        passwordResetCode: token,
        newPassword: password,
        newPasswordConfirmation: passwordConfirmation,
      })
      toast.dismiss(loadingToast)
      toast.success(response.message || "Password berhasil direset!")
      setIsSuccess(true)
    } catch (error: any) {
      toast.dismiss(loadingToast)
      toast.error(
        error.message || "Gagal mereset password. Token mungkin tidak valid atau sudah kadaluarsa."
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-white p-4">
        <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg shadow-2xl text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-400" />
          <h1 className="text-3xl font-bold mt-4">Reset Password Berhasil!</h1>
          <p className="text-gray-300 mt-2">
            Password Anda telah berhasil diubah. Silakan login dengan password baru Anda.
          </p>
          <Link
            to="/login"
            className="mt-6 inline-block bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-dark transition-colors"
          >
            Lanjutkan ke Halaman Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-white p-4">
      <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg shadow-2xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-primary">Reset Password Anda</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* --- INPUT EMAIL BARU --- */}
          <div>
            <label className="block text-sm font-medium text-gray-300">Email</label>
            <input
              value={email}
              type="email"
              readOnly
              className="mt-1 block w-full bg-gray-900/50 border border-gray-700 rounded-md shadow-sm py-2 px-3 text-gray-400 cursor-not-allowed"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Kode Reset</label>
            <input
              value={token}
              onChange={(e) => setToken(e.target.value)}
              type="text"
              required
              className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-primary focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Password Baru</label>
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
            <label className="block text-sm font-medium text-gray-300">
              Konfirmasi Password Baru
            </label>
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
            disabled={isSubmitting}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="animate-spin mr-2" size={20} />}
            {isSubmitting ? "Mereset..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPasswordPage
