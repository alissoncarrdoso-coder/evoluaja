import { useState } from 'react'
import { Plus, Droplets, ChevronDown, ChevronRight, Search } from 'lucide-react'
import clsx from 'clsx'

const metas = { cal: 2400, prot: 160, carb: 280, gord: 70 }
const consumo = { cal: 1620, prot: 98, carb: 190, gord: 48 }

const refeicoes = [
  {
    nome: 'Café da Manhã',
    emoji: '🌅',
    hora: '07:00',
    calorias: 420,
    alimentos: [
      { nome: 'Aveia com banana', cals: 280, prot: 8, carb: 52, gord: 5 },
      { nome: 'Ovo mexido (2 ovos)', cals: 140, prot: 12, carb: 1, gord: 10 },
    ],
  },
  {
    nome: 'Almoço',
    emoji: '☀️',
    hora: '12:30',
    calorias: 680,
    alimentos: [
      { nome: 'Frango grelhado 150g', cals: 250, prot: 42, carb: 0, gord: 8 },
      { nome: 'Arroz integral 100g', cals: 130, prot: 3, carb: 28, gord: 1 },
      { nome: 'Brócolis refogado', cals: 60, prot: 4, carb: 10, gord: 2 },
      { nome: 'Feijão 80g', cals: 120, prot: 8, carb: 20, gord: 1 },
      { nome: 'Salada', cals: 40, prot: 2, carb: 7, gord: 0 },
      { nome: 'Azeite 10ml', cals: 80, prot: 0, carb: 0, gord: 9 },
    ],
  },
  {
    nome: 'Lanche da Tarde',
    emoji: '🍎',
    hora: '16:00',
    calorias: 230,
    alimentos: [
      { nome: 'Whey protein', cals: 130, prot: 25, carb: 5, gord: 2 },
      { nome: 'Banana média', cals: 100, prot: 1, carb: 25, gord: 0 },
    ],
  },
  {
    nome: 'Jantar',
    emoji: '🌙',
    hora: '19:30',
    calorias: 0,
    alimentos: [],
  },
]

const MacroBar = ({ label, atual, meta, cor, unit = 'g' }) => {
  const pct = Math.min((atual / meta) * 100, 100)
  return (
    <div className="flex-1">
      <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
        <span>{label}</span>
        <span>{atual}{unit}</span>
      </div>
      <div className="progress-bar h-2">
        <div className={`progress-fill ${cor}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[10px] font-bold text-gray-300 mt-0.5">/{meta}{unit}</p>
    </div>
  )
}

export default function Alimentacao() {
  const [abertas, setAbertas] = useState({ 0: true, 1: true, 2: true })
  const [agua, setAgua] = useState(6) // copos de 250ml

  const toggle = (i) => setAbertas(prev => ({ ...prev, [i]: !prev[i] }))

  const calPct = Math.min((consumo.cal / metas.cal) * 100, 100)

  return (
    <div className="page-container animate-fade-in-up">
      <h1 className="text-2xl font-black text-gray-800 mb-5">Alimentação</h1>

      {/* Painel de macros */}
      <div className="card mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Calorias hoje</p>
            <p className="text-3xl font-black text-gray-800">{consumo.cal} <span className="text-base font-bold text-gray-400">/ {metas.cal} kcal</span></p>
          </div>
          <div className="relative w-16 h-16">
            <svg viewBox="0 0 64 64" className="-rotate-90 w-full h-full">
              <circle cx="32" cy="32" r="28" fill="none" stroke="#ede9fe" strokeWidth="6" />
              <circle cx="32" cy="32" r="28" fill="none" stroke="#7c3aed" strokeWidth="6"
                strokeDasharray={2 * Math.PI * 28} strokeDashoffset={2 * Math.PI * 28 * (1 - calPct / 100)}
                strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-brand-700">
              {Math.round(calPct)}%
            </span>
          </div>
        </div>

        <div className="flex gap-3">
          <MacroBar label="Proteínas" atual={consumo.prot} meta={metas.prot} cor="bg-red-400" />
          <MacroBar label="Carboidratos" atual={consumo.carb} meta={metas.carb} cor="bg-amber-400" />
          <MacroBar label="Gorduras" atual={consumo.gord} meta={metas.gord} cor="bg-blue-400" />
        </div>
      </div>

      {/* Hidratação */}
      <div className="card mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Droplets size={20} className="text-blue-500" />
            <span className="font-bold text-gray-700">Hidratação</span>
          </div>
          <span className="font-black text-blue-600">{agua * 250}ml / 2000ml</span>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <button
              key={i}
              onClick={() => setAgua(prev => i < prev ? i : i + 1)}
              className={clsx(
                'flex-1 h-8 rounded-xl transition-all',
                i < agua ? 'bg-blue-400' : 'bg-gray-100'
              )}
            />
          ))}
        </div>
        <p className="text-xs font-bold text-gray-400 mt-2">{agua} copos de 250ml</p>
      </div>

      {/* Refeições */}
      <div className="space-y-3">
        {refeicoes.map((r, i) => (
          <div key={i} className="card">
            <button
              onClick={() => toggle(i)}
              className="w-full flex items-center gap-3 text-left"
            >
              <span className="text-xl">{r.emoji}</span>
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-sm">{r.nome}</p>
                <p className="text-xs text-gray-400 font-semibold">{r.hora} · {r.calorias} kcal</p>
              </div>
              {abertas[i] ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
            </button>

            {abertas[i] && (
              <div className="mt-3 pt-3 border-t border-gray-50 space-y-2">
                {r.alimentos.length === 0 ? (
                  <p className="text-sm text-gray-300 font-semibold text-center py-2">Nenhum alimento registrado</p>
                ) : r.alimentos.map((a, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-700">{a.nome}</p>
                      <p className="text-[10px] font-semibold text-gray-400">
                        {a.cals}kcal · P:{a.prot}g · C:{a.carb}g · G:{a.gord}g
                      </p>
                    </div>
                  </div>
                ))}
                <button className="w-full flex items-center gap-2 py-2 text-brand-500 font-bold text-xs hover:text-brand-600 transition-colors">
                  <Plus size={14} /> Adicionar alimento
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
