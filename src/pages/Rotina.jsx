import { useState } from 'react'
import { CheckCircle2, Circle, Clock, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react'
import clsx from 'clsx'

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const hoje = new Date()
const diaHojeIdx = hoje.getDay()

const tarefas = [
  { hora: '06:30', titulo: 'Acordar e alongamento', cat: 'Saúde', status: 'done' },
  { hora: '07:00', titulo: 'Café da manhã', cat: 'Alimentação', status: 'done' },
  { hora: '08:00', titulo: 'Trabalho – Relatório mensal', cat: 'Trabalho', status: 'done' },
  { hora: '10:30', titulo: 'Reunião de equipe', cat: 'Trabalho', status: 'late' },
  { hora: '12:00', titulo: 'Almoço', cat: 'Alimentação', status: 'pending' },
  { hora: '14:00', titulo: 'Estudar React – Componentes', cat: 'Estudos', status: 'next' },
  { hora: '16:30', titulo: 'Treino B – Costas e Bíceps', cat: 'Treino', status: 'pending' },
  { hora: '19:00', titulo: 'Jantar', cat: 'Alimentação', status: 'pending' },
  { hora: '21:00', titulo: 'Leitura 30 min', cat: 'Hábitos', status: 'pending' },
  { hora: '22:30', titulo: 'Dormir', cat: 'Saúde', status: 'pending' },
]

const catColors = {
  'Saúde':       'bg-pink-100 text-pink-700',
  'Alimentação': 'bg-orange-100 text-orange-700',
  'Trabalho':    'bg-blue-100 text-blue-700',
  'Estudos':     'bg-indigo-100 text-indigo-700',
  'Treino':      'bg-red-100 text-red-700',
  'Hábitos':     'bg-emerald-100 text-emerald-700',
}

export default function Rotina() {
  const [diaAtivo, setDiaAtivo] = useState(diaHojeIdx)
  const [tarefasState, setTarefasState] = useState(tarefas)

  const toggle = (i) => {
    setTarefasState(prev => prev.map((t, idx) =>
      idx === i ? { ...t, status: t.status === 'done' ? 'pending' : 'done' } : t
    ))
  }

  const concluidas = tarefasState.filter(t => t.status === 'done').length

  return (
    <div className="page-container animate-fade-in-up">
      <h1 className="text-2xl font-black text-gray-800 mb-5">Minha Rotina</h1>

      {/* Calendário semanal */}
      <div className="card mb-5">
        <div className="flex items-center justify-between mb-3">
          <button className="p-1 rounded-xl hover:bg-gray-100">
            <ChevronLeft size={18} className="text-gray-400" />
          </button>
          <p className="font-bold text-gray-700 text-sm">
            {hoje.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
          </p>
          <button className="p-1 rounded-xl hover:bg-gray-100">
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {diasSemana.map((d, i) => {
            const isToday = i === diaHojeIdx
            const isActive = i === diaAtivo
            return (
              <button
                key={d}
                onClick={() => setDiaAtivo(i)}
                className={clsx(
                  'flex flex-col items-center py-2 rounded-2xl transition-all',
                  isActive && !isToday ? 'bg-gray-100' : '',
                  isToday ? 'bg-brand-500' : ''
                )}
              >
                <span className={clsx('text-[10px] font-bold mb-1', isToday ? 'text-brand-200' : 'text-gray-400')}>
                  {d}
                </span>
                <span className={clsx('text-sm font-black', isToday ? 'text-white' : 'text-gray-700')}>
                  {hoje.getDate() - diaHojeIdx + i}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Progresso */}
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 progress-bar">
          <div
            className="progress-fill bg-brand-500"
            style={{ width: `${(concluidas / tarefasState.length) * 100}%` }}
          />
        </div>
        <span className="text-sm font-bold text-gray-500">{concluidas}/{tarefasState.length}</span>
      </div>

      {/* Lista de tarefas */}
      <div className="space-y-2">
        {tarefasState.map((t, i) => (
          <button
            key={i}
            onClick={() => toggle(i)}
            className={clsx(
              'w-full card text-left flex items-center gap-4 py-4 transition-all',
              t.status === 'done' ? 'opacity-60' : ''
            )}
          >
            <div className="flex-shrink-0">
              {t.status === 'done'
                ? <CheckCircle2 size={22} className="text-emerald-500" />
                : t.status === 'late'
                ? <AlertCircle size={22} className="text-red-400" />
                : t.status === 'next'
                ? <Clock size={22} className="text-brand-500 animate-pulse-soft" />
                : <Circle size={22} className="text-gray-300" />
              }
            </div>
            <div className="flex-1 min-w-0">
              <p className={clsx('text-sm font-bold truncate', t.status === 'done' ? 'line-through text-gray-400' : 'text-gray-800')}>
                {t.titulo}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-semibold text-gray-400">{t.hora}</span>
                <span className={`badge ${catColors[t.cat] || 'bg-gray-100 text-gray-600'}`}>{t.cat}</span>
                {t.status === 'late' && <span className="badge badge-red">Atrasada</span>}
                {t.status === 'next' && <span className="badge badge-purple">Próxima</span>}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
