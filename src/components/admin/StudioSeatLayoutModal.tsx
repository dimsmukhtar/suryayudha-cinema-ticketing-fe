import { X } from "lucide-react"
import SeatLayout from "../SeatLayout"
import { transformSeatsLayout } from "../../utils/transformSeatsLayout" // Kita akan butuh helper ini

const StudioSeatLayoutModal = ({ isOpen, onClose, studio }: any) => {
  if (!isOpen || !studio) return null

  // Gunakan helper yang sama dari backend untuk mengubah daftar kursi menjadi denah 2D
  const seatLayout = transformSeatsLayout(studio.seats, studio.id)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4 border-b pb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Denah Kursi Template: {studio.name}</h2>
            <p className="text-sm text-gray-600">
              Ini adalah tampilan read-only dari semua kursi di studio ini.
            </p>
          </div>
          <button onClick={onClose}>
            <X className="text-gray-500 hover:text-gray-800" />
          </button>
        </div>
        <div className="overflow-y-auto flex-grow">
          <div className="bg-gray-900 text-white p-4 rounded-md">
            <SeatLayout
              layout={seatLayout}
              screenPlacement={studio.screen_placement}
              isTemplateView={true} // Aktifkan mode template
              selectedSeats={[]}
              onSeatSelect={() => {}} // Tidak ada aksi saat diklik
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default StudioSeatLayoutModal
