import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, TrendingUp, CheckCircle2, Flame, Clock, ChevronRight, Zap } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'

const CircularProgress = ({ pct, size = 88 }) => {
  const r = 36, circ = 2 * Math.PI * r, offset = circ - (pct / 100) * circ
  return (
    <svg width={size} height={size} viewBox="0 0 88 88" className="-rotate-90">
      <circle cx="44" cy="44" r={r} fill="none" stroke="#ede9fe" strokeWidth="8" className="dark:stroke-brand-950" />
      <circle cx="44" cy="44" r={r} fill="none" stroke="#7c3aed" strokeWidth="8"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease' }} />
      <text x="44" y="44" textAnchor="middle" dominantBaseline="central" fill="#4c1d95"
        style={{ fontSize: 15, fontWeight: 800, transform: 'rotate(90deg)', transformOrigin: '44px 44px', fontFamily: 'Nunito' }}>
        {pct}%
      </text>
    </svg>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [generating, setGenerating] = useState(false)
  const [streak] = useLocalStorage('evoluaja_streak', 7)
  const [habitos] = useLocalStorage('evoluaja_habitos', [
    { id: 1, nome: 'Beber 2L de água', emoji: '💧', done: true },
    { id: 2, nome: 'Alongamento matinal', emoji: '🧘', done: true },
    { id: 3, nome: 'Leitura 30 min', emoji: '📚', done: false },
    { id: 4, nome: 'Treino', emoji: '💪', done: true },
    { id: 5, nome: 'Meditação 10 min', emoji: '🧠', done: false },
  ])
  const [transacoes] = useLocalStorage('evoluaja_transacoes', [
    { id: 1, desc: 'Salário', valor: 4500, tipo: 'receita', data: '01/07', cat: 'Renda' },
    { id: 2, desc: 'Supermercado', valor: -320, tipo: 'despesa', data: '03/07', cat: 'Alimentação' },
    { id: 3, desc: 'Gym', valor: -89.90, tipo: 'despesa', data: '05/07', cat: 'Saúde' },
  ])
  const [tarefas] = useLocalStorage('evoluaja_tarefas', [
    { id: 1, hora: '14:00', titulo: 'Reunião de trabalho', cat: 'Trabalho', status: 'pending' },
    { id: 2, hora: '16:30', titulo: 'Treino B – Costas', cat: 'Treino', status: 'pending' },
    { id: 3, hora: '19:00', titulo: 'Estudar React', cat: 'Estudos', status: 'pending' },
  ])

  const saldo = transacoes.reduce((s, t) => s + t.valor, 0)
  const habitosDone = habitos.filter(h => h.done).length
  const tarefasDone = tarefas.filter(t => t.status === 'done').length
  const dayPct = Math.round((new Date().getHours() / 24) * 100)

  const cards = [
    { label: 'Saldo Atual', value: `R$ ${saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`, sub: 'atualizado', bg: 'bg-emerald-500', icon: TrendingUp, path: '/financas' },
    { label: 'Hábitos Hoje', value: `${habitosDone} / ${habitos.length}`, sub: `${habitos.length - habitosDone} restantes`, bg: 'bg-brand-500', icon: CheckCircle2, path: '/habitos' },
    { label: 'Tarefas', value: `${tarefasDone} / ${tarefas.length}`, sub: `${tarefas.length - tarefasDone} pendentes`, bg: 'bg-sky-500', icon: Clock, path: '/rotina' },
  ]

  const catColors = {
    'Trabalho': 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
    'Treino':   'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
    'Estudos':  'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300',
  }

  const handleGenerate = () => {
    setGenerating(true)
    setTimeout(() => { setGenerating(false); navigate('/rotina') }, 1800)
  }

  return (
    <div className="page-container animate-fade-in-up">
      {/* Greeting */}
      <div className="flex items-center justify-between mb-6 pt-2">
        <div>
          <p className="text-sm font-semibold text-gray-400 dark:text-gray-500">Bom dia! 👋</p>
          <h1 className="text-2xl font-black text-gray-800 dark:text-gray-100">Olá, Usuário</h1>
        </div>
        <div className="flex flex-col items-center gap-1">
          <CircularProgress pct={dayPct} />
          <span className="text-[10px] font-bold text-gray-400">do dia</span>
        </div>
      </div>

      {/* Streak */}
      <div className="flex items-center gap-3 bg-gradient-to-r from-orange-50 to-amber-50 dark:from-orange-950 dark:to-amber-950 rounded-3xl p-4 mb-5 border border-orange-100 dark:border-orange-900">
        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900 rounded-2xl flex items-center justify-center text-2xl">🔥</div>
        <div>
          <p className="font-black text-gray-800 dark:text-gray-100 text-lg leading-none">{streak} dias seguidos!</p>
          <p className="text-sm text-orange-600 dark:text-orange-400 font-semibold mt-0.5">Seu foguinho está aceso!</p>
        </div>
        <Flame className="ml-auto text-orange-400" size={20} />
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-3 mb-5">
        {cards.map(c => {
          const Icon = c.icon
          return (
            <button key={c.label} onClick={() => navigate(c.path)}
              className="card flex items-center gap-4 hover:shadow-md transition-shadow text-left">
              <div className={`${c.bg} w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0`}>
                <Icon size={22} className="text-white" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">{c.label}</p>
                <p className="text-xl font-black text-gray-800 dark:text-gray-100">{c.value}</p>
                <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 mt-0.5">{c.sub}</p>
              </div>
              <ChevronRight size={18} className="text-gray-300 dark:text-gray-700" />
            </button>
          )
        })}
      </div>

      {/* AI Button */}
      <button onClick={handleGenerate} disabled={generating}
        className="w-full btn-primary flex items-center justify-center gap-3 py-4 mb-5 text-base">
        {generating
          ? <><span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />Gerando sua rotina...</>
          : <><Sparkles size={20} />Gerar Rotina com IA<Zap size={16} className="opacity-70" /></>
        }
      </button>

      {/* Hábitos */}
      <div className="card mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title mb-0">Hábitos do dia</h2>
          <button onClick={() => navigate('/habitos')} className="btn-ghost py-1 text-xs">Ver todos</button>
        </div>
        <div className="space-y-2">
          {habitos.slice(0, 5).map(h => (
            <div key={h.id} className="flex items-center gap-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${h.done ? 'bg-emerald-100 dark:bg-emerald-900' : 'bg-gray-100 dark:bg-gray-800'}`}>
                {h.done
                  ? <CheckCircle2 size={16} className="text-emerald-500" />
                  : <div className="w-3 h-3 rounded-full border-2 border-gray-300 dark:border-gray-600" />
                }
              </div>
              <span className="text-sm flex-shrink-0">{h.emoji}</span>
              <span className={`text-sm font-semibold ${h.done ? 'line-through text-gray-300 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300'}`}>{h.nome}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 progress-bar">
          <div className="progress-fill bg-emerald-400" style={{ width: `${habitos.length ? (habitosDone / habitos.length) * 100 : 0}%` }} />
        </div>
        <p className="text-xs font-bold text-emerald-600 mt-2">{habitosDone}/{habitos.length} concluídos</p>
      </div>

      {/* Próximas tarefas */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title mb-0">Próximas tarefas</h2>
          <button onClick={() => navigate('/rotina')} className="btn-ghost py-1 text-xs">Ver rotina</button>
        </div>
        <div className="space-y-3">
          {tarefas.filter(t => t.status !== 'done').slice(0, 3).map(t => (
            <div key={t.id} className="flex items-center gap-3">
              <div className="text-center w-14 flex-shrink-0">
                <p className="text-xs font-black text-gray-500 dark:text-gray-400">{t.hora}</p>
              </div>
              <div className="w-px h-8 bg-gray-100 dark:bg-gray-800" />
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{t.titulo}</p>
                <span className={`badge mt-0.5 inline-block ${catColors[t.cat] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>{t.cat}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
