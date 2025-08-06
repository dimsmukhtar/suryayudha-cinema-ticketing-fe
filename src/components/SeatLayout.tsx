import Seat from "./Seat"

const SeatLayout = ({ layout, selectedSeats, onSeatSelect, screenPlacement }: any) => {
  const layoutContainerClass = () => {
    switch (screenPlacement) {
      case "left":
        return "flex flex-row-reverse gap-8 items-center" // Layar di kanan, kursi di kiri
      case "right":
        return "flex flex-row gap-8 items-center" // Layar di kiri, kursi di kanan
      case "top":
      default:
        return "flex flex-col gap-6 items-center" // Layar di atas, kursi di bawah
    }
  }

  const screenClass = () => {
    if (screenPlacement === "left" || screenPlacement === "right") {
      // Tampilan vertikal untuk layar di samping
      return "w-2 h-64 bg-white rounded-full shadow-[0_0_20px_5px_rgba(255,255,255,0.3)] flex items-center justify-center"
    }
    // Tampilan horizontal untuk layar di atas
    return "w-full max-w-lg h-2 bg-white rounded-full shadow-[0_0_20px_5px_rgba(255,255,255,0.3)]"
  }

  return (
    <div className={`p-4 bg-gray-800/50 rounded-lg ${layoutContainerClass()}`}>
      {/* Layar Bioskop */}
      <div className="flex-shrink-0 flex flex-col items-center">
        <div className={screenClass()}>
          {(screenPlacement === "left" || screenPlacement === "right") && (
            <span className="text-sm text-gray-400 -rotate-90 whitespace-nowrap">L A Y A R</span>
          )}
        </div>
        {screenPlacement === "top" && <p className="text-sm text-gray-400 mt-2">L A Y A R</p>}
      </div>

      {/* Denah Kursi */}
      <div className="flex flex-col gap-2">
        {layout.map((row: any[], rowIndex: number) => (
          <div key={rowIndex} className="flex gap-2 justify-center">
            {row.map((seat: any, seatIndex: number) => {
              if (seat) {
                const isSelected = selectedSeats.some((s: any) => s.seatId === seat.seatId)
                return (
                  <Seat
                    key={seat.seatId}
                    seat={seat}
                    isSelected={isSelected}
                    onSelect={onSeatSelect}
                  />
                )
              }
              return (
                <div key={`aisle-${rowIndex}-${seatIndex}`} className="w-6 h-6 md:w-8 md:h-8" />
              )
            })}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SeatLayout
