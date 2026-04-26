import { useState } from 'react'
import { TrendingUp, TrendingDown, CreditCard, Plus, Trash2, Edit2, X, Check, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'
import clsx from 'clsx'

const evolucao = [
  { mes: 'Jan', saldo: 2100 }, { mes: 'Fev', saldo: 2400 }, { mes: 'Mar', saldo: 2200 },
  { mes: 'Abr', saldo: 2900 }, { mes: 'Mai', saldo: 3100 }, { mes: 'Jun', saldo: 2800 }, { mes: 'Jul', saldo: 3847 },
]
const gastosCat = [
  { cat: 'Alimentação', valor: 850, color: '#f97316' }, { cat: 'Transporte', valor: 420, color: '#3b82f6' },
  { cat: 'Lazer', valor: 320, color: '#a78bfa' }, { cat: 'Saúde', valor: 280, color: '#ec4899' }, { cat: 'Outros', valor: 190, color: '#6b7280' },
]

const CATEGORIAS_TRANS = ['Alimentação', 'Transporte', 'Lazer', 'Saúde', 'Educação', 'Casa', 'Roupas', 'Renda', 'Freelance', 'Outro']
const BANDEIRAS = ['Visa', 'Mastercard', 'Elo', 'American Express', 'Hipercard']
const TABS = ['Visão Geral', 'Transações', 'Cartões', 'Metas']

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

const transVazia = { desc: '', valor: '', tipo: 'despesa', cat: 'Alimentação', data: new Date().toISOString().split('T')[0] }
const cartaoVazio = { nome: '', bandeira: 'Visa', limite: '', fatura: '', vencimento: '' }
const metaVazia = { nome: '', meta: '', atual: '', cor: '#7c3aed' }

export default function Financas() {
  const [tab, setTab] = useState(0)
  const [transacoes, setTransacoes] = useState([
    { id: 1, desc: 'Salário', valor: 4500, tipo: 'receita', data: '01/07', cat: 'Renda' },
    { id: 2, desc: 'Supermercado', valor: -320, tipo: 'despesa', data: '03/07', cat: 'Alimentação' },
    { id: 3, desc: 'Gym', valor: -89.90, tipo: 'despesa', data: '05/07', cat: 'Saúde' },
    { id: 4, desc: 'Netflix', valor: -39.90, tipo: 'despesa', data: '08/07', cat: 'Lazer' },
    { id: 5, desc: 'Freelance', valor: 800, tipo: 'receita', data: '10/07', cat: 'Freelance' },
    { id: 6, desc: 'Combustível', valor: -180, tipo: 'despesa', data: '12/07', cat: 'Transporte' },
  ])
  const [cartoes, setCartoes] = useState([
    { id: 1, nome: 'Nubank', bandeira: 'Mastercard', limite: 5000, fatura: 1240, vencimento: '10', cor: 'from-purple-500 to-brand-600' },
    { id: 2, nome: 'Inter', bandeira: 'Mastercard', limite: 3000, fatura: 420, vencimento: '15', cor: 'from-orange-400 to-orange-600' },
  ])
  const [metas, setMetas] = useState([
    { id: 1, nome: 'Reserva de emergência', meta: 15000, atual: 3847, cor: '#10b981' },
    { id: 2, nome: 'Viagem para Europa', meta: 8000, atual: 1200, cor: '#3b82f6' },
  ])

  const [modalTrans, setModalTrans] = useState(null)
  const [modalCartao, setModalCartao] = useState(null)
  const [modalMeta, setModalMeta] = useState(null)
  const [formTrans, setFormTrans] = useState(transVazia)
  const [formCartao, setFormCartao] = useState(cartaoVazio)
  const [formMeta, setFormMeta] = useState(metaVazia)

  // Transações
  const abrirTrans = (t = null) => { setFormTrans(t ? { desc: t.desc, valor: Math.abs(t.valor), tipo: t.tipo, cat: t.cat, data: t.data } : transVazia); setModalTrans(t ? t.id : 'novo') }
  const salvarTrans = () => {
    if (!formTrans.desc || !formTrans.valor) return
    const val = formTrans.tipo === 'receita' ? Math.abs(+formTrans.valor) : -Math.abs(+formTrans.valor)
    if (modalTrans === 'novo') setTransacoes(p => [...p, { ...formTrans, id: Date.now(), valor: val }])
    else setTransacoes(p => p.map(t => t.id === modalTrans ? { ...t, ...formTrans, valor: val } : t))
    setModalTrans(null)
  }

  // Cartões
  const abrirCartao = (c = null) => { setFormCartao(c ? { nome: c.nome, bandeira: c.bandeira, limite: c.limite, fatura: c.fatura, vencimento: c.vencimento } : cartaoVazio); setModalCartao(c ? c.id : 'novo') }
  const salvarCartao = () => {
    if (!formCartao.nome || !formCartao.limite) return
    const cores = ['from-purple-500 to-brand-600', 'from-orange-400 to-orange-600', 'from-blue-500 to-cyan-500', 'from-green-500 to-emerald-600', 'from-red-500 to-pink-600']
    if (modalCartao === 'novo') setCartoes(p => [...p, { ...formCartao, id: Date.now(), limite: +formCartao.limite, fatura: +formCartao.fatura || 0, cor: cores[p.length % cores.length] }])
    else setCartoes(p => p.map(c => c.id === modalCartao ? { ...c, ...formCartao, limite: +formCartao.limite, fatura: +formCartao.fatura } : c))
    setModalCartao(null)
  }

  // Metas
  const abrirMeta = (m = null) => { setFormMeta(m ? { nome: m.nome, meta: m.meta, atual: m.atual, cor: m.cor } : metaVazia); setModalMeta(m ? m.id : 'novo') }
  const salvarMeta = () => {
    if (!formMeta.nome || !formMeta.meta) return
    if (modalMeta === 'novo') setMetas(p => [...p, { ...formMeta, id: Date.now(), meta: +formMeta.meta, atual: +formMeta.atual || 0 }])
    else setMetas(p => p.map(m => m.id === modalMeta ? { ...m, ...formMeta, meta: +formMeta.meta, atual: +formMeta.atual } : m))
    setModalMeta(null)
  }

  const receitas = transacoes.filter(t => t.valor > 0).reduce((s, t) => s + t.valor, 0)
  const despesas = transacoes.filter(t => t.valor < 0).reduce((s, t) => s + Math.abs(t.valor), 0)
  const saldo = receitas - despesas

  return (
    <div className="page-container animate-fade-in-up">
      <h1 className="text-2xl font-black text-gray-800 mb-5">Finanças</h1>

      {/* Saldo */}
      <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-3xl p-6 mb-5 text-white shadow-lg shadow-brand-200">
        <p className="text-sm font-bold text-brand-200 mb-1">Saldo Atual</p>
        <p className="text-4xl font-black mb-3">R$ {saldo.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <ArrowUpRight size={16} className="text-emerald-300" />
            <div>
              <p className="text-[10px] text-brand-200 font-bold">RECEITAS</p>
              <p className="text-sm font-black">R$ {receitas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
          <div className="w-px bg-white/20" />
          <div className="flex items-center gap-1.5">
            <ArrowDownRight size={16} className="text-red-300" />
            <div>
              <p className="text-[10px] text-brand-200 font-bold">DESPESAS</p>
              <p className="text-sm font-black">R$ {despesas.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-2xl p-1 mb-5">
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className={`flex-1 py-2 text-[11px] font-bold rounded-xl transition-all ${tab === i ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* VISÃO GERAL */}
      {tab === 0 && (
        <div className="space-y-5">
          <div className="card">
            <h3 className="font-bold text-gray-700 mb-4">Evolução do Saldo</h3>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={evolucao}>
                <XAxis dataKey="mes" tick={{ fontSize: 11, fontWeight: 600, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip formatter={v => [`R$ ${v.toLocaleString('pt-BR')}`, 'Saldo']} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', fontSize: 12 }} />
                <Line type="monotone" dataKey="saldo" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4, fill: '#7c3aed' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h3 className="font-bold text-gray-700 mb-4">Gastos por Categoria</h3>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={gastosCat} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="cat" type="category" tick={{ fontSize: 11, fontWeight: 600, fill: '#6b7280' }} axisLine={false} tickLine={false} width={80} />
                <Tooltip formatter={v => [`R$ ${v}`, '']} contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }} />
                <Bar dataKey="valor" radius={[0, 8, 8, 0]}>{gastosCat.map((e, i) => <Cell key={i} fill={e.color} />)}</Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* TRANSAÇÕES */}
      {tab === 1 && (
        <div className="space-y-2">
          <button onClick={() => abrirTrans()} className="w-full btn-primary flex items-center justify-center gap-2 mb-3">
            <Plus size={18} /> Adicionar transação
          </button>
          {transacoes.map(t => (
            <div key={t.id} className="card flex items-center gap-3 py-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${t.valor > 0 ? 'bg-emerald-100' : 'bg-red-50'}`}>
                {t.valor > 0 ? <TrendingUp size={18} className="text-emerald-500" /> : <TrendingDown size={18} className="text-red-400" />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 truncate">{t.desc}</p>
                <p className="text-xs text-gray-400 font-semibold">{t.data} · {t.cat}</p>
              </div>
              <span className={`text-sm font-black flex-shrink-0 ${t.valor > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {t.valor > 0 ? '+' : ''}R$ {Math.abs(t.valor).toFixed(2)}
              </span>
              <button onClick={() => abrirTrans(t)} className="p-1.5 rounded-xl hover:bg-gray-100 flex-shrink-0"><Edit2 size={14} className="text-gray-400" /></button>
              <button onClick={() => setTransacoes(p => p.filter(x => x.id !== t.id))} className="p-1.5 rounded-xl hover:bg-red-50 flex-shrink-0"><Trash2 size={14} className="text-red-400" /></button>
            </div>
          ))}
        </div>
      )}

      {/* CARTÕES */}
      {tab === 2 && (
        <div className="space-y-4">
          {cartoes.map(c => (
            <div key={c.id} className={`bg-gradient-to-br ${c.cor} rounded-3xl p-5 text-white shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <CreditCard size={22} className="text-white/70" />
                  <div>
                    <p className="font-black text-lg">{c.nome}</p>
                    <p className="text-xs text-white/60">{c.bandeira} · Vence dia {c.vencimento}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => abrirCartao(c)} className="p-1.5 bg-white/20 rounded-xl"><Edit2 size={14} /></button>
                  <button onClick={() => setCartoes(p => p.filter(x => x.id !== c.id))} className="p-1.5 bg-white/20 rounded-xl"><Trash2 size={14} /></button>
                </div>
              </div>
              <p className="text-sm text-white/70 font-bold mb-1">Fatura atual</p>
              <p className="text-3xl font-black mb-3">R$ {c.fatura.toFixed(2)}</p>
              <div className="progress-bar bg-white/20 h-2">
                <div className="progress-fill bg-white" style={{ width: `${Math.min((c.fatura / c.limite) * 100, 100)}%` }} />
              </div>
              <p className="text-xs text-white/70 font-bold mt-2">
                R$ {c.fatura.toFixed(2)} de R$ {c.limite.toLocaleString()} ({Math.round((c.fatura / c.limite) * 100)}% usado)
              </p>
            </div>
          ))}
          <button onClick={() => abrirCartao()} className="w-full btn-primary flex items-center justify-center gap-2">
            <Plus size={18} /> Adicionar cartão
          </button>
        </div>
      )}

      {/* METAS */}
      {tab === 3 && (
        <div className="space-y-3">
          <button onClick={() => abrirMeta()} className="w-full btn-primary flex items-center justify-center gap-2 mb-1">
            <Plus size={18} /> Nova meta financeira
          </button>
          {metas.map(m => (
            <div key={m.id} className="card">
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold text-gray-800 text-sm">{m.nome}</p>
                <div className="flex gap-2">
                  <button onClick={() => abrirMeta(m)} className="p-1.5 rounded-xl hover:bg-gray-100"><Edit2 size={14} className="text-gray-400" /></button>
                  <button onClick={() => setMetas(p => p.filter(x => x.id !== m.id))} className="p-1.5 rounded-xl hover:bg-red-50"><Trash2 size={14} className="text-red-400" /></button>
                </div>
              </div>
              <div className="flex justify-between text-xs font-bold text-gray-400 mb-2">
                <span>R$ {m.atual.toLocaleString('pt-BR')}</span>
                <span>R$ {m.meta.toLocaleString('pt-BR')}</span>
              </div>
              <div className="progress-bar h-2.5">
                <div className="progress-fill" style={{ width: `${Math.min((m.atual / m.meta) * 100, 100)}%`, backgroundColor: m.cor }} />
              </div>
              <p className="text-xs text-gray-400 font-semibold mt-1">{Math.round((m.atual / m.meta) * 100)}% da meta</p>
            </div>
          ))}
        </div>
      )}

      {/* Modal Transação */}
      {modalTrans && (
        <Modal titulo={modalTrans === 'novo' ? 'Nova transação' : 'Editar transação'} onClose={() => setModalTrans(null)}>
          <div className="space-y-4">
            <div className="flex gap-2">
              {['receita', 'despesa'].map(t => (
                <button key={t} onClick={() => setFormTrans(p => ({ ...p, tipo: t }))}
                  className={clsx('flex-1 py-3 rounded-2xl text-sm font-bold border transition-all', formTrans.tipo === t ? t === 'receita' ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-600 border-gray-200')}>
                  {t === 'receita' ? '↑ Receita' : '↓ Despesa'}
                </button>
              ))}
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Descrição</label>
              <input type="text" value={formTrans.desc} onChange={e => setFormTrans(p => ({ ...p, desc: e.target.value }))} placeholder="Ex: Supermercado" className="input" autoFocus />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Valor (R$)</label>
                <input type="number" step="0.01" value={formTrans.valor} onChange={e => setFormTrans(p => ({ ...p, valor: e.target.value }))} placeholder="0,00" className="input" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Data</label>
                <input type="date" value={formTrans.data} onChange={e => setFormTrans(p => ({ ...p, data: e.target.value }))} className="input" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Categoria</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIAS_TRANS.map(c => (
                  <button key={c} onClick={() => setFormTrans(p => ({ ...p, cat: c }))}
                    className={clsx('px-3 py-1.5 rounded-xl text-xs font-bold border transition-all', formTrans.cat === c ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-gray-600 border-gray-200')}>
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setModalTrans(null)} className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-bold text-gray-500">Cancelar</button>
              <button onClick={salvarTrans} className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"><Check size={16} /> Salvar</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Cartão */}
      {modalCartao && (
        <Modal titulo={modalCartao === 'novo' ? 'Novo cartão' : 'Editar cartão'} onClose={() => setModalCartao(null)}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Nome do cartão</label>
              <input type="text" value={formCartao.nome} onChange={e => setFormCartao(p => ({ ...p, nome: e.target.value }))} placeholder="Ex: Nubank" className="input" autoFocus />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Bandeira</label>
              <div className="flex flex-wrap gap-2">
                {BANDEIRAS.map(b => (
                  <button key={b} onClick={() => setFormCartao(p => ({ ...p, bandeira: b }))}
                    className={clsx('px-3 py-1.5 rounded-xl text-xs font-bold border transition-all', formCartao.bandeira === b ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-gray-600 border-gray-200')}>
                    {b}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Limite (R$)</label>
                <input type="number" value={formCartao.limite} onChange={e => setFormCartao(p => ({ ...p, limite: e.target.value }))} placeholder="5000" className="input" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Fatura atual (R$)</label>
                <input type="number" value={formCartao.fatura} onChange={e => setFormCartao(p => ({ ...p, fatura: e.target.value }))} placeholder="0" className="input" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Dia de vencimento</label>
              <input type="number" min="1" max="31" value={formCartao.vencimento} onChange={e => setFormCartao(p => ({ ...p, vencimento: e.target.value }))} placeholder="10" className="input" />
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setModalCartao(null)} className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-bold text-gray-500">Cancelar</button>
              <button onClick={salvarCartao} className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"><Check size={16} /> Salvar</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Meta */}
      {modalMeta && (
        <Modal titulo={modalMeta === 'novo' ? 'Nova meta' : 'Editar meta'} onClose={() => setModalMeta(null)}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Nome da meta</label>
              <input type="text" value={formMeta.nome} onChange={e => setFormMeta(p => ({ ...p, nome: e.target.value }))} placeholder="Ex: Reserva de emergência" className="input" autoFocus />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Valor da meta (R$)</label>
                <input type="number" value={formMeta.meta} onChange={e => setFormMeta(p => ({ ...p, meta: e.target.value }))} placeholder="15000" className="input" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Valor atual (R$)</label>
                <input type="number" value={formMeta.atual} onChange={e => setFormMeta(p => ({ ...p, atual: e.target.value }))} placeholder="0" className="input" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Cor</label>
              <div className="flex gap-3">
                {['#7c3aed','#10b981','#3b82f6','#f59e0b','#ef4444','#ec4899'].map(cor => (
                  <button key={cor} onClick={() => setFormMeta(p => ({ ...p, cor }))}
                    className={clsx('w-9 h-9 rounded-xl transition-all', formMeta.cor === cor ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : '')}
                    style={{ backgroundColor: cor }} />
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setModalMeta(null)} className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-bold text-gray-500">Cancelar</button>
              <button onClick={salvarMeta} className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"><Check size={16} /> Salvar</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
