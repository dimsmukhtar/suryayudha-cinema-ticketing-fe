import React, { useState, useEffect, useMemo } from "react"
import toast from "react-hot-toast"
import {
  getAllUsersAdmin,
  createUserAdmin,
  updateUserAdmin,
  deleteUserAdmin,
  sendNotificationToUser,
  getUserByIdAdmin,
} from "../../api/apiService"
import {
  Plus,
  Edit,
  Trash2,
  Search,
  Send,
  Eye,
  MessageSquarePlus,
  Loader,
  Loader2,
} from "lucide-react"
import useDebounce from "../../hooks/useDebounce"
import Pagination from "../../components/admin/Pagination"
import UserFormModal from "../../components/admin/UserFormModal"
import DeleteConfirmationModal from "../../components/admin/DeleteConfirmationModal"
import NotificationFormModal from "../../components/admin/NotificationFormModal"
import UserDetailModal from "../../components/admin/UserDetailModal"

const ManageUsersPage = () => {
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [meta, setMeta] = useState<any>({})

  const [filters, setFilters] = useState({ name: "" })
  const [currentPage, setCurrentPage] = useState(1)
  const debouncedName = useDebounce(filters.name, 500)

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false) // State baru

  const [userToEdit, setUserToEdit] = useState<any | null>(null)
  const [userToDelete, setUserToDelete] = useState<any | null>(null)
  const [userForNotif, setUserForNotif] = useState<any | null>(null)
  const [userToView, setUserToView] = useState<any | null>(null)

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const response = await getAllUsersAdmin({ page: currentPage, name: debouncedName })
      setUsers(response.data)
      setMeta(response.meta)
    } catch (error) {
      toast.error("Gagal memuat data pengguna.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [currentPage, debouncedName])

  const handleOpenDetailModal = async (userId: number) => {
    const loadingToast = toast.loading("Mengambil detail pengguna...")
    try {
      const userDetails = await getUserByIdAdmin(userId)
      toast.dismiss(loadingToast)
      setUserToView(userDetails)
      setIsDetailModalOpen(true)
    } catch (error) {
      toast.dismiss(loadingToast)
      toast.error("Gagal mengambil detail pengguna.")
    }
  }

  const handleSaveUser = async (data: any, userId?: number) => {
    const actionPromise = userId ? updateUserAdmin(userId, data) : createUserAdmin(data)
    toast.promise(actionPromise, {
      loading: "Menyimpan pengguna...",
      success: (res) => {
        fetchUsers()
        setIsFormModalOpen(false)
        return res.message
      },
      error: (err) => err.message,
    })
  }

  const handleDeleteUser = async () => {
    if (!userToDelete) return
    const actionPromise = deleteUserAdmin(userToDelete.id)
    toast.promise(actionPromise, {
      loading: "Menghapus pengguna...",
      success: (res) => {
        fetchUsers()
        setIsDeleteModalOpen(false)
        return res.message
      },
      error: (err) => err.message,
    })
  }

  const handleSendNotification = async (data: any) => {
    const payload = {
      ...data,
      target_audience: "spesific",
      user_id: userForNotif.id,
    }
    const actionPromise = sendNotificationToUser(payload)
    toast.promise(actionPromise, {
      loading: "Mengirim notifikasi...",
      success: (res) => {
        setIsNotifModalOpen(false)
        return res.message
      },
      error: (err) => err.message,
    })
  }

  const handleSendBroadcastNotification = async (data: any) => {
    const payload = {
      ...data,
      target_audience: "all",
    }
    const actionPromise = sendNotificationToUser(payload)
    toast.promise(actionPromise, {
      loading: "Mengirim notifikasi global...",
      success: (res) => {
        setIsBroadcastModalOpen(false)
        return res.message
      },
      error: (err) => err.message,
    })
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Pengguna</h1>
        <div className="w-full md:w-auto flex items-center gap-4">
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Cari nama..."
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-black"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
          {/* --- TOMBOL BARU DI SINI --- */}
          <button
            onClick={() => setIsBroadcastModalOpen(true)}
            className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 whitespace-nowrap"
          >
            <MessageSquarePlus size={18} />
            Notif Global
          </button>
          <button
            onClick={() => {
              setUserToEdit(null)
              setIsFormModalOpen(true)
            }}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark whitespace-nowrap"
          >
            <Plus size={18} />
            Tambah User
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Nama
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Peran
                </th>
                <th scope="col" className="px-6 py-3">
                  Terverifikasi
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
                    <Loader2 className="animate-spin mx-auto text-primary" />
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.role}</td>
                    <td className="px-6 py-4">{user.is_verified ? "Ya" : "Tidak"}</td>
                    <td className="px-6 py-4 flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenDetailModal(user.id)}
                        className="p-1 text-gray-500 hover:text-green-600"
                        title="Lihat Detail"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setUserForNotif(user)
                          setIsNotifModalOpen(true)
                        }}
                        className="p-1 text-gray-500 hover:text-yellow-600"
                        title="Kirim Notifikasi"
                      >
                        <Send size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setUserToEdit(user)
                          setIsFormModalOpen(true)
                        }}
                        className="p-1 text-gray-500 hover:text-blue-600"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setUserToDelete(user)
                          setIsDeleteModalOpen(true)
                        }}
                        className="p-1 text-gray-500 hover:text-red-600"
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

      <Pagination
        currentPage={meta.page}
        totalPages={meta.totalPages}
        onPageChange={handlePageChange}
      />

      <UserFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveUser}
        userToEdit={userToEdit}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteUser}
        itemName={userToDelete?.name}
      />
      {userForNotif && (
        <NotificationFormModal
          isOpen={isNotifModalOpen}
          onClose={() => setIsNotifModalOpen(false)}
          onSend={handleSendNotification}
          user={userForNotif}
        />
      )}
      {userToView && (
        <UserDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          user={userToView}
        />
      )}

      {/* --- MODAL BARU DI SINI --- */}
      <NotificationFormModal
        isOpen={isBroadcastModalOpen}
        onClose={() => setIsBroadcastModalOpen(false)}
        onSend={handleSendBroadcastNotification}
      />
    </div>
  )
}

export default ManageUsersPage
