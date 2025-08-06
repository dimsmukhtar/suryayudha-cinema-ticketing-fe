import React, { useState, useMemo, useEffect } from "react"
import { useNavigate } from "react-router-dom"
// import { type Schedule } from '../types/movie.types'; // Tipe dinonaktifkan
import { formatRupiah } from "../utils/formatters"
import { Ticket, Minus, Plus } from "lucide-react"

const SchedulePicker = ({ schedules }: any) => {
  // Props diubah ke any
  const navigate = useNavigate()
  // --- PERBAIKAN DI SINI: Beri tahu useState tipe apa saja yang diizinkan ---
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSchedule, setSelectedSchedule] = useState<any | null>(null)
  const [ticketCount, setTicketCount] = useState(1)

  // 1. Kelompokkan jadwal berdasarkan tanggal
  const groupedSchedules = useMemo(() => {
    if (!schedules) return {}
    const groups: Record<string, any[]> = {}
    schedules.forEach((schedule: any) => {
      const date = new Date(schedule.start_time).toISOString().split("T")[0]
      if (!groups[date]) {
        groups[date] = []
      }
      groups[date].push(schedule)
    })
    return groups
  }, [schedules])

  const availableDates = Object.keys(groupedSchedules).sort()

  // 2. Set tanggal pertama sebagai default saat komponen dimuat
  useEffect(() => {
    if (availableDates.length > 0 && !selectedDate) {
      setSelectedDate(availableDates[0])
    }
  }, [availableDates, selectedDate])

  const handleDateSelect = (date: string) => {
    setSelectedDate(date)
    setSelectedSchedule(null) // Reset pilihan jam saat tanggal berubah
  }

  const handleScheduleSelect = (schedule: any) => {
    setSelectedSchedule(schedule)
  }

  const handleTicketCountChange = (amount: number) => {
    setTicketCount((prev) => Math.max(1, Math.min(10, prev + amount))) // Min 1, Max 10 tiket
  }

  const handleBooking = () => {
    if (selectedSchedule) {
      // Navigasi ke halaman pemilihan kursi dengan membawa ID jadwal
      navigate(`/schedules/${selectedSchedule.id}/seats`)
    }
  }

  if (!schedules || schedules.length === 0) {
    return (
      <div className="bg-gray-800 p-6 rounded-lg text-center text-gray-400">
        Jadwal belum tersedia untuk film ini.
      </div>
    )
  }

  return (
    <div className="bg-gray-800 p-6 rounded-lg">
      <h3 className="text-xl font-bold text-white mb-4">Pilih Jadwal</h3>

      {/* Pemilihan Tanggal */}
      <div className="flex space-x-2 mb-6 border-b border-gray-700 pb-4 overflow-x-auto">
        {availableDates.map((date) => (
          <button
            key={date}
            onClick={() => handleDateSelect(date)}
            className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors whitespace-nowrap ${
              selectedDate === date
                ? "bg-primary text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {new Date(date).toLocaleDateString("id-ID", {
              weekday: "long",
              day: "numeric",
              month: "short",
            })}
          </button>
        ))}
      </div>

      {/* Pemilihan Jam Tayang */}
      {selectedDate && (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-6">
          {groupedSchedules[selectedDate].map((schedule: any) => (
            <button
              key={schedule.id}
              onClick={() => handleScheduleSelect(schedule)}
              className={`p-3 rounded-lg text-center transition-all duration-200 border-2 ${
                selectedSchedule?.id === schedule.id
                  ? "bg-primary border-primary-light scale-105"
                  : "bg-gray-700 border-gray-600 hover:border-primary"
              }`}
            >
              <p className="font-bold text-lg text-white">
                {new Date(schedule.start_time).toLocaleTimeString("id-ID", {
                  hour: "2-digit",
                  minute: "2-digit",
                  timeZone: "Asia/Jakarta",
                })}
              </p>
              <p className="text-xs text-gray-400">{schedule.studio.name}</p>
            </button>
          ))}
        </div>
      )}

      {/* Pemilihan Jumlah Tiket & Tombol Booking */}
      {selectedSchedule && (
        <div className="bg-gray-900/50 p-4 rounded-lg flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Ticket className="w-8 h-8 text-primary" />
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleTicketCountChange(-1)}
                className="p-2 bg-gray-700 rounded-full text-white hover:bg-gray-600"
              >
                <Minus size={16} />
              </button>
              <span className="text-xl font-bold text-white w-8 text-center">{ticketCount}</span>
              <button
                onClick={() => handleTicketCountChange(1)}
                className="p-2 bg-gray-700 rounded-full text-white hover:bg-gray-600"
              >
                <Plus size={16} />
              </button>
            </div>
            <div className="border-l border-gray-600 pl-4">
              <p className="text-sm text-gray-400">Total Harga</p>
              <p className="text-xl font-bold text-white">
                {formatRupiah(selectedSchedule.price * ticketCount)}
              </p>
            </div>
          </div>
          <button
            onClick={handleBooking}
            className="w-full md:w-auto bg-primary hover:bg-primary-dark text-white font-bold py-3 px-8 rounded-lg transition-colors"
          >
            Pilih Kursi
          </button>
        </div>
      )}
    </div>
  )
}

export default SchedulePicker
