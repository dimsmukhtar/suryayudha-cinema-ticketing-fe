import { useState, useEffect } from "react"
import { useSearchParams, Link } from "react-router-dom"
import { verifyEmail } from "../api/apiService"
import toast from "react-hot-toast"
import { MailCheck, AlertTriangle, Loader } from "lucide-react"

type VerificationStatus = "verifying" | "success" | "error"

const VerifyEmailWithTokenPage = () => {
  const [searchParams] = useSearchParams()
  const [status, setStatus] = useState<VerificationStatus>("verifying")
  const [message, setMessage] = useState("Sedang memverifikasi akun Anda...")

  useEffect(() => {
    const email = searchParams.get("email")
    const token = searchParams.get("token")

    if (!email || !token) {
      setStatus("error")
      setMessage("Link verifikasi tidak valid atau tidak lengkap.")
      return
    }

    const performVerification = async () => {
      try {
        const response = await verifyEmail({ email, token })
        setStatus("success")
        setMessage(response.message || "Email Anda berhasil diverifikasi!")
        toast.success("Verifikasi berhasil!")
      } catch (err: any) {
        setStatus("error")
        const errorMessage =
          err.message || "Verifikasi gagal. Token mungkin sudah kadaluarsa atau tidak valid."
        setMessage(errorMessage)
        toast.error(errorMessage)
      }
    }

    const timer = setTimeout(() => {
      performVerification()
    }, 1500)

    return () => clearTimeout(timer)
  }, [searchParams])

  const renderContent = () => {
    switch (status) {
      case "verifying":
        return (
          <>
            <Loader className="mx-auto h-16 w-16 text-primary animate-spin" />
            <h1 className="text-3xl font-bold mt-4">Memverifikasi...</h1>
            <p className="text-gray-300 mt-2">{message}</p>
          </>
        )
      case "success":
        return (
          <>
            <MailCheck className="mx-auto h-16 w-16 text-green-400" />
            <h1 className="text-3xl font-bold mt-4">Verifikasi Berhasil!</h1>
            <p className="text-gray-300 mt-2">{message}</p>
            <Link
              to="/"
              className="mt-6 inline-block bg-primary text-white font-bold py-3 px-8 rounded-lg hover:bg-primary-dark transition-colors"
            >
              Lanjut ke Halaman Beranda
            </Link>
          </>
        )
      case "error":
        return (
          <>
            <AlertTriangle className="mx-auto h-16 w-16 text-red-400" />
            <h1 className="text-3xl font-bold mt-4">Verifikasi Gagal</h1>
            <p className="text-gray-300 mt-2">{message}</p>
            <Link
              to="/"
              className="mt-6 inline-block bg-gray-600 text-white font-bold py-3 px-8 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Kembali ke Halaman Beranda
            </Link>
          </>
        )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-white p-4">
      <div className="w-full max-w-md bg-gray-800/50 backdrop-blur-sm p-8 rounded-lg shadow-2xl text-center">
        {renderContent()}
      </div>
    </div>
  )
}

export default VerifyEmailWithTokenPage
