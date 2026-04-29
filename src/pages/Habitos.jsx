import { useState, useEffect } from 'react'
import { CheckCircle2, Circle, Plus, Trash2, Edit2, X, Check } from 'lucide-react'
import clsx from 'clsx'
import { useLocalStorage } from '../hooks/useLocalStorage'

// Hábitos são globais (lista de hábitos do usuário)
// O status "done" é por data — hoje vs outros dias
const habitosDefault = [
  { id: 1, nome: 'Beber 2L de água', emoji: '💧' },
  { id: 2, nome: 'Alongamento matinal', emoji: '🧘' },
  { id: 3, nome: 'Leitura 30 min', emoji: '📚' },
  { id: 4, nome: 'Treino', emoji: '💪' },
  { id: 5, nome: 'Meditação 10 min', emoji: '🧠' },
  { id: 6, nome: 'Sem açúcar', emoji: '🚫' },
  { id: 7, nome: 'Dormir às 22h', emoji: '😴' },
  { id: 8, nome: 'Skin care noturno', emoji: '✨' },
]

const EMOJIS = ['💧','🧘','📚','💪','🧠','🚫','😴','✨','🏃','🥗','🎯','🔥','⚡','🌟','🎵','🌿','❤️','🍎','☀️','🧩']

function toKey(date) {
  return date.toISOString().split('T')[0]
}
const hojeKey = toKey(new Date())

function Modal({ titulo, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
      <div className="w-full bg-white dark:bg-gray-900 rounded-t-3xl p-5 max-w-md mx-auto max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between mb-5 flex-shrink-0">
          <h2 className="font-black text-gray-800 dark:text-gray-100 text-lg">{titulo}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 pb-2">
          {children}
        </div>
      </div>
    </div>
  )
}

