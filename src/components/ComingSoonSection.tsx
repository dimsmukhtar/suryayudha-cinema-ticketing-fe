import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { getComingSoonMovies } from "../api/apiService"
import { MovieCard, MovieCardSkeleton } from "./MovieCard"

const ComingSoonSection = () => {
  const navigate = useNavigate()
  const [movies, setMovies] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await getComingSoonMovies()
        setMovies(data.slice(0, 5)) // Hanya tampilkan 5 film
      } catch (err) {
        console.error("Gagal mengambil film 'Coming Soon':", err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMovies()
  }, [])

  return (
    <div className="py-16 px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden">
      <div className="flex items-center justify-between pb-10">
        <h2 className="text-white font-medium text-2xl">Akan Datang</h2>
        <button
          onClick={() => navigate("/movies?status=coming_soon")}
          className="group flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-primary transition-colors"
        >
          Lihat Semua
          <ArrowRight className="group-hover:translate-x-1 transition-transform w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {isLoading
          ? Array.from({ length: 5 }).map((_, index) => <MovieCardSkeleton key={index} />)
          : movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
      </div>
    </div>
  )
}

export default ComingSoonSection
