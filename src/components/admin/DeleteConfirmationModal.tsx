import { X, Loader2, AlertTriangle } from "lucide-react"

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, isDeleting, itemName }: any) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
        <h2 className="text-xl font-bold text-gray-800 mt-4">Anda Yakin?</h2>
        <p className="text-gray-600 mt-2">
          Apakah Anda yakin ingin menghapus <strong>{itemName}</strong>? Tindakan ini tidak dapat
          diurungkan.
        </p>
        <div className="flex justify-center gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center gap-2 disabled:opacity-50"
          >
            {isDeleting && <Loader2 className="animate-spin" size={16} />}
            {isDeleting ? "Menghapus..." : "Ya, Hapus"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmationModal
