import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import toast from "react-hot-toast"
import { getAllMovies, getAllGenres } from "../../api/apiService"
import { MovieCard, MovieCardSkeleton } from "../../components/MovieCard"
import FilterControls from "../../components/FilterControls"

const AllMoviesPage = () => {
  const [movies, setMovies] = useState<any[]>([])
  const [genres, setGenres] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Gunakan useSearchParams untuk membaca dan menulis filter ke URL
  const [searchParams, setSearchParams] = useSearchParams()

  // State untuk filter, diinisialisasi dari URL
  const [filters, setFilters] = useState({
    title: searchParams.get("title") || "",
    genre: searchParams.get("genre") || "",
    status: searchParams.get("status") || "now_showing", // Default 'now_showing'
  })

  // Efek untuk mengambil data genre (hanya sekali)
  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const genreData = await getAllGenres()
        setGenres(genreData)
      } catch (err) {
        console.error("Gagal mengambil genre:", err)
        toast.error("Gagal memuat filter genre.")
      }
    }
    fetchGenres()
  }, [])

  // Efek untuk mengambil data film setiap kali filter berubah
  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const movieData = await getAllMovies(filters)
        setMovies(movieData)
      } catch (err) {
        console.error("Gagal mengambil film:", err)
        setError("Tidak dapat memuat film. Silakan coba lagi nanti.")
        toast.error("Gagal memuat film.")
      } finally {
        setIsLoading(false)
      }
    }

    // Update URL saat filter berubah
    setSearchParams(filters, { replace: true })

    // Tambahkan debounce untuk pencarian judul agar tidak memanggil API di setiap ketikan
    const debounceTimer = setTimeout(() => {
      fetchMovies()
    }, 300) // Tunggu 300ms setelah user berhenti mengetik

    return () => clearTimeout(debounceTimer) // Bersihkan timer
  }, [filters, setSearchParams])

  return (
    <div className="bg-background text-white min-h-screen pt-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-6 text-center">Semua Film</h1>

        <FilterControls genres={genres} filters={filters} setFilters={setFilters} />

        {error && <p className="text-center text-red-400 py-10">{error}</p>}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {isLoading ? (
            // Tampilkan 10 skeleton saat loading
            Array.from({ length: 10 }).map((_, index) => <MovieCardSkeleton key={index} />)
          ) : movies.length > 0 ? (
            // Tampilkan data film jika ada
            movies.map((movie) => <MovieCard key={movie.id} movie={movie} />)
          ) : (
            // Tampilkan pesan jika tidak ada hasil
            <div className="col-span-full text-center py-20 text-gray-400">
              <h3 className="text-2xl font-semibold">Tidak ada film yang ditemukan</h3>
              <p>Coba ubah filter pencarian Anda.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AllMoviesPage
