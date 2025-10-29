import { useTRPC } from "../../lib/trpc"
import { useQuery } from "@tanstack/react-query"
import { CheckCircle, XCircle, WarningCircle } from "@phosphor-icons/react"

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
      <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-8 animate-pulse">
        <div className="h-64 bg-gray-200 dark:bg-gray-800 rounded" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-600 dark:text-red-400">Erro ao carregar histórico: {error.message}</p>
      </div>
    )
  }

  if (!data || data.snapshots.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">Ainda não há histórico disponível.</p>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "success":
        return <CheckCircle weight="fill" size={20} className="text-green-500" />
      case "failed":
        return <XCircle weight="fill" size={20} className="text-red-500" />
      case "partial":
        return <WarningCircle weight="fill" size={20} className="text-yellow-500" />
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
    <div className="space-y-4">
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {data.total} {data.total === 1 ? "registro encontrado" : "registros encontrados"}
      </div>

      <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-lg">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Data/Hora
              </th>
              <th className="px-4 py-3 text-center text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Campanhas
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Criativos
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Impressões
              </th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                Alcance
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {data.snapshots.map((snapshot) => (
              <tr key={snapshot.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                <td className="px-4 py-3 whitespace-nowrap text-sm">{formatDateTime(snapshot.timestamp)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-center">
                  <div className="flex justify-center" title={snapshot.scrapingStatus}>
                    {getStatusIcon(snapshot.scrapingStatus)}
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                  {snapshot.campaignsCount}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                  {snapshot.creativesCount}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-600 dark:text-gray-400">
                  {snapshot.impressions?.toLocaleString() || "—"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right text-sm text-gray-600 dark:text-gray-400">
                  {snapshot.reach?.toLocaleString() || "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {data.snapshots.some((s) => s.adTexts && (s.adTexts as any).length > 0) && (
        <details className="bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300 mb-2">
            Textos dos Anúncios Coletados
          </summary>
          <div className="space-y-3 mt-3">
            {data.snapshots
              .filter((s) => s.adTexts && (s.adTexts as any).length > 0)
              .slice(0, 3)
              .map((snapshot) => (
                <div key={snapshot.id} className="border-l-4 border-blue-500 pl-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {formatDateTime(snapshot.timestamp)}
                  </div>
                  <ul className="space-y-1 text-sm">
                    {((snapshot.adTexts as any) || []).slice(0, 3).map((text: string, idx: number) => (
                      <li key={idx} className="text-gray-700 dark:text-gray-300">
                        • {text}
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
