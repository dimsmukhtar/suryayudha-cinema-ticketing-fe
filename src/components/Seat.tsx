const Seat = ({ seat, isSelected, onSelect }: any) => {
  // Fungsi untuk menentukan kelas CSS berdasarkan status kursi
  const getSeatClass = () => {
    // --- PERBAIKAN WARNA DI SINI ---
    if (seat.status === "booked" || seat.status === "reserved") {
      return "bg-slate-800 text-slate-600 cursor-not-allowed" // Sangat gelap, tidak tersedia
    }
    if (isSelected) {
      return "bg-primary text-white scale-110 shadow-lg shadow-primary/50" // Warna primer cerah
    }
    // 'available'
    return "bg-slate-600 text-slate-200 hover:bg-slate-500 cursor-pointer" // Abu-abu terang, tersedia
  }

  const isDisabled = seat.status === "booked" || seat.status === "reserved"

  return (
    <button
      onClick={() => !isDisabled && onSelect(seat)}
      disabled={isDisabled}
      className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-xs font-semibold rounded-md transition-all duration-200 ${getSeatClass()}`}
      aria-label={`Kursi ${seat.label}`}
    >
      <span className="hidden sm:inline">{seat.label}</span>
    </button>
  )
}

export default Seat
