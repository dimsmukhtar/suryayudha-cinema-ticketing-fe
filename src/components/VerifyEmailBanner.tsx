import { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { resendVerificationTokenToEmail } from "../api/apiService"
import toast from "react-hot-toast"

const VerifyEmailBanner = () => {
  const { user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  if (!user || user.is_verified) {
    return null
  }

  const handleResendClick = async () => {
    setIsLoading(true)
    try {
      const response = await resendVerificationTokenToEmail(user.email)
      if (response) {
        toast.success("Token verifikasi berhasil dikirim ke email Anda")
      } else {
        toast.error("Token verifikasi gagal dikirim ke email Anda")
      }
    } catch (error) {
      toast.error("Gagal mengirim email. Silakan coba lagi nanti.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 w-full text-center">
      <p className="font-bold">Verifikasi Email Anda</p>
      <p>
        Email Anda belum terverifikasi. Silahkan periksa kotak masuk Anda atau{" "}
        <button
          onClick={handleResendClick}
          disabled={isLoading}
          className="font-bold underline hover:text-yellow-800 disabled:opacity-50"
        >
          {isLoading ? "Loading..." : "kirim ulang token email verifikasi"}
        </button>{" "}
        untuk bisa memesan tiket
      </p>
    </div>
  )
}

export default VerifyEmailBanner
