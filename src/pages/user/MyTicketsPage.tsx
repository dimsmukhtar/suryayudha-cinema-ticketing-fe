import React, { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { getMyTickets, getTicketById } from "../../api/apiService"
import { Ticket as TicketIcon } from "lucide-react"
import { TicketCard } from "../../components/TicketCard"

const MyTicketsPage = () => {
  const [detailedTickets, setDetailedTickets] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAndDetailTickets = async () => {
      setIsLoading(true)
      try {
        // 1. Ambil daftar tiket sederhana (hanya berisi ID)
        const simpleTickets = await getMyTickets()

        if (simpleTickets.length === 0) {
          setDetailedTickets([])
          return
        }

        // 2. Ambil detail lengkap untuk setiap tiket secara bersamaan
        const ticketDetailPromises = simpleTickets.map((ticket) => getTicketById(ticket.id))
        const resolvedTickets = await Promise.all(ticketDetailPromises)

        setDetailedTickets(resolvedTickets)
      } catch (err) {
        setError("Gagal memuat tiket Anda.")
        toast.error("Gagal memuat tiket Anda.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAndDetailTickets()
  }, [])

  const renderContent = () => {
    if (isLoading) {
      // Skeleton Loading
      return (
        <div className="space-y-6">
          <div className="bg-gray-800/50 h-64 rounded-2xl animate-pulse"></div>
          <div className="bg-gray-800/50 h-64 rounded-2xl animate-pulse"></div>
        </div>
      )
    }
    if (error) {
      return <div className="text-center py-20 text-red-500">{error}</div>
    }
    if (detailedTickets.length > 0) {
      return (
        <div className="space-y-8">
          {detailedTickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      )
    }
    return (
      <div className="text-center py-20 text-gray-500">
        <TicketIcon size={48} className="mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Anda Belum Memiliki Tiket</h3>
        <p>Semua tiket yang berhasil Anda beli akan muncul di sini.</p>
      </div>
    )
  }

  return (
    <div className="bg-background text-white min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Tiket Saya</h1>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default MyTicketsPage
