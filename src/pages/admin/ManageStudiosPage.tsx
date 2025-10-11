import React, { useState, useEffect, useCallback } from "react"
import toast from "react-hot-toast"
import {
  getAllStudios,
  createStudio,
  updateStudio,
  deleteStudio,
  getStudioById,
} from "../../api/apiService"
import { Plus, Edit, Trash2, Camera, Loader2, Armchair } from "lucide-react"
import StudioFormModal from "../../components/admin/StudioFormModal"
import DeleteConfirmationModal from "../../components/admin/DeleteConfirmationModal"
import StudioGalleryModal from "../../components/admin/StudioGalleryModal"
import StudioSeatLayoutModal from "../../components/admin/StudioSeatLayoutModal"

const ManageStudiosPage = () => {
  const [studios, setStudios] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false)
  const [isSeatLayoutModalOpen, setIsSeatLayoutModalOpen] = useState(false)

  const [studioToEdit, setStudioToEdit] = useState<any | null>(null)
  const [studioToDelete, setStudioToDelete] = useState<any | null>(null)
  const [studioForGallery, setStudioForGallery] = useState<any | null>(null)
  const [studioForSeatLayout, setStudioForSeatLayout] = useState<any | null>(null)

  const fetchStudios = useCallback(async () => {
    setIsLoading(true)
    try {
      const data = await getAllStudios()
      // Untuk galeri, kita perlu data yang lebih detail, jadi kita ambil satu per satu
      const detailedStudios = await Promise.all(data.map((studio) => getStudioById(studio.id)))
      setStudios(detailedStudios)
    } catch (error) {
      toast.error("Gagal memuat data studio.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStudios()
  }, [fetchStudios])

  const handleOpenAddModal = () => {
    setStudioToEdit(null)
    setIsFormModalOpen(true)
  }

  const handleOpenEditModal = (studio: any) => {
    setStudioToEdit(studio)
    setIsFormModalOpen(true)
  }

  const handleOpenDeleteModal = (studio: any) => {
    setStudioToDelete(studio)
    setIsDeleteModalOpen(true)
  }

  const handleOpenGalleryModal = (studio: any) => {
    setStudioForGallery(studio)
    setIsGalleryModalOpen(true)
  }

  const handleOpenSeatLayoutModal = (studio: any) => {
    setStudioForSeatLayout(studio)
    setIsSeatLayoutModalOpen(true)
  }

  const handleSaveStudio = async (data: any) => {
    const isEditing = !!studioToEdit
    const actionPromise = isEditing ? updateStudio(studioToEdit.id, data) : createStudio(data)

    toast.promise(actionPromise, {
      loading: `Menyimpan studio...`,
      success: (res: any) => {
        fetchStudios()
        setIsFormModalOpen(false)
        return res.message || `Studio berhasil ${isEditing ? "diperbarui" : "ditambahkan"}!`
      },
      error: (err: any) => err.message || "Gagal menyimpan studio.",
    })
  }

  const handleDeleteStudio = async () => {
    if (!studioToDelete) return
    const actionPromise = deleteStudio(studioToDelete.id)
    toast.promise(actionPromise, {
      loading: "Menghapus studio...",
      success: (res: any) => {
        fetchStudios()
        setIsDeleteModalOpen(false)
        return res.message || "Studio berhasil dihapus!"
      },
      error: (err: any) => err.message || "Gagal menghapus studio.",
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Studio</h1>
        <button
          onClick={handleOpenAddModal}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark"
        >
          <Plus size={18} />
          Tambah Studio
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-gray-200 h-48 rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : studios.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {studios.map((studio) => (
            <div key={studio.id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-5">
                <h2 className="text-xl font-bold text-gray-800">{studio.name}</h2>
                <p className="text-sm text-gray-500 font-mono">{studio.id}</p>
                <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
                  <span>{studio.seats?.length || 0} Kursi</span>
                  <span>
                    Layar di: <span className="font-semibold">{studio.screen_placement}</span>
                  </span>
                </div>
              </div>
              <div className="bg-gray-50 px-5 py-3 flex justify-end gap-3">
                <button
                  onClick={() => handleOpenSeatLayoutModal(studio)}
                  className="text-gray-500 hover:text-purple-600"
                  title="Lihat Denah Kursi"
                >
                  <Armchair size={18} />
                </button>
                <button
                  onClick={() => handleOpenGalleryModal(studio)}
                  className="text-gray-500 hover:text-green-600"
                  title="Galeri Foto"
                >
                  <Camera size={18} />
                </button>
                <button
                  onClick={() => handleOpenEditModal(studio)}
                  className="text-gray-500 hover:text-blue-600"
                  title="Edit"
                >
                  <Edit size={18} />
                </button>
                <button
                  onClick={() => handleOpenDeleteModal(studio)}
                  className="text-gray-500 hover:text-red-600"
                  title="Hapus"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-500">
          <h3 className="text-xl font-semibold">Belum Ada Studio</h3>
          <p>Klik "Tambah Studio" untuk memulai.</p>
        </div>
      )}

      <StudioFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveStudio}
        studioToEdit={studioToEdit}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteStudio}
        itemName={studioToDelete?.name}
      />
      <StudioGalleryModal
        isOpen={isGalleryModalOpen}
        onClose={() => setIsGalleryModalOpen(false)}
        studio={studioForGallery}
        onDataChange={fetchStudios} // Refresh data saat ada perubahan
      />
      {studioForSeatLayout && (
        <StudioSeatLayoutModal
          isOpen={isSeatLayoutModalOpen}
          onClose={() => setIsSeatLayoutModalOpen(false)}
          studio={studioForSeatLayout}
        />
      )}
    </div>
  )
}

export default ManageStudiosPage
