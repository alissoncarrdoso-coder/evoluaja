import { useState } from 'react'
import { CheckCircle2, Circle, Plus, Flame } from 'lucide-react'
import clsx from 'clsx'

const habitos_iniciais = [
  { id: 1, nome: 'Beber 2L de água', emoji: '💧', done: true },
  { id: 2, nome: 'Alongamento matinal', emoji: '🧘', done: true },
  { id: 3, nome: 'Leitura 30 min', emoji: '📚', done: false },
  { id: 4, nome: 'Treino', emoji: '💪', done: true },
  { id: 5, nome: 'Meditação 10 min', emoji: '🧠', done: false },
  { id: 6, nome: 'Sem açúcar', emoji: '🚫', done: false },
  { id: 7, nome: 'Dormir às 22h', emoji: '😴', done: false },
  { id: 8, nome: 'Skin care noturno', emoji: '✨', done: true },
]

export default function Habitos() {
  const [habitos, setHabitos] = useState(habitos_iniciais)

  const toggle = (id) => {
    setHabitos(prev => prev.map(h => h.id === id ? { ...h, done: !h.done } : h))
  }

  const done = habitos.filter(h => h.done).length
  const pct = Math.round((done / habitos.length) * 100)

  return (
    <div className="page-container animate-fade-in-up">
      <h1 className="text-2xl font-black text-gray-800 mb-2">Meus Hábitos</h1>
      <p className="text-sm text-gray-400 font-semibold mb-5">Hoje · {new Date().toLocaleDateString('pt-BR')}</p>

      {/* Resumo streak */}
      <div className="card mb-5 flex items-center gap-4">
        <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl">🔥</div>
        <div>
          <p className="text-sm font-bold text-gray-400">Sequência atual</p>
          <p className="text-3xl font-black text-orange-500">7 dias</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-sm font-bold text-gray-400">Hoje</p>
          <p className="text-3xl font-black text-brand-600">{pct}%</p>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="mb-6">
        <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
          <span>{done} concluídos</span>
          <span>{habitos.length - done} restantes</span>
        </div>
        <div className="progress-bar h-3">
          <div
            className="progress-fill bg-gradient-to-r from-brand-400 to-brand-600"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Lista */}
      <div className="space-y-2 mb-6">
        {habitos.map((h) => (
          <button
            key={h.id}
            onClick={() => toggle(h.id)}
            className={clsx(
              'w-full card flex items-center gap-4 text-left transition-all py-4',
              h.done ? 'bg-emerald-50 border-emerald-100' : ''
            )}
          >
            <span className="text-2xl">{h.emoji}</span>
            <span className={clsx('flex-1 text-sm font-bold', h.done ? 'line-through text-gray-400' : 'text-gray-800')}>
              {h.nome}
            </span>
            {h.done
              ? <CheckCircle2 size={22} className="text-emerald-500 flex-shrink-0" />
              : <Circle size={22} className="text-gray-300 flex-shrink-0" />
            }
          </button>
        ))}
      </div>

      <button className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 font-bold text-sm hover:border-brand-300 hover:text-brand-500 transition-colors">
        <Plus size={18} />
        Adicionar hábito
      </button>
    </div>
  )
}
