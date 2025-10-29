import { useTRPC } from "../../lib/trpc"
import { useQuery } from "@tanstack/react-query"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

interface OfferChartProps {
  offerId: string
  days?: number
}

const OfferChart = ({ offerId, days = 7 }: OfferChartProps) => {
  const trpc = useTRPC()
  const { data, isLoading, isError, error } = useQuery(trpc.offer.getOfferChartData.queryOptions({ offerId, days }))

  if (isLoading) {
    return (
      <div className="h-96 bg-gray-100 dark:bg-gray-900 rounded-lg animate-pulse flex items-center justify-center">
        <p className="text-gray-500 dark:text-gray-400">Carregando dados...</p>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-600 dark:text-red-400">Erro ao carregar gráfico: {error.message}</p>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-96 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg flex items-center justify-center">
        <p className="text-gray-600 dark:text-gray-400">Ainda não há dados suficientes para exibir o gráfico.</p>
      </div>
    )
  }

  // Transform data for recharts (reverse to show oldest first)
  const chartData = [...data]
    .reverse()
    .map((snapshot) => ({
      timestamp: new Date(snapshot.timestamp).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
      Campanhas: snapshot.campaignsCount,
      Criativos: snapshot.creativesCount,
    }))

  return (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        Mostrando dados dos últimos {days} dias ({data.length} pontos de coleta)
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
          <XAxis dataKey="timestamp" stroke="#6B7280" fontSize={12} />
          <YAxis stroke="#6B7280" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(31, 41, 55, 0.95)",
              border: "1px solid #4B5563",
              borderRadius: "8px",
              color: "#F9FAFB",
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="Campanhas"
            stroke="#3B82F6"
            strokeWidth={2}
            dot={{ fill: "#3B82F6", r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="Criativos"
            stroke="#8B5CF6"
            strokeWidth={2}
            dot={{ fill: "#8B5CF6", r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Campanhas Atual</div>
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{data[0].campaignsCount}</div>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4">
          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Criativos Atual</div>
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{data[0].creativesCount}</div>
        </div>
      </div>
    </div>
  )
}

export default OfferChart
