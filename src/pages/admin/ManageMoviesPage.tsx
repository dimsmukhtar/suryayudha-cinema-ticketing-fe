import React, { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { getAllMoviesAdmin, createMovie, updateMovie, deleteMovie } from "../../api/apiService"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import MovieFormModal from "../../components/admin/MovieFormModal"
import DeleteConfirmationModal from "../../components/admin/DeleteConfirmationModal"
import { formatDate } from "../../utils/formatters"

const ManageMoviesPage = () => {
  const [movies, setMovies] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [movieToEdit, setMovieToEdit] = useState<any | null>(null)
  const [movieToDelete, setMovieToDelete] = useState<any | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const fetchMovies = async () => {
    setIsLoading(true)
    try {
      const data = await getAllMoviesAdmin({ title: searchTerm })
      setMovies(data.data)
    } catch (error) {
      toast.error("Gagal memuat data film.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchMovies()
    }, 500)
    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  const handleOpenAddModal = () => {
    setMovieToEdit(null)
    setIsModalOpen(true)
  }

  const handleOpenEditModal = (movie: any) => {
    setMovieToEdit(movie)
    setIsModalOpen(true)
  }

  const handleOpenDeleteModal = (movie: any) => {
    setMovieToDelete(movie)
    setIsDeleteModalOpen(true)
  }

  const handleSaveMovie = async (formData: FormData, movieId?: number) => {
    const actionPromise = movieId ? updateMovie(movieId, formData) : createMovie(formData)

    toast.promise(actionPromise, {
      loading: "Menyimpan film...",
      success: (res: any) => {
        fetchMovies()
        setIsModalOpen(false)
        return res.message || `Film berhasil ${movieId ? "diperbarui" : "ditambahkan"}!`
      },
      error: (err: any) => err.message || "Gagal menyimpan film.",
    })
  }

  const handleDeleteMovie = async () => {
    if (!movieToDelete) return

    const actionPromise = deleteMovie(movieToDelete.id)
    toast.promise(actionPromise, {
      loading: "Menghapus film...",
      success: (res: any) => {
        fetchMovies()
        setIsDeleteModalOpen(false)
        return res.message || "Film berhasil dihapus!"
      },
      error: (err: any) => err.message || "Gagal menghapus film.",
    })
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Film</h1>
        <div className="w-full md:w-auto flex items-center gap-4">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Cari film..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-black"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <button
            onClick={handleOpenAddModal}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark whitespace-nowrap"
          >
            <Plus size={18} />
            Tambah Film
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Poster
                </th>
                <th scope="col" className="px-6 py-3">
                  Judul
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Tanggal Rilis
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-10">
                    Loading...
                  </td>
                </tr>
              ) : (
                movies.map((movie) => (
                  <tr key={movie.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <img
                        src={movie.poster_url}
                        alt={movie.title}
                        className="w-12 h-16 object-cover rounded-md"
                      />
                    </td>
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900">
                      {movie.title}
                    </th>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          movie.status === "now_showing"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {movie.status === "now_showing" ? "Sedang Tayang" : "Akan Datang"}
                      </span>
                    </td>
                    <td className="px-6 py-4">{formatDate(movie.release_date)}</td>
                    <td className="px-6 py-4 flex justify-end gap-4">
                      <button
                        onClick={() => handleOpenEditModal(movie)}
                        className="text-blue-600 hover:text-blue-800"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleOpenDeleteModal(movie)}
                        className="text-red-600 hover:text-red-800"
                        title="Hapus"
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

      <MovieFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveMovie}
        movieToEdit={movieToEdit}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteMovie}
        isDeleting={false}
        itemName={movieToDelete?.title}
      />
    </div>
  )
}

export default ManageMoviesPage
