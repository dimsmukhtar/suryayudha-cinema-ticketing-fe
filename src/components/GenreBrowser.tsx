import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getAllGenres } from "../api/apiService"

const GenreBrowser = () => {
  const navigate = useNavigate()
  const [genres, setGenres] = useState<any[]>([])

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const data = await getAllGenres()
        setGenres(data)
      } catch (error) {
        console.error("Gagal mengambil genre:", error)
      }
    }
    fetchGenres()
  }, [])

  const handleGenreClick = (genreName: string) => {
    navigate(`/movies?genre=${genreName}`)
  }

  return (
    <div className="py-16 px-6 md:px-16 lg:px-24 xl:px-44">
      <h2 className="text-white font-medium text-2xl text-center mb-10">
        Telusuri Berdasarkan Genre
      </h2>
      <div className="flex flex-wrap justify-center gap-4">
        {genres.map((genre) => (
          <button
            key={genre.id}
            onClick={() => handleGenreClick(genre.name)}
            className="px-6 py-3 bg-gray-800/50 backdrop-blur-sm text-gray-300 font-semibold rounded-lg hover:bg-primary hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            {genre.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export default GenreBrowser
