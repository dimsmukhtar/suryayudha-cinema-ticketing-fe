import React, { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { getAllSchedulesAdmin, createSchedule, deleteSchedule } from "../../api/apiService"
import { Plus, Trash2, Calendar, Clock, Loader2, Eye } from "lucide-react"
import ScheduleFormModal from "../../components/admin/ScheduleFormModal"
import DeleteConfirmationModal from "../../components/admin/DeleteConfirmationModal"
import { formatDate, formatTime, formatRupiah } from "../../utils/formatters"
import ScheduleDetailModal from "../../components/admin/ScheduleDetailModal"

const ManageSchedulesPage = () => {
  const [schedules, setSchedules] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [scheduleToDelete, setScheduleToDelete] = useState<any | null>(null)
  const [scheduleToView, setScheduleToView] = useState<any | null>(null)
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0])

  const fetchSchedules = async () => {
    setIsLoading(true)
    try {
      const data = await getAllSchedulesAdmin({ date: filterDate })
      setSchedules(data.data)
    } catch (error) {
      toast.error("Gagal memuat data jadwal.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSchedules()
  }, [filterDate])

  const handleSaveSchedule = async (payload: any) => {
    const actionPromise = createSchedule(payload)
    toast.promise(actionPromise, {
      loading: "Menyimpan jadwal...",
      success: (res: any) => {
        fetchSchedules()
        setIsFormModalOpen(false)
        return res.message || "Jadwal berhasil ditambahkan!"
      },
      error: (err: any) => err.message || "Gagal menyimpan jadwal.",
    })
  }

  const handleDeleteSchedule = async () => {
    if (!scheduleToDelete) return
    const actionPromise = deleteSchedule(scheduleToDelete.id)
    toast.promise(actionPromise, {
      loading: "Menghapus jadwal...",
      success: (res: any) => {
        fetchSchedules()
        setIsDeleteModalOpen(false)
        return res.message || "Jadwal berhasil dihapus!"
      },
      error: (err: any) => err.message || "Gagal menghapus jadwal.",
    })
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Jadwal</h1>
        <div className="w-full md:w-auto flex items-center gap-4">
          <div className="relative w-full md:w-auto">
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900"
            />
            <Calendar
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={20}
            />
          </div>
          <button
            onClick={() => setIsFormModalOpen(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-primary-dark whitespace-nowrap"
          >
            <Plus size={18} />
            Tambah Jadwal
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Film
                </th>
                <th scope="col" className="px-6 py-3">
                  Studio
                </th>
                <th scope="col" className="px-6 py-3">
                  Waktu Mulai
                </th>
                <th scope="col" className="px-6 py-3">
                  Waktu Selesai
                </th>
                <th scope="col" className="px-6 py-3">
                  Harga
                </th>
                <th scope="col" className="px-6 py-3 text-right">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="text-center py-10">
                    <Loader2 className="animate-spin mx-auto text-primary" />
                  </td>
                </tr>
              ) : schedules.length > 0 ? (
                schedules.map((schedule: any) => (
                  <tr key={schedule.id} className="bg-white border-b hover:bg-gray-50">
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                    >
                      {schedule.movie.title}
                    </th>
                    <td className="px-6 py-4">{schedule.studio.name}</td>
                    <td className="px-6 py-4 flex items-center gap-2">
                      <Clock size={14} /> {formatTime(schedule.start_time)}
                    </td>
                    <td className="px-6 py-4">{formatTime(schedule.finished_time)}</td>
                    <td className="px-6 py-4">{formatRupiah(schedule.price)}</td>
                    <td className="px-6 py-4 text-right flex justify-end gap-4">
                      <button
                        onClick={() => {
                          setScheduleToView(schedule)
                          setIsDetailModalOpen(true)
                        }}
                        className="text-gray-500 hover:text-primary"
                        title="Lihat Kursi"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => {
                          setScheduleToDelete(schedule)
                          setIsDeleteModalOpen(true)
                        }}
                        className="text-red-600 hover:text-red-800"
                        title="Hapus"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">
                    Tidak ada jadwal untuk tanggal ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ScheduleFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveSchedule}
      />

      <ScheduleDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        schedule={scheduleToView}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteSchedule}
        isDeleting={false}
        itemName={`Jadwal film "${scheduleToDelete?.movie.title}"`}
      />
    </div>
  )
}

export default ManageSchedulesPage
