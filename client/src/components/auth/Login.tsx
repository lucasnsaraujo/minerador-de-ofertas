import React from "react"
import { Link } from "react-router"
import { useNavigate } from "react-router"
import { LogIn, Eye, EyeOff, Loader2, Lock } from "lucide-react"
import { useMutation } from "@tanstack/react-query"
import { authClient } from "../../lib/auth-client"
import { tryCatch } from "../../lib/try-catch"
import { useTRPC } from "../../lib/trpc"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

const Login = () => {
  const session = authClient.useSession()
  const trpc = useTRPC()
  const mutation = useMutation(trpc.session.login.mutationOptions())

  const [showPassword, setShowPassword] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [formData, setFormData] = React.useState({
    password: "securePassword",
    email: "alan@example.com",
  })

  const navigate = useNavigate()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    const result = await tryCatch(mutation.mutateAsync({ email: formData.email, password: formData.password }))
    if (result.error) {
      setError(result.error.message)
    }
    if (result.data) {
      navigate("/profile")
      session.refetch()
    }

    setIsSubmitting(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center animate-pulse-glow">
            <Lock className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Bem-vindo de volta
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Entre para acessar sua conta</p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LogIn className="w-6 h-6" />
              Login
            </CardTitle>
            <CardDescription>Digite suas credenciais para acessar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email-input" className="text-sm font-semibold">
                  Email
                </label>
                <Input
                  id="email-input"
                  name="email"
                  autoFocus
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  type="email"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password-input" className="text-sm font-semibold">
                  Senha
                </label>
                <div className="relative">
                  <Input
                    id="password-input"
                    name="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-3 text-red-600 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5 mr-2" />
                    Entrar
                  </>
                )}
              </Button>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Não tem uma conta?{" "}
                  <Link
                    to="/signup"
                    className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                  >
                    Cadastre-se
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Login
