import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sparkles, TrendingUp, CheckCircle2, Clock, ChevronRight, Zap } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useApp } from '../context/AppContext'
import StreakBanner from '../components/ui/StreakBanner'

// ── Helpers ──────────────────────────────────────────────────────
function getSaudacao() {
  const h = new Date().getHours()
  if (h < 12) return 'Bom dia! ☀️'
  if (h < 18) return 'Boa tarde! 🌤️'
  return 'Boa noite! 🌙'
}

function getDayPct() {
  const now = new Date()
  return Math.round(((now.getHours() * 60 + now.getMinutes()) / 1440) * 100)
}

function toKey(d) { return d.toISOString().split('T')[0] }
const hojeKey = toKey(new Date())

// ── Circular progress ────────────────────────────────────────────
function CircularProgress({ pct }) {
  const r = 36, circ = 2 * Math.PI * r, offset = circ - (pct / 100) * circ
  return (
    <svg width={88} height={88} viewBox="0 0 88 88" className="-rotate-90">
      <circle cx="44" cy="44" r={r} fill="none" strokeWidth="8" className="stroke-brand-100 dark:stroke-brand-950" />
      <circle cx="44" cy="44" r={r} fill="none" stroke="#7c3aed" strokeWidth="8"
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease' }} />
      <text x="44" y="44" textAnchor="middle" dominantBaseline="central" fill="#6d28d9"
        style={{ fontSize: 14, fontWeight: 800, transform: 'rotate(90deg)', transformOrigin: '44px 44px', fontFamily: 'Nunito' }}>
        {pct}%
      </text>
    </svg>
  )
}

