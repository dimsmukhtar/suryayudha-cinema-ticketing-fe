import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { X, Loader2 } from "lucide-react"

const VoucherFormModal = ({ isOpen, onClose, onSave, voucherToEdit }: any) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm()
  const isEditing = !!voucherToEdit

  useEffect(() => {
    if (isOpen) {
      if (voucherToEdit) {
        // Format tanggal agar sesuai dengan input type="date"
        const formattedData = {
          ...voucherToEdit,
          expires_at: voucherToEdit.expires_at
            ? new Date(voucherToEdit.expires_at).toISOString().split("T")[0]
            : "",
        }
        reset(formattedData)
      } else {
        reset({ code: "", type: "fixed", value: 0, usage_limit: 1, min_purchase_amount: 0 })
      }
    }
  }, [isOpen, voucherToEdit, reset])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">
            {isEditing ? "Edit Voucher" : "Tambah Voucher Baru"}
          </h2>
          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-gray-800" />
          </button>
        </div>
        <form
          onSubmit={handleSubmit((data) => onSave(data, voucherToEdit?.id))}
          className="space-y-4"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Kode Voucher"
              name="code"
              register={register}
              errors={errors}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700">Tipe Diskon</label>
              <select
                {...register("type")}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="fixed">Potongan Tetap (Rp)</option>
                <option value="percentage">Persentase (%)</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Nilai Diskon"
              name="value"
              type="number"
              register={register}
              errors={errors}
              required
            />
            <InputField
              label="Tanggal Kadaluarsa"
              name="expires_at"
              type="date"
              register={register}
              errors={errors}
              required
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Batas Penggunaan"
              name="usage_limit"
              type="number"
              register={register}
              errors={errors}
              required
            />
            <InputField
              label="Min. Pembelian (Rp)"
              name="min_purchase_amount"
              type="number"
              register={register}
              errors={errors}
              required
            />
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

// Helper komponen yang bisa digunakan kembali
const InputField = ({ label, name, type = "text", register, errors, required = false }: any) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      id={name}
      type={type}
      {...register(name, {
        required: required && `${label} tidak boleh kosong`,
        valueAsNumber: type === "number",
      })}
      className="mt-1 block w-full border border-gray-300 rounded-md p-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
    />
    {errors[name] && <p className="text-red-500 text-xs mt-1">{errors[name].message as string}</p>}
  </div>
)

export default VoucherFormModal
