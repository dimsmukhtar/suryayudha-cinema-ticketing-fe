import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

interface ProtectedRouteProps {
  allowedRoles: ("admin" | "user")[]
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (user && allowedRoles.includes(user.role)) {
    return <Outlet />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return <Navigate to="/" replace />
}

export default ProtectedRoute
