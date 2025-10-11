import React, { useState, useEffect, useMemo } from "react"
import toast from "react-hot-toast"
import { getAdminDashboardStats, getAdminDashboardChartData } from "../../api/apiService"
import { useAuth } from "../../hooks/useAuth"
import { formatRupiah } from "../../utils/formatters"
import StatsCard from "../../components/admin/StatsCard"
import { DollarSign, Ticket, Film, Users, Loader2 } from "lucide-react"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts"

// Helper untuk format tanggal YYYY-MM-DD
const toYYYYMMDD = (date: Date) => date.toISOString().split("T")[0]

const DashboardPage = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState<any>(null)
  const [chartData, setChartData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // --- STATE BARU UNTUK FILTER ---
  const [activeFilter, setActiveFilter] = useState("7days")
  const [customDates, setCustomDates] = useState({
    start: toYYYYMMDD(new Date(new Date().setDate(new Date().getDate() - 6))),
    end: toYYYYMMDD(new Date()),
  })

  // Memoize date params untuk mencegah re-fetch yang tidak perlu
  const dateParams = useMemo(() => {
    const endDate = new Date()
    switch (activeFilter) {
      case "30days":
        const thirtyDaysAgo = new Date(new Date().setDate(endDate.getDate() - 29))
        return { startDate: toYYYYMMDD(thirtyDaysAgo), endDate: toYYYYMMDD(endDate) }
      case "custom":
        return { startDate: customDates.start, endDate: customDates.end }
      case "7days":
      default:
        const sevenDaysAgo = new Date(new Date().setDate(endDate.getDate() - 6))
        return { startDate: toYYYYMMDD(sevenDaysAgo), endDate: toYYYYMMDD(endDate) }
    }
  }, [activeFilter, customDates])

  // Efek ini akan berjalan saat halaman dimuat dan saat filter tanggal berubah
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        // Ambil kedua data secara bersamaan untuk efisiensi
        const [statsData, chartDataRes] = await Promise.all([
          getAdminDashboardStats(),
          getAdminDashboardChartData(dateParams), // Kirim parameter tanggal
        ])

        console.log("===== DATA DARI DASHBOARD PAGE =====")
        console.log("Isi variabel 'chartDataRes' sebelum di-set:", chartDataRes)
        console.log("Apakah 'chartDataRes' sebuah array?", Array.isArray(chartDataRes))
        console.log("====================================")
        setStats(statsData)
        setChartData(chartDataRes)
      } catch (error) {
        toast.error("Gagal memuat data dashboard.")
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchDashboardData()
  }, [dateParams]) // Dependency: jalankan lagi jika dateParams berubah

  const handleCustomDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCustomDates((prev) => ({ ...prev, [name]: value }))
  }

  const FilterButton = ({ filterValue, label }: { filterValue: string; label: string }) => (
    <button
      onClick={() => setActiveFilter(filterValue)}
      className={`px-3 py-1 text-sm rounded-md transition-colors ${
        activeFilter === filterValue
          ? "bg-primary text-white"
          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
      }`}
    >
      {label}
    </button>
  )

  if (isLoading && !stats) {
    // Hanya tampilkan skeleton besar saat pertama kali loading
    return (
      <div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Selamat Datang, Admin!</h1>
        <p className="text-gray-500 mb-8">Memuat data statistik...</p>
        {/* Skeleton UI */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="h-28 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-28 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-28 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-28 bg-gray-200 rounded-lg animate-pulse"></div>
        </div>
        <div className="mt-10 h-80 bg-gray-200 rounded-lg animate-pulse"></div>
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
          icon={<DollarSign className="text-green-600" />}
          color="bg-green-100"
          to="/admin/transactions"
        />
        <StatsCard
          title="Tiket Terjual"
          value={stats?.totalTicketsSold || 0}
          icon={<Ticket className="text-blue-600" />}
          color="bg-blue-100"
          to="/admin/tickets"
        />
        <StatsCard
          title="Total Film"
          value={stats?.totalMovies || 0}
          icon={<Film className="text-purple-600" />}
          color="bg-purple-100"
          to="/admin/movies"
        />
        <StatsCard
          title="Total Pengguna"
          value={stats?.totalUsers || 0}
          icon={<Users className="text-orange-600" />}
          color="bg-orange-100"
          to="/admin/users"
        />
      </div>

      {/* Grafik Pendapatan */}
      <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Ringkasan Pendapatan</h2>
          <div className="flex items-center gap-2 flex-wrap">
            <FilterButton filterValue="7days" label="7 Hari" />
            <FilterButton filterValue="30days" label="30 Hari" />
            <FilterButton filterValue="custom" label="Kustom" />
          </div>
        </div>

        {activeFilter === "custom" && (
          <div className="flex flex-col sm:flex-row items-center gap-2 p-4 bg-gray-50 rounded-md mb-4 animate-fade-in">
            <input
              type="date"
              name="start"
              value={customDates.start}
              onChange={handleCustomDateChange}
              className="border p-2 rounded-md text-gray-800 w-full sm:w-auto"
            />
            <span className="text-gray-500">sampai</span>
            <input
              type="date"
              name="end"
              value={customDates.end}
              onChange={handleCustomDateChange}
              className="border p-2 rounded-md text-gray-800 w-full sm:w-auto"
            />
          </div>
        )}

        {isLoading ? (
          <div className="h-[300px] flex justify-center items-center">
            <Loader2 className="animate-spin text-primary" size={32} />
          </div>
        ) : (
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis
                  tickFormatter={(value) => `Rp${Math.floor(value / 1000)}k`}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                  }}
                  formatter={(value) => [formatRupiah(value as number), "Pendapatan"]}
                />
                <Legend wrapperStyle={{ fontSize: "14px" }} />
                <Bar dataKey="revenue" fill="#4F46E5" name="Pendapatan" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Tabel Transaksi Terakhir */}
      <div className="mt-10 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Transaksi Terakhir</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  ID Pesanan
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
                  <th
                    scope="row"
                    className="px-6 py-4 font-mono text-gray-900 whitespace-nowrap text-xs"
                  >
                    {trx.order_id || `TRX-${trx.id}`}
                  </th>
                  <td className="px-6 py-4">{trx.user?.name || "N/A"}</td>
                  <td className="px-6 py-4 font-semibold">{formatRupiah(trx.final_amount)}</td>
                  <td className="px-6 py-4 text-xs">
                    {new Date(trx.updated_at).toLocaleString("id-ID")}
                  </td>
                </tr>
              ))}
              {(!stats?.recentTransactions || stats.recentTransactions.length === 0) && (
                <tr>
                  <td colSpan={4} className="text-center py-10 text-gray-500">
                    Belum ada transaksi.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
