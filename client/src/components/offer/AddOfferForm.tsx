import { useState } from "react"
import { useTRPC } from "../../lib/trpc"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Plus } from "@phosphor-icons/react"

const AddOfferForm = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [url, setUrl] = useState("")
  const [name, setName] = useState("")
  const [type, setType] = useState<"infoproduto" | "nutra">("infoproduto")
  const [region, setRegion] = useState<"brasil" | "latam" | "eua" | "europa">("brasil")

  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const createOffer = useMutation({
    ...trpc.offer.createOffer.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [["offer", "getOffers"]] })
      setUrl("")
      setName("")
      setType("infoproduto")
      setRegion("brasil")
      setIsOpen(false)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url || !name) return

    createOffer.mutateAsync({ url, name, type, region })
  }

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} className="btn-blue flex items-center gap-2">
        <Plus weight="bold" size={20} />
        Adicionar Oferta
      </button>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Nova Oferta</h2>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          ✕
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Nome da Oferta
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Curso de Marketing Digital"
            className="input w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="url" className="block text-sm font-medium mb-1">
            URL da Biblioteca de Anúncios
          </label>
          <input
            id="url"
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.facebook.com/ads/library/..."
            className="input w-full"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="type" className="block text-sm font-medium mb-1">
              Tipo
            </label>
            <select id="type" value={type} onChange={(e) => setType(e.target.value as any)} className="input w-full">
              <option value="infoproduto">Infoproduto</option>
              <option value="nutra">Nutra</option>
            </select>
          </div>

          <div>
            <label htmlFor="region" className="block text-sm font-medium mb-1">
              Região
            </label>
            <select
              id="region"
              value={region}
              onChange={(e) => setRegion(e.target.value as any)}
              className="input w-full"
            >
              <option value="brasil">Brasil</option>
              <option value="latam">LATAM</option>
              <option value="eua">EUA</option>
              <option value="europa">Europa</option>
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <button type="submit" disabled={createOffer.isPending} className="btn-blue flex-1">
            {createOffer.isPending ? "Adicionando..." : "Adicionar"}
          </button>
          <button type="button" onClick={() => setIsOpen(false)} className="btn-gray flex-1">
            Cancelar
          </button>
        </div>

        {createOffer.isError && (
          <div className="text-red-600 dark:text-red-400 text-sm">Erro: {createOffer.error.message}</div>
        )}
      </form>
    </div>
  )
}

export default AddOfferForm
