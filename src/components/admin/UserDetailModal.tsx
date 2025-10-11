import React, { useState, useEffect } from "react"
import { X, Loader2, CreditCard, Ticket } from "lucide-react"
import { getTicketsForUser } from "../../api/apiService"
import { formatRupiah, formatDate, formatTime } from "../../utils/formatters"
import toast from "react-hot-toast"

const UserDetailModal = ({ isOpen, onClose, user }: any) => {
  // State sekarang hanya untuk tiket dan loading
  const [tickets, setTickets] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("transactions")

  useEffect(() => {
    if (isOpen && user) {
      const fetchDetails = async () => {
        setIsLoading(true)
        try {
          // Hanya perlu mengambil data tiket secara terpisah
          const ticketsRes = await getTicketsForUser(user.id)
          setTickets(ticketsRes)
        } catch (error) {
          console.error("Gagal memuat detail tiket user:", error)
          toast.error("Gagal memuat detail tiket user.")
        } finally {
          setIsLoading(false)
        }
      }
      fetchDetails()
    }
  }, [isOpen, user])

  if (!isOpen) return null

  // Ambil data transaksi langsung dari prop 'user'
  const transactions = user?.transactions || []

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Detail Pengguna: {user.name}</h2>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-gray-800" />
          </button>
        </div>

        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("transactions")}
              className={`${
                activeTab === "transactions"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500"
              } py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <CreditCard size={16} /> Riwayat Transaksi ({transactions.length})
            </button>
            <button
              onClick={() => setActiveTab("tickets")}
              className={`${
                activeTab === "tickets"
                  ? "border-primary text-primary"
                  : "border-transparent text-gray-500"
              } py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}
            >
              <Ticket size={16} /> Riwayat Tiket ({tickets.length})
            </button>
          </nav>
        </div>

        <div className="overflow-y-auto flex-grow mt-4">
          {isLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="animate-spin text-primary" />
            </div>
          ) : activeTab === "transactions" ? (
            <TransactionTable transactions={transactions} />
          ) : (
            <TicketTable tickets={tickets} />
          )}
        </div>
      </div>
    </div>
  )
}

const TransactionTable = ({ transactions }: any) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-left text-gray-600">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th className="px-4 py-2">Order ID</th>
          <th className="px-4 py-2">Total</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Waktu</th>
        </tr>
      </thead>
      <tbody>
        {transactions.length > 0 ? (
          transactions.map((trx: any) => (
            <tr key={trx.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2 font-mono text-xs">{trx.order_id || "-"}</td>
              <td className="px-4 py-2 font-semibold">{formatRupiah(trx.final_amount)}</td>
              <td className="px-4 py-2">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                    trx.status === "settlement"
                      ? "bg-green-100 text-green-800"
                      : trx.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : trx.status === "initiated"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {trx.status}
                </span>
              </td>
              <td className="px-4 py-2 text-xs">{formatDate(trx.transaction_time)}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={4} className="text-center py-4">
              Tidak ada riwayat transaksi.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)

const TicketTable = ({ tickets }: any) => (
  <div className="overflow-x-auto">
    <table className="w-full text-sm text-left text-gray-600">
      <thead className="text-xs text-gray-700 uppercase bg-gray-50">
        <tr>
          <th className="px-4 py-2">Kode Tiket</th>
          <th className="px-4 py-2">Film</th>
          <th className="px-4 py-2">Kursi</th>
        </tr>
      </thead>
      <tbody>
        {tickets.length > 0 ? (
          tickets.map((ticket: any) => (
            <tr key={ticket.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2 font-semibold">{ticket.code}</td>
              <td className="px-4 py-2">{ticket.movie_title}</td>
              <td className="px-4 py-2">{ticket.seat_label}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3} className="text-center py-4">
              Tidak ada riwayat tiket.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
)

export default UserDetailModal
