import React, { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import toast from "react-hot-toast"
import { getScheduleLayout, createBooking } from "../../api/apiService"
import SeatLayout from "../../components/SeatLayout"
import { formatRupiah } from "../../utils/formatters"
import { useAuth } from "../../hooks/useAuth"
import { ArrowRight } from "lucide-react"

const SeatSelectionPage = () => {
  const { id: scheduleId } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const location = useLocation()

  // Ambil 'isAuthenticated' dari context yang sudah disederhanakan
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth()

  // Ambil jumlah tiket dari halaman sebelumnya, default 1 jika tidak ada
  const ticketCount = location.state?.ticketCount || 1

  const [scheduleInfo, setScheduleInfo] = useState<any>(null)
  const [seatLayout, setSeatLayout] = useState<any[]>([])
  const [selectedSeats, setSelectedSeats] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isBooking, setIsBooking] = useState(false)

  useEffect(() => {
    if (!scheduleId) return
    const fetchLayout = async () => {
      setIsLoading(true)
      try {
        const data = await getScheduleLayout(scheduleId)
        setScheduleInfo(data.schedule)
        setSeatLayout(data.seatLayout)
      } catch (error) {
        toast.error("Gagal memuat denah kursi.")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchLayout()
  }, [scheduleId])

  const handleSeatSelect = (seat: any) => {
    // --- PERBAIKAN UTAMA DI SINI ---
    // Cek 'isAuthenticated' dari context, bukan 'user'
    if (!isAuthenticated) {
      toast.error("Anda harus login untuk memilih kursi.")
      navigate("/login", { state: { from: location } })
      return
    }

    // Anda bisa menambahkan kembali pengecekan is_verified jika user object ada di context
    // if (!user.is_verified) { ... }

    setSelectedSeats((prev) => {
      const isSelected = prev.some((s) => s.seatId === seat.seatId)
      if (isSelected) {
        return prev.filter((s) => s.seatId !== seat.seatId)
      } else {
        // Batasi jumlah kursi yang bisa dipilih
        if (prev.length >= ticketCount) {
          toast.error(`Anda hanya dapat memilih ${ticketCount} kursi.`)
          // Ganti kursi terakhir dengan yang baru
          return [...prev.slice(1), seat]
        }
        return [...prev, seat]
      }
    })
  }

  const handleCreateBooking = async () => {
    if (selectedSeats.length !== ticketCount) {
      toast.error(`Harap pilih tepat ${ticketCount} kursi.`)
      return
    }
    setIsBooking(true)
    const loadingToast = toast.loading("Membuat booking...")
    try {
      const scheduleSeatIds = selectedSeats.map((s) => s.scheduleSeatId)
      const newTransaction = await createBooking(parseInt(scheduleId!), scheduleSeatIds)
      toast.dismiss(loadingToast)
      toast.success("Booking berhasil dibuat! Lanjutkan ke pembayaran.")
      navigate(`/booking-summary/${newTransaction.id}`)
    } catch (error: any) {
      toast.dismiss(loadingToast)
      const errorMessage = error.response?.data?.message || "Gagal membuat booking."
      toast.error(errorMessage)
    } finally {
      setIsBooking(false)
    }
  }

  const totalPrice = (scheduleInfo?.price || 0) * selectedSeats.length

  if (isLoading || isAuthLoading) {
    return <div className="text-white text-center py-40">Memuat denah kursi...</div>
  }

  return (
    <div className="bg-background text-white min-h-screen pt-24 pb-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold">{scheduleInfo?.movieTitle}</h1>
          <p className="text-lg text-gray-400 mt-2">
            {new Date(scheduleInfo?.startTime).toLocaleString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "long",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>

        <SeatLayout
          layout={seatLayout}
          selectedSeats={selectedSeats}
          onSeatSelect={handleSeatSelect}
          screenPlacement={scheduleInfo?.screenPlacement}
        />
      </div>

      {/* Booking Summary Bar */}
      <div
        className={`fixed bottom-0 left-0 w-full bg-gray-900/80 backdrop-blur-sm border-t border-gray-700 shadow-lg transform transition-transform duration-300 ${
          selectedSeats.length > 0 ? "translate-y-0" : "translate-y-full"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm text-gray-400">
              Kursi Dipilih ({selectedSeats.length}/{ticketCount})
            </p>
            <p className="font-semibold text-lg truncate max-w-xs sm:max-w-md">
              {selectedSeats.map((s) => s.label).join(", ") || "Pilih kursi Anda"}
            </p>
          </div>
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <div className="text-right">
              <p className="text-sm text-gray-400">Total Harga</p>
              <p className="font-bold text-2xl text-primary">{formatRupiah(totalPrice)}</p>
            </div>
            <button
              onClick={handleCreateBooking}
              disabled={isBooking || selectedSeats.length !== ticketCount}
              className="flex-grow sm:flex-grow-0 flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-white font-bold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isBooking ? "Memproses..." : "Lanjutkan"}
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeatSelectionPage
