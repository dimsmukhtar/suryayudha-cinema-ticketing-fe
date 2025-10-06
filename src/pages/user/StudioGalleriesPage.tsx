import React, { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { getAllStudios, getAllStudioPhotos } from "../../api/apiService"
import GalleryModal from "../../components/GaleryModal"

const StudioCard = ({ studio, onClick }: { studio: any; onClick: () => void }) => (
  <div
    className="group relative overflow-hidden rounded-lg shadow-lg cursor-pointer"
    onClick={onClick}
  >
    <img
      src={
        studio.galleries[0]?.photo_url || "https://placehold.co/600x400/1a202c/ffffff?text=Studio"
      }
      alt={studio.name}
      className="w-full h-64 object-cover transform transition-transform duration-500 group-hover:scale-110"
    />
    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
    <div className="absolute bottom-0 left-0 p-4">
      <h3 className="text-2xl font-bold text-white">{studio.name}</h3>
      <p className="text-sm text-gray-300">{studio.galleries.length} Foto</p>
    </div>
  </div>
)

const StudioGalleriesPage = () => {
  const [studiosWithGalleries, setStudiosWithGalleries] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStudio, setSelectedStudio] = useState<any | null>(null)

  useEffect(() => {
    const fetchAndProcessData = async () => {
      setIsLoading(true)
      try {
        const [studiosData, photosData] = await Promise.all([getAllStudios(), getAllStudioPhotos()])

        const processedData = studiosData.map((studio) => {
          const galleriesForThisStudio = photosData.filter(
            (photo: any) => photo.studio_id === studio.id
          )

          return {
            ...studio,
            galleries: galleriesForThisStudio,
          }
        })

        setStudiosWithGalleries(processedData)
      } catch (err) {
        toast.error("Gagal memuat data studio.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchAndProcessData()
  }, [])

  if (isLoading) return <div className="text-white text-center py-20">Memuat Studio...</div>

  return (
    <>
      <div className="bg-background text-white min-h-screen pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold mb-8 text-center">Galeri Studio Kami</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {studiosWithGalleries.map((studio) => (
              <StudioCard
                key={studio.id}
                studio={studio}
                onClick={() => setSelectedStudio(studio)}
              />
            ))}
          </div>
        </div>
      </div>
      {selectedStudio && (
        <GalleryModal studio={selectedStudio} onClose={() => setSelectedStudio(null)} />
      )}
    </>
  )
}

export default StudioGalleriesPage
