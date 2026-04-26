import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, BookOpen, Plus } from 'lucide-react'
import clsx from 'clsx'

const materias = [
  { nome: 'React & TypeScript', prioridade: 'Alta', progresso: 65, cor: 'text-blue-600', bg: 'bg-blue-50' },
  { nome: 'Node.js Backend', prioridade: 'Alta', progresso: 40, cor: 'text-green-600', bg: 'bg-green-50' },
  { nome: 'Banco de Dados SQL', prioridade: 'Média', progresso: 80, cor: 'text-amber-600', bg: 'bg-amber-50' },
  { nome: 'Inglês Técnico', prioridade: 'Baixa', progresso: 30, cor: 'text-purple-600', bg: 'bg-purple-50' },
]

const POMODORO = 25 * 60

export default function Estudos() {
  const [segundos, setSegundos] = useState(POMODORO)
  const [rodando, setRodando] = useState(false)
  const [ciclos, setCiclos] = useState(0)
  const intervalo = useRef(null)

  useEffect(() => {
    if (rodando) {
      intervalo.current = setInterval(() => {
        setSegundos(s => {
          if (s <= 1) {
            clearInterval(intervalo.current)
            setRodando(false)
            setCiclos(c => c + 1)
            return POMODORO
          }
          return s - 1
        })
      }, 1000)
    } else {
      clearInterval(intervalo.current)
    }
    return () => clearInterval(intervalo.current)
  }, [rodando])

  const reset = () => { setRodando(false); setSegundos(POMODORO) }
  const min = String(Math.floor(segundos / 60)).padStart(2, '0')
  const sec = String(segundos % 60).padStart(2, '0')
  const pct = ((POMODORO - segundos) / POMODORO) * 100
  const circ = 2 * Math.PI * 52

  return (
    <div className="page-container animate-fade-in-up">
      <h1 className="text-2xl font-black text-gray-800 mb-5">Estudos</h1>

      {/* Pomodoro */}
      <div className="card mb-5 flex flex-col items-center py-6">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Timer Pomodoro</p>
        <div className="relative w-36 h-36 mb-4">
          <svg viewBox="0 0 120 120" className="-rotate-90 w-full h-full">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#ede9fe" strokeWidth="8" />
            <circle cx="60" cy="60" r="52" fill="none" stroke="#7c3aed" strokeWidth="8"
              strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ}
              strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-gray-800">{min}:{sec}</span>
            <span className="text-[10px] font-bold text-gray-400 mt-0.5">
              {rodando ? 'Focando...' : 'Pausado'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={reset} className="p-3 rounded-2xl bg-gray-100 hover:bg-gray-200 transition-colors">
            <RotateCcw size={18} className="text-gray-500" />
          </button>
          <button
            onClick={() => setRodando(r => !r)}
            className="px-8 py-3 bg-brand-500 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-brand-600 transition-colors shadow-md shadow-brand-200"
          >
            {rodando ? <Pause size={18} /> : <Play size={18} />}
            {rodando ? 'Pausar' : 'Iniciar'}
          </button>
        </div>
        {ciclos > 0 && (
          <p className="text-xs font-bold text-brand-600 mt-3">🎯 {ciclos} ciclo{ciclos > 1 ? 's' : ''} concluído{ciclos > 1 ? 's' : ''} hoje!</p>
        )}
      </div>

      {/* Matérias */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="section-title mb-0">Matérias</h2>
        <button className="btn-ghost py-1 flex items-center gap-1"><Plus size={14} /> Adicionar</button>
      </div>

      <div className="space-y-3">
        {materias.map((m, i) => (
          <div key={i} className="card">
            <div className="flex items-center gap-3 mb-3">
              <div className={`${m.bg} p-2.5 rounded-xl`}>
                <BookOpen size={18} className={m.cor} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-sm">{m.nome}</p>
                <span className={clsx('badge', m.prioridade === 'Alta' ? 'badge-red' : m.prioridade === 'Média' ? 'badge-orange' : 'badge-blue')}>
                  {m.prioridade} prioridade
                </span>
              </div>
              <span className="text-lg font-black text-gray-700">{m.progresso}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill bg-brand-500" style={{ width: `${m.progresso}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
