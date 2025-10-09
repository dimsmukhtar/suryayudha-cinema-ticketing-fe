import React, { useState, useEffect, useCallback } from "react"
import toast from "react-hot-toast"
import { X, Loader2 } from "lucide-react"
import { getScheduleLayout, updateScheduleSeatStatus } from "../../api/apiService"
import SeatLayout from "../SeatLayout"
import UpdateStatusConfirmationModal from "./UpdateStatusConfirmationModal" // Impor baru

const ScheduleDetailModal = ({ isOpen, onClose, schedule }: any) => {
  const [layoutData, setLayoutData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  // State baru untuk modal konfirmasi
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false)
  const [seatToUpdate, setSeatToUpdate] = useState<any>(null)

  const fetchLayout = useCallback(async () => {
    if (!schedule) return
    setIsLoading(true)
    try {
      const data = await getScheduleLayout(schedule.id)
      setLayoutData(data)
    } catch (error) {
      toast.error("Gagal memuat denah kursi.")
    } finally {
      setIsLoading(false)
    }
  }, [schedule])

  useEffect(() => {
    if (isOpen) {
      fetchLayout()
    }
  }, [isOpen, fetchLayout])

  // Fungsi ini sekarang HANYA membuka modal konfirmasi
  const handleAdminSeatSelect = (seat: any) => {
    if (seat.status !== "available") {
      toast.error("Hanya kursi yang tersedia yang bisa diubah menjadi Dipesan.")
      return
    }
    setSeatToUpdate(seat)
    setIsConfirmModalOpen(true)
  }

  const confirmUpdateStatus = async () => {
    if (!seatToUpdate) return
    await updateScheduleSeatStatus(seatToUpdate.scheduleSeatId, "booked")
    fetchLayout()
  }

  if (!isOpen) return null

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
          <div className="flex justify-between items-center mb-4 border-b pb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Detail Kursi Jadwal</h2>
              <p className="text-sm text-gray-600">
                {schedule?.movie.title} - {schedule?.studio.name}
              </p>
            </div>
            <button onClick={onClose}>
              <X className="text-gray-500 hover:text-gray-800" />
            </button>
          </div>
          <div className="overflow-y-auto flex-grow">
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="animate-spin text-primary" size={40} />
              </div>
            ) : layoutData ? (
              <div className="bg-gray-900 text-white p-4 rounded-md">
                <SeatLayout
                  layout={layoutData.seatLayout}
                  selectedSeats={[]}
                  onSeatSelect={handleAdminSeatSelect}
                  screenPlacement={layoutData.schedule.screenPlacement}
                  isAdmin={true}
                />
              </div>
            ) : (
              <p className="text-center text-gray-600">Gagal memuat denah kursi.</p>
            )}
          </div>
        </div>
      </div>

      {/* Render Modal Konfirmasi di sini */}
      <UpdateStatusConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={confirmUpdateStatus}
        seat={seatToUpdate}
      />
    </>
  )
}

export default ScheduleDetailModal
