import Logout from "./Logout"
import Login from "./Login"
import { authClient } from "../../lib/auth-client"
import { Loader2 } from "lucide-react"

const AuthManagement = () => {
  const session = authClient.useSession()

  if (session.data?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl font-black">
            {session.data.user.name?.charAt(0).toUpperCase()}
          </div>
          <h1 className="text-3xl font-black mb-2">Olá, {session.data.user.name}!</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">Você já está autenticado</p>
          <Logout />
        </div>
      </div>
    )
  }

  if (session.isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-blue-600" />
          <p className="text-gray-600 dark:text-gray-400">Carregando...</p>
        </div>
      </div>
    )
  }

  return <Login />
}
export default AuthManagement
