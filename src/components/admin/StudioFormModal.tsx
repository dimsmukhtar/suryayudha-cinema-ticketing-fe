import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { X, Loader2 } from "lucide-react"

const StudioFormModal = ({ isOpen, onClose, onSave, studioToEdit }: any) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()

  useEffect(() => {
    if (isOpen) {
      if (studioToEdit) {
        reset(studioToEdit)
      } else {
        reset({ id: "", name: "", screen_placement: "top" })
      }
    }
  }, [isOpen, studioToEdit, reset])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {studioToEdit ? "Edit Studio" : "Tambah Studio Baru"}
          </h2>
          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-gray-800" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSave)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">ID Studio</label>
            <input
              {...register("id", { required: "ID tidak boleh kosong" })}
              readOnly={!!studioToEdit}
              placeholder="Contoh: cinema-4"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary read-only:bg-gray-100 read-only:cursor-not-allowed"
            />
            {errors.id && (
              <p className="text-red-500 text-xs mt-1">{errors.id.message as string}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Studio</label>
            <input
              {...register("name", { required: "Nama tidak boleh kosong" })}
              placeholder="Contoh: Cinema 4"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Posisi Layar</label>
            <select
              {...register("screen_placement")}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="top">Atas (Top)</option>
              <option value="left">Kiri (Left)</option>
              <option value="right">Kanan (Right)</option>
            </select>
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
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StudioFormModal
