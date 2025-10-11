import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { X, Loader2 } from "lucide-react"

const UserFormModal = ({ isOpen, onClose, onSave, userToEdit }: any) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()
  const isEditing = !!userToEdit

  useEffect(() => {
    if (isOpen) {
      if (userToEdit) {
        reset(userToEdit)
      } else {
        reset({ name: "", email: "", role: "user", password: "", is_verified: false })
      }
    }
  }, [isOpen, userToEdit, reset])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {isEditing ? "Edit Pengguna" : "Tambah Pengguna Baru"}
          </h2>
          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-gray-800" />
          </button>
        </div>
        <form onSubmit={handleSubmit((data) => onSave(data, userToEdit?.id))} className="space-y-4">
          <InputField
            label="Nama Lengkap"
            name="name"
            register={register}
            errors={errors}
            required
          />
          <InputField
            label="Email"
            name="email"
            type="email"
            register={register}
            errors={errors}
            required
          />

          {!isEditing && (
            <InputField
              label="Password"
              name="password"
              type="password"
              register={register}
              errors={errors}
              required
            />
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700">Peran</label>
            <select
              {...register("role")}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                {...register("is_verified")}
                type="checkbox"
                className="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded"
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="is_verified" className="font-medium text-gray-700">
                Sudah Terverifikasi
              </label>
            </div>
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

export default UserFormModal
