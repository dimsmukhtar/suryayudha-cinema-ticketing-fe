export const formatDate = (dateString: string) => {
  if (!dateString) return ""
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }
  return new Date(dateString).toLocaleDateString("id-ID", options)
}

export const formatDuration = (durationString: string): string => {
  if (!durationString) return "N/A"
  const hoursMatch = durationString.match(/(\d+)\s*h/i)
  const minutesMatch = durationString.match(/(\d+)\s*m/i)

  let result = ""
  if (hoursMatch) result += `${hoursMatch[1]} jam `
  if (minutesMatch) result += `${minutesMatch[1]} menit`

  return result.trim()
}

export const formatRupiah = (amount: number): string => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount)
}

export const formatTime = (dateString: string) => {
  if (!dateString) return "N/A"
  return new Date(dateString).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Jakarta",
  })
}
