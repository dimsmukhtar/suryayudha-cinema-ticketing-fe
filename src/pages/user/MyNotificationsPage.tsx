import React, { useState, useEffect } from "react"
import toast from "react-hot-toast"
import { getMyNotifications, markNotificationAsRead, hideNotification } from "../../api/apiService"
import NotificationItem from "../../components/NotificationItem"
import { BellOff } from "lucide-react"

const MyNotificationsPage = () => {
  const [notifications, setNotifications] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchNotifications = async () => {
    setIsLoading(true)
    try {
      const fetchedNotifications = await getMyNotifications()
      setNotifications(fetchedNotifications || [])
    } catch (err) {
      setError("Gagal memuat notifikasi.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id)

      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, is_read: true } : n)))
      toast.success("Notifikasi ditandai sebagai dibaca.")
    } catch (err) {
      toast.error("Gagal menandai notifikasi.")
    }
  }

  const handleHide = async (id: number) => {
    const notificationToHide = notifications.find((n) => n.id === id)

    setNotifications((prev) => prev.filter((n) => n.id !== id))

    toast(
      (t) => (
        <span className="flex items-center">
          Notifikasi disembunyikan.
          <button
            className="ml-4 font-bold text-primary"
            onClick={() => {
              toast.dismiss(t.id)
              setNotifications((prev) =>
                [notificationToHide, ...prev].sort(
                  (a, b) => +new Date(b.created_at) - +new Date(a.created_at)
                )
              )
            }}
          >
            Urungkan
          </button>
        </span>
      ),
      {
        duration: 5000,
      }
    )

    try {
      await hideNotification(id)
    } catch (err) {
      toast.error("Gagal menyembunyikan notifikasi di server.")
      setNotifications((prev) =>
        [notificationToHide, ...prev].sort(
          (a, b) => +new Date(b.created_at) - +new Date(a.created_at)
        )
      )
    }
  }

  const renderContent = () => {
    if (isLoading) {
      return <div className="text-center p-10 text-gray-400">Memuat notifikasi...</div>
    }
    if (error) {
      return <div className="text-center p-10 text-red-500">{error}</div>
    }
    if (notifications.length > 0) {
      return (
        <div className="space-y-4">
          {notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              onHide={handleHide}
            />
          ))}
        </div>
      )
    }
    return (
      <div className="text-center py-20 text-gray-500">
        <BellOff size={48} className="mx-auto mb-4" />
        <h3 className="text-xl font-semibold">Tidak Ada Notifikasi</h3>
        <p>Semua notifikasi Anda akan muncul di sini.</p>
      </div>
    )
  }

  return (
    <div className="bg-background text-white min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-8">Notifikasi Saya</h1>
          {renderContent()}
        </div>
      </div>
    </div>
  )
}

export default MyNotificationsPage
