import { AuthProvider } from "./contexts/AuthContext"
import AppRoutes from "./routes/AppRoutes"
import "./index.css"

const App = () => {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
