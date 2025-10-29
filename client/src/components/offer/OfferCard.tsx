import { useState } from "react"
import { useTRPC } from "../../lib/trpc"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Trash2, TrendingUp, TrendingDown, ExternalLink, Eye, RefreshCw } from "lucide-react"
import OfferDetailsModal from "./OfferDetailsModal"
import DeleteConfirmModal from "./DeleteConfirmModal"
import { Card, CardContent, CardHeader } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"

interface OfferCardProps {
  offer: any // Type from tRPC query result
}

const OfferCard = ({ offer }: OfferCardProps) => {
  const [showDetails, setShowDetails] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const deleteOffer = useMutation({
    ...trpc.offer.deleteOffer.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["offer", "getOffers"]] })
      setShowDeleteConfirm(false)
    },
  })

  const triggerScraping = useMutation({
    ...trpc.offer.triggerScraping.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["offer", "getOffers"]] })
    },
  })

  const handleDelete = () => {
    setShowDeleteConfirm(true)
  }

  const handleConfirmDelete = () => {
    deleteOffer.mutateAsync({ offerId: offer.id })
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
      return <Badge variant="secondary">Aguardando</Badge>
    }

    if (latestSnapshot.scrapingStatus === "failed") {
      return <Badge variant="destructive">Erro</Badge>
    }

    if (latestSnapshot.scrapingStatus === "partial") {
      return <Badge className="bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-500/20">Parcial</Badge>
    }

    return <Badge className="bg-green-500/10 text-green-700 dark:text-green-400 hover:bg-green-500/20">Ativo</Badge>
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
    const Icon = isPositive ? TrendingUp : TrendingDown

    return (
      <span className={`${color} text-sm font-semibold flex items-center gap-1`}>
        <Icon className="w-4 h-4" />
        {isPositive ? "+" : ""}
        {value}
      </span>
    )
  }

  return (
    <>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 group">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-[#8B2F52] dark:group-hover:text-[#B85478] transition-colors">
                {offer.name}
              </h3>
              <div className="flex gap-2 flex-wrap">
                <Badge variant="secondary" className="bg-[#8B2F52]/10 text-[#8B2F52] dark:text-[#B85478]">
                  {typeLabels[offer.type]}
                </Badge>
                <Badge variant="secondary" className="bg-[#5C7457]/10 text-[#5C7457] dark:text-[#8FA88E]">
                  {regionLabels[offer.region]}
                </Badge>
                {getStatusBadge()}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleDelete}
              disabled={deleteOffer.isPending}
              className="text-gray-400 hover:text-red-600 dark:hover:text-red-400 shrink-0"
            >
              <Trash2 className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <a
            href={offer.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#8B2F52] dark:text-[#B85478] hover:underline text-sm flex items-center gap-2 truncate group/link"
          >
            <ExternalLink className="w-4 h-4 shrink-0 group-hover/link:translate-x-0.5 transition-transform" />
            <span className="truncate">{offer.url}</span>
          </a>

          <div className="space-y-3 pt-3 border-t">
            {latestSnapshot ? (
              <>
                <div className="flex justify-between items-center py-2 px-3 bg-gradient-to-r from-[#F5EDE4]/50 to-[#E8C9A0]/50 dark:from-[#8B2F52]/10 dark:to-[#4A2C4F]/10 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Campanhas</span>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-xl bg-gradient-to-r from-[#8B2F52] to-[#B85478] bg-clip-text text-transparent">
                      {latestSnapshot.campaignsCount}
                    </span>
                    {delta24h && renderDelta(delta24h.campaignsCount)}
                  </div>
                </div>

                <div className="flex justify-between items-center py-2 px-3 bg-gradient-to-r from-[#F5EDE4]/50 to-[#E8C9A0]/50 dark:from-[#5C7457]/10 dark:to-[#4A2C4F]/10 rounded-lg">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Criativos</span>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-xl bg-gradient-to-r from-[#5C7457] to-[#8FA88E] bg-clip-text text-transparent">
                      {latestSnapshot.creativesCount}
                    </span>
                    {delta24h && renderDelta(delta24h.creativesCount)}
                  </div>
                </div>

                {latestSnapshot.impressions !== null && latestSnapshot.impressions !== undefined && (
                  <div className="flex justify-between items-center py-2 px-3 bg-gradient-to-r from-[#F5EDE4]/50 to-[#E8C9A0]/50 dark:from-[#D4A574]/10 dark:to-[#4A2C4F]/10 rounded-lg">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Impressões</span>
                    <span className="font-black text-xl bg-gradient-to-r from-[#D4A574] to-[#C8915F] bg-clip-text text-transparent">
                      {latestSnapshot.impressions.toLocaleString()}
                    </span>
                  </div>
                )}

                <div className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2">
                  Atualizado {formatTimeAgo(latestSnapshot.timestamp)}
                </div>
              </>
            ) : (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-r from-[#8B2F52]/10 to-[#5C7457]/10 flex items-center justify-center">
                  <RefreshCw className="w-6 h-6 animate-spin text-[#8B2F52]" />
                </div>
                <p className="text-sm">Aguardando primeiro scraping...</p>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-3 border-t">
            <Button
              onClick={() => setShowDetails(true)}
              className="flex-1"
              size="sm"
            >
              <Eye className="w-4 h-4 mr-2" />
              Ver Detalhes
            </Button>
            <Button
              onClick={handleTriggerScraping}
              disabled={triggerScraping.isPending}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 ${triggerScraping.isPending ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardContent>
      </Card>

      {showDetails && <OfferDetailsModal offerId={offer.id} onClose={() => setShowDetails(false)} />}

      {showDeleteConfirm && (
        <DeleteConfirmModal
          offerName={offer.name}
          isDeleting={deleteOffer.isPending}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}
    </>
  )
}

export default OfferCard
