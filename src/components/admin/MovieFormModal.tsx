import React, { useState, useEffect } from "react"
import { X, Loader2, UploadCloud, Plus, Edit, Trash2 } from "lucide-react"
import { useForm } from "react-hook-form"
import { getAllGenres, createCast, updateCast, deleteCast } from "../../api/apiService"
import toast from "react-hot-toast"
import CastFormModal from "./CastFormModal"
import DeleteConfirmationModal from "./DeleteConfirmationModal"

const MovieFormModal = ({ isOpen, onClose, onSave, movieToEdit }: any) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  const [allGenres, setAllGenres] = useState<any[]>([])
  const [casts, setCasts] = useState<any[]>([])
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [isCastModalOpen, setIsCastModalOpen] = useState(false)
  const [castToEdit, setCastToEdit] = useState<any | null>(null)
  const [isDeleteCastModalOpen, setIsDeleteCastModalOpen] = useState(false)
  const [castToDelete, setCastToDelete] = useState<any | null>(null)

  useEffect(() => {
    if (isOpen) {
      getAllGenres()
        .then(setAllGenres)
        .catch((err) => console.error("Gagal mengambil genre", err))
    }
  }, [isOpen])

  useEffect(() => {
    if (isOpen) {
      if (movieToEdit) {
        reset({
          ...movieToEdit,
          release_date: movieToEdit.release_date
            ? new Date(movieToEdit.release_date).toISOString().split("T")[0]
            : "",
        })
        setImagePreview(movieToEdit.poster_url)
        setCasts(movieToEdit.casts || [])
      } else {
        reset({ status: "coming_soon", movie_genres: [] })
        setImagePreview(null)
        setCasts([])
      }
    }
  }, [isOpen, movieToEdit, reset])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagePreview(URL.createObjectURL(e.target.files[0]))
    }
  }

  const onSubmit = (data: any) => {
    const formData = new FormData()

    Object.keys(data).forEach((key) => {
      if (key === "poster_url") {
        if (data.poster_url && data.poster_url[0] && data.poster_url[0] instanceof File) {
          formData.append("poster_url", data.poster_url[0])
        }
      }
      // Saat mengedit, kita tidak mengirim genre. Saat menambah, kita kirim.
      else if (key === "movie_genres" && !movieToEdit) {
        let finalGenreIds: string[] = []
        if (data.movie_genres) {
          if (Array.isArray(data.movie_genres)) {
            finalGenreIds = data.movie_genres
          } else {
            finalGenreIds = [data.movie_genres]
          }
        }
        formData.append("movie_genres", finalGenreIds.join(","))
      }
      // Untuk field lain, tambahkan jika nilainya ada
      else if (key !== "movie_genres" && data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key])
      }
    })

    onSave(formData, movieToEdit?.id)
  }

  const handleSaveCast = async (formData: FormData, castId?: number) => {
    if (!movieToEdit?.id) return
    formData.append("movie_id", movieToEdit.id.toString())

    const actionPromise = castId ? updateCast(castId, formData) : createCast(formData)

    toast.promise(actionPromise, {
      loading: "Menyimpan pemain...",
      success: (res) => {
        if (castId) {
          setCasts(casts.map((c) => (c.id === castId ? res.data : c)))
        } else {
          setCasts([...casts, res.data])
        }
        setIsCastModalOpen(false)
        return res.message || "Pemain berhasil disimpan."
      },
      error: (err) => err.message || "Gagal menyimpan pemain.",
    })
  }

  const handleDeleteCast = async () => {
    if (!castToDelete) return
    const actionPromise = deleteCast(castToDelete.id)
    toast.promise(actionPromise, {
      loading: "Menghapus pemain...",
      success: (res) => {
        setCasts(casts.filter((c) => c.id !== castToDelete.id))
        setIsDeleteCastModalOpen(false)
        return res.message || "Pemain berhasil dihapus."
      },
      error: (err) => err.message || "Gagal menghapus pemain.",
    })
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4 border-b pb-4">
            <h2 className="text-xl font-bold text-gray-800">
              {movieToEdit ? "Edit Film" : "Tambah Film Baru"}
            </h2>
            <button onClick={onClose}>
              <X className="text-gray-500 hover:text-gray-800" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium text-gray-700 mb-1">Poster Film</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto h-48 w-auto rounded-md"
                      />
                    ) : (
                      <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                    )}
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label
                        htmlFor="poster_url"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none"
                      >
                        <span>Unggah file</span>
                        <input
                          id="poster_url"
                          {...register("poster_url", { onChange: handleImageChange })}
                          type="file"
                          className="sr-only"
                          accept="image/*"
                        />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500">PNG, JPG, GIF hingga 2MB</p>
                  </div>
                </div>
              </div>

              <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InputField
                  label="Judul Film"
                  name="title"
                  register={register}
                  errors={errors}
                  required
                />
                <InputField
                  label="Sutradara"
                  name="director"
                  register={register}
                  errors={errors}
                  required
                />
                <InputField
                  label="Durasi (cth: 2h 15m)"
                  name="duration"
                  register={register}
                  errors={errors}
                  required
                />
                <InputField
                  label="Rating (cth: 13+)"
                  name="rating"
                  register={register}
                  errors={errors}
                  required
                />
                <InputField
                  label="Bahasa"
                  name="language"
                  register={register}
                  errors={errors}
                  required
                />
                <InputField
                  label="Subtitle"
                  name="subtitle"
                  register={register}
                  errors={errors}
                  required
                />
                <InputField
                  label="URL Trailer (YouTube)"
                  name="trailer_url"
                  register={register}
                  errors={errors}
                  required
                />
                <InputField
                  label="Tanggal Rilis"
                  name="release_date"
                  type="date"
                  register={register}
                  errors={errors}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700">Status Tayang</label>
                  <select
                    {...register("status")}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="coming_soon">Akan Datang</option>
                    <option value="now_showing">Sedang Tayang</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700">Sinopsis</label>
                  <textarea
                    {...register("synopsis", { required: "Sinopsis tidak boleh kosong" })}
                    rows={3}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
                  ></textarea>
                  {errors.synopsis && (
                    <p className="text-red-500 text-xs mt-1">{errors.synopsis.message as string}</p>
                  )}
                </div>
              </div>
            </div>

            {/* --- PERBAIKAN UTAMA: Genre HANYA muncul saat Tambah Film --- */}
            {!movieToEdit && (
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700">Genre</label>
                <div className="mt-2 grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                  {allGenres.map((genre: any) => (
                    <label key={genre.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        {...register("movie_genres")}
                        value={genre.id}
                        className="rounded text-primary focus:ring-primary"
                      />
                      <span className="text-gray-700">{genre.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Bagian Cast (Hanya muncul saat edit) */}
            {movieToEdit && (
              <div className="md:col-span-3 border-t pt-6 mt-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-700">Daftar Pemain</h3>
                  <button
                    type="button"
                    onClick={() => {
                      setCastToEdit(null)
                      setIsCastModalOpen(true)
                    }}
                    className="bg-blue-500 text-white px-3 py-1 text-sm rounded-md flex items-center gap-1 hover:bg-blue-600"
                  >
                    <Plus size={16} /> Tambah
                  </button>
                </div>
                <div className="space-y-2">
                  {casts.map((cast: any) => (
                    <div
                      key={cast.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={cast.actor_url}
                          alt={cast.actor_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="font-medium text-gray-800">{cast.actor_name}</span>
                      </div>
                      <div className="flex gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            setCastToEdit(cast)
                            setIsCastModalOpen(true)
                          }}
                          className="text-gray-500 hover:text-blue-600"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCastToDelete(cast)
                            setIsDeleteCastModalOpen(true)
                          }}
                          className="text-gray-500 hover:text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  ))}
                  {casts.length === 0 && (
                    <p className="text-center text-gray-500 text-sm py-4">
                      Belum ada pemain ditambahkan.
                    </p>
                  )}
                </div>
              </div>
            )}

            <div className="md:col-span-3 flex justify-end gap-4 mt-4 border-t pt-6">
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
                {isSubmitting ? "Menyimpan..." : "Simpan Film"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <CastFormModal
        isOpen={isCastModalOpen}
        onClose={() => setIsCastModalOpen(false)}
        onSave={handleSaveCast}
        castToEdit={castToEdit}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteCastModalOpen}
        onClose={() => setIsDeleteCastModalOpen(false)}
        onConfirm={handleDeleteCast}
        itemName={castToDelete?.actor_name}
      />
    </>
  )
}

// Helper komponen untuk input field
const InputField = ({ label, name, type = "text", register, errors, required = false }: any) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      id={name}
      type={type}
      {...register(name, { required: required && `${label} tidak boleh kosong` })}
      className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
    />
    {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name].message as string}</p>}
  </div>
)

export default MovieFormModal
