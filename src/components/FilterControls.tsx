import React from "react"
import { Search } from "lucide-react"

const FilterControls = ({ genres, filters, setFilters }: any) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters((prev: any) => ({ ...prev, [name]: value }))
  }

  const handleStatusChange = (status: string) => {
    setFilters((prev: any) => ({ ...prev, status }))
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-4 rounded-lg mb-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
        {/* Search Input */}
        <div className="relative col-span-1 md:col-span-1">
          <input
            type="text"
            name="title"
            value={filters.title || ""}
            onChange={handleInputChange}
            placeholder="Cari judul film..."
            className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>

        {/* Genre & Status Filters */}
        <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row gap-4">
          <select
            name="genre"
            value={filters.genre || ""}
            onChange={handleInputChange}
            className="w-full sm:w-1/2 bg-gray-700 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Semua Genre</option>
            {genres.map((genre: any) => (
              <option key={genre.id} value={genre.name}>
                {genre.name}
              </option>
            ))}
          </select>

          <div className="w-full sm:w-1/2 bg-gray-700 rounded-md p-1 flex">
            <button
              onClick={() => handleStatusChange("now_showing")}
              className={`w-1/2 rounded p-1 text-sm font-semibold transition ${
                filters.status === "now_showing"
                  ? "bg-primary text-white"
                  : "text-gray-300 hover:bg-gray-600"
              }`}
            >
              Sedang Tayang
            </button>
            <button
              onClick={() => handleStatusChange("coming_soon")}
              className={`w-1/2 rounded p-1 text-sm font-semibold transition ${
                filters.status === "coming_soon"
                  ? "bg-primary text-white"
                  : "text-gray-300 hover:bg-gray-600"
              }`}
            >
              Akan Datang
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilterControls
