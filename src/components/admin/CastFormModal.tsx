import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { X, Loader2, UploadCloud } from "lucide-react"

const CastFormModal = ({ isOpen, onClose, onSave, castToEdit, movieId }: any) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    if (isOpen) {
      if (castToEdit) {
        reset(castToEdit)
        setImagePreview(castToEdit.actor_url)
      } else {
        reset({ actor_name: "", actor_url: null })
        setImagePreview(null)
      }
    }
  }, [isOpen, castToEdit, reset])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImagePreview(URL.createObjectURL(e.target.files[0]))
    }
  }

  const onSubmit = (data: any) => {
    const formData = new FormData()
    formData.append("actor_name", data.actor_name)
    // Hanya kirim file jika ada yang dipilih
    if (data.actor_url && data.actor_url[0]) {
      formData.append("actor_url", data.actor_url[0])
    }
    onSave(formData, castToEdit?.id)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {castToEdit ? "Edit Pemain" : "Tambah Pemain Baru"}
          </h2>
          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-gray-800" />
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Foto Aktor</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mx-auto h-24 w-24 rounded-full object-cover"
                  />
                ) : (
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                )}
                <div className="flex text-sm text-gray-600 justify-center">
                  <label
                    htmlFor="actor_url"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark"
                  >
                    <span>Unggah file</span>
                    <input
                      id="actor_url"
                      {...register("actor_url", { onChange: handleImageChange })}
                      type="file"
                      className="sr-only"
                      accept="image/*"
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Nama Aktor</label>
            <input
              {...register("actor_name", { required: "Nama tidak boleh kosong" })}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.actor_name && (
              <p className="text-red-500 text-xs mt-1">{errors.actor_name.message as string}</p>
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
              {isSubmitting ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CastFormModal
