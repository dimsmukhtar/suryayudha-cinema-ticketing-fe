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

export const loginAdmin = async (credentials: { email: string; password: string }) => {
  try {
    const response = await api.post("/users/login-admin", {
      email: credentials.email,
      password: credentials.password,
    })
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
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
  try {
    const response = await api.get(`/transactions/${transactionId}`)
    return response.data.data
  } catch (error: any) {
    throw error.response?.data || error
  }
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

export const forgotPassword = async (data: { email: string }) => {
  try {
    const response = await api.post("/users/forgot-password", data)
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const resetPassword = async (data: any) => {
  try {
    const response = await api.post("/users/reset-password", data)
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}
export const getAdminDashboardStats = async (): Promise<any> => {
  try {
    const response = await api.get("/users/dashboard/admin-stats")
    return response.data.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const getAdminDashboardChartData = async (params: {
  startDate?: string
  endDate?: string
}): Promise<any> => {
  try {
    const response = await api.get("/users/dashboard/admin-chart", { params })
    return response.data.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const createGenre = async (data: { name: string }): Promise<any> => {
  try {
    const response = await api.post("/genres", data)
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const updateGenre = async (id: number, data: { name: string }): Promise<any> => {
  try {
    const response = await api.patch(`/genres/${id}`, data)
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const deleteGenre = async (id: number): Promise<any> => {
  try {
    const response = await api.delete(`/genres/${id}`)
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const getAllMoviesAdmin = async (filters: any): Promise<any> => {
  const params = new URLSearchParams()
  if (filters.title) params.append("title", filters.title)
  const response = await api.get(`/movies?${params.toString()}`)
  return response.data
}

export const createMovie = async (formData: FormData): Promise<any> => {
  const response = await api.post("/movies", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return response.data
}

export const updateMovie = async (id: number, formData: FormData): Promise<any> => {
  const response = await api.patch(`/movies/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return response.data
}

export const deleteMovie = async (id: number): Promise<any> => {
  const response = await api.delete(`/movies/${id}`)
  return response.data
}

export const createCast = async (formData: FormData): Promise<any> => {
  const response = await api.post("/casts", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return response.data
}

export const updateCast = async (id: number, formData: FormData): Promise<any> => {
  const response = await api.patch(`/casts/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })
  return response.data
}

export const deleteCast = async (id: number): Promise<any> => {
  const response = await api.delete(`/casts/${id}`)
  return response.data
}

export const addGenreToMovie = async (data: { movie_id: number; genre_id: number }) => {
  const response = await api.post("/genres/movie-genre", data)
  return response.data
}

export const removeGenreFromMovie = async (movieGenreId: number) => {
  const response = await api.delete(`/genres/movie-genre/${movieGenreId}`)
  return response.data
}

export const validateTicket = async (code: string) => {
  try {
    const response = await api.patch("/tickets/validate", { code })
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}
export const getAllTicketsAdmin = async (params: any) => {
  try {
    const response = await api.get("/tickets", { params })
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}
export const getTicketByCodeAdmin = async (code: string) => {
  try {
    const response = await api.get(`/tickets/${code}/find-code`)
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const deleteTicketAdmin = async (id: number) => {
  try {
    const response = await api.delete(`/tickets/${id}`)
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const getTicketByIdAdmin = async (id: number) => {
  try {
    const response = await api.get(`/tickets/${id}`)
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const getAllSchedulesAdmin = async (filters: any = {}) => {
  const params = new URLSearchParams()
  if (filters.date) params.append("date", filters.date)
  const response = await api.get(`/schedules?${params.toString()}`)
  return response.data
}

export const createSchedule = async (data: any) => {
  try {
    const response = await api.post("/schedules", data)
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const deleteSchedule = async (id: number) => {
  try {
    const response = await api.delete(`/schedules/${id}`)
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const getAllMoviesAdminSimple = async () => {
  const response = await api.get("/movies")
  return response.data
}
export const updateScheduleSeatStatus = async (scheduleSeatId: number, status: string) => {
  try {
    const response = await api.put(`/schedules/seats/${scheduleSeatId}`, { status })
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const createStudio = async (data: any) => {
  try {
    const response = await api.post("/studios", data)
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const updateStudio = async (id: string, data: any) => {
  try {
    const response = await api.put(`/studios/${id}`, data)
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const deleteStudio = async (id: string) => {
  try {
    const response = await api.delete(`/studios/${id}`)
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const uploadStudioPhotos = async (id: string, formData: FormData) => {
  try {
    const response = await api.post(`/studios/${id}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const deleteStudioPhoto = async (photoId: number) => {
  try {
    const response = await api.delete(`/studios/photos/${photoId}/delete`)
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const getStudioById = async (id: string) => {
  const response = await api.get(`/studios/${id}`)
  return response.data.data
}
export const getAllUsersAdmin = async (params: any) => {
  try {
    const response = await api.get("/users", { params })
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const getUserByIdAdmin = async (id: number) => {
  try {
    const response = await api.get(`/users/${id}`)
    return response.data.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const getTicketsForUser = async (userId: number) => {
  try {
    const response = await api.get(`/users/${userId}/tickets`)
    return response.data.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const createUserAdmin = async (data: any) => {
  try {
    const response = await api.post("/users", data)
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const updateUserAdmin = async (id: number, data: any) => {
  try {
    const response = await api.patch(`/users/${id}`, data)
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const deleteUserAdmin = async (id: number) => {
  try {
    const response = await api.delete(`/users/${id}`)
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const sendNotificationToUser = async (data: any) => {
  try {
    const response = await api.post("/notifications", data)
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const getAllTransactionsAdmin = async (params: any) => {
  try {
    const response = await api.get("/transactions", { params })
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const getAllVouchers = async () => {
  try {
    const response = await api.get("/vouchers")
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const createVoucher = async (data: any) => {
  try {
    const response = await api.post("/vouchers", data)
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const updateVoucher = async (id: number, data: any) => {
  try {
    const response = await api.patch(`/vouchers/${id}`, data)
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}

export const deleteVoucher = async (id: number) => {
  try {
    const response = await api.delete(`/vouchers/${id}`)
    return response.data
  } catch (error: any) {
    throw error.response?.data || error
  }
}
