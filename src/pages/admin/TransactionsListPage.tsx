import React, { useState, useEffect, useMemo, useCallback } from "react"
import toast from "react-hot-toast"
import { getAllTransactionsAdmin } from "../../api/apiService"
import { formatRupiah, formatDate, formatTime } from "../../utils/formatters"
import { Loader2, X } from "lucide-react"
import useDebounce from "../../hooks/useDebounce"
import Pagination from "../../components/admin/Pagination"

const TransactionsListPage = () => {
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [meta, setMeta] = useState<any>({}) // Untuk data paginasi

  // State untuk filter
  const [filters, setFilters] = useState({
    email: "",
    orderId: "",
    status: "",
    date: "",
  })
  const [currentPage, setCurrentPage] = useState(1)

  // Gunakan debounce untuk input teks agar tidak memanggil API setiap ketikan
  const debouncedEmail = useDebounce(filters.email, 500)
  const debouncedOrderId = useDebounce(filters.orderId, 500)

  // Memoize params untuk mencegah re-fetch yang tidak perlu
  const queryParams = useMemo(
    () => ({
      email: debouncedEmail,
      order_id: debouncedOrderId, // Sesuaikan dengan key di backend
      status: filters.status,
      date: filters.date,
    }),
    [debouncedEmail, debouncedOrderId, filters.status, filters.date]
  )

  // Gunakan useCallback agar fungsi tidak dibuat ulang setiap render
  const fetchTransactions = useCallback(async () => {
    setIsLoading(true)
    try {
      const response = await getAllTransactionsAdmin({ page: currentPage, ...queryParams })
      setTransactions(response.data)
      setMeta(response.meta)
    } catch (error) {
      toast.error("Gagal memuat data transaksi.")
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, queryParams])

  useEffect(() => {
    fetchTransactions()
  }, [fetchTransactions]) // Re-fetch hanya jika fungsi fetchTransactions berubah

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFilters((prev) => ({ ...prev, [name]: value }))
    setCurrentPage(1) // Kembali ke halaman 1 setiap kali filter diubah
  }

  const resetFilters = () => {
    setFilters({ email: "", orderId: "", status: "", date: "" })
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Daftar Transaksi</h1>

      {/* Kontrol Filter */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <input
            type="text"
            name="email"
            placeholder="Filter via Email..."
            value={filters.email}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-black"
          />
          <input
            type="text"
            name="orderId"
            placeholder="Filter via Order ID..."
            value={filters.orderId}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-black"
          />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-black"
          >
            <option value="">Semua Status</option>
            <option value="settlement">Settlement</option>
            <option value="pending">Pending</option>
            <option value="cancelled">Cancelled</option>
            <option value="initiated">Initiated</option>
          </select>
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-black"
          />
          <button
            onClick={resetFilters}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center justify-center gap-2"
          >
            <X size={16} /> Reset
          </button>
        </div>
      </div>

      {/* Tabel Transaksi */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Order ID
                </th>
                <th scope="col" className="px-6 py-3">
                  Pengguna
                </th>
                <th scope="col" className="px-6 py-3">
                  Total
                </th>
                <th scope="col" className="px-6 py-3">
                  Status
                </th>
                <th scope="col" className="px-6 py-3">
                  Waktu
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="text-center py-10">
                    <Loader2 className="animate-spin mx-auto text-primary" />
                  </td>
                </tr>
              ) : transactions.length > 0 ? (
                transactions.map((trx) => (
                  <tr key={trx.id} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono text-gray-900 text-xs">
                      {trx.order_id || "-"}
                    </td>
                    <td className="px-6 py-4">
                      {trx.user?.name || "N/A"} <br />{" "}
                      <span className="text-xs text-gray-500">{trx.user?.email}</span>
                    </td>
                    <td className="px-6 py-4 font-semibold">{formatRupiah(trx.final_amount)}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-semibold rounded-full capitalize ${
                          trx.status === "settlement"
                            ? "bg-green-100 text-green-800"
                            : trx.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : trx.status === "initiated"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {trx.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      {formatDate(trx.transaction_time)}
                      <br />
                      {formatTime(trx.transaction_time)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-500">
                    Tidak ada transaksi yang cocok dengan filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t">
          <Pagination
            currentPage={meta.page}
            totalPages={meta.totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  )
}

export default TransactionsListPage
