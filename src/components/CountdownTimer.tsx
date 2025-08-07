import React, { useState, useEffect } from "react"

const CountdownTimer = ({ expiryTime, onExpire }: { expiryTime: string; onExpire: () => void }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(expiryTime) - +new Date()
    if (difference > 0) {
      return {
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }
    return { minutes: 0, seconds: 0 }
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    // Set interval yang akan berjalan setiap detik
    const interval = setInterval(() => {
      const newTimeLeft = calculateTimeLeft()
      setTimeLeft(newTimeLeft)

      if (newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        onExpire()
        clearInterval(interval) // Hentikan interval saat waktu habis
      }
    }, 1000)

    // Fungsi cleanup: Hapus interval saat komponen di-unmount
    // Ini sangat penting untuk mencegah memory leak.
    return () => clearInterval(interval)
  }, [expiryTime, onExpire]) // <-- Dependency array yang benar

  const isTimeRunningOut = timeLeft.minutes < 1

  return (
    <div
      className={`font-mono text-2xl font-bold ${
        isTimeRunningOut ? "text-red-500 animate-pulse" : "text-yellow-400"
      }`}
    >
      {String(timeLeft.minutes).padStart(2, "0")}:{String(timeLeft.seconds).padStart(2, "0")}
    </div>
  )
}

export default CountdownTimer
