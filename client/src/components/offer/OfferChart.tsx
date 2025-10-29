import { useTRPC } from "../../lib/trpc"
import { useQuery } from "@tanstack/react-query"
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js"
import { Loader2, AlertCircle, BarChart3, TrendingUp, Activity } from "lucide-react"
import { Card } from "../ui/card"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

interface OfferChartProps {
  offerId: string
  days?: number
}

const OfferChart = ({ offerId, days = 7 }: OfferChartProps) => {
  const trpc = useTRPC()
  const { data, isLoading, isError, error } = useQuery(trpc.offer.getOfferChartData.queryOptions({ offerId, days }))

  if (isLoading) {
    return (
      <div className="h-96 bg-gradient-to-br from-[#F5EDE4] to-[#E8C9A0]/30 dark:from-gray-900 dark:to-[#4A2C4F]/20 rounded-2xl animate-pulse flex items-center justify-center border-2 border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-3 animate-spin text-[#8B2F52]" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Carregando dados do gráfico...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 border-2 border-red-200 dark:border-red-800 rounded-2xl p-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center shrink-0">
            <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
          </div>
          <div>
            <h3 className="font-bold text-red-900 dark:text-red-200 mb-1">Erro ao carregar gráfico</h3>
            <p className="text-sm text-red-700 dark:text-red-400">{error.message}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className="h-96 bg-gradient-to-br from-[#F5EDE4] to-[#E8C9A0]/30 dark:from-gray-900 dark:to-[#4A2C4F]/20 border-2 border-gray-200 dark:border-gray-700 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-[#8B2F52]/10 to-[#5C7457]/10 flex items-center justify-center">
            <BarChart3 className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">Sem dados para exibir</h3>
          <p className="text-gray-600 dark:text-gray-400">Ainda não há dados suficientes para exibir o gráfico.</p>
        </div>
      </div>
    )
  }

  // Transform data for Chart.js (reverse to show oldest first)
  const reversedData = [...data].reverse()
  const labels = reversedData.map((snapshot) =>
    new Date(snapshot.timestamp).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
  )

  const chartData = {
    labels,
    datasets: [
      {
        label: "Campanhas",
        data: reversedData.map((s) => s.campaignsCount),
        borderColor: "rgb(139, 47, 82)", // Wine
        backgroundColor: "rgba(139, 47, 82, 0.1)",
        borderWidth: 3,
        pointBackgroundColor: "rgb(139, 47, 82)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
        fill: true,
      },
      {
        label: "Criativos",
        data: reversedData.map((s) => s.creativesCount),
        borderColor: "rgb(92, 116, 87)", // Moss
        backgroundColor: "rgba(92, 116, 87, 0.1)",
        borderWidth: 3,
        pointBackgroundColor: "rgb(92, 116, 87)",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 5,
        pointHoverRadius: 7,
        tension: 0.4,
        fill: true,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          usePointStyle: true,
          padding: 20,
          font: {
            size: 13,
            weight: "600" as const,
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        titleColor: "#CBD5E1",
        bodyColor: "#F8FAFC",
        borderColor: "rgba(148, 163, 184, 0.3)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
        displayColors: true,
        usePointStyle: true,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(148, 163, 184, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: "#64748B",
          font: {
            size: 11,
          },
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: "#64748B",
          font: {
            size: 11,
          },
          maxRotation: 45,
          minRotation: 45,
        },
      },
    },
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <Activity className="w-4 h-4" />
        <span className="font-medium">
          Últimos {days} dias · {data.length} pontos de coleta
        </span>
      </div>

      <div className="bg-gradient-to-br from-[#F5EDE4]/30 via-[#E8C9A0]/30 to-[#D4A574]/20 dark:from-gray-900/50 dark:to-[#4A2C4F]/20 p-6 rounded-2xl border-2 border-[#D4A574]/50 dark:border-[#8B6F47]/50">
        <div style={{ height: "400px" }}>
          <Line data={chartData} options={options} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card className="p-6 border-2 bg-gradient-to-br from-[#F5EDE4] to-[#D4889E]/20 dark:from-[#4A2C4F]/30 dark:to-[#8B2F52]/20 border-[#B85478]/30 dark:border-[#8B2F52]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#8B2F52]/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#8B2F52] dark:text-[#B85478]" />
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Campanhas Atual</div>
          </div>
          <div className="text-3xl font-black" style={{
            background: "linear-gradient(to right, rgb(139, 47, 82), rgb(184, 84, 120))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            {data[0].campaignsCount}
          </div>
        </Card>
        <Card className="p-6 border-2 bg-gradient-to-br from-[#F5EDE4] to-[#8FA88E]/20 dark:from-[#4A3F3F]/30 dark:to-[#5C7457]/20 border-[#8FA88E]/30 dark:border-[#5C7457]">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-[#5C7457]/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#5C7457] dark:text-[#8FA88E]" />
            </div>
            <div className="text-sm font-medium text-gray-600 dark:text-gray-400">Criativos Atual</div>
          </div>
          <div className="text-3xl font-black" style={{
            background: "linear-gradient(to right, rgb(92, 116, 87), rgb(143, 168, 142))",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text"
          }}>
            {data[0].creativesCount}
          </div>
        </Card>
      </div>
    </div>
  )
}

export default OfferChart
