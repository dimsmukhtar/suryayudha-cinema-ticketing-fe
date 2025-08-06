import React, { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { getTransactionById, applyVoucher, initiatePayment } from "../../api/apiService"
import { useAuth } from "../../hooks/useAuth"
import { formatRupiah, formatDate } from "../../utils/formatters"
import CountdownTimer from "../../components/CountdownTimer"
import { Ticket, Tag, Loader2 } from "lucide-react"

const BookingSummaryPage = () => {
  const { transactionId } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [transaction, setTransaction] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [voucherCode, setVoucherCode] = useState("")
  const [isApplyingVoucher, setIsApplyingVoucher] = useState(false)
  const [isInitiatingPayment, setIsInitiatingPayment] = useState(false)
  const [isExpired, setIsExpired] = useState(false)

  // Fungsi untuk memuat ulang data transaksi
  const fetchTransaction = async () => {
    if (!transactionId) return
    try {
      const data = await getTransactionById(transactionId)
      setTransaction(data)
      // Cek apakah sudah kadaluarsa saat memuat
      const expiryDate = new Date(data.payment_expires_at || data.booking_expires_at)
      if (expiryDate < new Date()) {
        setIsExpired(true)
      }
    } catch (error) {
      toast.error("Gagal memuat detail booking.")
      navigate("/")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchTransaction()
  }, [transactionId])

  const handleApplyVoucher = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!voucherCode) return
    setIsApplyingVoucher(true)
    try {
      const updatedTransaction = await applyVoucher(transactionId!, voucherCode)
      setTransaction(updatedTransaction)
      toast.success("Voucher berhasil diterapkan!")
      setVoucherCode("")
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal menerapkan voucher.")
    } finally {
      setIsApplyingVoucher(false)
    }
  }

  const handleInitiatePayment = async () => {
    if (!user) {
      toast.error("Sesi Anda telah berakhir. Silakan login kembali.")
      navigate("/login")
      return
    }
    setIsInitiatingPayment(true)
    try {
      const { snapToken } = await initiatePayment(transactionId!)
      window.snap.pay(snapToken, {
        onSuccess: function (result: any) {
          toast.success("Pembayaran berhasil!")
          navigate("/my-tickets")
        },

        onPending: function (result: any) {
          toast("Menunggu pembayaran Anda.")
          navigate("/my-bookings")
        },
        onError: function (result: any) {
          toast.error("Pembayaran gagal.")
        },
        onClose: function () {
          toast("Anda menutup jendela pembayaran.")
        },
      })
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Gagal memulai pembayaran.")
    } finally {
      setIsInitiatingPayment(false)
    }
  }

  const handleExpire = () => {
    setIsExpired(true)
    toast.error("Waktu booking Anda telah habis.")
  }

  if (isLoading) return <div className="text-white text-center py-40">Memuat ringkasan...</div>
  if (!transaction) return null

  const schedule = transaction.transaction_items[0]?.schedule_seat.schedule
  const movie = schedule?.movie
  const expiryTime = transaction.payment_expires_at || transaction.booking_expires_at

  return (
    <div className="bg-background text-white min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold">Ringkasan Pemesanan</h1>
            <p className="text-gray-400 mt-2">Selesaikan pembayaran Anda sebelum waktu habis.</p>
          </div>

          <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg">
            {/* Countdown Timer */}
            <div className="bg-gray-900/70 p-4 rounded-lg text-center mb-6">
              <p className="text-sm text-gray-400 uppercase tracking-wider">
                Sisa Waktu Pembayaran
              </p>
              {isExpired ? (
                <p className="font-mono text-2xl font-bold text-red-500">Waktu Habis</p>
              ) : (
                <CountdownTimer expiryTime={expiryTime} onExpire={handleExpire} />
              )}
            </div>

            {/* Detail Film */}
            <div className="flex gap-6 border-b border-gray-700 pb-6 mb-6">
              <img
                src={movie?.poster_url}
                alt={movie?.title}
                className="w-24 h-36 rounded-md object-cover"
              />
              <div>
                <h2 className="text-2xl font-bold">{movie?.title}</h2>
                <p className="text-gray-400">{schedule?.studio.name}</p>
                <p className="text-gray-300 mt-2">
                  {new Date(schedule?.start_time).toLocaleString("id-ID", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            {/* Detail Kursi & Harga */}
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2 flex items-center gap-2">
                  <Ticket size={18} /> Detail Tiket
                </h3>
                {transaction.transaction_items.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center text-gray-300">
                    <span>Kursi {item.seat_label}</span>
                    <span>{formatRupiah(item.price)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-700 pt-4 space-y-2">
                <div className="flex justify-between text-gray-300">
                  <span>Subtotal</span>
                  <span>{formatRupiah(transaction.total_amount)}</span>
                </div>
                {transaction.discount_amount > 0 && (
                  <div className="flex justify-between text-green-400">
                    <span>Diskon Voucher</span>
                    <span>- {formatRupiah(transaction.discount_amount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-white font-bold text-xl pt-2">
                  <span>Total</span>
                  <span>{formatRupiah(transaction.final_amount)}</span>
                </div>
              </div>
            </div>

            {/* Voucher Form */}
            {!transaction.voucher_id && !isExpired && (
              <form onSubmit={handleApplyVoucher} className="mt-6 flex gap-2">
                <input
                  type="text"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
                  placeholder="Masukkan Kode Voucher"
                  className="flex-grow bg-gray-700 text-white placeholder-gray-400 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="submit"
                  disabled={isApplyingVoucher}
                  className="bg-gray-600 hover:bg-gray-500 text-white font-semibold px-4 py-2 rounded-md transition flex items-center disabled:opacity-50"
                >
                  {isApplyingVoucher ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <Tag size={20} />
                  )}
                  <span className="ml-2 hidden sm:inline">Terapkan</span>
                </button>
              </form>
            )}

            {/* Tombol Bayar */}
            <div className="mt-8">
              <button
                onClick={handleInitiatePayment}
                disabled={isInitiatingPayment || isExpired}
                className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-4 px-8 rounded-lg transition-colors text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isInitiatingPayment ? "Memproses..." : "Lanjutkan ke Pembayaran"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookingSummaryPage
