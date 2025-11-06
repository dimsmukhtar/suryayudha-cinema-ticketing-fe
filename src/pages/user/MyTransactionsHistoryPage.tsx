import React, { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { getMyTransactionHistory } from "../../api/apiService"
import TransactionHistoryCard from "../../components/TransactionHistoryCard"
import { History } from "lucide-react"

const MyTransactionsHistoryPage = () => {
  const [transactions, setTransactions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true)
      try {
        const data = await getMyTransactionHistory()
        setTransactions(data)
      } catch (err) {
        setError("Gagal memuat riwayat transaksi Anda.")
        toast.error("Gagal memuat riwayat transaksi Anda.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTransactions()
  }, [])

  const renderContent = () => {
    if (isLoading) {
      // Skeleton Loading
      return (
        <div className="space-y-4">
          <div className="bg-gray-800/50 h-28 rounded-lg animate-pulse"></div>
          <div className="bg-gray-800/50 h-28 rounded-lg animate-pulse"></div>
        </div>
      )
    }
    if (error) {
      return <div className="text-center py-20 text-red-500">{error}</div>
    }
    if (transactions.length > 0) {
      return (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <TransactionHistoryCard key={transaction.id} transaction={transaction} />
          ))}
        </div>
      )
    }
    return (
      <div className="text-center py-20 text-gray-500">
        <History size={48} className="mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Tidak Ada Riwayat Transaksi</h3>
        <p>Semua transaksi pembayaran Anda akan muncul di sini.</p>
      </div>
    )
  }

  return (
    <div className="bg-background text-white min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Riwayat Transaksi Saya</h1>
          <p className="text-sm text-red-400">*transaksi yang batal otomatis akan hilang</p>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default MyTransactionsHistoryPage
