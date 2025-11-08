import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import { formatRupiah } from "../utils/formatters"
import CountdownTimer from "./CountdownTimer"
import { CheckCircle, Clock, ExternalLink } from "lucide-react"

const TransactionHistoryCard = ({ transaction }: any) => {
  const navigate = useNavigate()
  const [isExpired, setIsExpired] = useState(new Date(transaction.payment_expires_at) < new Date())

  const isPending = transaction.status === "pending" && !isExpired
  const isSettlement = transaction.status === "settlement"

  if (!transaction.transaction_items || transaction.transaction_items.length === 0) {
    return (
      <div className="bg-gray-800/50 rounded-lg shadow-lg flex items-center p-4 border-l-4 border-red-500">
        <div className="flex-grow ml-2">
          <h3 className="font-bold text-lg text-white">Transaksi Dibatalkan</h3>
          <p className="text-sm text-gray-400">Order ID: {transaction.order_id}</p>
          <p className="text-sm text-gray-400 mt-1">
            Total: {formatRupiah(transaction.final_amount)}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="flex items-center justify-end gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-red-900 text-red-200">
            <span>Dibatalkan</span>
          </div>
        </div>
      </div>
    )
  }

  const movie = transaction.transaction_items[0]?.schedule_seat.schedule.movie

  return (
    <div
      className={`bg-gray-800/50 rounded-lg shadow-lg flex items-center p-4 transition-all duration-300 ${
        isPending ? "border-l-4 border-yellow-500" : "border-l-4 border-green-500"
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
          Kursi: {transaction.transaction_items.map((item: any) => item.seat_label).join(", ")}
        </p>
        <p className="text-sm text-gray-300 font-semibold mt-1">
          {formatRupiah(transaction.final_amount)}
        </p>
      </div>
      <div className="text-right w-40 flex-shrink-0">
        {isPending && (
          <>
            <p className="text-xs text-yellow-400 mb-1 flex items-center justify-end gap-1">
              <Clock size={14} /> Batas Waktu
            </p>
            <CountdownTimer
              expiryTime={transaction.payment_expires_at}
              onExpire={() => setIsExpired(true)}
            />
            <a
              href={transaction.payment_url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-xs bg-primary text-white font-semibold px-3 py-2 rounded-full flex items-center justify-center gap-1 hover:bg-primary-dark transition-colors"
            >
              Bayar Sekarang <ExternalLink size={14} />
            </a>
          </>
        )}
        {isSettlement && (
          <div className="flex flex-col items-end gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-green-800 text-green-200">
              <CheckCircle size={14} />
              <span>Pembayaran Berhasil</span>
            </div>
            <button
              onClick={() => navigate("/my-tickets")}
              className="mt-1 text-xs bg-gray-600 text-white font-semibold px-3 py-2 rounded-full hover:bg-gray-500 transition-colors"
            >
              Lihat Tiket
            </button>
          </div>
        )}
        {!isPending && !isSettlement && (
          <div className="flex items-center justify-end gap-2 text-xs font-semibold px-3 py-1 rounded-full bg-gray-700 text-gray-400">
            <span>Kadaluarsa</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default TransactionHistoryCard
