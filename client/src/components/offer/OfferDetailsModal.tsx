import { X } from "@phosphor-icons/react"
import { useTRPC } from "../../lib/trpc"
import { useQuery } from "@tanstack/react-query"
import OfferChart from "./OfferChart"
import OfferHistoryTable from "./OfferHistoryTable"
import { useState } from "react"

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
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-auto p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
            <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!offer) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-gray-800 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-6 flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold mb-2">{offer.name}</h2>
            <a
              href={offer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm"
            >
              {offer.url}
            </a>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 p-1"
          >
            <X weight="bold" size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="flex gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab("chart")}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === "chart"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              Gráfico de Tendência
            </button>
            <button
              onClick={() => setActiveTab("history")}
              className={`pb-3 px-1 font-medium transition-colors ${
                activeTab === "history"
                  ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                  : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
              }`}
            >
              Histórico Completo
            </button>
          </div>

          {activeTab === "chart" && <OfferChart offerId={offerId} />}
          {activeTab === "history" && <OfferHistoryTable offerId={offerId} />}
        </div>
      </div>
    </div>
  )
}

export default OfferDetailsModal
