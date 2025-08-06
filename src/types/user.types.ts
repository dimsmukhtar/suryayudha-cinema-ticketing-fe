export interface User {
  id: number
  name: string
  email: string
  role: "user" | "admin"
  is_verified: boolean
  profile_url: string
  created_at: string
  updated_at: string
}
