import React, { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { getAllGenres, createGenre, updateGenre, deleteGenre } from "../../api/apiService"
import { Plus, Edit, Trash2, Loader2 } from "lucide-react"
import GenreFormModal from "../../components/admin/GenreFormModal"
import DeleteConfirmationModal from "../../components/admin/DeleteConfirmationModal"

const ManageGenresPage = () => {
  const [genres, setGenres] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [genreToEdit, setGenreToEdit] = useState<any | null>(null)
  const [genreToDelete, setGenreToDelete] = useState<any | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchGenres = async () => {
    setIsLoading(true)
    try {
      const data = await getAllGenres()
      setGenres(data)
    } catch (error) {
      toast.error("Gagal memuat data genre.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchGenres()
  }, [])

  const handleOpenAddModal = () => {
    setGenreToEdit(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (genre: any) => {
    setGenreToEdit(genre)
    setIsModalOpen(true)
  }

  const handleOpenDeleteModal = (genre: any) => {
    setGenreToDelete(genre)
    setIsDeleteModalOpen(true)
  }

  const handleSaveGenre = async (data: { name: string }) => {
    const actionPromise = genreToEdit ? updateGenre(genreToEdit.id, data) : createGenre(data)

    toast.promise(actionPromise, {
      loading: "Menyimpan...",
      success: (res: any) => {
        fetchGenres() // Muat ulang data setelah sukses
        setIsModalOpen(false)
        return res.message || `Genre berhasil ${genreToEdit ? "diperbarui" : "ditambahkan"}!`
      },
      error: (err: any) => err.message || "Gagal menyimpan genre.",
    })
  }

  const handleDeleteGenre = async () => {
    if (!genreToDelete) return
    setIsSubmitting(true)
    try {
      const res = await deleteGenre(genreToDelete.id)
      toast.success(res.message || "Genre berhasil dihapus!")
      setGenres(genres.filter((g) => g.id !== genreToDelete.id))
    } catch (error: any) {
      toast.error(error.message || "Gagal menghapus genre.")
    } finally {
      setIsSubmitting(false)
      setIsDeleteModalOpen(false)
      setGenreToDelete(null)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Genre</h1>
        <button
          onClick={handleOpenAddModal}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark"
        >
          <Plus size={18} />
          Tambah Genre
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Nama Genre
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10">
                    <Loader2 className="animate-spin mx-auto text-primary" />
                  </td>
                </tr>
              ) : (
                genres.map((genre) => (
                  <tr key={genre.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{genre.id}</td>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900">
                      {genre.name}
                    </th>
                    <td className="px-6 py-4 flex justify-end gap-4">
                      <button
                        onClick={() => handleOpenEditModal(genre)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleOpenDeleteModal(genre)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <GenreFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveGenre}
        genreToEdit={genreToEdit}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteGenre}
        isDeleting={isSubmitting}
        itemName={genreToDelete?.name}
      />
    </div>
  )
}

export default ManageGenresPage
