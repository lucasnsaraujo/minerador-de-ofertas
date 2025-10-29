import { useTRPC } from "../../lib/trpc"
import { useQuery } from "@tanstack/react-query"
import OfferCard from "./OfferCard"

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-lg h-64 animate-pulse" />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-red-600 dark:text-red-400">Erro ao carregar ofertas: {error.message}</p>
      </div>
    )
  }

  if (!data || data.offers.length === 0) {
    return (
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Nenhuma oferta encontrada. Adicione sua primeira oferta para começar o rastreamento.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        {data.total} {data.total === 1 ? "oferta encontrada" : "ofertas encontradas"}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.offers.map((offer) => (
          <OfferCard key={offer.id} offer={offer} />
        ))}
      </div>
    </div>
  )
}

export default OffersList
