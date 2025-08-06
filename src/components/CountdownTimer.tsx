import React, { useState, useEffect } from "react"

const CountdownTimer = ({ expiryTime, onExpire }: { expiryTime: string; onExpire: () => void }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(expiryTime) - +new Date()
    let timeLeft = { minutes: 0, seconds: 0 }

    if (difference > 0) {
      timeLeft = {
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
    }
    return timeLeft
  }

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())

  useEffect(() => {
    const timer = setTimeout(() => {
      const newTimeLeft = calculateTimeLeft()
      setTimeLeft(newTimeLeft)
      if (newTimeLeft.minutes === 0 && newTimeLeft.seconds === 0) {
        onExpire()
      }
    }, 1000)

    return () => clearTimeout(timer)
  })

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
