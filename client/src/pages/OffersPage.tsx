import { useState } from "react"
import AddOfferForm from "../components/offer/AddOfferForm"
import OfferFilters from "../components/offer/OfferFilters"
import OffersList from "../components/offer/OffersList"

type OfferType = "infoproduto" | "nutra" | undefined
type OfferRegion = "brasil" | "latam" | "eua" | "europa" | undefined

const OffersPage = () => {
  const [selectedType, setSelectedType] = useState<OfferType>(undefined)
  const [selectedRegion, setSelectedRegion] = useState<OfferRegion>(undefined)

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Rastreador de Ofertas</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Monitore e analise a movimentação de ofertas de anúncios no Facebook
        </p>
      </div>

      <div className="mb-6">
        <AddOfferForm />
      </div>

      <div className="mb-6">
        <OfferFilters
          selectedType={selectedType}
          selectedRegion={selectedRegion}
          onTypeChange={setSelectedType}
          onRegionChange={setSelectedRegion}
        />
      </div>

      <OffersList type={selectedType} region={selectedRegion} />
    </div>
  )
}

export default OffersPage
