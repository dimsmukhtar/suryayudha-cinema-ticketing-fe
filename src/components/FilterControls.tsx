import React from 'react'
import { Search } from 'lucide-react'

const statusOptions = [
  { label: 'Semua', value: '' },
  { label: 'Sedang Tayang', value: 'now_showing' },
  { label: 'Akan Datang', value: 'coming_soon' },
  { label: 'Selesai Tayang', value: 'ended' }
]

const FilterControls = ({ genres, filters, setFilters }: any) => {
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
        <div className="relative col-span-1">
          <input
            type="text"
            name="title"
            value={filters.title || ''}
            onChange={handleInputChange}
            placeholder="Cari judul film..."
            className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
        </div>

        {/* Genre Filter */}
        <div className="col-span-1">
          <select
            name="genre"
            value={filters.genre || ''}
            onChange={handleInputChange}
            className="w-full bg-gray-700 text-white rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Semua Genre</option>
            {genres.map((genre: any) => (
              <option key={genre.id} value={genre.name}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="col-span-1 bg-gray-700 rounded-md p-1 flex">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleStatusChange(opt.value)}
              className={`flex-1 rounded py-1 text-xs font-semibold transition ${
                filters.status === opt.value
                  ? 'bg-primary text-white'
                  : 'text-gray-300 hover:bg-gray-600'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FilterControls
