import { useNavigate } from "react-router"
import { authClient } from "../lib/auth-client"
import { ChartLineIcon } from "@phosphor-icons/react"

const HomePage = () => {
  const navigate = useNavigate()
  const session = authClient.useSession()

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8">
          <ChartLineIcon size={80} weight="fill" className="mx-auto mb-4 text-blue-600 dark:text-blue-400" />
          <h1 className="text-5xl font-bold mb-4">Rastreador de Ofertas</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Monitore e analise a movimentação de ofertas de anúncios no Facebook em tempo real
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 border border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold mb-4">Funcionalidades</h2>
          <ul className="space-y-3 text-left mb-8">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Rastreamento automático a cada hora</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Visualização de métricas em tempo real</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Análise de tendências com gráficos detalhados</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Comparação de deltas de 24 horas</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Filtros por tipo (Infoproduto/Nutra) e região</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">✓</span>
              <span>Histórico completo de todas as coletas</span>
            </li>
          </ul>

          {session.data?.user ? (
            <button onClick={() => navigate("/offers")} className="btn-blue text-lg px-8 py-3">
              Acessar Dashboard
            </button>
          ) : (
            <div className="space-y-3">
              <p className="text-gray-600 dark:text-gray-400 mb-4">Faça login para começar a rastrear suas ofertas</p>
              <div className="flex gap-3 justify-center">
                <button onClick={() => navigate("/login")} className="btn-blue text-lg px-8 py-3">
                  Login
                </button>
                <button onClick={() => navigate("/signup")} className="btn-gray text-lg px-8 py-3">
                  Criar Conta
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default HomePage
