import { useState } from 'react'
import { CheckCircle2, Circle, Plus, ShoppingCart, Home, Trash2, Edit2, X, Check } from 'lucide-react'
import clsx from 'clsx'

const tarefasIniciais = {
  Diárias: [
    { id: 1, nome: 'Lavar louça', done: true },
    { id: 2, nome: 'Varrer o chão', done: true },
    { id: 3, nome: 'Tirar o lixo', done: false },
    { id: 4, nome: 'Arrumar a cama', done: true },
  ],
  Semanais: [
    { id: 5, nome: 'Limpar banheiro', done: false },
    { id: 6, nome: 'Aspirar o tapete', done: false },
    { id: 7, nome: 'Lavar roupas', done: true },
    { id: 8, nome: 'Limpar janelas', done: false },
  ],
}

const comprasIniciais = [
  { id: 1, nome: 'Frango (1kg)', cat: 'Supermercado', done: false, qtd: '1kg' },
  { id: 2, nome: 'Arroz integral', cat: 'Supermercado', done: false, qtd: '2 pct' },
  { id: 3, nome: 'Ovos (12 un)', cat: 'Supermercado', done: true, qtd: '1 cx' },
  { id: 4, nome: 'Protetor solar', cat: 'Farmácia', done: false, qtd: '1 un' },
  { id: 5, nome: 'Vitamina D', cat: 'Farmácia', done: false, qtd: '1 fr' },
]

const CATS_COMPRA = ['Supermercado', 'Farmácia', 'Padaria', 'Hortifruti', 'Limpeza', 'Outro']
const FREQUENCIAS = ['Diárias', 'Semanais']

