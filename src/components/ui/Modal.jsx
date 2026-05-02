import { useEffect } from 'react'
import { X } from 'lucide-react'

/**
 * Modal universal do EvoluaJá
 * - Botões do rodapé SEMPRE visíveis (nunca escondidos pelo teclado ou conteúdo)
 * - Scroll apenas na área de conteúdo
 * - Fecha ao clicar no overlay
 */
export default function Modal({ titulo, onClose, onConfirm, confirmLabel = 'Salvar', children }) {
  // Bloqueia scroll do body enquanto o modal está aberto
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-t-3xl flex flex-col"
        style={{ maxHeight: '88vh' }}>

        {/* Header fixo */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 flex-shrink-0 border-b border-gray-100 dark:border-gray-800">
          <h2 className="font-black text-gray-800 dark:text-gray-100 text-lg">{titulo}</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        {/* Conteúdo com scroll */}
        <div className="flex-1 overflow-y-auto px-5 py-4 min-h-0">
          {children}
        </div>

        {/* Rodapé fixo — botões SEMPRE visíveis */}
        <div className="flex-shrink-0 px-5 pb-6 pt-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3.5 rounded-2xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          >
            Cancelar
          </button>
          {onConfirm && (
            <button
              onClick={onConfirm}
              className="flex-1 btn-primary py-3.5 flex items-center justify-center gap-2"
            >
              {confirmLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
