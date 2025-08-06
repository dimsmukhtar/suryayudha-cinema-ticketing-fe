import React, { useState } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"

const GalleryModal = ({ studio, onClose }: { studio: any; onClose: () => void }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const goToPrevious = () => {
    const isFirstSlide = currentIndex === 0
    const newIndex = isFirstSlide ? studio.galleries.length - 1 : currentIndex - 1
    setCurrentIndex(newIndex)
  }

  const goToNext = () => {
    const isLastSlide = currentIndex === studio.galleries.length - 1
    const newIndex = isLastSlide ? 0 : currentIndex + 1
    setCurrentIndex(newIndex)
  }

  if (!studio || !studio.galleries || studio.galleries.length === 0) {
    return null
  }

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl h-[80vh] bg-black"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 bg-white text-black rounded-full p-1 z-10 hover:scale-110 transition-transform"
        >
          <X size={24} />
        </button>

        <div className="w-full h-full flex items-center justify-center">
          <img
            src={studio.galleries[currentIndex].photo_url}
            alt={`Studio ${studio.name} - Gambar ${currentIndex + 1}`}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        <button
          onClick={goToPrevious}
          className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/20 text-white p-2 rounded-full hover:bg-white/40 transition"
        >
          <ChevronLeft size={32} />
        </button>
        <button
          onClick={goToNext}
          className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/20 text-white p-2 rounded-full hover:bg-white/40 transition"
        >
          <ChevronRight size={32} />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-4 py-2 rounded-full">
          {currentIndex + 1} / {studio.galleries.length}
        </div>
      </div>
    </div>
  )
}

export default GalleryModal