function Modal({ titulo, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
      <div className="w-full bg-white rounded-t-3xl p-5 max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-black text-gray-800 text-lg">{titulo}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100"><X size={20} className="text-gray-400" /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

export default function Casa() {
  const [tab, setTab] = useState(0)
  const [tarefas, setTarefas] = useState(tarefasIniciais)
  const [compras, setCompras] = useState(comprasIniciais)
  const [modalTarefa, setModalTarefa] = useState(null) // null | { grupo, id|'novo' }
  const [modalCompra, setModalCompra] = useState(null)
  const [formTarefa, setFormTarefa] = useState({ nome: '', freq: 'Diárias' })
  const [formCompra, setFormCompra] = useState({ nome: '', cat: 'Supermercado', qtd: '' })

  const toggleTarefa = (grupo, id) => setTarefas(p => ({ ...p, [grupo]: p[grupo].map(t => t.id === id ? { ...t, done: !t.done } : t) }))
  const toggleCompra = (id) => setCompras(p => p.map(c => c.id === id ? { ...c, done: !c.done } : c))

  // Tarefas
  const abrirTarefa = (grupo, t = null) => { setFormTarefa(t ? { nome: t.nome, freq: grupo } : { nome: '', freq: grupo }); setModalTarefa({ grupo, id: t ? t.id : 'novo' }) }
  const salvarTarefa = () => {
    if (!formTarefa.nome) return
    const { grupo, id } = modalTarefa
    const freq = formTarefa.freq
    if (id === 'novo') {
      setTarefas(p => ({ ...p, [freq]: [...(p[freq] || []), { id: Date.now(), nome: formTarefa.nome, done: false }] }))
    } else {
      if (freq !== grupo) {
        // mover entre grupos
        const tarefa = tarefas[grupo].find(t => t.id === id)
        setTarefas(p => ({
          ...p,
          [grupo]: p[grupo].filter(t => t.id !== id),
          [freq]: [...p[freq], { ...tarefa, nome: formTarefa.nome }]
        }))
      } else {
        setTarefas(p => ({ ...p, [grupo]: p[grupo].map(t => t.id === id ? { ...t, nome: formTarefa.nome } : t) }))
      }
    }
    setModalTarefa(null)
  }
  const excluirTarefa = (grupo, id) => setTarefas(p => ({ ...p, [grupo]: p[grupo].filter(t => t.id !== id) }))

  // Compras
  const abrirCompra = (c = null) => { setFormCompra(c ? { nome: c.nome, cat: c.cat, qtd: c.qtd || '' } : { nome: '', cat: 'Supermercado', qtd: '' }); setModalCompra(c ? c.id : 'novo') }
  const salvarCompra = () => {
    if (!formCompra.nome) return
    if (modalCompra === 'novo') setCompras(p => [...p, { ...formCompra, id: Date.now(), done: false }])
    else setCompras(p => p.map(c => c.id === modalCompra ? { ...c, ...formCompra } : c))
    setModalCompra(null)
  }

  const cats = [...new Set(compras.map(c => c.cat))]
  const comprasConcluidas = compras.filter(c => c.done).length

  return (
    <div className="page-container animate-fade-in-up">
      <h1 className="text-2xl font-black text-gray-800 mb-5">Casa & Compras</h1>

      <div className="flex gap-1 bg-gray-100 rounded-2xl p-1 mb-5">
        {[{ label: 'Casa', icon: Home }, { label: 'Compras', icon: ShoppingCart }].map(({ label, icon: Icon }, i) => (
          <button key={label} onClick={() => setTab(i)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${tab === i ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500'}`}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* ABA CASA */}
      {tab === 0 && (
        <div className="space-y-5">
          {Object.entries(tarefas).map(([grupo, items]) => {
            const concluidas = items.filter(t => t.done).length
            return (
              <div key={grupo}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="section-title mb-0">{grupo}</h2>
                    <p className="text-xs text-gray-400 font-semibold">{concluidas}/{items.length} concluídas</p>
                  </div>
                  <button onClick={() => abrirTarefa(grupo)} className="btn-ghost py-1 text-xs flex items-center gap-1"><Plus size={13} /> Adicionar</button>
                </div>
                <div className="space-y-2">
                  {items.map(t => (
                    <div key={t.id} className={clsx('card flex items-center gap-3 py-3', t.done && 'bg-gray-50')}>
                      <button onClick={() => toggleTarefa(grupo, t.id)} className="flex-shrink-0">
                        {t.done ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Circle size={20} className="text-gray-300" />}
                      </button>
                      <span className={clsx('flex-1 text-sm font-semibold', t.done ? 'line-through text-gray-300' : 'text-gray-700')}>{t.nome}</span>
                      <button onClick={() => abrirTarefa(grupo, t)} className="p-1.5 rounded-xl hover:bg-gray-100"><Edit2 size={14} className="text-gray-400" /></button>
                      <button onClick={() => excluirTarefa(grupo, t.id)} className="p-1.5 rounded-xl hover:bg-red-50"><Trash2 size={14} className="text-red-400" /></button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ABA COMPRAS */}
      {tab === 1 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-gray-500">{comprasConcluidas}/{compras.length} itens comprados</p>
            <button onClick={() => abrirCompra()} className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5">
              <Plus size={14} /> Adicionar item
            </button>
          </div>
          <div className="progress-bar mb-5">
            <div className="progress-fill bg-emerald-400" style={{ width: `${compras.length ? (comprasConcluidas / compras.length) * 100 : 0}%` }} />
          </div>
          {cats.map(cat => (
            <div key={cat} className="mb-5">
              <h2 className="section-title">{cat}</h2>
              <div className="space-y-2">
                {compras.filter(c => c.cat === cat).map(c => (
                  <div key={c.id} className={clsx('card flex items-center gap-3 py-3', c.done && 'opacity-50')}>
                    <button onClick={() => toggleCompra(c.id)} className="flex-shrink-0">
                      {c.done ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Circle size={20} className="text-gray-300" />}
                    </button>
                    <div className="flex-1">
                      <span className={clsx('text-sm font-semibold', c.done ? 'line-through text-gray-400' : 'text-gray-700')}>{c.nome}</span>
                      {c.qtd && <span className="text-xs text-gray-400 font-semibold ml-2">({c.qtd})</span>}
                    </div>
                    <button onClick={() => abrirCompra(c)} className="p-1.5 rounded-xl hover:bg-gray-100"><Edit2 size={14} className="text-gray-400" /></button>
                    <button onClick={() => setCompras(p => p.filter(x => x.id !== c.id))} className="p-1.5 rounded-xl hover:bg-red-50"><Trash2 size={14} className="text-red-400" /></button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Tarefa */}
      {modalTarefa && (
        <Modal titulo={modalTarefa.id === 'novo' ? 'Nova tarefa' : 'Editar tarefa'} onClose={() => setModalTarefa(null)}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Nome da tarefa</label>
              <input type="text" value={formTarefa.nome} onChange={e => setFormTarefa(p => ({ ...p, nome: e.target.value }))} placeholder="Ex: Limpar banheiro" className="input" autoFocus />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Frequência</label>
              <div className="flex gap-2">
                {FREQUENCIAS.map(f => (
                  <button key={f} onClick={() => setFormTarefa(p => ({ ...p, freq: f }))}
                    className={clsx('flex-1 py-3 rounded-2xl text-sm font-bold border transition-all', formTarefa.freq === f ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-gray-600 border-gray-200')}>
                    {f}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setModalTarefa(null)} className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-bold text-gray-500">Cancelar</button>
              <button onClick={salvarTarefa} className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"><Check size={16} /> Salvar</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Compra */}
      {modalCompra && (
        <Modal titulo={modalCompra === 'novo' ? 'Novo item' : 'Editar item'} onClose={() => setModalCompra(null)}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Nome do item</label>
              <input type="text" value={formCompra.nome} onChange={e => setFormCompra(p => ({ ...p, nome: e.target.value }))} placeholder="Ex: Frango 1kg" className="input" autoFocus />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Quantidade</label>
              <input type="text" value={formCompra.qtd} onChange={e => setFormCompra(p => ({ ...p, qtd: e.target.value }))} placeholder="Ex: 1kg, 2 un, 1 cx" className="input" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Categoria</label>
              <div className="flex flex-wrap gap-2">
                {CATS_COMPRA.map(c => (
                  <button key={c} onClick={() => setFormCompra(p => ({ ...p, cat: c }))}
                    className={clsx('px-3 py-1.5 rounded-xl text-xs font-bold border transition-all', formCompra.cat === c ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-gray-600 border-gray-200')}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setModalCompra(null)} className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-bold text-gray-500">Cancelar</button>
              <button onClick={salvarCompra} className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"><Check size={16} /> Salvar</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
