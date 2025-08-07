import React, { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { getMyBookings } from "../../api/apiService"
import BookingHistoryCard from "../../components/BookingHistoryCard"
import { FileText } from "lucide-react"

const MyBookingsHistoryPage = () => {
  const [bookings, setBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBookings = async () => {
      setIsLoading(true)
      try {
        const data = await getMyBookings()
        setBookings(data)
      } catch (err) {
        setError("Gagal memuat riwayat booking Anda.")
        toast.error("Gagal memuat riwayat booking Anda.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchBookings()
  }, [])

  const renderContent = () => {
    if (isLoading) {
      // Skeleton Loading
      return (
        <div className="space-y-4">
          <div className="bg-gray-800/50 h-28 rounded-lg animate-pulse"></div>
          <div className="bg-gray-800/50 h-28 rounded-lg animate-pulse"></div>
        </div>
      )
    }
    if (error) {
      return <div className="text-center py-20 text-red-500">{error}</div>
    }
    if (bookings.length > 0) {
      return (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <BookingHistoryCard key={booking.id} booking={booking} />
          ))}
        </div>
      )
    }
    return (
      <div className="text-center py-20 text-gray-500">
        <FileText size={48} className="mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Tidak Ada Riwayat Booking</h3>
        <p>Semua booking Anda yang belum dibayar akan muncul di sini.</p>
      </div>
    )
  }

  return (
    <div className="bg-background text-white min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Riwayat Booking Saya</h1>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default MyBookingsHistoryPage
