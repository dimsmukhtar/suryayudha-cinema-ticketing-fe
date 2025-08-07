import { Calendar, Clock, MapPin } from "lucide-react"

export const TicketCard = ({ ticket }: any) => {
  // Pengecekan data dasar
  if (!ticket || !ticket.code) {
    return <div className="text-white bg-gray-800 p-4 rounded-lg">Memuat detail tiket...</div>
  }

  const getStatusClass = () => {
    switch (ticket.status) {
      case "active":
        return "bg-green-500 text-white"
      case "used":
        return "bg-gray-500 text-gray-200"
      case "expired":
        return "bg-red-800 text-red-200"
      case "cancelled":
        return "bg-yellow-800 text-yellow-200"
      default:
        return "bg-gray-700"
    }
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg flex flex-col overflow-hidden">
      {/* Bagian Detail Tiket */}
      <div className="flex-grow p-6 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <div>
              <p className="text-xs text-primary font-semibold uppercase">{ticket.studio}</p>
              <h2 className="text-2xl font-bold text-white mt-1">{ticket.movie_title}</h2>
            </div>
            <div
              className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${getStatusClass()}`}
            >
              {ticket.status}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 border-t border-gray-700 pt-4 text-sm">
            <InfoItem
              icon={<Calendar size={16} />}
              label="Waktu Tayang"
              value={new Date(ticket.start_time).toLocaleString("id-ID", {
                day: "numeric",
                month: "long",
                hour: "2-digit",
                minute: "2-digit",
              })}
            />
            <InfoItem
              icon={<Clock size={16} />}
              label="Selesai"
              value={`~ ${new Date(ticket.finished_time).toLocaleTimeString("id-ID", {
                hour: "2-digit",
                minute: "2-digit",
              })} WIB`}
            />
            <InfoItem icon={<MapPin size={16} />} label="Kursi" value={ticket.seat_label} />
          </div>
        </div>

        <div className="mt-6 text-center bg-gray-900/50 p-4 rounded-lg">
          <p className="text-sm text-gray-400">Kode Tiket</p>
          <p className="font-mono text-xl md:text-2xl font-bold text-white tracking-widest mt-1">
            {ticket.code}
          </p>
        </div>
      </div>
    </div>
  )
}

export const InfoItem = ({ icon, value, label }: any) => (
  <div>
    <p className="flex items-center gap-2 text-xs text-gray-400">
      {icon} {label}
    </p>
    <p className="font-semibold text-white mt-1">{value}</p>
  </div>
)
