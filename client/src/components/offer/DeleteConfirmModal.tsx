import { AlertTriangle, X } from "lucide-react"
import { Button } from "../ui/button"
import { Card } from "../ui/card"

interface DeleteConfirmModalProps {
  offerName: string
  isDeleting: boolean
  onConfirm: () => void
  onCancel: () => void
}

const DeleteConfirmModal = ({ offerName, isDeleting, onConfirm, onCancel }: DeleteConfirmModalProps) => {
  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in"
      onClick={onCancel}
    >
      <Card
        className="max-w-md w-full border-2 shadow-2xl overflow-hidden animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-red-600 to-red-700 p-6 text-white">
          <div className="absolute inset-0 bg-black/10" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-lg rounded-xl flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black">Confirmar Exclusão</h2>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onCancel}
              disabled={isDeleting}
              className="text-white hover:bg-white/20 rounded-full"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-700 dark:text-gray-300">
            Tem certeza que deseja remover a oferta{" "}
            <span className="font-bold text-[#8B2F52] dark:text-[#B85478]">"{offerName}"</span>?
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Esta ação não pode ser desfeita. Todos os dados históricos e snapshots desta oferta serão permanentemente
            removidos.
          </p>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              onClick={onCancel}
              disabled={isDeleting}
              variant="outline"
              size="lg"
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={onConfirm}
              disabled={isDeleting}
              variant="destructive"
              size="lg"
              className="flex-1"
            >
              {isDeleting ? "Removendo..." : "Sim, Remover"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default DeleteConfirmModal