const catColors = {
  'Trabalho':    'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
  'Treino':      'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
  'Estudos':     'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300',
  'Alimentação': 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300',
  'Saúde':       'bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300',
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [generating, setGenerating] = useState(false)
  const { perfil, streak, frase, animando, registrarUso } = useApp()

  // ── Estado dinâmico — atualiza a cada minuto ──────────────────
  const [saudacao, setSaudacao]   = useState(getSaudacao)
  const [dayPct, setDayPct]       = useState(getDayPct)
  const [horaAtual, setHoraAtual] = useState(() => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))

  useEffect(() => {
    const tick = () => {
      setSaudacao(getSaudacao())
      setDayPct(getDayPct())
      setHoraAtual(new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }))
    }
    // Alinha ao próximo minuto cheio
    const msAteProximoMinuto = (60 - new Date().getSeconds()) * 1000
    const timeout = setTimeout(() => {
      tick()
      const interval = setInterval(tick, 60_000)
      return () => clearInterval(interval)
    }, msAteProximoMinuto)
    return () => clearTimeout(timeout)
  }, [])

  // ── Dados dos módulos ─────────────────────────────────────────
  const [habDef]    = useLocalStorage('evoluaja_habitos_def', [])
  const [habReg]    = useLocalStorage('evoluaja_habitos_reg', {})
  const [transacoes]= useLocalStorage('evoluaja_transacoes', [])
  const [tarefasAll]= useLocalStorage('evoluaja_tarefas_v2', {})

  const tarefasHoje = tarefasAll[hojeKey] || []
  const regHoje     = habReg[hojeKey] || {}
  const habitosDone = habDef.filter(h => !!regHoje[h.id]).length
  const tarefasDone = tarefasHoje.filter(t => t.status === 'done').length
  const saldo       = transacoes.reduce((s, t) => s + t.valor, 0)
  const primeiroNome = (perfil.nome || 'Usuário').split(' ')[0]

  const dataStr = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', day: '2-digit', month: 'long'
  }).replace(/^\w/, c => c.toUpperCase())

  const cards = [
    {
      label: 'Saldo Atual',
      value: `R$ ${saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`,
      sub: saldo >= 0 ? 'saldo positivo' : 'saldo negativo',
      bg: saldo >= 0 ? 'bg-emerald-500' : 'bg-red-500',
      icon: TrendingUp, path: '/financas'
    },
    {
      label: 'Hábitos Hoje',
      value: habDef.length === 0 ? '—' : `${habitosDone} / ${habDef.length}`,
      sub: habDef.length === 0 ? 'nenhum hábito cadastrado' : `${habDef.length - habitosDone} restantes`,
      bg: 'bg-brand-500', icon: CheckCircle2, path: '/habitos'
    },
    {
      label: 'Tarefas Hoje',
      value: tarefasHoje.length === 0 ? '—' : `${tarefasDone} / ${tarefasHoje.length}`,
      sub: tarefasHoje.length === 0 ? 'sem tarefas hoje' : `${tarefasHoje.length - tarefasDone} pendentes`,
      bg: 'bg-sky-500', icon: Clock, path: '/rotina'
    },
  ]

  const handleGenerate = () => {
    registrarUso()
    setGenerating(true)
    setTimeout(() => { setGenerating(false); navigate('/rotina') }, 1800)
  }

  return (
    <div className="page-container animate-fade-in-up">

      {/* ── Saudação + progresso do dia ── */}
      <div className="flex items-center justify-between mb-5 pt-2">
        <div>
          <p className="text-sm font-semibold text-gray-400 dark:text-gray-500">{saudacao}</p>
          <h1 className="text-2xl font-black text-gray-800 dark:text-gray-100">
            Olá, {primeiroNome}!
          </h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 font-semibold mt-0.5">{dataStr}</p>
          <p className="text-xs text-gray-300 dark:text-gray-600 font-semibold">{horaAtual}</p>
        </div>
        <div className="flex flex-col items-center gap-1">
          <CircularProgress pct={dayPct} />
          <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">do dia</span>
        </div>
      </div>

      {/* ── Streak + frase motivacional ── */}
      <div className="mb-5">
        <StreakBanner streak={streak} frase={frase} animando={animando} />
      </div>

      {/* ── Cards ── */}
      <div className="grid grid-cols-1 gap-3 mb-5">
        {cards.map(c => {
          const Icon = c.icon
          return (
            <button key={c.label} onClick={() => navigate(c.path)}
              className="card flex items-center gap-4 hover:shadow-md transition-shadow text-left active:scale-[0.99]">
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

      {/* ── Botão IA ── */}
      <button onClick={handleGenerate} disabled={generating}
        className="w-full btn-primary flex items-center justify-center gap-3 py-4 mb-5 text-base">
        {generating
          ? <><span className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />Gerando sua rotina...</>
          : <><Sparkles size={20} />Gerar Rotina com IA<Zap size={16} className="opacity-70" /></>
        }
      </button>

      {/* ── Hábitos ── */}
      <div className="card mb-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title mb-0">Hábitos do dia</h2>
          <button onClick={() => navigate('/habitos')} className="btn-ghost py-1 text-xs">Ver todos</button>
        </div>
        {habDef.length === 0 ? (
          <p className="text-sm text-gray-300 dark:text-gray-600 font-semibold text-center py-3">
            Nenhum hábito cadastrado ainda
          </p>
        ) : (
          <>
            <div className="space-y-2">
              {habDef.slice(0, 5).map(h => {
                const done = !!regHoje[h.id]
                return (
                  <div key={h.id} className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${done ? 'bg-emerald-100 dark:bg-emerald-900' : 'bg-gray-100 dark:bg-gray-800'}`}>
                      {done
                        ? <CheckCircle2 size={16} className="text-emerald-500" />
                        : <div className="w-3 h-3 rounded-full border-2 border-gray-300 dark:border-gray-600" />}
                    </div>
                    <span className="text-sm flex-shrink-0">{h.emoji}</span>
                    <span className={`text-sm font-semibold truncate ${done ? 'line-through text-gray-300 dark:text-gray-600' : 'text-gray-700 dark:text-gray-300'}`}>
                      {h.nome}
                    </span>
                  </div>
                )
              })}
            </div>
            <div className="mt-4 progress-bar">
              <div className="progress-fill bg-emerald-400"
                style={{ width: `${habDef.length ? (habitosDone / habDef.length) * 100 : 0}%` }} />
            </div>
            <p className="text-xs font-bold text-emerald-600 mt-2">{habitosDone}/{habDef.length} concluídos hoje</p>
          </>
        )}
      </div>

      {/* ── Tarefas ── */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="section-title mb-0">Tarefas de hoje</h2>
          <button onClick={() => navigate('/rotina')} className="btn-ghost py-1 text-xs">Ver rotina</button>
        </div>
        {tarefasHoje.filter(t => t.status !== 'done').length === 0 ? (
          <p className="text-sm text-gray-300 dark:text-gray-600 font-semibold text-center py-3">
            {tarefasHoje.length === 0 ? 'Nenhuma tarefa para hoje' : '✅ Todas as tarefas concluídas!'}
          </p>
        ) : (
          <div className="space-y-3">
            {tarefasHoje.filter(t => t.status !== 'done').slice(0, 3).map(t => (
              <div key={t.id} className="flex items-center gap-3">
                <p className="text-xs font-black text-gray-500 dark:text-gray-400 w-14 flex-shrink-0">{t.hora}</p>
                <div className="w-px h-8 bg-gray-100 dark:bg-gray-800" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-700 dark:text-gray-300 truncate">{t.titulo}</p>
                  <span className={`badge mt-0.5 inline-block ${catColors[t.cat] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
                    {t.cat}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}
