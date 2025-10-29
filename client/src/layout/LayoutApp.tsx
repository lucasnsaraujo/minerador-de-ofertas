import AppRouter from "../AppRouter"
import AvatarMenu from "../auth/AvatarMenu"
import { Link } from "react-router"
import { useThemeStore } from "../store/useThemeStore"
import { Moon, Sun } from "lucide-react"
import { Button } from "../components/ui/button"

const LayoutApp = () => {
  const { isDarkMode, toggleDarkMode } = useThemeStore()

  return (
    <div className="min-h-screen">
      {/* Modern Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:scale-110 transition-transform">
                AdMiner
              </div>
            </Link>

            {/* Right side - Actions */}
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleDarkMode}
                className="rounded-full"
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
              <AvatarMenu />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-20">
        <AppRouter />
      </main>
    </div>
  )
}

export default LayoutApp
