import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import toast from 'react-hot-toast'

interface ProtectedRouteProps {
  allowedRoles: ('admin' | 'user')[]
}

const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth()

  if (user && allowedRoles.includes(user.role)) {
    return <Outlet />
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    )
  }

  toast.error('Anda tidak memiliki akses ke halaman ini. Login terlebih dahulu')
  return <Navigate to="/" replace />
}

export default ProtectedRoute
