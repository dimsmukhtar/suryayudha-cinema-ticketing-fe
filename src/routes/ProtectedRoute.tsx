import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

interface ProtectedRouteProps {
  allowedRoles: ("admin" | "user")[]
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (user && allowedRoles.includes(user.role)) {
    return <Outlet />
  }

  return <Navigate to="/" replace />
}

export default ProtectedRoute
