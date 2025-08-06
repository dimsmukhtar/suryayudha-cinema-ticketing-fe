const Seat = ({ seat, isSelected, onSelect }: any) => {
  const getSeatClass = () => {
    if (seat.status === "booked" || seat.status === "reserved") {
      return "bg-zinc-800 text-zinc-600 cursor-not-allowed"
    }
    if (isSelected) {
      return "bg-primary text-white scale-110 shadow-lg shadow-primary/50"
    }
    return "bg-zinc-600 text-zinc-300 hover:bg-zinc-500 cursor-pointer"
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
