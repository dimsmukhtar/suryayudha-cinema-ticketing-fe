export interface User {
  id: number
  name: string
  role: "user" | "admin"
  email: string
  is_verified: boolean
  profile_url: string | null
  created_at: string
  updated_at: string
}
