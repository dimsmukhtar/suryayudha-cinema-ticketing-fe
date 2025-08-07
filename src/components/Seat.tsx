const Seat = ({ seat, isSelected, onSelect }: any) => {
  const getSeatClass = () => {
    if (seat.status === "booked" || seat.status === "reserved") {
      return "bg-slate-800 text-slate-600 cursor-not-allowed"
    }
    if (isSelected) {
      return "bg-primary text-white scale-110 shadow-lg shadow-primary/50"
    }
    return "bg-slate-600 text-slate-200 hover:bg-slate-500 cursor-pointer"
  }

  const isDisabled = seat.status === "booked" || seat.status === "reserved"

  return (
    <button
      onClick={() => !isDisabled && onSelect(seat)}
      disabled={isDisabled}
      className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-[10px] sm:text-xs font-semibold rounded-md transition-all duration-200 ${getSeatClass()}`}
      aria-label={`Kursi ${seat.label}`}
    >
      {/* --- PERBAIKAN DI SINI --- */}
      {/* Class 'hidden sm:inline' dihapus agar label selalu terlihat */}
      <span>{seat.label}</span>
    </button>
  )
}

export default Seat
