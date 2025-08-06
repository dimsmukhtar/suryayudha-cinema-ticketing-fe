import React from "react"
import { Link } from "react-router-dom"
export const MovieCard = ({ movie }: any) => {
  return (
    <Link
      to={`/movies/${movie.id}`}
      className="group block overflow-hidden rounded-lg shadow-lg relative aspect-[2/3]"
    >
      <img
        src={movie.poster_url}
        alt={movie.title}
        className="w-full h-full object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
      <div className="absolute bottom-0 left-0 p-4 text-white">
        <h3 className="text-lg font-bold transition-colors duration-300 group-hover:text-primary">
          {movie.title}
        </h3>
        <div className="flex items-center mt-1 text-xs gap-2 flex-wrap">
          {movie.movie_genres.slice(0, 2).map(({ genre }: any) => (
            <span key={genre.id} className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full">
              {genre.name}
            </span>
          ))}
        </div>
      </div>
      <div className="absolute top-0 right-0 p-2 bg-black/50 rounded-bl-lg backdrop-blur-sm flex items-center gap-1 text-white">
        <span className="text-sm font-bold">{movie.rating}</span>
      </div>
    </Link>
  )
}

// Komponen Skeleton untuk ditampilkan saat data sedang dimuat
export const MovieCardSkeleton = () => {
  return <div className="bg-gray-800 rounded-lg shadow-lg animate-pulse aspect-[2/3]"></div>
}
