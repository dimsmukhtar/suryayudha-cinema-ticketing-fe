import Seat from "./Seat"

const SeatLayout = ({ layout, selectedSeats, onSeatSelect, screenPlacement }: any) => {
  const layoutContainerClass = () => {
    switch (screenPlacement?.toLowerCase()) {
      case "left":
        return "flex flex-row items-center gap-8"
      case "right":
        return "flex flex-row-reverse items-center gap-8"
      case "top":
      default:
        return "flex flex-col items-center gap-6"
    }
  }

  const screenClass = () => {
    if (screenPlacement?.toLowerCase() === "left" || screenPlacement?.toLowerCase() === "right") {
      return "w-2 h-64 bg-white rounded-full shadow-[0_0_20px_5px_rgba(255,255,255,0.3)] flex items-center justify-center"
    }
    return "w-full max-w-lg h-2 bg-white rounded-full shadow-[0_0_20px_5px_rgba(255,255,255,0.3)]"
  }

  return (
    <div className="p-4 bg-gray-800/50 rounded-lg flex flex-col items-center gap-8">
      <div className={layoutContainerClass()}>
        {/* Layar Bioskop */}
        <div className="flex-shrink-0 flex flex-col items-center">
          <div className={screenClass()}>
            {(screenPlacement?.toLowerCase() === "left" ||
              screenPlacement?.toLowerCase() === "right") && (
              <span className="text-sm text-gray-400 -rotate-90 whitespace-nowrap tracking-widest">
                L A Y A R
              </span>
            )}
          </div>
          {screenPlacement?.toLowerCase() === "top" && (
            <p className="text-sm text-gray-400 mt-2 tracking-widest">L A Y A R</p>
          )}
        </div>

        {/* Denah Kursi */}
        <div className="flex flex-col gap-2">
          {layout.map((row: any, rowIndex: number) => (
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

      {/* --- LEGENDA STATUS KURSI (DIPERBAIKI WARNANYA) --- */}
      <div className="w-full flex flex-wrap justify-center gap-x-6 gap-y-2 mt-4 text-sm text-gray-300 border-t border-gray-700 pt-6">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-slate-600"></div>
          <span>Tersedia</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-primary"></div>
          <span>Pilihan Anda</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-slate-800"></div>
          <span>Sudah Dipesan</span>
        </div>
      </div>
    </div>
  )
}

export default SeatLayout
