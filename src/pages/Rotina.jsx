import { useState } from 'react'
import { CheckCircle2, Circle, Clock, ChevronLeft, ChevronRight, AlertCircle, Plus, Trash2, Edit2, X, Check } from 'lucide-react'
import clsx from 'clsx'
import { useLocalStorage } from '../hooks/useLocalStorage'

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
const hoje = new Date()
const diaHojeIdx = hoje.getDay()

const CATEGORIAS = ['Trabalho', 'Estudos', 'Treino', 'Alimentação', 'Saúde', 'Casa', 'Hábitos', 'Lazer', 'Outro']
const catColors = {
  'Trabalho': 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
  'Estudos': 'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300',
  'Treino': 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
  'Alimentação': 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300',
  'Saúde': 'bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300',
  'Casa': 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
  'Hábitos': 'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300',
  'Lazer': 'bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300',
  'Outro': 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
}

const tarefasDefault = [
  { id: 1, hora: '06:30', titulo: 'Acordar e alongamento', cat: 'Saúde', status: 'done' },
  { id: 2, hora: '07:00', titulo: 'Café da manhã', cat: 'Alimentação', status: 'done' },
  { id: 3, hora: '08:00', titulo: 'Trabalho – Relatório mensal', cat: 'Trabalho', status: 'done' },
  { id: 4, hora: '10:30', titulo: 'Reunião de equipe', cat: 'Trabalho', status: 'late' },
  { id: 5, hora: '12:00', titulo: 'Almoço', cat: 'Alimentação', status: 'pending' },
  { id: 6, hora: '14:00', titulo: 'Estudar React – Componentes', cat: 'Estudos', status: 'next' },
  { id: 7, hora: '16:30', titulo: 'Treino B – Costas e Bíceps', cat: 'Treino', status: 'pending' },
  { id: 8, hora: '19:00', titulo: 'Jantar', cat: 'Alimentação', status: 'pending' },
]

function Modal({ titulo, onClose, children }) {
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

export default function Rotina() {
  const [diaAtivo, setDiaAtivo] = useState(diaHojeIdx)
  const [tarefas, setTarefas] = useLocalStorage('evoluaja_tarefas', tarefasDefault)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ hora: '08:00', titulo: '', cat: 'Trabalho', status: 'pending' })

  const toggle = (id) => setTarefas(prev => prev.map(t => t.id === id ? { ...t, status: t.status === 'done' ? 'pending' : 'done' } : t))
  const excluir = (id) => setTarefas(prev => prev.filter(t => t.id !== id))

  const abrirNova = () => { setForm({ hora: '08:00', titulo: '', cat: 'Trabalho', status: 'pending' }); setModal('nova') }
  const abrirEditar = (t) => { setForm({ hora: t.hora, titulo: t.titulo, cat: t.cat, status: t.status }); setModal(t.id) }
  const salvar = () => {
    if (!form.titulo.trim()) return
    if (modal === 'nova') setTarefas(prev => [...prev, { ...form, id: Date.now() }].sort((a, b) => a.hora.localeCompare(b.hora)))
    else setTarefas(prev => prev.map(t => t.id === modal ? { ...t, ...form } : t))
    setModal(null)
  }

  const concluidas = tarefas.filter(t => t.status === 'done').length

  return (
    <div className="page-container animate-fade-in-up">
      <h1 className="text-2xl font-black text-gray-800 dark:text-gray-100 mb-5">Minha Rotina</h1>

      <div className="card mb-5">
        <div className="flex items-center justify-between mb-3">
          <button className="p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"><ChevronLeft size={18} className="text-gray-400" /></button>
          <p className="font-bold text-gray-700 dark:text-gray-300 text-sm">{hoje.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</p>
          <button className="p-1 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"><ChevronRight size={18} className="text-gray-400" /></button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {diasSemana.map((d, i) => {
            const isToday = i === diaHojeIdx, isActive = i === diaAtivo
            return (
              <button key={d} onClick={() => setDiaAtivo(i)}
                className={clsx('flex flex-col items-center py-2 rounded-2xl transition-all', isActive && !isToday ? 'bg-gray-100 dark:bg-gray-800' : '', isToday ? 'bg-brand-500' : '')}>
                <span className={clsx('text-[10px] font-bold mb-1', isToday ? 'text-brand-200' : 'text-gray-400 dark:text-gray-500')}>{d}</span>
                <span className={clsx('text-sm font-black', isToday ? 'text-white' : 'text-gray-700 dark:text-gray-300')}>{hoje.getDate() - diaHojeIdx + i}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="flex-1 progress-bar">
          <div className="progress-fill bg-brand-500" style={{ width: `${tarefas.length ? (concluidas / tarefas.length) * 100 : 0}%` }} />
        </div>
        <span className="text-sm font-bold text-gray-500 dark:text-gray-400">{concluidas}/{tarefas.length}</span>
      </div>

      <div className="space-y-2 mb-4">
        {tarefas.map(t => (
          <div key={t.id} className={clsx('card flex items-center gap-3 py-3 transition-all', t.status === 'done' ? 'opacity-60' : '')}>
            <button onClick={() => toggle(t.id)} className="flex-shrink-0">
              {t.status === 'done' ? <CheckCircle2 size={22} className="text-emerald-500" />
                : t.status === 'late' ? <AlertCircle size={22} className="text-red-400" />
                : t.status === 'next' ? <Clock size={22} className="text-brand-500 animate-pulse" />
                : <Circle size={22} className="text-gray-300 dark:text-gray-600" />}
            </button>
            <div className="flex-1 min-w-0">
              <p className={clsx('text-sm font-bold truncate', t.status === 'done' ? 'line-through text-gray-400 dark:text-gray-600' : 'text-gray-800 dark:text-gray-100')}>{t.titulo}</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-semibold text-gray-400">{t.hora}</span>
                <span className={`badge ${catColors[t.cat] || 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>{t.cat}</span>
                {t.status === 'late' && <span className="badge badge-red">Atrasada</span>}
                {t.status === 'next' && <span className="badge badge-purple">Próxima</span>}
              </div>
            </div>
            <button onClick={() => abrirEditar(t)} className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"><Edit2 size={15} className="text-gray-400" /></button>
            <button onClick={() => excluir(t.id)} className="p-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950"><Trash2 size={15} className="text-red-400" /></button>
          </div>
        ))}
      </div>

      <button onClick={abrirNova} className="w-full btn-primary flex items-center justify-center gap-2">
        <Plus size={18} /> Nova tarefa
      </button>

      {modal && (
        <Modal titulo={modal === 'nova' ? 'Nova tarefa' : 'Editar tarefa'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Título</label>
              <input type="text" value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} placeholder="Nome da tarefa" className="input" autoFocus />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Horário</label>
                <input type="time" value={form.hora} onChange={e => setForm(p => ({ ...p, hora: e.target.value }))} className="input" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Status</label>
                <select value={form.status} onChange={e => setForm(p => ({ ...p, status: e.target.value }))} className="input">
                  <option value="pending">Pendente</option>
                  <option value="done">Concluída</option>
                  <option value="next">Próxima</option>
                  <option value="late">Atrasada</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Categoria</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIAS.map(c => (
                  <button key={c} onClick={() => setForm(p => ({ ...p, cat: c }))}
                    className={clsx('px-3 py-1.5 rounded-xl text-xs font-bold border transition-all', form.cat === c ? 'bg-brand-500 text-white border-brand-500' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700')}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setModal(null)} className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-500">Cancelar</button>
              <button onClick={salvar} className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"><Check size={16} /> Salvar</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
