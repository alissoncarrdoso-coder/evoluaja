import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, BookOpen, Plus, Trash2, Edit2, X, Check } from 'lucide-react'
import clsx from 'clsx'
import { useLocalStorage } from '../hooks/useLocalStorage'

const materiasDefault = [
  { id: 1, nome: 'React & TypeScript', prioridade: 'Alta', progresso: 65, cor: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950' },
  { id: 2, nome: 'Node.js Backend', prioridade: 'Alta', progresso: 40, cor: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950' },
  { id: 3, nome: 'Banco de Dados SQL', prioridade: 'Média', progresso: 80, cor: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950' },
  { id: 4, nome: 'Inglês Técnico', prioridade: 'Baixa', progresso: 30, cor: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950' },
]
const CORES_M = [
  { cor: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950' }, { cor: 'text-green-600', bg: 'bg-green-50 dark:bg-green-950' },
  { cor: 'text-amber-600', bg: 'bg-amber-50 dark:bg-amber-950' }, { cor: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-950' },
  { cor: 'text-red-600', bg: 'bg-red-50 dark:bg-red-950' }, { cor: 'text-pink-600', bg: 'bg-pink-50 dark:bg-pink-950' },
]

function ModalE({ titulo, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
      <div className="w-full bg-white dark:bg-gray-900 rounded-t-3xl p-5 max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-black text-gray-800 dark:text-gray-100 text-lg">{titulo}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"><X size={20} className="text-gray-400" /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function Estudos() {
  const [materias, setMaterias] = useLocalStorage('evoluaja_materias', materiasDefault)
  const [ciclos, setCiclos] = useLocalStorage('evoluaja_pomodoro_ciclos', 0)
  const [duracaoMin, setDuracaoMin] = useLocalStorage('evoluaja_pomodoro_dur', 25)
  const [segundos, setSegundos] = useState(duracaoMin * 60)
  const [rodando, setRodando] = useState(false)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ nome: '', prioridade: 'Média', progresso: 0, cor: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950' })
  const intervalo = useRef(null)

  useEffect(() => {
    if (rodando) {
      intervalo.current = setInterval(() => {
        setSegundos(s => {
          if (s <= 1) { clearInterval(intervalo.current); setRodando(false); setCiclos(c => c + 1); return duracaoMin * 60 }
          return s - 1
        })
      }, 1000)
    } else { clearInterval(intervalo.current) }
    return () => clearInterval(intervalo.current)
  }, [rodando, duracaoMin])

  const changeDur = (m) => { if (rodando) return; setDuracaoMin(m); setSegundos(m * 60) }
  const reset = () => { setRodando(false); setSegundos(duracaoMin * 60) }
  const mm = String(Math.floor(segundos / 60)).padStart(2, '0')
  const ss = String(segundos % 60).padStart(2, '0')
  const pct = ((duracaoMin * 60 - segundos) / (duracaoMin * 60)) * 100
  const circ = 2 * Math.PI * 52

  const abrirModal = (m = null) => { setForm(m ? { nome: m.nome, prioridade: m.prioridade, progresso: m.progresso, cor: m.cor, bg: m.bg } : { nome: '', prioridade: 'Média', progresso: 0, cor: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-950' }); setModal(m ? m.id : 'novo') }
  const salvar = () => {
    if (!form.nome) return
    if (modal === 'novo') setMaterias(p => [...p, { ...form, id: Date.now(), progresso: +form.progresso }])
    else setMaterias(p => p.map(m => m.id === modal ? { ...m, ...form, progresso: +form.progresso } : m))
    setModal(null)
  }
  const chip = (ativo) => clsx('px-3 py-1.5 rounded-xl text-xs font-bold border transition-all', ativo ? 'bg-brand-500 text-white border-brand-500' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700')

  return (
    <div className="page-container animate-fade-in-up">
      <h1 className="text-2xl font-black text-gray-800 dark:text-gray-100 mb-5">Estudos</h1>

      <div className="card mb-5 flex flex-col items-center py-6">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Timer Pomodoro</p>
        <div className="flex gap-2 mb-5">
          {[15, 25, 45, 60].map(m => <button key={m} onClick={() => changeDur(m)} className={chip(duracaoMin === m)}>{m}min</button>)}
        </div>
        <div className="relative w-36 h-36 mb-4">
          <svg viewBox="0 0 120 120" className="-rotate-90 w-full h-full">
            <circle cx="60" cy="60" r="52" fill="none" stroke="#ede9fe" strokeWidth="8" className="dark:stroke-brand-950" />
            <circle cx="60" cy="60" r="52" fill="none" stroke="#7c3aed" strokeWidth="8"
              strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ} strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-gray-800 dark:text-gray-100">{mm}:{ss}</span>
            <span className="text-[10px] font-bold text-gray-400 mt-0.5">{rodando ? 'Focando...' : 'Pausado'}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={reset} className="p-3 rounded-2xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"><RotateCcw size={18} className="text-gray-500 dark:text-gray-400" /></button>
          <button onClick={() => setRodando(r => !r)} className="px-8 py-3 bg-brand-500 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-brand-600 shadow-md shadow-brand-200">
            {rodando ? <Pause size={18} /> : <Play size={18} />}{rodando ? 'Pausar' : 'Iniciar'}
          </button>
        </div>
        {ciclos > 0 && <p className="text-xs font-bold text-brand-600 mt-3">🎯 {ciclos} ciclo{ciclos > 1 ? 's' : ''} hoje!</p>}
      </div>

      <div className="flex items-center justify-between mb-3">
        <h2 className="section-title mb-0">Matérias</h2>
        <button onClick={() => abrirModal()} className="btn-ghost py-1 flex items-center gap-1 text-xs"><Plus size={14} /> Adicionar</button>
      </div>

      <div className="space-y-3">
        {materias.map(m => (
          <div key={m.id} className="card">
            <div className="flex items-center gap-3 mb-3">
              <div className={`${m.bg} p-2.5 rounded-xl`}><BookOpen size={18} className={m.cor} /></div>
              <div className="flex-1">
                <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">{m.nome}</p>
                <span className={clsx('badge', m.prioridade === 'Alta' ? 'badge-red' : m.prioridade === 'Média' ? 'badge-orange' : 'badge-blue')}>{m.prioridade} prioridade</span>
              </div>
              <span className="text-lg font-black text-gray-700 dark:text-gray-300">{m.progresso}%</span>
              <button onClick={() => abrirModal(m)} className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"><Edit2 size={14} className="text-gray-400" /></button>
              <button onClick={() => setMaterias(p => p.filter(x => x.id !== m.id))} className="p-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950"><Trash2 size={14} className="text-red-400" /></button>
            </div>
            <div className="progress-bar"><div className="progress-fill bg-brand-500" style={{ width: `${m.progresso}%` }} /></div>
          </div>
        ))}
      </div>

      {modal && (
        <ModalE titulo={modal === 'novo' ? 'Nova matéria' : 'Editar matéria'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Nome</label><input type="text" value={form.nome} onChange={e => setForm(p => ({ ...p, nome: e.target.value }))} placeholder="Ex: React & TypeScript" className="input" autoFocus /></div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Prioridade</label>
              <div className="flex gap-2">{['Alta', 'Média', 'Baixa'].map(pr => <button key={pr} onClick={() => setForm(p => ({ ...p, prioridade: pr }))} className={clsx('flex-1 py-2.5 rounded-xl text-sm font-bold border transition-all', form.prioridade === pr ? 'bg-brand-500 text-white border-brand-500' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700')}>{pr}</button>)}</div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Progresso: {form.progresso}%</label>
              <input type="range" min="0" max="100" value={form.progresso} onChange={e => setForm(p => ({ ...p, progresso: +e.target.value }))} className="w-full accent-brand-500" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Cor</label>
              <div className="flex gap-2 flex-wrap">{CORES_M.map((c, i) => <button key={i} onClick={() => setForm(p => ({ ...p, cor: c.cor, bg: c.bg }))} className={clsx('w-9 h-9 rounded-xl', c.bg, form.cor === c.cor ? 'ring-2 ring-offset-1 ring-gray-400' : '')}><BookOpen size={16} className={clsx('mx-auto', c.cor)} /></button>)}</div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-500">Cancelar</button>
              <button onClick={salvar} className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"><Check size={16} /> Salvar</button>
            </div>
          </div>
        </ModalE>
      )}
    </div>
  )
}
