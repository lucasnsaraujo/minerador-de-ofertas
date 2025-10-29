import { X, TrendingUp, Table2, ExternalLink, Loader2 } from "lucide-react"
import { useTRPC } from "../../lib/trpc"
import { useQuery } from "@tanstack/react-query"
import OfferChart from "./OfferChart"
import OfferHistoryTable from "./OfferHistoryTable"
import { useState } from "react"
import { Button } from "../ui/button"
import { Card } from "../ui/card"

interface OfferDetailsModalProps {
  offerId: string
  onClose: () => void
}

const OfferDetailsModal = ({ offerId, onClose }: OfferDetailsModalProps) => {
  const [activeTab, setActiveTab] = useState<"chart" | "history">("chart")
  const trpc = useTRPC()

  const { data: offer, isLoading } = useQuery(trpc.offer.getOfferDetails.queryOptions({ offerId }))

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
        <Card className="max-w-5xl w-full max-h-[90vh] overflow-auto p-8 border-2">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-[#8B2F52]" />
              <div className="space-y-2 flex-1">
                <div className="h-8 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-lg w-1/3 animate-pulse" />
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded w-1/2 animate-pulse" />
              </div>
            </div>
            <div className="h-96 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl animate-pulse" />
          </div>
        </Card>
      </div>
    )
  }

  if (!offer) {
    return null
  }

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <Card
        className="max-w-5xl w-full max-h-[90vh] overflow-auto border-2 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-950 border-b-2 p-6 flex justify-between items-start backdrop-blur-lg bg-opacity-95 dark:bg-opacity-95 z-10">
          <div className="flex-1 min-w-0 pr-4">
            <h2 className="text-2xl font-black mb-3 bg-gradient-to-r from-[#8B2F52] to-[#5C7457] bg-clip-text text-transparent">
              {offer.name}
            </h2>
            <a
              href={offer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#8B2F52] dark:text-[#B85478] hover:underline text-sm flex items-center gap-2 group"
            >
              <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              <span className="truncate">{offer.url}</span>
            </a>
          </div>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="shrink-0 rounded-full hover:bg-red-500/10 hover:text-red-600"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="p-6">
          <div className="flex gap-2 mb-6 p-1 bg-gray-100 dark:bg-gray-900 rounded-xl">
            <button
              onClick={() => setActiveTab("chart")}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === "chart"
                  ? "bg-gradient-to-r from-[#8B2F52] to-[#5C7457] text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              Gráfico de Tendência
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                activeTab === "history"
                  ? "bg-gradient-to-r from-[#8B2F52] to-[#5C7457] text-white shadow-lg"
                  : "text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-800"
              }`}
            >
              <Table2 className="w-5 h-5" />
              Histórico Completo
            </button>
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in">
            {activeTab === "chart" && <OfferChart offerId={offerId} />}
            {activeTab === "history" && <OfferHistoryTable offerId={offerId} />}
          </div>
        </div>
      </Card>
    </div>
  )
}

export default OfferDetailsModal
