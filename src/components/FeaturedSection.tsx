import { useNavigate } from "react-router-dom"
import BlurCircle from "./BlurCircle"
import { ArrowRight } from "lucide-react"
import { useState, useEffect } from "react"
import { MovieCard, MovieCardSkeleton } from "./MovieCard"
import { getNowShowingMovies } from "../api/apiService"

const FeaturedSection = () => {
  const navigate = useNavigate()
  const [movies, setMovies] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getNowShowingMovies()
        // Hanya tampilkan 5 film di homepage
        setMovies(data.slice(0, 5))
      } catch (err) {
        console.error("Gagal mengambil film 'Now Showing':", err)
        setError("Tidak dapat memuat film. Silakan coba lagi nanti.")
      } finally {
        setIsLoading(false)
      }
    }
    fetchMovies()
  }, [])

  return (
    <div className="py-16 px-6 md:px-16 lg:px-24 xl:px-44 overflow-hidden relative">
      <BlurCircle top="0" right="-80px" />
      <div className="flex items-center justify-between pb-10">
        <h2 className="text-white font-medium text-2xl">Sedang Tayang</h2>
        <button
          onClick={() => navigate("/movies")}
          className="group flex items-center gap-2 text-sm text-gray-300 cursor-pointer hover:text-primary transition-colors"
        >
          Lihat Semua
          <ArrowRight className="group-hover:translate-x-1 transition-transform w-4 h-4" />
        </button>
      </div>

      {/* Konten Dinamis: Loading, Error, atau Daftar Film */}
      <div>
        {error && <p className="text-center text-red-400 py-10">{error}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {isLoading
            ? // Tampilkan 5 skeleton saat loading
              Array.from({ length: 5 }).map((_, index) => <MovieCardSkeleton key={index} />)
            : // Tampilkan data film jika sudah selesai loading
              movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)}
        </div>
      </div>
    </div>
  )
}

export default FeaturedSection
