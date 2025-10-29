import { useTRPC } from "../../lib/trpc"
import { useQuery } from "@tanstack/react-query"
import { CheckCircle, XCircle, AlertTriangle, Loader2, AlertCircle, Table2, ChevronDown } from "lucide-react"
import { Badge } from "../ui/badge"

interface OfferHistoryTableProps {
  offerId: string
}

const OfferHistoryTable = ({ offerId }: OfferHistoryTableProps) => {
  const trpc = useTRPC()
  const { data, isLoading, isError, error } = useQuery(
    trpc.offer.getOfferSnapshots.queryOptions({
      offerId,
      limit: 100,
      offset: 0,
    })
  )

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 animate-pulse border-2 border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-4 mb-4">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/4" />
        </div>
        <div className="h-64 bg-gray-300 dark:bg-gray-700 rounded-xl" />
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
            <h3 className="font-bold text-red-900 dark:text-red-200 mb-1">Erro ao carregar histórico</h3>
            <p className="text-sm text-red-700 dark:text-red-400">{error.message}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!data || data.snapshots.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-950/20 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex items-center justify-center">
          <Table2 className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-lg font-bold mb-2 text-gray-900 dark:text-gray-100">Sem histórico disponível</h3>
        <p className="text-gray-600 dark:text-gray-400">Ainda não há histórico de coletas para esta oferta.</p>
      </div>
    )
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20">
            <CheckCircle className="w-3 h-3 mr-1" />
            Sucesso
          </Badge>
        )
      case "failed":
        return (
          <Badge variant="destructive">
            <XCircle className="w-3 h-3 mr-1" />
            Erro
          </Badge>
        )
      case "partial":
        return (
          <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/20">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Parcial
          </Badge>
        )
      default:
        return null
    }
  }

  const formatDateTime = (date: string | Date) => {
    return new Date(date).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
        <Table2 className="w-4 h-4" />
        <span className="font-medium">
          {data.total} {data.total === 1 ? "registro encontrado" : "registros encontrados"}
        </span>
      </div>

      <div className="overflow-x-auto border-2 border-gray-200 dark:border-gray-700 rounded-2xl">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Data/Hora
              </th>
              <th className="px-6 py-4 text-center text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Campanhas
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Criativos
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Impressões
              </th>
              <th className="px-6 py-4 text-right text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                Alcance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-950 divide-y divide-gray-200 dark:divide-gray-800">
            {data.snapshots.map((snapshot, index) => (
              <tr
                key={snapshot.id}
                className={`transition-colors hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-purple-50/50 dark:hover:from-blue-950/20 dark:hover:to-purple-950/20 ${
                  index === 0 ? "bg-blue-50/30 dark:bg-blue-950/10" : ""
                }`}
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  {formatDateTime(snapshot.timestamp)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  {getStatusBadge(snapshot.scrapingStatus)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
                  {snapshot.campaignsCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-bold bg-gradient-to-r from-purple-600 to-purple-500 bg-clip-text text-transparent">
                  {snapshot.creativesCount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600 dark:text-gray-400">
                  {snapshot.impressions?.toLocaleString() || "—"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-600 dark:text-gray-400">
                  {snapshot.reach?.toLocaleString() || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.snapshots.some((s) => s.adTexts && (s.adTexts as any).length > 0) && (
        <details className="group bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-950/20 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-6">
          <summary className="cursor-pointer font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            <ChevronDown className="w-5 h-5 group-open:rotate-180 transition-transform" />
            Textos dos Anúncios Coletados
          </summary>
          <div className="space-y-4 mt-6">
            {data.snapshots
              .filter((s) => s.adTexts && (s.adTexts as any).length > 0)
              .slice(0, 3)
              .map((snapshot) => (
                <div
                  key={snapshot.id}
                  className="border-l-4 border-blue-500 dark:border-blue-400 pl-4 py-2 bg-white dark:bg-gray-950 rounded-r-lg"
                >
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2">
                    {formatDateTime(snapshot.timestamp)}
                  </div>
                  <ul className="space-y-2 text-sm">
                    {((snapshot.adTexts as any) || []).slice(0, 3).map((text: string, idx: number) => (
                      <li key={idx} className="text-gray-700 dark:text-gray-300 flex items-start gap-2">
                        <span className="text-blue-600 dark:text-blue-400 font-bold mt-0.5">•</span>
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
          </div>
        </details>
      )}
    </div>
  )
}

export default OfferHistoryTable
