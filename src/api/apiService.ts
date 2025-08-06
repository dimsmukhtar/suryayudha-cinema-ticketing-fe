import axios from "axios"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
})

export const getMyProfile = async () => {
  const response = await api.get("/users/profile")
  return response.data
}

export const loginUser = async (data: any) => {
  try {
    const response = await api.post("/users/login", {
      email: data.email,
      password: data.password,
    })
    return response.data
  } catch (error: any) {
    throw error.response?.data
  }
}

export const registerUser = async (data: any) => {
  try {
    const response = await api.post("/users/register", {
      name: data.name,
      email: data.email,
      password: data.password,
      passwordConfirmation: data.passwordConfirmation,
    })
    return response.data // Mengembalikan response JSON dari API
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
  if (response.status === 200) {
    return true
  }
  return false
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
  // Membuat query string dari objek filter
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
