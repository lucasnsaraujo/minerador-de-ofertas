import ProfileQuery from "./ProfileQuery"
import Logout from "./Logout"
import { Link } from "react-router"
import { UserCircle, TrendingUp } from "lucide-react"
import { authClient } from "../../lib/auth-client"
import { Button } from "../ui/button"

const ProfilePage = () => {
  const session = authClient.useSession()

  if (!session.data?.user) {
    return null
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center">
                <UserCircle className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-black mb-2">Meu Perfil</h1>
                <p className="text-blue-100">Gerencie suas informações pessoais</p>
              </div>
            </div>
            <Logout />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <ProfileQuery meId={session.data.user.id} />

        <div className="mt-6">
          <Link to="/offers">
            <Button size="lg" className="w-full sm:w-auto">
              <TrendingUp className="w-5 h-5 mr-2" />
              Ir para Ofertas
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
export default ProfilePage