export default function Habitos() {
  // Lista de hábitos (definição — iguais todos os dias)
  const [habitos, setHabitos] = useLocalStorage('evoluaja_habitos_def', habitosDefault)
  // Registro diário: { [dateKey]: { [habitoId]: boolean } }
  const [registros, setRegistros] = useLocalStorage('evoluaja_habitos_reg', {})

  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({ nome: '', emoji: '🎯' })

  // Status de hoje
  const regHoje = registros[hojeKey] || {}

  const isDone = (id) => !!regHoje[id]

  const toggle = (id) => {
    setRegistros(prev => ({
      ...prev,
      [hojeKey]: {
        ...(prev[hojeKey] || {}),
        [id]: !isDone(id)
      }
    }))
  }

  const excluir = (id) => setHabitos(prev => prev.filter(h => h.id !== id))

  const abrirNovo = () => { setForm({ nome: '', emoji: '🎯' }); setModal('novo') }
  const abrirEditar = (h) => { setForm({ nome: h.nome, emoji: h.emoji }); setModal(h.id) }

  const salvar = () => {
    if (!form.nome.trim()) return
    if (modal === 'novo') {
      setHabitos(prev => [...prev, { id: Date.now(), nome: form.nome, emoji: form.emoji }])
    } else {
      setHabitos(prev => prev.map(h => h.id === modal ? { ...h, ...form } : h))
    }
    setModal(null)
  }

  const done = habitos.filter(h => isDone(h.id)).length
  const pct = habitos.length ? Math.round((done / habitos.length) * 100) : 0

  // Streak: quantos dias consecutivos com pelo menos 1 hábito feito
  const streak = (() => {
    let s = 0
    const d = new Date()
    for (let i = 0; i < 365; i++) {
      const k = toKey(d)
      const reg = registros[k] || {}
      const temAlgum = Object.values(reg).some(v => v)
      if (temAlgum) { s++; d.setDate(d.getDate() - 1) }
      else if (i === 0) { d.setDate(d.getDate() - 1) } // hoje pode estar em andamento
      else break
    }
    return s
  })()

  return (
    <div className="page-container animate-fade-in-up">
      <h1 className="text-2xl font-black text-gray-800 dark:text-gray-100 mb-2">Meus Hábitos</h1>
      <p className="text-sm text-gray-400 font-semibold mb-5">
        Hoje · {new Date().toLocaleDateString('pt-BR')}
      </p>

      {/* Streak */}
      <div className="card mb-5 flex items-center gap-4">
        <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900 rounded-2xl flex items-center justify-center text-2xl">🔥</div>
        <div>
          <p className="text-sm font-bold text-gray-400">Sequência atual</p>
          <p className="text-3xl font-black text-orange-500">{streak} dia{streak !== 1 ? 's' : ''}</p>
        </div>
        <div className="ml-auto text-right">
          <p className="text-sm font-bold text-gray-400">Hoje</p>
          <p className="text-3xl font-black text-brand-600">{pct}%</p>
        </div>
      </div>

      {/* Barra de progresso */}
      <div className="mb-5">
        <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
          <span>{done} concluídos</span>
          <span>{habitos.length - done} restantes</span>
        </div>
        <div className="progress-bar h-3">
          <div className="progress-fill bg-gradient-to-r from-brand-400 to-brand-600" style={{ width: `${pct}%` }} />
        </div>
      </div>

      {/* Lista — mesmos hábitos todo dia */}
      <div className="space-y-2 mb-5">
        {habitos.map(h => (
          <div key={h.id}
            className={clsx('card flex items-center gap-3 py-3 transition-all',
              isDone(h.id) ? 'bg-emerald-50 dark:bg-emerald-950 border-emerald-100 dark:border-emerald-900' : ''
            )}>
            <button onClick={() => toggle(h.id)} className="flex-shrink-0">
              {isDone(h.id)
                ? <CheckCircle2 size={22} className="text-emerald-500" />
                : <Circle size={22} className="text-gray-300 dark:text-gray-600" />}
            </button>
            <span className="text-xl flex-shrink-0">{h.emoji}</span>
            <span className={clsx('flex-1 text-sm font-bold',
              isDone(h.id) ? 'line-through text-gray-400 dark:text-gray-600' : 'text-gray-800 dark:text-gray-100')}>
              {h.nome}
            </span>
            <button onClick={() => abrirEditar(h)} className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
              <Edit2 size={15} className="text-gray-400" />
            </button>
            <button onClick={() => excluir(h.id)} className="p-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950">
              <Trash2 size={15} className="text-red-400" />
            </button>
          </div>
        ))}
      </div>

      <button onClick={abrirNovo} className="w-full btn-primary flex items-center justify-center gap-2">
        <Plus size={18} /> Adicionar hábito
      </button>

      {modal && (
        <Modal titulo={modal === 'novo' ? 'Novo hábito' : 'Editar hábito'} onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Nome do hábito</label>
              <input
                type="text"
                value={form.nome}
                onChange={e => setForm(p => ({ ...p, nome: e.target.value }))}
                placeholder="Ex: Beber 2L de água"
                className="input"
                autoFocus
              />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Emoji</label>
              <div className="grid grid-cols-10 gap-2">
                {EMOJIS.map(em => (
                  <button key={em} onClick={() => setForm(p => ({ ...p, emoji: em }))}
                    className={clsx('text-xl w-9 h-9 rounded-xl flex items-center justify-center transition-all',
                      form.emoji === em ? 'bg-brand-100 dark:bg-brand-900 ring-2 ring-brand-500' : 'hover:bg-gray-100 dark:hover:bg-gray-800')}>
                    {em}
                  </button>
                ))}
              </div>
            </div>
            {/* Botão salvar sempre visível */}
            <div className="flex gap-2 pt-2">
              <button onClick={() => setModal(null)}
                className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-500">
                Cancelar
              </button>
              <button onClick={salvar}
                className="flex-1 btn-primary py-3 flex items-center justify-center gap-2">
                <Check size={16} /> Salvar
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
