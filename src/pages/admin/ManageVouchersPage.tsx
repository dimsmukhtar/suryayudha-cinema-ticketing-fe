import React, { useState, useEffect, useCallback } from "react"
import toast from "react-hot-toast"
import { getAllVouchers, createVoucher, updateVoucher, deleteVoucher } from "../../api/apiService"
import { Plus, Edit, Trash2, Loader2, Tag } from "lucide-react"
import VoucherFormModal from "../../components/admin/VoucherFormModal"
import DeleteConfirmationModal from "../../components/admin/DeleteConfirmationModal"
import { formatRupiah, formatDate } from "../../utils/formatters"

const ManageVouchersPage = () => {
  const [vouchers, setVouchers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

  const [voucherToEdit, setVoucherToEdit] = useState<any | null>(null)
  const [voucherToDelete, setVoucherToDelete] = useState<any | null>(null)

  const fetchVouchers = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await getAllVouchers()
      setVouchers(response.data)
    } catch (error) {
      toast.error("Gagal memuat data voucher.")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVouchers()
  }, [fetchVouchers])

  const handleOpenAddModal = () => {
    setVoucherToEdit(null)
    setIsFormModalOpen(true)
  }

  const handleOpenEditModal = (voucher: any) => {
    setVoucherToEdit(voucher)
    setIsFormModalOpen(true)
  }

  const handleOpenDeleteModal = (voucher: any) => {
    setVoucherToDelete(voucher)
    setIsDeleteModalOpen(true)
  }

  const handleSaveVoucher = async (data: any, voucherId?: number) => {
    const isEditing = !!voucherId
    const actionPromise = isEditing ? updateVoucher(voucherId!, data) : createVoucher(data)

    toast.promise(actionPromise, {
      loading: "Menyimpan voucher...",
      success: (res: any) => {
        fetchVouchers()
        setIsFormModalOpen(false)
        return res.message || `Voucher berhasil ${isEditing ? "diperbarui" : "ditambahkan"}!`
      },
      error: (err: any) => err.message || "Gagal menyimpan voucher.",
    })
  }

  const handleDeleteVoucher = async () => {
    if (!voucherToDelete) return
    const actionPromise = deleteVoucher(voucherToDelete.id)
    toast.promise(actionPromise, {
      loading: "Menghapus voucher...",
      success: (res: any) => {
        fetchVouchers()
        setIsDeleteModalOpen(false)
        return res.message || "Voucher berhasil dihapus!"
      },
      error: (err: any) => err.message || "Gagal menghapus voucher.",
    })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Voucher</h1>
        <button
          onClick={handleOpenAddModal}
          className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark"
        >
          <Plus size={18} />
          Tambah Voucher
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Kode
                </th>
                <th scope="col" className="px-6 py-3">
                  Tipe
                </th>
                <th scope="col" className="px-6 py-3">
                  Nilai
                </th>
                <th scope="col" className="px-6 py-3">
                  Penggunaan
                </th>
                <th scope="col" className="px-6 py-3">
                  Kadaluarsa
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="text-center py-10">
                    <Loader2 className="animate-spin mx-auto text-primary" />
                  </td>
                </tr>
              ) : vouchers.length > 0 ? (
                vouchers.map((voucher) => {
                  const isExpired = new Date(voucher.expires_at) < new Date()
                  return (
                    <tr key={voucher.id} className="bg-white border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono font-semibold text-gray-900">
                        {voucher.code}
                      </td>
                      <td className="px-6 py-4 capitalize">{voucher.type}</td>
                      <td className="px-6 py-4 font-semibold">
                        {voucher.type === "percentage"
                          ? `${voucher.value}%`
                          : formatRupiah(voucher.value)}
                      </td>
                      <td className="px-6 py-4">
                        {voucher.usage_count} / {voucher.usage_limit}
                      </td>
                      <td className="px-6 py-4">{formatDate(voucher.expires_at)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            isExpired ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                          }`}
                        >
                          {isExpired ? "Kadaluarsa" : "Aktif"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right flex justify-end gap-4">
                        <button
                          onClick={() => handleOpenEditModal(voucher)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleOpenDeleteModal(voucher)}
                          className="text-red-600 hover:text-red-800"
                          title="Hapus"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-20 text-gray-500">
                    <Tag size={40} className="mx-auto mb-2" />
                    <p className="font-semibold">Belum ada voucher.</p>
                    <p className="text-xs">Klik "Tambah Voucher" untuk membuat yang baru.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <VoucherFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveVoucher}
        voucherToEdit={voucherToEdit}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteVoucher}
        itemName={`voucher ${voucherToDelete?.code}`}
      />
    </div>
  )
}

export default ManageVouchersPage
