const Seat = ({ seat, isSelected, onSelect, isAdmin = false, isTemplateView = false }: any) => {
  if (!seat) {
    return <div className="w-6 h-6 md:w-8 md:h-8" /> // Lorong
  }

  const seatLabel = seat.label || seat.seat_label
  const { status } = seat

  const getSeatClass = () => {
    if (isTemplateView) {
      return "bg-slate-500 text-slate-200 cursor-default"
    }
    // Logika warna dari implementasi terakhir yang sudah disetujui
    if (isSelected && !isAdmin) {
      return "bg-primary text-white scale-110 shadow-lg shadow-primary/50"
    }
    switch (status) {
      case "available":
        return "bg-slate-600 text-slate-200 hover:bg-slate-500 cursor-pointer"
      case "reserved":
        return "bg-yellow-600 text-yellow-100 cursor-not-allowed"
      case "booked":
        return "bg-red-600 text-red-100 cursor-not-allowed"
      default:
        return "bg-gray-900 cursor-not-allowed"
    }
  }

  // User tidak bisa klik kursi yang sudah dipesan/direservasi.
  const isUserDisabled = !isAdmin && (status === "booked" || status === "reserved")
  // Admin hanya bisa klik kursi yang tersedia.
  const isAdminDisabled = isAdmin && status !== "available"

  return (
    <button
      onClick={() => !isTemplateView && onSelect(seat)}
      disabled={isUserDisabled || isAdminDisabled}
      className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-[10px] sm:text-xs font-semibold rounded-md transition-all duration-200 ${getSeatClass()}`}
      aria-label={`Kursi ${seatLabel}`}
    >
      <span>{seatLabel}</span>
    </button>
  )
}

export default Seat
