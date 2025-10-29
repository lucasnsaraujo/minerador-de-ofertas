import { Link, Route, Routes } from "react-router"
import HomePage from "./pages/HomePage"
import AuthManagement from "./components/auth/AuthManagement"
import ProfilePage from "./components/auth/ProfilePage"
import PrivateRoute from "./PrivateRoute"
import Signup from "./components/auth/Signup"
import OffersPage from "./pages/OffersPage"
import { Home } from "lucide-react"
import { Button } from "./components/ui/button"

const AppRouter = () => {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="/login" element={<AuthManagement />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
      <Route path="/offers" element={<PrivateRoute element={<OffersPage />} />} />
      <Route
        path="*"
        element={
          <div className="min-h-screen flex items-center justify-center p-6">
            <div className="text-center">
              <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">404</h1>
              <h2 className="text-2xl font-bold mb-2">Página não encontrada</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-8">A página que você está procurando não existe.</p>
              <Link to="/">
                <Button size="lg">
                  <Home className="w-5 h-5 mr-2" />
                  Voltar para Home
                </Button>
              </Link>
            </div>
          </div>
        }
      />
    </Routes>
  )
}
export default AppRouter
