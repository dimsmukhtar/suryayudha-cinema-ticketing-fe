import React, { useState, useEffect } from "react"
import { useAuth } from "../../hooks/useAuth"
import { getMyProfile, updateMyProfile } from "../../api/apiService"
import toast from "react-hot-toast"
import { Camera, Loader2 } from "lucide-react"

const ProfilePage = () => {
  const { user, setUser, isLoading: isAuthLoading } = useAuth()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (user) {
      setName(user.name)
      setEmail(user.email)
      setPreviewImage(user.profile_url)
    }
  }, [user])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setProfileImage(file)
      // Buat URL sementara untuk pratinjau gambar
      setPreviewImage(URL.createObjectURL(file))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const loadingToast = toast.loading("Menyimpan perubahan...")

    // FormData digunakan untuk mengirim file dan teks bersamaan
    const formData = new FormData()
    formData.append("name", name)
    formData.append("email", email)
    if (profileImage) {
      formData.append("profile_url", profileImage)
    }

    try {
      await updateMyProfile(formData)
      // Ambil profil terbaru untuk memperbarui context secara global
      const updatedProfile = await getMyProfile()
      setUser(updatedProfile)
      toast.dismiss(loadingToast)
      toast.success("Profil berhasil diperbarui!")
    } catch (error: any) {
      toast.dismiss(loadingToast)
      toast.error(error.message || "Gagal memperbarui profil.")
      console.error("Update profile error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isAuthLoading) {
    return <div className="text-white text-center py-40">Memuat profil...</div>
  }

  return (
    <div className="bg-background text-white min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Profil Saya</h1>
          <form
            onSubmit={handleSubmit}
            className="bg-gray-800/50 p-8 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Kolom Kiri: Foto Profil */}
            <div className="md:col-span-1 flex flex-col items-center">
              <div className="relative w-40 h-40">
                <img
                  src={
                    previewImage ||
                    `https://ui-avatars.com/api/?name=${name}&size=160&background=random&color=fff`
                  }
                  alt="Pratinjau Profil"
                  className="w-full h-full rounded-full object-cover border-4 border-gray-700"
                />
                <label
                  htmlFor="profileImageInput"
                  className="absolute bottom-2 right-2 bg-primary hover:bg-primary-dark text-white p-2 rounded-full cursor-pointer transition-transform hover:scale-110"
                >
                  <Camera size={20} />
                  <input
                    id="profileImageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              </div>
              <p className="text-xs text-gray-400 mt-4 text-center">
                Klik ikon kamera untuk mengubah foto
              </p>
            </div>

            {/* Kolom Kanan: Detail Form */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
                  Nama Lengkap
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Alamat Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-700 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Peran</label>
                <p className="w-full bg-gray-900/50 text-gray-400 rounded-md p-2 capitalize">
                  {user?.role}
                </p>
              </div>
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
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
