import { useState } from "react"
import AddOfferForm from "../components/offer/AddOfferForm"
import OfferFilters from "../components/offer/OfferFilters"
import OffersList from "../components/offer/OffersList"
import { TrendingUp, Plus } from "lucide-react"
import { Button } from "../components/ui/button"

type OfferType = "infoproduto" | "nutra" | undefined
type OfferRegion = "brasil" | "latam" | "eua" | "europa" | undefined

const OffersPage = () => {
  const [selectedType, setSelectedType] = useState<OfferType>(undefined)
  const [selectedRegion, setSelectedRegion] = useState<OfferRegion>(undefined)
  const [showAddForm, setShowAddForm] = useState(false)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-[#8B2F52] via-[#D4A574] to-[#5C7457] text-white">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-4xl font-black mb-2">Dashboard de Ofertas</h1>
                <p className="text-white/90">
                  Monitore suas ofertas em tempo real
                </p>
              </div>
            </div>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              size="lg"
              variant="secondary"
            >
              <Plus className="w-5 h-5 mr-2" />
              Nova Oferta
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Add Form Modal */}
        <AddOfferForm isOpen={showAddForm} onClose={() => setShowAddForm(false)} />

        {/* Filters */}
        <OfferFilters
          selectedType={selectedType}
          selectedRegion={selectedRegion}
          onTypeChange={setSelectedType}
          onRegionChange={setSelectedRegion}
        />

        {/* Offers List */}
        <OffersList type={selectedType} region={selectedRegion} />
      </div>
    </div>
  )
}

export default OffersPage
