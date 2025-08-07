import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
})

export const getMyProfile = async () => {
  const response = await api.get("/users/profile")
  return response.data.data
}

export const loginUser = async (credentials: { email: string; password: string }) => {
  try {
    const response = await api.post("/users/login", {
      email: credentials.email,
      password: credentials.password,
    })
    return response.data
  } catch (error: any) {
    throw error.response?.data
  }
}

export const registerUser = async (credentials: {
  name: string
  email: string
  password: string
  passwordConfirmation: string
}) => {
  try {
    const response = await api.post("/users/register", {
      name: credentials.name,
      email: credentials.email,
      password: credentials.password,
      passwordConfirmation: credentials.passwordConfirmation,
    })
    return response.data
  } catch (error: any) {
    throw error.response?.data
  }
}

export const loginAdmin = async (data: any) => {
  const response = await api.post("/auths/admin/login", data)
  return response.data
}

export const logout = async () => {
  await api.post("/users/logout")
}

export const resendVerificationTokenToEmail = async (email: string) => {
  const response = await api.post("users/resend-verification-token", { email })
  return response.data
}

export const getNowShowingMovies = async () => {
  const response = await api.get("movies?status=now_showing")
  return response.data.data
}

export const getMovieById = async (id: string) => {
  const response = await api.get(`movies/${id}`)
  return response.data.data
}

interface MovieFilters {
  title?: string
  genre?: string
  status?: string
}

export const getAllMovies = async (filters: MovieFilters): Promise<any[]> => {
  const params = new URLSearchParams()
  if (filters.title) params.append("title", filters.title)
  if (filters.genre) params.append("genre", filters.genre)
  if (filters.status) params.append("status", filters.status)

  const response = await api.get(`/movies?${params.toString()}`)
  return response.data.data
}

export const getAllGenres = async (): Promise<any[]> => {
  const response = await api.get("/genres")
  return response.data.data
}

export const getComingSoonMovies = async (): Promise<any[]> => {
  const response = await api.get("/movies?status=coming_soon")
  return response.data.data
}

export const getAllStudios = async (): Promise<any[]> => {
  const response = await api.get("/studios")
  return response.data.data
}

export const getAllStudioPhotos = async (): Promise<any[]> => {
  const response = await api.get("/studios/photos")
  return response.data.data
}

export const getScheduleLayout = async (scheduleId: string): Promise<any> => {
  const response = await api.get(`/schedules/${scheduleId}/seats`)
  return response.data.data
}

export const createBooking = async (
  scheduleId: number,
  scheduleSeatIds: number[]
): Promise<any> => {
  const response = await api.post("/transactions", {
    schedule_id: scheduleId,
    schedule_seat_ids: scheduleSeatIds.join(","), // Kirim sebagai string dipisah koma
  })
  return response.data.data
}

export const checkAuth = async () => {
  const response = await api.get("/users/check-auth")
  return response
}

export const verifyEmail = async (data: { email: string; token: string }) => {
  try {
    const response = await api.get(`/users/verify-email?token=${data.token}&email=${data.email}`)
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const getTransactionById = async (transactionId: string): Promise<any> => {
  const response = await api.get(`/transactions/${transactionId}`)
  return response.data.data
}

export const applyVoucher = async (transactionId: string, voucherCode: string): Promise<any> => {
  const response = await api.patch(`/transactions/${transactionId}/apply-voucher`, {
    voucher_code: voucherCode,
  })

  return response.data.data
}

export const initiatePayment = async (transactionId: string): Promise<any> => {
  try {
    const response = await api.post(`/transactions/${transactionId}/pay`)
    return response.data.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const getMyNotifications = async () => {
  const response = await api.get("/notifications/my")
  return response.data.data
}

export const markNotificationAsRead = async (notificationId: number) => {
  const response = await api.post(`/notifications/${notificationId}/my/mark`)
  return response.data
}

export const hideNotification = async (notificationId: number) => {
  const response = await api.delete(`/notifications/${notificationId}/my/hide`)
  return response.data
}
export const updateMyProfile = async (formData: FormData): Promise<any> => {
  try {
    const response = await api.patch("/users/update-profile", formData)
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const getMyTickets = async (): Promise<any[]> => {
  try {
    const response = await api.get("/tickets/my")
    return response.data.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const getTicketById = async (id: number): Promise<any> => {
  try {
    const response = await api.get(`/tickets/${id}`)
    return response.data.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const getMyBookings = async (): Promise<any[]> => {
  try {
    const response = await api.get("/transactions/my?type=booking")
    return response.data.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const getMyTransactionHistory = async (): Promise<any[]> => {
  try {
    const response = await api.get("/transactions/my?type=payment")
    return response.data.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const changePassword = async (data: any) => {
  try {
    const response = await api.patch("/users/change-password", data)
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}
