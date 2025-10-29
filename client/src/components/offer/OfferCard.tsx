import { useState } from "react"
import { useTRPC } from "../../lib/trpc"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trash, TrendUp, TrendDown, Link as LinkIcon, Eye, ArrowClockwise } from "@phosphor-icons/react"
import OfferDetailsModal from "./OfferDetailsModal"

interface OfferCardProps {
  offer: any // Type from tRPC query result
}

const OfferCard = ({ offer }: OfferCardProps) => {
  const [showDetails, setShowDetails] = useState(false)
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const deleteOffer = useMutation({
    ...trpc.offer.deleteOffer.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["offer", "getOffers"]] })
    },
  })

  const triggerScraping = useMutation({
    ...trpc.offer.triggerScraping.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["offer", "getOffers"]] })
    },
  })

  const handleDelete = () => {
    if (confirm(`Tem certeza que deseja remover a oferta "${offer.name}"?`)) {
      deleteOffer.mutateAsync({ offerId: offer.id })
    }
  }

  const handleTriggerScraping = () => {
    triggerScraping.mutateAsync({ offerId: offer.id })
  }

  const latestSnapshot = offer.latestSnapshot
  const delta24h = offer.delta24h

  const typeLabels: Record<string, string> = {
    infoproduto: "Infoproduto",
    nutra: "Nutra",
  }

  const regionLabels: Record<string, string> = {
    brasil: "🇧🇷 Brasil",
    latam: "🌎 LATAM",
    eua: "🇺🇸 EUA",
    europa: "🇪🇺 Europa",
  }

  const getStatusBadge = () => {
    if (!latestSnapshot) {
      return <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">Aguardando</span>
    }

    if (latestSnapshot.scrapingStatus === "failed") {
      return <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-1 rounded">Erro</span>
    }

    if (latestSnapshot.scrapingStatus === "partial") {
      return <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 px-2 py-1 rounded">Parcial</span>
    }

    return <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded">Ativo</span>
  }

  const formatTimeAgo = (date: string | Date) => {
    const now = new Date()
    const then = new Date(date)
    const diffMs = now.getTime() - then.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMins / 60)
    const diffDays = Math.floor(diffHours / 24)

    if (diffDays > 0) return `há ${diffDays} ${diffDays === 1 ? "dia" : "dias"}`
    if (diffHours > 0) return `há ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`
    if (diffMins > 0) return `há ${diffMins} ${diffMins === 1 ? "minuto" : "minutos"}`
    return "agora"
  }

  const renderDelta = (value: number | null | undefined) => {
    if (value === null || value === undefined) return null

    if (value === 0) {
      return <span className="text-gray-500 dark:text-gray-400 text-sm">—</span>
    }

    const isPositive = value > 0
    const color = isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
    const Icon = isPositive ? TrendUp : TrendDown

    return (
      <span className={`${color} text-sm font-medium flex items-center gap-1`}>
        <Icon weight="bold" size={16} />
        {isPositive ? "+" : ""}
        {value}
      </span>
    )
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1 line-clamp-2">{offer.name}</h3>
              <div className="flex gap-2 text-xs flex-wrap">
                <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">
                  {typeLabels[offer.type]}
                </span>
                <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-1 rounded">
                  {regionLabels[offer.region]}
                </span>
                {getStatusBadge()}
              </div>
            </div>
            <button
              onClick={handleDelete}
              disabled={deleteOffer.isPending}
              className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors p-1"
              title="Remover oferta"
            >
              <Trash weight="fill" size={20} />
            </button>
          </div>

          <div className="mb-3">
            <a
              href={offer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-1 truncate"
            >
              <LinkIcon size={14} />
              <span className="truncate">{offer.url}</span>
            </a>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 pt-3 space-y-2">
            {latestSnapshot ? (
              <>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Campanhas:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{latestSnapshot.campaignsCount}</span>
                    {delta24h && renderDelta(delta24h.campaignsCount)}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400 text-sm">Criativos:</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">{latestSnapshot.creativesCount}</span>
                    {delta24h && renderDelta(delta24h.creativesCount)}
                  </div>
                </div>

                {latestSnapshot.impressions !== null && latestSnapshot.impressions !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400 text-sm">Impressões:</span>
                    <span className="font-bold text-lg">{latestSnapshot.impressions.toLocaleString()}</span>
                  </div>
                )}

                <div className="text-xs text-gray-500 dark:text-gray-400 mt-3">
                  Última atualização: {formatTimeAgo(latestSnapshot.timestamp)}
                </div>
              </>
            ) : (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                Aguardando primeiro scraping...
              </div>
            )}
          </div>

          <div className="flex gap-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setShowDetails(true)}
              className="btn-blue flex-1 text-sm py-2 flex items-center justify-center gap-1"
            >
              <Eye size={16} />
              Ver Detalhes
            </button>
            <button
              onClick={handleTriggerScraping}
              disabled={triggerScraping.isPending}
              className="btn-gray text-sm py-2 px-3 flex items-center justify-center gap-1"
              title="Atualizar agora"
            >
              <ArrowClockwise size={16} className={triggerScraping.isPending ? "animate-spin" : ""} />
            </button>
          </div>
        </div>
      </div>

      {showDetails && <OfferDetailsModal offerId={offer.id} onClose={() => setShowDetails(false)} />}
    </>
  )
}

export default OfferCard
