import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { changePassword } from "../api/apiService"
import { useAuth } from "../hooks/useAuth"
import { Eye, EyeOff, Loader2 } from "lucide-react"

const ChangePasswordPage = () => {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("")
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (newPassword !== newPasswordConfirmation) {
      toast.error("Password baru tidak cocok.")
      return
    }
    if (newPassword.length < 6) {
      toast.error("Password baru minimal 6 karakter.")
      return
    }

    setIsSubmitting(true)
    const loadingToast = toast.loading("Mengubah password...")

    try {
      const response = await changePassword({ oldPassword, newPassword, newPasswordConfirmation })
      toast.dismiss(loadingToast)
      toast.success(response.message || "Password berhasil diubah! Silakan login kembali.")

      // --- PERBAIKAN UTAMA DI SINI ---
      // 1. Arahkan pengguna ke halaman login TERLEBIH DAHULU.
      //    Halaman login adalah rute publik, jadi ProtectedRoute tidak akan aktif.
      navigate("/login")

      // 2. BARU setelah itu, panggil fungsi logout untuk membersihkan state.
      //    Ini tidak akan menyebabkan redirect yang tidak diinginkan.
      await logout()
    } catch (error: any) {
      toast.dismiss(loadingToast)
      toast.error(error.message || "Gagal mengubah password.")
      console.error("Change password error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="bg-background text-white min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-lg mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Ubah Password</h1>
          <form
            onSubmit={handleSubmit}
            className="bg-gray-800/50 p-8 rounded-lg shadow-lg space-y-6"
          >
            {/* Password Lama */}
            <div>
              <label className="block text-sm font-medium text-gray-300">Password Lama</label>
              <div className="relative mt-1">
                <input
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-primary focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowOldPassword(!showOldPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                >
                  {showOldPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Password Baru */}
            <div>
              <label className="block text-sm font-medium text-gray-300">Password Baru</label>
              <div className="relative mt-1">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  className="block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-primary focus:border-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Konfirmasi Password Baru */}
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Konfirmasi Password Baru
              </label>
              <input
                type="password"
                value={newPasswordConfirmation}
                onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                required
                className="mt-1 block w-full bg-gray-700 border border-gray-600 rounded-md shadow-sm py-2 px-3 text-white focus:outline-none focus:ring-primary focus:border-primary"
              />
            </div>

            {/* Tombol Simpan */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-2 px-6 rounded-lg transition-colors disabled:opacity-50"
              >
                {isSubmitting && <Loader2 className="animate-spin" size={20} />}
                {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ChangePasswordPage
