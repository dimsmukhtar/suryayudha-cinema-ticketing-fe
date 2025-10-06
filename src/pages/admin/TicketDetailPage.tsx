import React, { useState, useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import { getTicketByIdAdmin } from "../../api/apiService"
import toast from "react-hot-toast"
import {
  Loader2,
  ArrowLeft,
  Film,
  Armchair,
  Calendar,
  Clock,
  Ticket as TicketIcon,
  User,
  Hash,
} from "lucide-react"
import { formatDate, formatTime } from "../../utils/formatters"

const TicketDetailPage = () => {
  const { id } = useParams()
  const [ticket, setTicket] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (id) {
      const fetchTicket = async () => {
        setIsLoading(true)
        try {
          const response = await getTicketByIdAdmin(parseInt(id))
          setTicket(response.data)
        } catch (error) {
          toast.error("Gagal memuat detail tiket.")
        } finally {
          setIsLoading(false)
        }
      }
      fetchTicket()
    }
  }, [id])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    )
  }

  if (!ticket) {
    return <div className="text-center py-10 text-gray-700">Tiket tidak ditemukan.</div>
  }

  return (
    <div>
      <Link
        to="/admin/tickets"
        className="flex items-center gap-2 text-sm text-gray-600 hover:text-primary mb-4"
      >
        <ArrowLeft size={16} /> Kembali ke Manajemen Tiket
      </Link>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Detail Tiket</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem icon={<Hash />} label="Kode Tiket" value={ticket.code} isMono />
          <InfoItem icon={<User />} label="Nama Pemilik" value={ticket.user} />
          <InfoItem icon={<Film />} label="Film" value={ticket.movie_title} />
          <InfoItem icon={<Armchair />} label="Studio" value={ticket.studio} />
          <InfoItem icon={<TicketIcon />} label="Kursi" value={ticket.seat_label} />
          <InfoItem
            icon={<Calendar />}
            label="Jadwal Tayang"
            value={formatDate(ticket.start_time)}
          />
          <InfoItem
            icon={<Clock />}
            label="Jam Mulai"
            value={`${formatTime(ticket.start_time)} WIB`}
          />
          <InfoItem
            icon={<Clock className="text-red-500" />}
            label="Jam Selesai (Perkiraan)"
            value={`~${formatTime(ticket.finished_time)} WIB`}
          />
        </div>
        <div className="mt-6 border-t pt-4">
          <p className="text-sm text-gray-500">Status Tiket:</p>
          <span
            className={`px-3 py-1.5 text-base font-semibold rounded-full ${
              ticket.status === "active"
                ? "bg-blue-100 text-blue-800"
                : ticket.status === "used"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
          </span>
        </div>
      </div>
    </div>
  )
}

const InfoItem = ({ icon, label, value, isMono = false }: any) => (
  <div className="flex items-start gap-3">
    <div className="text-primary mt-1">{icon}</div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`font-semibold text-gray-800 ${isMono ? "font-mono" : ""}`}>{value || "N/A"}</p>
    </div>
  </div>
)

export default TicketDetailPage
