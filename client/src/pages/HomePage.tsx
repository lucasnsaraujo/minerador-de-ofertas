import { useNavigate } from "react-router"
import { authClient } from "../lib/auth-client"
import { TrendingUp, BarChart3, Clock, Filter, History, Zap, ArrowRight, Sparkles } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"

const HomePage = () => {
  const navigate = useNavigate()
  const session = authClient.useSession()

  const features = [
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Rastreamento Automático",
      description: "Coleta de dados a cada hora, 24/7, sem interrupções",
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: "Métricas em Tempo Real",
      description: "Visualize campanhas e criativos atualizados instantaneamente",
    },
    {
      icon: <TrendingUp className="w-6 h-6" />,
      title: "Análise de Tendências",
      description: "Gráficos interativos com histórico de 7 dias",
    },
    {
      icon: <Filter className="w-6 h-6" />,
      title: "Filtros Inteligentes",
      description: "Organize por tipo (Infoproduto/Nutra) e região",
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Deltas de 24h",
      description: "Compare o crescimento ou queda das suas ofertas",
    },
    {
      icon: <History className="w-6 h-6" />,
      title: "Histórico Completo",
      description: "Acesse todos os snapshots de coleta anteriores",
    },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-6 overflow-hidden relative">
      {/* Animated background blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="max-w-6xl w-full relative z-10 animate-fade-in">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 text-sm px-4 py-1.5">
            <Sparkles className="w-4 h-4 mr-1" />
            Powered by AI
          </Badge>
          <h1 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent leading-tight">
            AdMiner
          </h1>
          <p className="text-2xl md:text-3xl font-semibold text-gray-700 dark:text-gray-200 mb-4">
            Rastreador Inteligente de Ofertas
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Monitore e analise a movimentação de ofertas de anúncios do Facebook em tempo real com inteligência artificial
          </p>
        </div>

        {/* CTA */}
        <div className="flex justify-center gap-4 mb-16">
          {session.data?.user ? (
            <Button onClick={() => navigate("/offers")} size="lg" className="group">
              Acessar Dashboard
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          ) : (
            <>
              <Button onClick={() => navigate("/login")} size="lg">
                Fazer Login
              </Button>
              <Button onClick={() => navigate("/signup")} variant="outline" size="lg">
                Criar Conta
              </Button>
            </>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="group hover:scale-105 transition-all duration-300 cursor-pointer border-2 hover:border-blue-500/50"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white mb-3 group-hover:shadow-lg transition-shadow">
                  {feature.icon}
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>

        {/* Stats Section */}
        <div className="mt-16 grid grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">24/7</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Monitoramento</p>
          </div>
          <div className="space-y-2">
            <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">1h</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Intervalo de Coleta</p>
          </div>
          <div className="space-y-2">
            <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">∞</p>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Histórico Ilimitado</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage
