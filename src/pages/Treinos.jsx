import { useState } from 'react'
import { ChevronDown, ChevronRight, CheckCircle2, Circle, TrendingUp, Plus } from 'lucide-react'
import clsx from 'clsx'

const fichas = [
  {
    nome: 'Treino A – Peito e Tríceps',
    dia: 'Segunda / Quinta',
    cor: 'from-red-500 to-rose-600',
    exercicios: [
      { nome: 'Supino Reto', series: 4, reps: '8-12', carga: 60 },
      { nome: 'Supino Inclinado Halteres', series: 3, reps: '10-12', carga: 24 },
      { nome: 'Crucifixo Polia', series: 3, reps: '12-15', carga: 15 },
      { nome: 'Tríceps Corda', series: 4, reps: '12-15', carga: 30 },
      { nome: 'Tríceps Francês', series: 3, reps: '10-12', carga: 20 },
    ],
  },
  {
    nome: 'Treino B – Costas e Bíceps',
    dia: 'Terça / Sexta',
    cor: 'from-blue-500 to-indigo-600',
    exercicios: [
      { nome: 'Puxada Frontal', series: 4, reps: '8-12', carga: 55 },
      { nome: 'Remada Curvada', series: 4, reps: '8-10', carga: 50 },
      { nome: 'Remada Unilateral', series: 3, reps: '10-12', carga: 28 },
      { nome: 'Rosca Direta', series: 3, reps: '10-12', carga: 30 },
      { nome: 'Rosca Martelo', series: 3, reps: '12', carga: 14 },
    ],
  },
  {
    nome: 'Treino C – Pernas',
    dia: 'Quarta / Sábado',
    cor: 'from-emerald-500 to-teal-600',
    exercicios: [
      { nome: 'Agachamento Livre', series: 4, reps: '8-10', carga: 70 },
      { nome: 'Leg Press 45°', series: 4, reps: '12-15', carga: 150 },
      { nome: 'Cadeira Extensora', series: 3, reps: '12-15', carga: 50 },
      { nome: 'Mesa Flexora', series: 3, reps: '12', carga: 40 },
      { nome: 'Panturrilha em pé', series: 4, reps: '15-20', carga: 60 },
    ],
  },
]

function ExercicioRow({ ex }) {
  const [registros, setRegistros] = useState(
    Array.from({ length: ex.series }, () => ({ peso: ex.carga.toString(), reps: ex.reps.split('-')[0], done: false }))
  )

  const toggleSerie = (i) => {
    setRegistros(prev => prev.map((r, idx) => idx === i ? { ...r, done: !r.done } : r))
  }

  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-bold text-gray-700">{ex.nome}</p>
        <span className="badge badge-purple">{ex.series}x{ex.reps}</span>
      </div>
      <div className="space-y-1.5">
        {registros.map((r, i) => (
          <div key={i} className={clsx('flex items-center gap-2 p-2 rounded-xl transition-colors', r.done ? 'bg-emerald-50' : 'bg-gray-50')}>
            <span className="text-xs font-bold text-gray-400 w-6">S{i + 1}</span>
            <div className="flex items-center gap-1.5 flex-1">
              <input
                type="number"
                value={r.peso}
                onChange={(e) => setRegistros(prev => prev.map((x, idx) => idx === i ? { ...x, peso: e.target.value } : x))}
                className="w-16 text-center text-xs font-bold border border-gray-200 rounded-lg py-1 focus:outline-none focus:ring-1 focus:ring-brand-300 bg-white"
              />
              <span className="text-xs text-gray-400 font-semibold">kg</span>
              <span className="text-gray-300 mx-1">×</span>
              <input
                type="number"
                value={r.reps}
                onChange={(e) => setRegistros(prev => prev.map((x, idx) => idx === i ? { ...x, reps: e.target.value } : x))}
                className="w-14 text-center text-xs font-bold border border-gray-200 rounded-lg py-1 focus:outline-none focus:ring-1 focus:ring-brand-300 bg-white"
              />
              <span className="text-xs text-gray-400 font-semibold">reps</span>
            </div>
            <button onClick={() => toggleSerie(i)}>
              {r.done
                ? <CheckCircle2 size={20} className="text-emerald-500" />
                : <Circle size={20} className="text-gray-300" />
              }
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Treinos() {
  const [aberto, setAberto] = useState(null)

  const semana = { volume: '18.450 kg', treinos: 3, meta: 4 }

  return (
    <div className="page-container animate-fade-in-up">
      <h1 className="text-2xl font-black text-gray-800 mb-5">Treinos</h1>

      {/* Resumo da semana */}
      <div className="card mb-5 flex gap-4">
        <div className="flex-1 text-center">
          <p className="text-xs font-bold text-gray-400 mb-1">Volume semanal</p>
          <p className="text-xl font-black text-gray-800">{semana.volume}</p>
        </div>
        <div className="w-px bg-gray-100" />
        <div className="flex-1 text-center">
          <p className="text-xs font-bold text-gray-400 mb-1">Treinos</p>
          <p className="text-xl font-black text-gray-800">{semana.treinos}<span className="text-sm font-bold text-gray-400">/{semana.meta}</span></p>
        </div>
        <div className="w-px bg-gray-100" />
        <div className="flex-1 text-center">
          <p className="text-xs font-bold text-gray-400 mb-1">Dias</p>
          <div className="flex justify-center gap-0.5">
            {['S', 'T', 'Q', 'Q', 'S'].map((d, i) => (
              <div key={i} className={clsx('w-5 h-5 rounded-md flex items-center justify-center text-[9px] font-black', i < 3 ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-400')}>
                {d}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fichas de treino */}
      <div className="space-y-3">
        {fichas.map((ficha, i) => (
          <div key={i} className="card overflow-hidden">
            <button
              onClick={() => setAberto(aberto === i ? null : i)}
              className="w-full flex items-center gap-4 text-left"
            >
              <div className={`bg-gradient-to-br ${ficha.cor} w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0`}>
                <TrendingUp size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-sm">{ficha.nome}</p>
                <p className="text-xs text-gray-400 font-semibold">{ficha.dia} · {ficha.exercicios.length} exercícios</p>
              </div>
              {aberto === i
                ? <ChevronDown size={18} className="text-gray-400" />
                : <ChevronRight size={18} className="text-gray-400" />
              }
            </button>

            {aberto === i && (
              <div className="mt-4 pt-4 border-t border-gray-50">
                {ficha.exercicios.map((ex, j) => (
                  <ExercicioRow key={j} ex={ex} />
                ))}
                <button className="w-full btn-primary mt-4 flex items-center justify-center gap-2">
                  <CheckCircle2 size={18} /> Finalizar treino
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <button className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 font-bold text-sm hover:border-brand-300 hover:text-brand-500 transition-colors mt-3">
        <Plus size={18} /> Nova ficha de treino
      </button>
    </div>
  )
}
