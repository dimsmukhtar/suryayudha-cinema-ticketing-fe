import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { X, Loader2 } from "lucide-react"
import { getAllMoviesAdminSimple, getAllStudios } from "../../api/apiService"

const ScheduleFormModal = ({ isOpen, onClose, onSave }: any) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()
  const [movies, setMovies] = useState<any[]>([])
  const [studios, setStudios] = useState<any[]>([])

  useEffect(() => {
    if (isOpen) {
      // Ambil data film dan studio untuk dropdown
      const fetchData = async () => {
        try {
          const [moviesRes, studiosRes] = await Promise.all([
            getAllMoviesAdminSimple(),
            getAllStudios(),
          ])
          setMovies(moviesRes.data)
          setStudios(studiosRes)
        } catch (error) {
          toast.error("Gagal memuat data film atau studio.")
        }
      }
      fetchData()
      reset() // Kosongkan form setiap kali modal dibuka
    }
  }, [isOpen, reset])

  const onSubmit = (data: any) => {
    // Ubah format tanggal dan waktu lokal menjadi ISO string UTC
    const localDateTime = new Date(data.start_time)
    const isoDateTime = localDateTime.toISOString()

    const payload = {
      ...data,
      movie_id: parseInt(data.movie_id, 10),
      start_time: isoDateTime,
      price: parseInt(data.price, 10), // Pastikan harga adalah angka
    }
    onSave(payload)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Tambah Jadwal Baru</h2>
          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-gray-800" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Film</label>
            <select
              {...register("movie_id", { required: "Film harus dipilih" })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Pilih Film</option>
              {movies.map((movie) => (
                <option key={movie.id} value={movie.id}>
                  {movie.title}
                </option>
              ))}
            </select>
            {errors.movie_id && (
              <p className="text-red-500 text-xs mt-1">{errors.movie_id.message as string}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Studio</label>
            <select
              {...register("studio_id", { required: "Studio harus dipilih" })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Pilih Studio</option>
              {studios.map((studio) => (
                <option key={studio.id} value={studio.id}>
                  {studio.name}
                </option>
              ))}
            </select>
            {errors.studio_id && (
              <p className="text-red-500 text-xs mt-1">{errors.studio_id.message as string}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Waktu Mulai Tayang</label>
            <input
              type="datetime-local"
              {...register("start_time", { required: "Waktu mulai harus diisi" })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.start_time && (
              <p className="text-red-500 text-xs mt-1">{errors.start_time.message as string}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Harga Tiket (Rp)</label>
            <input
              type="number"
              {...register("price", { required: "Harga harus diisi", valueAsNumber: true })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.price && (
              <p className="text-red-500 text-xs mt-1">{errors.price.message as string}</p>
            )}
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark flex items-center gap-2 disabled:opacity-50"
            >
              {isSubmitting && <Loader2 className="animate-spin" size={16} />}
              {isSubmitting ? "Menyimpan..." : "Simpan Jadwal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ScheduleFormModal
