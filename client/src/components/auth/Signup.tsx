import React from "react"
import { Link, useNavigate } from "react-router"
import { UserPlus, Eye, EyeOff, Loader2, Sparkles } from "lucide-react"
import { authClient } from "../../lib/auth-client"
import { useTRPC } from "../../lib/trpc"
import { useMutation } from "@tanstack/react-query"
import { tryCatch } from "../../lib/try-catch"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

const Signup = () => {
  const session = authClient.useSession()
  const trpc = useTRPC()
  const mutation = useMutation(trpc.session.signup.mutationOptions())

  const navigate = useNavigate()

  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
  })
  const [error, setError] = React.useState<string | null>(null)
  const [showPassword, setShowPassword] = React.useState(false)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    const result = await tryCatch(
      mutation.mutateAsync({ email: formData.email, password: formData.password, name: formData.name })
    )
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
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Crie sua conta
          </h1>
          <p className="text-gray-600 dark:text-gray-400">Comece a rastrear suas ofertas agora</p>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserPlus className="w-6 h-6" />
              Cadastro
            </CardTitle>
            <CardDescription>Preencha os dados para criar sua conta</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name-input" className="text-sm font-semibold">
                  Nome
                </label>
                <Input
                  id="name-input"
                  name="name"
                  autoFocus
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  type="text"
                  placeholder="Seu nome completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email-input" className="text-sm font-semibold">
                  Email
                </label>
                <Input
                  id="email-input"
                  name="email"
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
                    Criando conta...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-5 h-5 mr-2" />
                    Criar conta
                  </>
                )}
              </Button>

              <div className="text-center pt-4 border-t">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Já tem uma conta?{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 hover:underline"
                  >
                    Faça login
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

export default Signup
