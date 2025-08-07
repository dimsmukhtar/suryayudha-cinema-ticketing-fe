import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { formatRupiah } from "../utils/formatters"
import CountdownTimer from "./CountdownTimer"
import { AlertCircle, CheckCircle, Clock, Film } from "lucide-react"

const BookingHistoryCard = ({ booking }: any) => {
  const navigate = useNavigate()
  const [isExpired, setIsExpired] = useState(new Date(booking.booking_expires_at) < new Date())

  const isCancelled = booking.status === "cancelled"
  const isActive = booking.status === "initiated" && !isExpired

  // --- KARTU UNTUK BOOKING YANG DIBATALKAN ---
  if (isCancelled) {
    return (
      <div className="bg-gray-800/50 rounded-lg shadow-lg flex items-center p-4 opacity-60">
        <div className="w-20 h-28 rounded-md bg-gray-700 flex items-center justify-center">
          <Film className="w-10 h-10 text-gray-500" />
        </div>
        <div className="flex-grow ml-4">
          <h3 className="font-bold text-lg text-gray-500 line-through">Booking Dibatalkan</h3>
          <p className="text-sm text-gray-400">ID Transaksi: {booking.id}</p>
          <p className="text-sm text-gray-300 font-semibold mt-1">
            {formatRupiah(booking.total_amount)}
          </p>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-red-800 text-red-200">
            <AlertCircle size={14} />
            <span>Dibatalkan</span>
          </div>
        </div>
      </div>
    )
  }

  // --- KARTU UNTUK BOOKING AKTIF (YANG MEMILIKI DETAIL) ---
  const movie = booking.transaction_items[0]?.schedule_seat.schedule.movie

  const handleCardClick = () => {
    if (isActive) {
      navigate(`/booking-summary/${booking.id}`)
    }
  }

  return (
    <div
      onClick={handleCardClick}
      className={`bg-gray-800/50 rounded-lg shadow-lg flex items-center p-4 transition-all duration-300 ${
        isActive ? "hover:bg-gray-700/70 cursor-pointer" : "opacity-100"
      }`}
    >
      <img
        src={movie?.poster_url}
        alt={movie?.title}
        className="w-20 h-28 rounded-md object-cover"
      />
      <div className="flex-grow ml-4">
        <h3 className="font-bold text-lg text-white">{movie?.title}</h3>
        <p className="text-sm text-gray-400">
          Kursi: {booking.transaction_items.map((item: any) => item.seat_label).join(", ")}
        </p>
        <p className="text-sm text-gray-300 font-semibold mt-1">
          {formatRupiah(booking.total_amount)}
        </p>
      </div>
      <div className="text-right">
        {isActive ? (
          <>
            <p className="text-xs text-yellow-400 mb-1 flex items-center justify-end gap-1">
              <Clock size={14} /> Selesaikan Dalam
            </p>
            <CountdownTimer
              expiryTime={booking.booking_expires_at}
              onExpire={() => setIsExpired(true)}
            />
            <button className="mt-2 text-xs bg-primary text-white font-semibold px-3 py-1 rounded-full">
              Lanjutkan
            </button>
          </>
        ) : (
          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-gray-700 text-gray-400">
            <CheckCircle size={14} />
            <span>Kadaluarsa</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default BookingHistoryCard
