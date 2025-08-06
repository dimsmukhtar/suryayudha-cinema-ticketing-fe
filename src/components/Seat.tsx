const Seat = ({ seat, isSelected, onSelect }: any) => {
  const getSeatClass = () => {
    if (seat.status === "booked" || seat.status === "reserved") {
      return "bg-gray-600 text-gray-400 cursor-not-allowed"
    }
    if (isSelected) {
      return "bg-primary text-white scale-110 shadow-lg shadow-primary/50"
    }
    return "bg-gray-700 text-gray-300 hover:bg-primary/80 cursor-pointer"
  }

  const isDisabled = seat.status === "booked" || seat.status === "reserved"

  return (
    <button
      onClick={() => !isDisabled && onSelect(seat)}
      disabled={isDisabled}
      className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center text-xs font-semibold rounded-md transition-all duration-200 ${getSeatClass()}`}
    >
      {/* Opsi: Sembunyikan label di mobile untuk kerapian */}
      <span className="hidden sm:inline">{seat.label}</span>
    </button>
  )
}

export default Seat
