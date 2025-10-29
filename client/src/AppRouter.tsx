import { Link, Route, Routes } from "react-router"
import HomePage from "./pages/HomePage"
import AuthManagement from "./components/auth/AuthManagement"
import ProfilePage from "./components/auth/ProfilePage"
import PrivateRoute from "./PrivateRoute"
import UsersPage from "./components/user/UsersPage"
import Signup from "./components/auth/Signup"
import { HouseIcon } from "@phosphor-icons/react"
import SessionsPage from "./components/session/SessionsPage"
import OffersPage from "./pages/OffersPage"

const AppRouter = () => {
  return (
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="/login" element={<AuthManagement />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/profile" element={<PrivateRoute element={<ProfilePage />} />} />
      <Route path="/users" element={<PrivateRoute element={<UsersPage />} />} />
      <Route path="/sessions" element={<PrivateRoute element={<SessionsPage />} />} />
      <Route path="/offers" element={<PrivateRoute element={<OffersPage />} />} />
      <Route
        path="*"
        element={
          <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">Página não encontrada</h1>
            <p className="text-gray-600 dark:text-gray-400">A página que você está procurando não existe.</p>
            <div className="mt-8">
              <Link to="/">
                <button id="id-home-button" className="btn-blue flex items-center">
                  <HouseIcon className="mr-2" />
                  Voltar para Home
                </button>
              </Link>
            </div>
          </div>
        }
      />
    </Routes>
  )
}
export default AppRouter
