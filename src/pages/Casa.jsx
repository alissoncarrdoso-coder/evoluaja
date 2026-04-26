import { useState } from 'react'
import { CheckCircle2, Circle, Plus, ShoppingCart, Home } from 'lucide-react'
import clsx from 'clsx'

const tarefasCasa = {
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
  { id: 1, nome: 'Frango (1kg)', cat: 'Supermercado', done: false },
  { id: 2, nome: 'Arroz integral', cat: 'Supermercado', done: false },
  { id: 3, nome: 'Ovos (12 un)', cat: 'Supermercado', done: true },
  { id: 4, nome: 'Protetor solar', cat: 'Farmácia', done: false },
  { id: 5, nome: 'Vitamina D', cat: 'Farmácia', done: false },
  { id: 6, nome: 'Aveia', cat: 'Supermercado', done: false },
]

const TABS = ['Casa', 'Compras']

export default function Casa() {
  const [tab, setTab] = useState(0)
  const [tarefas, setTarefas] = useState(tarefasCasa)
  const [compras, setCompras] = useState(comprasIniciais)

  const toggleTarefa = (grupo, id) => {
    setTarefas(prev => ({
      ...prev,
      [grupo]: prev[grupo].map(t => t.id === id ? { ...t, done: !t.done } : t)
    }))
  }

  const toggleCompra = (id) => {
    setCompras(prev => prev.map(c => c.id === id ? { ...c, done: !c.done } : c))
  }

  const cats = [...new Set(compras.map(c => c.cat))]

  return (
    <div className="page-container animate-fade-in-up">
      <h1 className="text-2xl font-black text-gray-800 mb-5">Casa & Compras</h1>

      <div className="flex gap-1 bg-gray-100 rounded-2xl p-1 mb-5">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              tab === i ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            {i === 0 ? <Home size={14} /> : <ShoppingCart size={14} />}
            {t}
          </button>
        ))}
      </div>

      {tab === 0 && (
        <div className="space-y-5">
          {Object.entries(tarefas).map(([grupo, items]) => (
            <div key={grupo}>
              <h2 className="section-title">{grupo}</h2>
              <div className="space-y-2">
                {items.map(t => (
                  <button
                    key={t.id}
                    onClick={() => toggleTarefa(grupo, t.id)}
                    className={clsx('w-full card flex items-center gap-4 text-left py-4', t.done ? 'bg-gray-50' : '')}
                  >
                    {t.done
                      ? <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
                      : <Circle size={20} className="text-gray-300 flex-shrink-0" />
                    }
                    <span className={clsx('text-sm font-semibold', t.done ? 'line-through text-gray-300' : 'text-gray-700')}>
                      {t.nome}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 font-bold text-sm hover:border-brand-300 hover:text-brand-500 transition-colors">
            <Plus size={18} /> Adicionar tarefa
          </button>
        </div>
      )}

      {tab === 1 && (
        <div className="space-y-5">
          {cats.map(cat => (
            <div key={cat}>
              <h2 className="section-title">{cat}</h2>
              <div className="space-y-2">
                {compras.filter(c => c.cat === cat).map(c => (
                  <button
                    key={c.id}
                    onClick={() => toggleCompra(c.id)}
                    className={clsx('w-full card flex items-center gap-4 text-left py-4', c.done ? 'opacity-50' : '')}
                  >
                    {c.done
                      ? <CheckCircle2 size={20} className="text-emerald-500 flex-shrink-0" />
                      : <Circle size={20} className="text-gray-300 flex-shrink-0" />
                    }
                    <span className={clsx('text-sm font-semibold flex-1', c.done ? 'line-through text-gray-400' : 'text-gray-700')}>
                      {c.nome}
                    </span>
                    <span className="badge badge-blue">{c.cat}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
          <button className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 font-bold text-sm hover:border-brand-300 hover:text-brand-500 transition-colors">
            <Plus size={18} /> Adicionar item
          </button>
        </div>
      )}
    </div>
  )
}
