import React, { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import toast from "react-hot-toast"
import { getMovieById } from "../../api/apiService"
import { formatDuration, formatDate } from "../../utils/formatters"
import { Star, Clock, Calendar, Film, PlayCircle, Languages, Captions } from "lucide-react"
import SchedulePicker from "../../components/SchedulePicker"
import TrailerModal from "../../components/TrailerModal"

const MovieDetailPage = () => {
  const { id } = useParams<{ id: string }>()
  const [movie, setMovie] = useState<any | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isTrailerOpen, setIsTrailerOpen] = useState(false)

  useEffect(() => {
    if (!id) {
      setIsLoading(false)
      setError("ID film tidak valid.")
      return
    }
    const fetchMovieDetail = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const data = await getMovieById(id)
        setMovie(data)
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || "Film tidak ditemukan atau terjadi kesalahan."
        toast.error(errorMessage)
        setError(errorMessage)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMovieDetail()
  }, [id])

  if (isLoading) return <div className="h-screen"></div>
  if (error) return <div className="text-white text-center py-20">{error}</div>
  if (!movie) return null

  return (
    <>
      <div className="bg-background text-white min-h-screen">
        <div className="relative h-[80vh] md:h-[70vh] w-full">
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-full h-full object-cover object-top opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-full container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center md:flex-row md:items-end gap-8">
              <div className="w-48 md:w-64 flex-shrink-0 -mb-8 md:-mb-16 rounded-lg overflow-hidden shadow-2xl">
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="pb-8 flex-grow text-center md:text-left">
                <h1 className="text-4xl md:text-6xl font-black tracking-tight">{movie.title}</h1>
                <div className="flex items-center justify-center md:justify-start mt-3 text-gray-300 gap-4 flex-wrap">
                  {movie.movie_genres &&
                    movie.movie_genres.map(
                      (mg: any) => mg.genre && <span key={mg.genre.id}>{mg.genre.name}</span>
                    )}
                </div>
                <button
                  onClick={() => setIsTrailerOpen(true)}
                  className="mt-6 flex items-center gap-2 mx-auto md:mx-0 px-6 py-3 text-lg bg-white/10 hover:bg-white/20 backdrop-blur-sm transition rounded-full font-semibold cursor-pointer"
                >
                  <PlayCircle />
                  Tonton Trailer
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8 text-center">
                <InfoBox
                  icon={<Star className="text-yellow-400" />}
                  label="Rating"
                  value={movie.rating}
                />
                <InfoBox icon={<Clock />} label="Durasi" value={formatDuration(movie.duration)} />
                <InfoBox icon={<Calendar />} label="Rilis" value={formatDate(movie.release_date)} />
                <InfoBox icon={<Film />} label="Sutradara" value={movie.director} />
                <InfoBox icon={<Languages />} label="Bahasa" value={movie.language} />
                <InfoBox icon={<Captions />} label="Subtitle" value={movie.subtitle} />
              </div>

              <Section title="Sinopsis">
                <p className="text-gray-300 leading-relaxed">{movie.synopsis}</p>
              </Section>

              <Section title="Pemain">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {movie.casts &&
                    movie.casts.map((cast: any) => (
                      <div key={cast.id} className="text-center">
                        <img
                          src={cast.actor_url}
                          alt={cast.actor_name}
                          className="w-24 h-24 rounded-full object-cover mx-auto mb-2 shadow-md"
                        />
                        <p className="text-sm font-medium text-white">{cast.actor_name}</p>
                      </div>
                    ))}
                </div>
              </Section>
            </div>

            <div className="lg:col-span-1">
              <SchedulePicker schedules={movie.schedules} />
            </div>
          </div>
        </div>
      </div>

      {isTrailerOpen && (
        <TrailerModal trailerUrl={movie.trailer_url} onClose={() => setIsTrailerOpen(false)} />
      )}
    </>
  )
}

const Section = ({ title, children }: any) => (
  <div className="mb-10">
    <h2 className="text-2xl font-bold text-white border-l-4 border-primary pl-4 mb-4">{title}</h2>
    {children}
  </div>
)

const InfoBox = ({ icon, label, value }: any) => (
  <div className="bg-gray-800/50 p-4 rounded-lg flex flex-col items-center justify-center gap-2">
    <div className="text-primary">{icon}</div>
    <p className="text-xs text-gray-400 uppercase">{label}</p>
    <p className="font-bold text-white text-sm">{value}</p>
  </div>
)

export default MovieDetailPage
