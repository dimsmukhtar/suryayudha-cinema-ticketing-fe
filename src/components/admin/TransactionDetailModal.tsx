import React, { useState, useEffect, useCallback } from "react"
import { X, Loader2, Film, Armchair, Calendar, Clock, User, Hash, Ticket } from "lucide-react"
import { getTransactionById } from "../../api/apiService"
import toast from "react-hot-toast"
import { formatRupiah, formatDate, formatTime } from "../../utils/formatters"

const TransactionDetailModal = ({ isOpen, onClose, transactionId }: any) => {
  const [transaction, setTransaction] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchTransactionDetails = useCallback(async () => {
    if (!transactionId) return
    setIsLoading(true)
    try {
      const response = await getTransactionById(transactionId)
      setTransaction(response)
    } catch (error) {
      toast.error("Gagal memuat detail transaksi.")
      onClose()
    } finally {
      setIsLoading(false)
    }
  }, [transactionId, onClose])

  useEffect(() => {
    if (isOpen) {
      fetchTransactionDetails()
    }
  }, [isOpen, fetchTransactionDetails])

  if (!isOpen) return null

  const movie = transaction?.transaction_items[0]?.schedule_seat.schedule.movie
  const schedule = transaction?.transaction_items[0]?.schedule_seat.schedule

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <h2 className="text-xl font-bold text-gray-800">Detail Transaksi</h2>
          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-gray-800" />
          </button>
        </div>

        <div className="overflow-y-auto flex-grow">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="animate-spin text-primary" size={32} />
            </div>
          ) : (
            transaction && (
              <div className="space-y-6">
                {/* Detail Pengguna */}
                <Section title="Data Pemesan">
                  <InfoItem icon={<User />} label="Nama" value={transaction.user.name} />
                  <InfoItem icon={<User />} label="Email" value={transaction.user.email} />
                </Section>

                {/* Detail Film & Jadwal */}
                <Section title="Detail Tontonan">
                  <InfoItem icon={<Film />} label="Film" value={movie?.title} />
                  <InfoItem icon={<Armchair />} label="Studio" value={schedule?.studio.name} />
                  <InfoItem
                    icon={<Calendar />}
                    label="Tanggal"
                    value={formatDate(schedule?.start_time)}
                  />
                  <InfoItem
                    icon={<Clock />}
                    label="Jam"
                    value={`${formatTime(schedule?.start_time)} WIB`}
                  />
                </Section>

                {/* Detail Kursi */}
                <Section title="Detail Kursi">
                  <div className="flex flex-wrap gap-2">
                    {transaction.transaction_items.map((item: any) => (
                      <span
                        key={item.id}
                        className="bg-gray-200 text-gray-800 text-sm font-semibold px-3 py-1 rounded-full"
                      >
                        {item.seat_label}
                      </span>
                    ))}
                  </div>
                </Section>

                {/* Rincian Pembayaran */}
                <Section title="Rincian Pembayaran">
                  <PriceItem label="Subtotal" value={formatRupiah(transaction.total_amount)} />
                  {transaction.discount_amount > 0 && (
                    <PriceItem
                      label="Diskon Voucher"
                      value={`- ${formatRupiah(transaction.discount_amount)}`}
                      isDiscount
                    />
                  )}
                  <div className="border-t my-2"></div>
                  <PriceItem
                    label="Total Akhir"
                    value={formatRupiah(transaction.final_amount)}
                    isTotal
                  />
                </Section>

                <Section title="Status Transaksi">
                  <InfoItem
                    icon={<Hash />}
                    label="Order ID"
                    value={transaction.order_id || `TRX-${transaction.id}`}
                    isMono
                  />
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <span
                      className={`px-2 py-1 text-sm font-semibold rounded-full capitalize ${
                        transaction.status === "settlement"
                          ? "bg-green-100 text-green-800"
                          : transaction.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : transaction.status === "initiated"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </div>
                </Section>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  )
}

const Section = ({ title, children }: any) => (
  <div>
    <h3 className="text-lg font-semibold text-gray-700 mb-3 border-b pb-2">{title}</h3>
    <div className="space-y-3">{children}</div>
  </div>
)

const InfoItem = ({ icon, label, value, isMono = false }: any) => (
  <div className="flex items-start gap-3">
    <div className="text-gray-400 mt-1">{icon}</div>
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`font-medium text-gray-800 ${isMono ? "font-mono" : ""}`}>{value || "N/A"}</p>
    </div>
  </div>
)

const PriceItem = ({ label, value, isDiscount = false, isTotal = false }: any) => (
  <div className={`flex justify-between ${isTotal ? "font-bold text-lg" : "text-sm"}`}>
    <span className={isDiscount ? "text-green-600" : "text-gray-600"}>{label}</span>
    <span className={isDiscount ? "text-green-600" : "text-gray-800"}>{value}</span>
  </div>
)

export default TransactionDetailModal
