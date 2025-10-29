import { useState } from "react"
import { useTRPC } from "../../lib/trpc"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { X, Plus, Loader2, Sparkles, Tag, MapPin, FileText, Link as LinkIcon, Info } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Badge } from "../ui/badge"

interface AddOfferFormProps {
  onClose?: () => void
  isOpen?: boolean
}

const AddOfferForm = ({ onClose, isOpen = true }: AddOfferFormProps) => {
  const [step, setStep] = useState(1)
  const [url, setUrl] = useState("")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [niche, setNiche] = useState("")
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
      setDescription("")
      setNiche("")
      setType("infoproduto")
      setRegion("brasil")
      setStep(1)
      onClose?.()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url || !name) return
    createOffer.mutateAsync({ url, name, type, region })
  }

  const handleNext = () => {
    if (step === 1 && name && url) setStep(2)
    else if (step === 2) setStep(3)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="w-full max-w-2xl animate-slide-up">
        <Card className="border-2 shadow-2xl overflow-hidden">
          {/* Header com gradiente */}
          <div className="relative bg-gradient-to-r from-[#8B2F52] via-[#D4A574] to-[#5C7457] p-6 text-white">
            <div className="absolute inset-0 bg-black/10" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black">Nova Oferta</h2>
                  <p className="text-sm text-white/90">Passo {step} de 3</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="text-white hover:bg-white/20 rounded-full"
              >
                <X className="w-6 h-6" />
              </Button>
            </div>

            {/* Progress bar */}
            <div className="relative mt-4 h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 bg-white rounded-full transition-all duration-500 ease-out"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Step 1: Informações Básicas */}
              {step === 1 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#8B2F52]" />
                      <label htmlFor="name" className="text-sm font-bold">
                        Nome da Oferta *
                      </label>
                    </div>
                    <Input
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Ex: Curso de Marketing Digital"
                      className="border-2"
                      required
                      autoFocus
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4 text-[#5C7457]" />
                      <label htmlFor="url" className="text-sm font-bold">
                        URL da Biblioteca de Anúncios *
                      </label>
                    </div>
                    <Input
                      id="url"
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://www.facebook.com/ads/library/..."
                      className="border-2"
                      required
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                      <Info className="w-3 h-3" />
                      Cole o link da página de anúncios do Facebook
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Categorização */}
              {step === 2 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#D4A574]" />
                      <label htmlFor="description" className="text-sm font-bold">
                        Descrição (Opcional)
                      </label>
                    </div>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Descreva brevemente o produto ou serviço..."
                      className="w-full min-h-[100px] px-3 py-2 border-2 rounded-lg focus:border-[#8B2F52] focus:outline-none transition-colors dark:bg-gray-800 dark:border-gray-700"
                      rows={4}
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4 text-[#8B2F52]" />
                      <label htmlFor="niche" className="text-sm font-bold">
                        Nicho (Opcional)
                      </label>
                    </div>
                    <Input
                      id="niche"
                      value={niche}
                      onChange={(e) => setNiche(e.target.value)}
                      placeholder="Ex: Emagrecimento, Finanças, Marketing..."
                      className="border-2"
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Tipo e Região */}
              {step === 3 && (
                <div className="space-y-6 animate-fade-in">
                  <div className="space-y-3">
                    <label className="text-sm font-bold flex items-center gap-2">
                      <Badge className="bg-[#8B2F52]">Tipo de Produto</Badge>
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setType("infoproduto")}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          type === "infoproduto"
                            ? "border-[#8B2F52] bg-[#B85478]/10 dark:bg-[#B85478]/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-[#8B2F52]/50"
                        }`}
                      >
                        <div className="text-3xl mb-2">📚</div>
                        <div className="font-bold">Infoproduto</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Cursos, ebooks, etc
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setType("nutra")}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          type === "nutra"
                            ? "border-[#5C7457] bg-[#8FA88E]/10 dark:bg-[#8FA88E]/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-[#5C7457]/50"
                        }`}
                      >
                        <div className="text-3xl mb-2">💊</div>
                        <div className="font-bold">Nutra</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Suplementos, saúde
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#5C7457]" />
                      Região de Interesse
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {(["brasil", "latam", "eua", "europa"] as const).map((r) => (
                        <button
                          key={r}
                          type="button"
                          onClick={() => setRegion(r)}
                          className={`p-3 rounded-xl border-2 transition-all ${
                            region === r
                              ? "border-[#5C7457] bg-[#8FA88E]/10 dark:bg-[#8FA88E]/20"
                              : "border-gray-200 dark:border-gray-700 hover:border-[#5C7457]/50"
                          }`}
                        >
                          <div className="text-2xl mb-1">
                            {r === "brasil" ? "🇧🇷" : r === "latam" ? "🌎" : r === "eua" ? "🇺🇸" : "🇪🇺"}
                          </div>
                          <div className="font-bold text-sm">{r.toUpperCase()}</div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Error message */}
              {createOffer.isError && (
                <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-4 text-red-600 dark:text-red-400 text-sm animate-fade-in">
                  <div className="flex items-center gap-2">
                    <X className="w-5 h-5" />
                    <span className="font-semibold">Erro: {createOffer.error.message}</span>
                  </div>
                </div>
              )}

              {/* Navigation buttons */}
              <div className="flex gap-3 pt-4">
                {step > 1 && (
                  <Button type="button" onClick={handleBack} variant="outline" size="lg" className="w-32">
                    Voltar
                  </Button>
                )}
                {step < 3 ? (
                  <Button
                    type="button"
                    onClick={handleNext}
                    disabled={step === 1 && (!name || !url)}
                    size="lg"
                    className="flex-1"
                  >
                    Próximo
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={createOffer.isPending}
                    className="flex-1"
                    size="lg"
                  >
                    {createOffer.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Criando...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5 mr-2" />
                        Criar Oferta
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AddOfferForm
