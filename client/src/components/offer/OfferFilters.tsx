import { Button } from "../ui/button"
import { Card } from "../ui/card"
import { Filter } from "lucide-react"

type OfferType = "infoproduto" | "nutra" | undefined
type OfferRegion = "brasil" | "latam" | "eua" | "europa" | undefined

interface OfferFiltersProps {
  selectedType: OfferType
  selectedRegion: OfferRegion
  onTypeChange: (type: OfferType) => void
  onRegionChange: (region: OfferRegion) => void
}

const OfferFilters = ({ selectedType, selectedRegion, onTypeChange, onRegionChange }: OfferFiltersProps) => {
  const typeLabels: Record<"infoproduto" | "nutra", string> = {
    infoproduto: "Infoproduto",
    nutra: "Nutra",
  }

  const regionLabels: Record<"brasil" | "latam" | "eua" | "europa", { label: string; emoji: string }> = {
    brasil: { label: "Brasil", emoji: "🇧🇷" },
    latam: { label: "LATAM", emoji: "🌎" },
    eua: { label: "EUA", emoji: "🇺🇸" },
    europa: { label: "Europa", emoji: "🇪🇺" },
  }

  return (
    <Card className="p-6 border-2">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gradient-to-r from-[#8B2F52] to-[#5C7457] rounded-xl flex items-center justify-center">
          <Filter className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg font-bold">Filtros</h2>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-sm font-semibold">Tipo</label>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={selectedType === undefined ? "default" : "outline"}
              size="sm"
              onClick={() => onTypeChange(undefined)}
            >
              Todos
            </Button>
            {(Object.keys(typeLabels) as Array<"infoproduto" | "nutra">).map((type) => (
              <Button
                key={type}
                type="button"
                variant={selectedType === type ? "default" : "outline"}
                size="sm"
                onClick={() => onTypeChange(type)}
              >
                {typeLabels[type]}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-sm font-semibold">Região</label>
          <div className="flex flex-wrap gap-2">
            <Button
              type="button"
              variant={selectedRegion === undefined ? "default" : "outline"}
              size="sm"
              onClick={() => onRegionChange(undefined)}
            >
              Todas
            </Button>
            {(Object.keys(regionLabels) as Array<"brasil" | "latam" | "eua" | "europa">).map((region) => (
              <Button
                key={region}
                type="button"
                variant={selectedRegion === region ? "default" : "outline"}
                size="sm"
                onClick={() => onRegionChange(region)}
              >
                {regionLabels[region].emoji} {regionLabels[region].label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

export default OfferFilters
