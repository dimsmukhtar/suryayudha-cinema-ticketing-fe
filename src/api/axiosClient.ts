import axios from "axios"

declare module "axios" {
  export interface AxiosInstance {
    _logoutHandler?: () => void
  }
}

let isRefreshing = false
let refreshSubscribers: ((token: void) => void)[] = []

function onRefreshed() {
  refreshSubscribers.forEach((cb) => cb())
  refreshSubscribers = []
}

function addSubscriber(callback: (token: void) => void) {
  refreshSubscribers.push(callback)
}

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
})

export const attachLogoutHandler = (logoutFn: () => void) => {
  api._logoutHandler = logoutFn
}

api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (!isRefreshing) {
        isRefreshing = true
        try {
          await api.post("/auth/refresh")
          isRefreshing = false
          onRefreshed()
          return api(originalRequest)
        } catch (err) {
          isRefreshing = false
          api._logoutHandler?.()
          return Promise.reject(err)
        }
      }

      return new Promise((resolve) => {
        addSubscriber(() => resolve(api(originalRequest)))
      })
    }

    return Promise.reject(error)
  }
)

export default api
