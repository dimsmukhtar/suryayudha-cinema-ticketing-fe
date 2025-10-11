import React, { useState, useCallback } from "react"
import { X, Loader2, UploadCloud, Trash2, Camera } from "lucide-react"
import { uploadStudioPhotos, deleteStudioPhoto } from "../../api/apiService"
import DeleteConfirmationModal from "./DeleteConfirmationModal"
import toast from "react-hot-toast"

const StudioGalleryModal = ({ isOpen, onClose, studio, onDataChange }: any) => {
  const [photosToUpload, setPhotosToUpload] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [galleryToDelete, setGalleryToDelete] = useState<any | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      setPhotosToUpload(filesArray)
      const previewUrls = filesArray.map((file) => URL.createObjectURL(file))
      setPreviews(previewUrls)
    }
  }

  const resetForm = () => {
    setPhotosToUpload([])
    setPreviews([])
  }

  const handleUpload = async () => {
    if (photosToUpload.length === 0) {
      toast.error("Pilih setidaknya satu foto untuk diunggah.")
      return
    }
    setIsUploading(true)
    const formData = new FormData()
    photosToUpload.forEach((photo) => formData.append("photos", photo))

    const actionPromise = uploadStudioPhotos(studio.id, formData)
    toast
      .promise(actionPromise, {
        loading: "Mengunggah foto...",
        success: (res) => {
          resetForm()
          onDataChange() // Beri tahu halaman utama untuk refresh data
          return res.message || "Foto berhasil diunggah!"
        },
        error: (err) => err.message || "Gagal mengunggah foto.",
      })
      .finally(() => setIsUploading(false))
  }

  const handleOpenDeleteModal = (photoId: any) => {
    setGalleryToDelete(photoId)
    setIsDeleteModalOpen(true)
  }

  const handleDeletePhoto = () => {
    if (!galleryToDelete) return
    const actionPromise = deleteStudioPhoto(galleryToDelete)
    toast.promise(actionPromise, {
      loading: "Menghapus foto...",
      success: (res) => {
        onDataChange()
        setIsDeleteModalOpen(false)
        return res.message || "Foto berhasil dihapus!"
      },
      error: (err) => err.message || "Gagal menghapus foto.",
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <h2 className="text-xl font-bold text-gray-800">Galeri Foto: {studio.name}</h2>
          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-gray-800" />
          </button>
        </div>

        <div className="overflow-y-auto flex-grow space-y-6">
          {/* Bagian Unggah Foto */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tambah Foto Baru</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 justify-center">
                  <label
                    htmlFor="photos"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark"
                  >
                    <span>Pilih file untuk diunggah</span>
                    <input
                      id="photos"
                      type="file"
                      className="sr-only"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500">Bisa pilih lebih dari satu</p>
              </div>
            </div>
            {previews.length > 0 && (
              <div className="mt-4">
                <h3 className="text-sm font-medium text-gray-700">
                  Pratinjau ({previews.length} foto):
                </h3>
                <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {previews.map((src, index) => (
                    <img
                      key={index}
                      src={src}
                      alt={`preview ${index}`}
                      className="w-24 h-24 object-cover rounded-md"
                    />
                  ))}
                </div>
                <button
                  onClick={handleUpload}
                  disabled={isUploading}
                  className="mt-4 w-full bg-primary text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 hover:bg-primary-dark disabled:opacity-50"
                >
                  {isUploading ? <Loader2 className="animate-spin" /> : <UploadCloud size={18} />}
                  {isUploading ? "Mengunggah..." : "Unggah Foto"}
                </button>
              </div>
            )}
          </div>

          {/* Bagian Galeri yang Sudah Ada */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-4">
              Galeri Saat Ini ({studio.galleries.length} foto)
            </h3>
            {studio.galleries.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {studio.galleries.map((photo: any) => (
                  <div key={photo.id} className="relative group">
                    <img
                      src={photo.photo_url}
                      alt={`Studio photo ${photo.id}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                      <button
                        onClick={() => handleOpenDeleteModal(photo.id)}
                        className="p-2 bg-red-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">
                <Camera size={40} className="mx-auto mb-2" />
                <p>Belum ada foto di galeri ini.</p>
              </div>
            )}
          </div>
        </div>
      </div>
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeletePhoto}
        itemName={"foto ini"}
      />
    </div>
  )
}

export default StudioGalleryModal
