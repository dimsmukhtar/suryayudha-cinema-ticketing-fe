import React, { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import { validateTicket, getAllTicketsAdmin } from "../../api/apiService"
import { Search, Loader2, CheckCircle, XCircle, Ticket, Eye } from "lucide-react"
import { formatDate } from "../../utils/formatters"

const ManageTicketsPage = () => {
  const [activeTab, setActiveTab] = useState("validate")

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Manajemen Tiket</h1>
      <div className="mb-6 border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("validate")}
            className={`${
              activeTab === "validate"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Validasi Tiket
          </button>
          <button
            onClick={() => setActiveTab("list")}
            className={`${
              activeTab === "list"
                ? "border-primary text-primary"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Daftar Semua Tiket
          </button>
        </nav>
      </div>
      {activeTab === "validate" ? <TicketValidator /> : <TicketList />}
    </div>
  )
}

const TicketValidator = () => {
  const [ticketCode, setTicketCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [validationResult, setValidationResult] = useState<any | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleValidate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!ticketCode) {
      toast.error("Silakan masukkan kode tiket.")
      return
    }
    setIsLoading(true)
    setValidationResult(null)
    setError(null)
    try {
      const response = await validateTicket(ticketCode)
      setValidationResult(response.data)
      toast.success(response.message || "Tiket berhasil divalidasi!")
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat validasi.")
      toast.error(err.message || "Validasi tiket gagal.")
    } finally {
      setIsLoading(false)
      setTicketCode("")
    }
  }

  const ResultCard = () => {
    if (!validationResult && !error) return null
    if (error) {
      return (
        <div className="mt-8 bg-red-100 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-md animate-fade-in">
          <div className="flex items-center gap-4">
            <XCircle size={40} />
            <div>
              <h3 className="text-xl font-bold">Validasi Gagal</h3>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )
    }
    if (validationResult) {
      return (
        <div className="mt-8 bg-green-100 border-l-4 border-green-500 text-green-800 p-6 rounded-lg shadow-md animate-fade-in">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4">
              <CheckCircle size={40} />
              <div>
                <h3 className="text-xl font-bold">Tiket Valid & Berhasil Divalidasi!</h3>
                <p>
                  Kode:{" "}
                  <span className="font-mono bg-green-200 px-1 rounded">
                    {validationResult.code}
                  </span>
                </p>
              </div>
            </div>
            <Link
              to={`/admin/tickets/${validationResult.id}`}
              className="bg-green-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-green-700 transition flex items-center gap-2"
            >
              <Eye size={16} /> Lihat Detail Tiket
            </Link>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <form onSubmit={handleValidate}>
        <label htmlFor="ticketCode" className="block text-sm font-medium text-gray-700 mb-2">
          Masukkan atau Pindai Kode Tiket
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-grow">
            <input
              id="ticketCode"
              type="text"
              value={ticketCode}
              onChange={(e) => setTicketCode(e.target.value.toUpperCase())}
              placeholder="Contoh: TICKET-39-48-DNSK7..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-gray-900 text-lg"
            />
            <Ticket className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : <Search size={20} />}
            <span className="font-semibold">{isLoading ? "Memvalidasi..." : "Validasi"}</span>
          </button>
        </div>
      </form>
      <ResultCard />
    </div>
  )
}

const TicketList = () => {
  const [tickets, setTickets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchTickets = async () => {
      setIsLoading(true)
      try {
        const response = await getAllTicketsAdmin()
        setTickets(response.data)
      } catch (error) {
        toast.error("Gagal memuat daftar tiket.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchTickets()
  }, [])

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">
                Kode Tiket
              </th>
              <th scope="col" className="px-6 py-3">
                Status
              </th>
              <th scope="col" className="px-6 py-3">
                Film
              </th>
              <th scope="col" className="px-6 py-3">
                Kursi
              </th>
              <th scope="col" className="px-6 py-3">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="text-center py-10">
                  Memuat daftar tiket...
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr key={ticket.id} className="bg-white border-b hover:bg-gray-50">
                  <th scope="row" className="px-6 py-4 font-mono text-gray-900">
                    {ticket.code}
                  </th>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        ticket.status === "active"
                          ? "bg-blue-100 text-blue-800"
                          : ticket.status === "used"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{ticket.movie_title || "N/A"}</td>
                  <td className="px-6 py-4">{ticket.seat_label || "N/A"}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => navigate(`/admin/tickets/${ticket.id}`)}
                      className="text-primary hover:underline text-xs font-semibold"
                    >
                      Lihat Detail
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageTicketsPage
