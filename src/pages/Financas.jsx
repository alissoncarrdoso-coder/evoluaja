import { useState } from 'react'
import { TrendingUp, TrendingDown, CreditCard, Plus, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'

const evolucao = [
  { mes: 'Jan', saldo: 2100 },
  { mes: 'Fev', saldo: 2400 },
  { mes: 'Mar', saldo: 2200 },
  { mes: 'Abr', saldo: 2900 },
  { mes: 'Mai', saldo: 3100 },
  { mes: 'Jun', saldo: 2800 },
  { mes: 'Jul', saldo: 3847 },
]

const gastosCat = [
  { cat: 'Alimentação', valor: 850, color: '#f97316' },
  { cat: 'Transporte', valor: 420, color: '#3b82f6' },
  { cat: 'Lazer', valor: 320, color: '#a78bfa' },
  { cat: 'Saúde', valor: 280, color: '#ec4899' },
  { cat: 'Outros', valor: 190, color: '#6b7280' },
]

const transacoes = [
  { desc: 'Salário', valor: 4500, tipo: 'receita', data: '01/07', cat: 'Renda' },
  { desc: 'Supermercado', valor: -320, tipo: 'despesa', data: '03/07', cat: 'Alimentação' },
  { desc: 'Gym', valor: -89.90, tipo: 'despesa', data: '05/07', cat: 'Saúde' },
  { desc: 'Netflix', valor: -39.90, tipo: 'despesa', data: '08/07', cat: 'Lazer' },
  { desc: 'Freelance', valor: 800, tipo: 'receita', data: '10/07', cat: 'Renda' },
  { desc: 'Combustível', valor: -180, tipo: 'despesa', data: '12/07', cat: 'Transporte' },
]

const cartoes = [
  { nome: 'Nubank', limite: 5000, fatura: 1240, cor: 'from-purple-500 to-brand-600' },
  { nome: 'Inter', limite: 3000, fatura: 420, cor: 'from-orange-400 to-orange-600' },
]

const TABS = ['Visão Geral', 'Transações', 'Cartões']

export default function Financas() {
  const [tab, setTab] = useState(0)

  return (
    <div className="page-container animate-fade-in-up">
      <h1 className="text-2xl font-black text-gray-800 mb-5">Finanças</h1>

      {/* Saldo */}
      <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-3xl p-6 mb-5 text-white shadow-lg shadow-brand-200">
        <p className="text-sm font-bold text-brand-200 mb-1">Saldo Atual</p>
        <p className="text-4xl font-black mb-3">R$ 3.847,50</p>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <ArrowUpRight size={16} className="text-emerald-300" />
            <div>
              <p className="text-[10px] text-brand-200 font-bold">RECEITAS</p>
              <p className="text-sm font-black">R$ 5.300,00</p>
            </div>
          </div>
          <div className="w-px bg-white/20" />
          <div className="flex items-center gap-1.5">
            <ArrowDownRight size={16} className="text-red-300" />
            <div>
              <p className="text-[10px] text-brand-200 font-bold">DESPESAS</p>
              <p className="text-sm font-black">R$ 1.452,50</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-2xl p-1 mb-5">
        {TABS.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${
              tab === i ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 0 && (
        <div className="space-y-5">
          {/* Evolução mensal */}
          <div className="card">
            <h3 className="font-bold text-gray-700 mb-4">Evolução do Saldo</h3>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={evolucao}>
                <XAxis dataKey="mes" tick={{ fontSize: 11, fontWeight: 600, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip
                  formatter={(v) => [`R$ ${v.toLocaleString('pt-BR')}`, 'Saldo']}
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', fontSize: 12 }}
                />
                <Line type="monotone" dataKey="saldo" stroke="#7c3aed" strokeWidth={3} dot={{ r: 4, fill: '#7c3aed' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Gastos por categoria */}
          <div className="card">
            <h3 className="font-bold text-gray-700 mb-4">Gastos por Categoria</h3>
            <ResponsiveContainer width="100%" height={140}>
              <BarChart data={gastosCat} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="cat" type="category" tick={{ fontSize: 11, fontWeight: 600, fill: '#6b7280' }} axisLine={false} tickLine={false} width={70} />
                <Tooltip
                  formatter={(v) => [`R$ ${v}`, '']}
                  contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', fontSize: 12 }}
                />
                <Bar dataKey="valor" radius={[0, 8, 8, 0]}>
                  {gastosCat.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Metas */}
          <div className="card">
            <h3 className="font-bold text-gray-700 mb-4">Metas Financeiras</h3>
            {[
              { nome: 'Reserva de emergência', atual: 3847, meta: 15000, cor: 'bg-emerald-400' },
              { nome: 'Viagem para Europa', atual: 1200, meta: 8000, cor: 'bg-blue-400' },
            ].map((m, i) => (
              <div key={i} className="mb-4 last:mb-0">
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-gray-700">{m.nome}</span>
                  <span className="text-gray-400">R$ {m.atual.toLocaleString()} / R$ {m.meta.toLocaleString()}</span>
                </div>
                <div className="progress-bar h-2.5">
                  <div className={`progress-fill ${m.cor}`} style={{ width: `${(m.atual / m.meta) * 100}%` }} />
                </div>
                <p className="text-xs text-gray-400 font-semibold mt-1">{Math.round((m.atual / m.meta) * 100)}% da meta</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === 1 && (
        <div className="space-y-2">
          <button className="w-full btn-primary flex items-center justify-center gap-2 mb-3">
            <Plus size={18} /> Adicionar transação
          </button>
          {transacoes.map((t, i) => (
            <div key={i} className="card flex items-center gap-4 py-4">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${t.tipo === 'receita' ? 'bg-emerald-100' : 'bg-red-50'}`}>
                {t.tipo === 'receita'
                  ? <TrendingUp size={18} className="text-emerald-500" />
                  : <TrendingDown size={18} className="text-red-400" />
                }
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-800">{t.desc}</p>
                <p className="text-xs text-gray-400 font-semibold">{t.data} · {t.cat}</p>
              </div>
              <span className={`text-sm font-black ${t.valor > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {t.valor > 0 ? '+' : ''}R$ {Math.abs(t.valor).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}

      {tab === 2 && (
        <div className="space-y-4">
          {cartoes.map((c, i) => (
            <div key={i} className={`bg-gradient-to-br ${c.cor} rounded-3xl p-5 text-white shadow-lg`}>
              <div className="flex items-center gap-3 mb-4">
                <CreditCard size={22} className="text-white/70" />
                <p className="font-black text-lg">{c.nome}</p>
              </div>
              <p className="text-sm text-white/70 font-bold mb-1">Fatura atual</p>
              <p className="text-3xl font-black mb-3">R$ {c.fatura.toFixed(2)}</p>
              <div className="progress-bar bg-white/20 h-2">
                <div className="progress-fill bg-white" style={{ width: `${(c.fatura / c.limite) * 100}%` }} />
              </div>
              <p className="text-xs text-white/70 font-bold mt-2">
                R$ {c.fatura} de R$ {c.limite.toLocaleString()} ({Math.round((c.fatura / c.limite) * 100)}% usado)
              </p>
            </div>
          ))}
          <button className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 font-bold text-sm hover:border-brand-300 hover:text-brand-500 transition-colors">
            <Plus size={18} /> Adicionar cartão
          </button>
        </div>
      )}
    </div>
  )
}
