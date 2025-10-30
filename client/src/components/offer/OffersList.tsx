import { useTRPC } from "../../lib/trpc"
import { useQuery } from "@tanstack/react-query"
import OfferCard from "./OfferCard"
import { AlertCircle, PackageOpen } from "lucide-react"

interface OffersListProps {
  type?: "infoproduto" | "nutra"
  region?: "brasil" | "latam" | "eua" | "europa"
}

const OffersList = ({ type, region }: OffersListProps) => {
  const trpc = useTRPC()
  const { data, isLoading, isError, error } = useQuery(
    trpc.offer.getOffers.queryOptions({
      type,
      region,
      limit: 50,
      offset: 0,
    })
  )

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-2xl h-80 border-2 border-gray-200 dark:border-gray-700">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent animate-shimmer" />
          </div>
        ))}
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
            <h3 className="font-bold text-red-900 dark:text-red-200 mb-1">Erro ao carregar ofertas</h3>
            <p className="text-sm text-red-700 dark:text-red-400">{error.message}</p>
          </div>
        </div>
      </div>
    )
  }

  if (!data || data.offers.length === 0) {
    return (
      <div className="bg-gradient-to-br from-gray-50 to-blue-50/30 dark:from-gray-900 dark:to-blue-950/20 border-2 border-gray-200 dark:border-gray-700 rounded-2xl p-12 text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 flex items-center justify-center">
          <PackageOpen className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">Nenhuma oferta encontrada</h3>
        <p className="text-gray-600 dark:text-gray-400">
          Adicione sua primeira oferta para começar o rastreamento inteligente.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          {data.total} {data.total === 1 ? "oferta encontrada" : "ofertas encontradas"}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </div>
  )
}

export default OffersList
