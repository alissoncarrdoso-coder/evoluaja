import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, TrendingUp, CheckCircle2, Flame, Clock, ChevronRight, Zap } from 'lucide-react'

const CircularProgress = ({ pct, size = 88 }) => {
  const r = 36
  const circ = 2 * Math.PI * r
  const offset = circ - (pct / 100) * circ
  return (
    <svg width={size} height={size} viewBox="0 0 88 88" className="-rotate-90">
      <circle cx="44" cy="44" r={r} fill="none" stroke="#ede9fe" strokeWidth="8" />
      <circle
        cx="44" cy="44" r={r} fill="none"
        stroke="#7c3aed" strokeWidth="8"
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
      <text
        x="44" y="44" textAnchor="middle" dominantBaseline="central"
        className="rotate-90" fill="#4c1d95"
        style={{ fontSize: 15, fontWeight: 800, transform: 'rotate(90deg)', transformOrigin: '44px 44px', fontFamily: 'Nunito' }}
      >
        {pct}%
      </text>
    </svg>
  )
}

const cards = [
  {
    label: 'Saldo Atual',
    value: 'R$ 3.847,50',
    sub: '+R$ 420 este mês',
    bg: 'bg-emerald-500',
    icon: TrendingUp,
    path: '/financas',
  },
  {
    label: 'Hábitos Hoje',
    value: '5 / 8',
    sub: '3 restantes',
    bg: 'bg-brand-500',
    icon: CheckCircle2,
    path: '/habitos',
  },
  {
    label: 'Tarefas',
    value: '3 / 7',
    sub: '4 pendentes',
    bg: 'bg-sky-500',
    icon: Clock,
    path: '/rotina',
  },
]

const habitos = [
  { nome: 'Beber 2L de água', done: true },
  { nome: 'Alongamento matinal', done: true },
  { nome: 'Leitura 30min', done: false },
  { nome: 'Treino', done: true },
  { nome: 'Meditação', done: false },
]

const proximas = [
  { hora: '14:00', tarefa: 'Reunião de trabalho', cat: 'Trabalho', cor: 'bg-blue-100 text-blue-700' },
  { hora: '16:30', tarefa: 'Treino B – Costas', cat: 'Treino', cor: 'bg-red-100 text-red-700' },
  { hora: '19:00', tarefa: 'Estudar React', cat: 'Estudos', cor: 'bg-indigo-100 text-indigo-700' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [generating, setGenerating] = useState(false)

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => {
      setGenerating(false)
      navigate('/rotina')
    }, 1800)
  }

  const dayPct = Math.round((new Date().getHours() / 24) * 100)

  return (
    <div className="page-container animate-fade-in-up">
      {/* Greeting */}
      <div className="flex items-center justify-between mb-6 pt-2">
        <div>
          <p className="text-sm font-semibold text-gray-400">Bom dia! 👋</p>
          <h1 className="text-2xl font-black text-gray-800">Olá, Usuário</h1>
        </div>
        <div className="flex flex-col items-center gap-1">
          <CircularProgress pct={dayPct} />
          <span className="text-[10px] font-bold text-gray-400">do dia</span>
        </div>
      </div>

      {/* Streak */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-3xl p-4 mb-5 border border-orange-100">
        <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-2xl">
          🔥
        </div>
        <div>
          <p className="font-black text-gray-800 text-lg leading-none">7 dias seguidos!</p>
          <p className="text-sm text-orange-600 font-semibold mt-0.5">Seu foguinho está aceso. Continue assim!</p>
        </div>
        <Flame className="ml-auto text-orange-400" size={20} />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-3 mb-5">
        {cards.map((c) => {
          const Icon = c.icon
          return (
            <button
              key={c.label}
              onClick={() => navigate(c.path)}
              className="card flex items-center gap-4 hover:shadow-md transition-shadow text-left"
            >
              <div className={`${c.bg} w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0`}>
                <Icon size={22} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">{c.label}</p>
                <p className="text-xl font-black text-gray-800">{c.value}</p>
                <p className="text-xs font-semibold text-gray-400 mt-0.5">{c.sub}</p>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
          )
        })}
      </div>

      {/* AI Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={generating}
        className="w-full btn-primary flex items-center justify-center gap-3 py-4 mb-5 text-base"
      >
        {generating ? (
          <>
            <span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            Gerando sua rotina...
          </>
        ) : (
          <>
            <Sparkles size={20} />
            Gerar Rotina com IA
            <Zap size={16} className="opacity-70" />
          </>
        )}
      </button>

      {/* Hábitos do dia */}
      <div className="card mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title mb-0">Hábitos do dia</h2>
          <button onClick={() => navigate('/habitos')} className="btn-ghost py-1">Ver todos</button>
        </div>
        <div className="space-y-2">
          {habitos.map((h, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${h.done ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                {h.done
                  ? <CheckCircle2 size={16} className="text-emerald-500" />
                  : <div className="w-3 h-3 rounded-full border-2 border-gray-300" />
                }
              </div>
              <span className={`text-sm font-semibold ${h.done ? 'line-through text-gray-300' : 'text-gray-700'}`}>
                {h.nome}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 progress-bar">
          <div
            className="progress-fill bg-emerald-400"
            style={{ width: `${(habitos.filter(h => h.done).length / habitos.length) * 100}%` }}
          />
        </div>
        <p className="text-xs font-bold text-emerald-600 mt-2">
          {habitos.filter(h => h.done).length}/{habitos.length} concluídos
        </p>
      </div>

      {/* Próximas tarefas */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title mb-0">Próximas tarefas</h2>
          <button onClick={() => navigate('/rotina')} className="btn-ghost py-1">Ver rotina</button>
        </div>
        <div className="space-y-3">
          {proximas.map((t, i) => (
            <div key={i} className="flex items-center gap-3">
              <div className="text-center w-14 flex-shrink-0">
                <p className="text-xs font-black text-gray-500">{t.hora}</p>
              </div>
              <div className="w-px h-8 bg-gray-100" />
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-700">{t.tarefa}</p>
                <span className={`badge ${t.cor} mt-0.5`}>{t.cat}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
