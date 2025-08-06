import React from "react"
import { formatDate } from "../utils/formatters" // Asumsi Anda punya ini
import { Info, CheckCircle } from "lucide-react"

const NotificationItem = ({ notification, onMarkAsRead, onHide }: any) => {
  const isRead = notification.is_read

  return (
    <div
      className={`p-4 border-l-4 ${
        isRead ? "bg-gray-800/50 border-gray-700" : "bg-blue-900/30 border-primary"
      } rounded-md shadow-sm flex items-start gap-4 transition-colors`}
    >
      <div className="flex-shrink-0 mt-1">
        {isRead ? (
          <CheckCircle className="h-6 w-6 text-gray-500" />
        ) : (
          <Info className="h-6 w-6 text-primary" />
        )}
      </div>
      <div className="flex-grow">
        <div className="flex justify-between items-center">
          <h3 className={`font-semibold ${isRead ? "text-gray-400" : "text-white"}`}>
            {notification.title}
          </h3>
          <span className="text-xs text-gray-500">{formatDate(notification.created_at)}</span>
        </div>
        <p className="text-sm text-gray-300 mt-1">{notification.description}</p>
        <div className="mt-3 flex gap-4">
          {!isRead && (
            <button
              onClick={() => onMarkAsRead(notification.id)}
              className="text-sm font-medium text-primary hover:text-primary-light transition-colors"
            >
              Tandai sudah dibaca
            </button>
          )}
          <button
            onClick={() => onHide(notification.id)}
            className="text-sm font-medium text-gray-500 hover:text-red-500 transition-colors"
          >
            Sembunyikan
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationItem
