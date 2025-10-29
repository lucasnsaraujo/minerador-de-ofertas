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

  const regionLabels: Record<"brasil" | "latam" | "eua" | "europa", string> = {
    brasil: "Brasil",
    latam: "LATAM",
    eua: "EUA",
    europa: "Europa",
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium mb-2">Tipo</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onTypeChange(undefined)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedType === undefined
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              Todos
            </button>
            {(Object.keys(typeLabels) as Array<"infoproduto" | "nutra">).map((type) => (
              <button
                key={type}
                onClick={() => onTypeChange(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedType === type
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {typeLabels[type]}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium mb-2">Região</label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onRegionChange(undefined)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedRegion === undefined
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
            >
              Todas
            </button>
            {(Object.keys(regionLabels) as Array<"brasil" | "latam" | "eua" | "europa">).map((region) => (
              <button
                key={region}
                onClick={() => onRegionChange(region)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedRegion === region
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {regionLabels[region]}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default OfferFilters
