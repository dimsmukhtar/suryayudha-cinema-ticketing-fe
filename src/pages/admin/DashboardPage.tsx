import React, { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { getAdminDashboardStats } from "../../api/apiService"
import { useAuth } from "../../hooks/useAuth"
import { formatRupiah } from "../../utils/formatters"
import StatsCard from "../../components/admin/StatsCard"
import { DollarSign, Ticket, Film, Users } from "lucide-react"

const DashboardPage = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true)
      try {
        const data = await getAdminDashboardStats()
        setStats(data)
      } catch (error) {
        toast.error("Gagal memuat statistik dashboard.")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (isLoading) {
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Selamat Datang, Admin!</h1>
        <p className="text-gray-500 mb-8">Memuat data statistik...</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="h-28 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-28 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-28 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-28 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Selamat Datang, {user?.name}!</h1>
      <p className="text-gray-500 mb-8">Berikut adalah ringkasan aktivitas di bioskop Anda.</p>

      {/* Grid Statistik Utama */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Pendapatan"
          value={formatRupiah(stats?.totalRevenue || 0)}
          icon={<DollarSign className="text-green-800" />}
          color="bg-green-100"
        />
        <StatsCard
          title="Tiket Terjual"
          value={stats?.totalTicketsSold || 0}
          icon={<Ticket className="text-blue-800" />}
          color="bg-blue-100"
        />
        <StatsCard
          title="Total Film"
          value={stats?.totalMovies || 0}
          icon={<Film className="text-purple-800" />}
          color="bg-purple-100"
        />
        <StatsCard
          title="Total Pengguna"
          value={stats?.totalUsers || 0}
          icon={<Users className="text-orange-800" />}
          color="bg-orange-100"
        />
      </div>

      {/* Tabel Transaksi Terakhir */}
      <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Transaksi Terakhir</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  ID Transaksi
                </th>
                <th scope="col" className="px-6 py-3">
                  Pengguna
                </th>
                <th scope="col" className="px-6 py-3">
                  Total Bayar
                </th>
                <th scope="col" className="px-6 py-3">
                  Waktu
                </th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentTransactions?.map((trx: any) => (
                <tr key={trx.id} className="bg-white border-b hover:bg-gray-50">
                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                    {trx.order_id || `TRX-${trx.id}`}
                  </th>
                  <td className="px-6 py-4">{trx.user?.name || "N/A"}</td>
                  <td className="px-6 py-4">{formatRupiah(trx.final_amount)}</td>
                  <td className="px-6 py-4">{new Date(trx.updated_at).toLocaleString("id-ID")}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
