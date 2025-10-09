import React, { useState } from "react"
import { X, Loader2, AlertTriangle } from "lucide-react"
import toast from "react-hot-toast"

const UpdateStatusConfirmationModal = ({ isOpen, onClose, onConfirm, seat }: any) => {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleConfirm = async () => {
    setIsUpdating(true)
    const loadingToast = toast.loading(`Mengubah status kursi ${seat?.label}...`)
    try {
      await onConfirm()
      toast.dismiss(loadingToast)
      toast.success(`Kursi ${seat?.label} berhasil dipesan.`)
      onClose() // Tutup modal setelah berhasil
    } catch (error: any) {
      toast.dismiss(loadingToast)
      toast.error(error.message || "Gagal mengubah status kursi.")
    } finally {
      setIsUpdating(false)
    }
  }

  if (!isOpen || !seat) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[60] p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex items-start">
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
            <AlertTriangle className="h-6 w-6 text-blue-600" aria-hidden="true" />
          </div>
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Konfirmasi Perubahan Status
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Anda yakin ingin mengubah status kursi{" "}
                <strong className="font-mono bg-gray-200 px-1 rounded">{seat.label}</strong> menjadi{" "}
                <strong className="text-red-600">Dipesan (Booked)</strong>? Aksi ini untuk penjualan
                tiket offline.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            disabled={isUpdating}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary-dark sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            onClick={handleConfirm}
          >
            {isUpdating && <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />}
            {isUpdating ? "Memproses..." : "Ya, Ubah Status"}
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={onClose}
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  )
}

export default UpdateStatusConfirmationModal
