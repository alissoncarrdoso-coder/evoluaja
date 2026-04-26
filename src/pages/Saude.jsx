import { useState } from 'react'
import { Heart, Pill, Calendar, Plus, Clock, CheckCircle2, Circle } from 'lucide-react'
import clsx from 'clsx'

const consultas = [
  { medico: 'Dr. Carlos Silva', especialidade: 'Clínico Geral', data: '28/07/2025', hora: '09:00', status: 'agendada' },
  { medico: 'Dra. Ana Souza', especialidade: 'Dermatologista', data: '15/08/2025', hora: '14:30', status: 'agendada' },
  { medico: 'Dr. Pedro Lima', especialidade: 'Ortopedista', data: '10/06/2025', hora: '11:00', status: 'concluída' },
]

const medicamentos = [
  { nome: 'Vitamina D 2000UI', dose: '1 cápsula', horarios: ['08:00'], estoque: 24, done: true },
  { nome: 'Ômega 3', dose: '2 cápsulas', horarios: ['13:00'], estoque: 45, done: false },
  { nome: 'Creatina 5g', dose: '1 colher', horarios: ['pre-treino'], estoque: 120, done: true },
  { nome: 'Whey Protein', dose: '30g', horarios: ['pos-treino'], estoque: 800, done: true },
]

const TABS = ['Consultas', 'Medicamentos']

export default function Saude() {
  const [tab, setTab] = useState(0)
  const [meds, setMeds] = useState(medicamentos)

  const toggleMed = (i) => setMeds(prev => prev.map((m, idx) => idx === i ? { ...m, done: !m.done } : m))

  return (
    <div className="page-container animate-fade-in-up">
      <h1 className="text-2xl font-black text-gray-800 mb-5">Saúde & Compromissos</h1>

      <div className="flex gap-1 bg-gray-100 rounded-2xl p-1 mb-5">
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${tab === i ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500'}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === 0 && (
        <div className="space-y-3">
          <button className="w-full btn-primary flex items-center justify-center gap-2 mb-2">
            <Plus size={18} /> Nova consulta
          </button>
          {consultas.map((c, i) => (
            <div key={i} className="card flex gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${c.status === 'concluída' ? 'bg-gray-100' : 'bg-pink-100'}`}>
                <Heart size={20} className={c.status === 'concluída' ? 'text-gray-400' : 'text-pink-500'} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-sm">{c.medico}</p>
                <p className="text-xs text-gray-400 font-semibold">{c.especialidade}</p>
                <div className="flex items-center gap-2 mt-1.5">
                  <Calendar size={12} className="text-gray-300" />
                  <span className="text-xs font-bold text-gray-500">{c.data} às {c.hora}</span>
                  <span className={`badge ${c.status === 'agendada' ? 'badge-purple' : 'badge-green'}`}>{c.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 1 && (
        <div className="space-y-3">
          <button className="w-full btn-primary flex items-center justify-center gap-2 mb-2">
            <Plus size={18} /> Adicionar medicamento
          </button>
          {meds.map((m, i) => (
            <button key={i} onClick={() => toggleMed(i)}
              className={clsx('w-full card flex items-center gap-4 text-left transition-all', m.done ? 'bg-emerald-50 border-emerald-100' : '')}>
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${m.done ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                <Pill size={20} className={m.done ? 'text-emerald-500' : 'text-gray-400'} />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-sm">{m.nome}</p>
                <p className="text-xs text-gray-400 font-semibold">{m.dose}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock size={11} className="text-gray-300" />
                  <span className="text-xs font-bold text-gray-400">{m.horarios.join(', ')}</span>
                  <span className="badge badge-blue">Estoque: {m.estoque}</span>
                </div>
              </div>
              {m.done ? <CheckCircle2 size={22} className="text-emerald-500 flex-shrink-0" /> : <Circle size={22} className="text-gray-300 flex-shrink-0" />}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
