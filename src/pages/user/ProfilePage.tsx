import { useAuth } from "../../hooks/useAuth"

const ProfilePage = () => {
  const { user } = useAuth()
  return <div>Nama: {user?.name}</div>
}

export default ProfilePage
