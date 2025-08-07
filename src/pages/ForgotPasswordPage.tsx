import React, { useState } from "react"
import { Link } from "react-router-dom"
import toast from "react-hot-toast"
import { forgotPassword } from "../api/apiService"
import { Mail, Loader2 } from "lucide-react"

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const loadingToast = toast.loading("Mengirim permintaan...")
    try {
      const response = await forgotPassword({ email })
      toast.dismiss(loadingToast)
      toast.success(
        response.message ||
          "Jika email Anda terdaftar, kami telah mengirimkan instruksi reset password."
      )
      setIsSubmitted(true) // Tampilkan pesan sukses
    } catch (error: any) {
      toast.dismiss(loadingToast)
      // Tampilkan pesan sukses generik untuk keamanan (tidak memberitahu jika email ada/tidak)
      toast.success("Jika email Anda terdaftar, kami telah mengirimkan instruksi reset password.")
      setIsSubmitted(true)
      console.error("Forgot password error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-white p-4">
      <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg shadow-2xl text-center">
        {isSubmitted ? (
          <>
            <Mail className="mx-auto h-16 w-16 text-green-400" />
            <h1 className="text-3xl font-bold mt-4">Periksa Email Anda</h1>
            <p className="text-gray-300 mt-2">
              Kami telah mengirimkan instruksi untuk mereset password Anda ke{" "}
              <strong>{email}</strong>. Silakan periksa kotak masuk (dan folder spam) Anda.
            </p>
            {/* --- PERBAIKAN DI SINI --- */}
            {/* Kita tidak lagi mengarahkan ke halaman login, tapi langsung ke reset password */}
            {/* dengan menyertakan email di URL. */}
            <Link
              to={`/reset-password?email=${encodeURIComponent(email)}`}
              className="mt-6 inline-block text-primary hover:text-primary-light"
            >
              Ke Halaman Reset Password
            </Link>
          </>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-primary">Lupa Password?</h1>
            <p className="text-gray-400 mt-2 mb-6">
              Jangan khawatir. Masukkan email Anda dan kami akan mengirimkan instruksi untuk mereset
              password Anda.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6 text-left">
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
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="animate-spin mr-2" size={20} />}
                {isSubmitting ? "Mengirim..." : "Kirim Instruksi"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

export default ForgotPasswordPage
