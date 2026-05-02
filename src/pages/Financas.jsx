import { useState, useMemo } from 'react'
import { TrendingUp, TrendingDown, CreditCard, Plus, Trash2, Edit2, ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts'
import clsx from 'clsx'
import { useLocalStorage } from '../hooks/useLocalStorage'
import Modal from '../components/ui/Modal'

const CATS = ['Alimentação','Transporte','Lazer','Saúde','Educação','Casa','Roupas','Renda','Freelance','Outro']
const BANDEIRAS = ['Visa','Mastercard','Elo','American Express','Hipercard']
const TABS = ['Visão Geral','Transações','Cartões','Metas']
const CORES_META = ['#7c3aed','#10b981','#3b82f6','#f59e0b','#ef4444','#ec4899']
const CORES_CARTAO = ['from-purple-500 to-brand-600','from-orange-400 to-orange-600','from-blue-500 to-cyan-500','from-green-500 to-emerald-600','from-red-500 to-pink-600']
const CAT_COLORS = {'Alimentação':'#f97316','Transporte':'#3b82f6','Lazer':'#a78bfa','Saúde':'#ec4899','Educação':'#6366f1','Casa':'#eab308','Roupas':'#f43f5e','Outro':'#6b7280','Freelance':'#10b981','Renda':'#10b981'}

const transDefault = [
  {id:1,desc:'Salário',valor:4500,tipo:'receita',data:new Date().toISOString().split('T')[0],cat:'Renda'},
  {id:2,desc:'Supermercado',valor:-320,tipo:'despesa',data:new Date().toISOString().split('T')[0],cat:'Alimentação'},
  {id:3,desc:'Gym',valor:-89.90,tipo:'despesa',data:new Date().toISOString().split('T')[0],cat:'Saúde'},
  {id:4,desc:'Netflix',valor:-39.90,tipo:'despesa',data:new Date().toISOString().split('T')[0],cat:'Lazer'},
  {id:5,desc:'Freelance',valor:800,tipo:'receita',data:new Date().toISOString().split('T')[0],cat:'Freelance'},
]
const cartoesDefault = [
  {id:1,nome:'Nubank',bandeira:'Mastercard',limite:5000,fatura:1240,vencimento:'10',cor:'from-purple-500 to-brand-600'},
  {id:2,nome:'Inter',bandeira:'Mastercard',limite:3000,fatura:420,vencimento:'15',cor:'from-orange-400 to-orange-600'},
]
const metasDefault = [
  {id:1,nome:'Reserva de emergência',meta:15000,atual:3847,cor:'#10b981'},
  {id:2,nome:'Viagem para Europa',meta:8000,atual:1200,cor:'#3b82f6'},
]

export default function Financas() {
  const [tab, setTab] = useState(0)
  const [transacoes, setTransacoes] = useLocalStorage('evoluaja_transacoes', transDefault)
  const [cartoes, setCartoes] = useLocalStorage('evoluaja_cartoes', cartoesDefault)
  const [metas, setMetas] = useLocalStorage('evoluaja_metas_fin', metasDefault)

  const [modalTrans, setModalTrans] = useState(null)
  const [modalCartao, setModalCartao] = useState(null)
  const [modalMeta, setModalMeta] = useState(null)
  const [fTrans, setFTrans] = useState({desc:'',valor:'',tipo:'despesa',cat:'Alimentação',data:new Date().toISOString().split('T')[0]})
  const [fCartao, setFCartao] = useState({nome:'',bandeira:'Visa',limite:'',fatura:'',vencimento:''})
  const [fMeta, setFMeta] = useState({nome:'',meta:'',atual:'',cor:'#7c3aed'})

  const receitas = useMemo(()=>transacoes.filter(t=>t.valor>0).reduce((s,t)=>s+t.valor,0),[transacoes])
  const despesas = useMemo(()=>transacoes.filter(t=>t.valor<0).reduce((s,t)=>s+Math.abs(t.valor),0),[transacoes])
  const saldo = receitas - despesas

  const gastosCat = useMemo(()=>{
    const mapa={}
    transacoes.filter(t=>t.valor<0).forEach(t=>{mapa[t.cat]=(mapa[t.cat]||0)+Math.abs(t.valor)})
    return Object.entries(mapa).map(([cat,valor])=>({cat,valor:+valor.toFixed(2),color:CAT_COLORS[cat]||'#6b7280'})).sort((a,b)=>b.valor-a.valor).slice(0,6)
  },[transacoes])

  const evolucaoMensal = useMemo(()=>{
    const meses=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez']
    const agora=new Date()
    return Array.from({length:6},(_,i)=>{
      const d=new Date(agora.getFullYear(),agora.getMonth()-5+i,1)
      const saldoMes=transacoes.filter(t=>{try{const dt=new Date(t.data);return dt.getMonth()===d.getMonth()&&dt.getFullYear()===d.getFullYear()}catch{return false}}).reduce((s,t)=>s+t.valor,0)
      return {mes:meses[d.getMonth()],saldo:+saldoMes.toFixed(2)}
    })
  },[transacoes])

  const abrirTrans = (t=null) => {
    setFTrans(t?{desc:t.desc,valor:Math.abs(t.valor),tipo:t.tipo,cat:t.cat,data:t.data}:{desc:'',valor:'',tipo:'despesa',cat:'Alimentação',data:new Date().toISOString().split('T')[0]})
    setModalTrans(t?t.id:'novo')
  }
  const salvarTrans = () => {
    if (!fTrans.desc||!fTrans.valor) return
    const val=fTrans.tipo==='receita'?Math.abs(+fTrans.valor):-Math.abs(+fTrans.valor)
    if (modalTrans==='novo') setTransacoes(p=>[...p,{...fTrans,id:Date.now(),valor:val}])
    else setTransacoes(p=>p.map(t=>t.id===modalTrans?{...t,...fTrans,valor:val}:t))
    setModalTrans(null)
  }

  const abrirCartao = (c=null) => {
    setFCartao(c?{nome:c.nome,bandeira:c.bandeira,limite:c.limite,fatura:c.fatura,vencimento:c.vencimento}:{nome:'',bandeira:'Visa',limite:'',fatura:'',vencimento:''})
    setModalCartao(c?c.id:'novo')
  }
  const salvarCartao = () => {
    if (!fCartao.nome||!fCartao.limite) return
    if (modalCartao==='novo') setCartoes(p=>[...p,{...fCartao,id:Date.now(),limite:+fCartao.limite,fatura:+fCartao.fatura||0,cor:CORES_CARTAO[p.length%CORES_CARTAO.length]}])
    else setCartoes(p=>p.map(c=>c.id===modalCartao?{...c,...fCartao,limite:+fCartao.limite,fatura:+fCartao.fatura}:c))
    setModalCartao(null)
  }

  const abrirMeta = (m=null) => {
    setFMeta(m?{nome:m.nome,meta:m.meta,atual:m.atual,cor:m.cor}:{nome:'',meta:'',atual:'',cor:'#7c3aed'})
    setModalMeta(m?m.id:'novo')
  }
  const salvarMeta = () => {
    if (!fMeta.nome||!fMeta.meta) return
    if (modalMeta==='novo') setMetas(p=>[...p,{...fMeta,id:Date.now(),meta:+fMeta.meta,atual:+fMeta.atual||0}])
    else setMetas(p=>p.map(m=>m.id===modalMeta?{...m,...fMeta,meta:+fMeta.meta,atual:+fMeta.atual}:m))
    setModalMeta(null)
  }

  const chip = (ativo) => clsx('px-3 py-1.5 rounded-xl text-xs font-bold border transition-all',
    ativo?'bg-brand-500 text-white border-brand-500':'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700')

  return (
    <div className="page-container animate-fade-in-up">
      <h1 className="text-2xl font-black text-gray-800 dark:text-gray-100 mb-5">Finanças</h1>

      <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-3xl p-6 mb-5 text-white shadow-lg shadow-brand-200">
        <p className="text-sm font-bold text-brand-200 mb-1">Saldo Atual</p>
        <p className="text-4xl font-black mb-3">R$ {saldo.toLocaleString('pt-BR',{minimumFractionDigits:2})}</p>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <ArrowUpRight size={16} className="text-emerald-300"/>
            <div><p className="text-[10px] text-brand-200 font-bold">RECEITAS</p><p className="text-sm font-black">R$ {receitas.toLocaleString('pt-BR',{minimumFractionDigits:2})}</p></div>
          </div>
          <div className="w-px bg-white/20"/>
          <div className="flex items-center gap-1.5">
            <ArrowDownRight size={16} className="text-red-300"/>
            <div><p className="text-[10px] text-brand-200 font-bold">DESPESAS</p><p className="text-sm font-black">R$ {despesas.toLocaleString('pt-BR',{minimumFractionDigits:2})}</p></div>
          </div>
        </div>
      </div>

      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 mb-5">
        {TABS.map((t,i)=>(
          <button key={t} onClick={()=>setTab(i)}
            className={`flex-1 py-2 text-[11px] font-bold rounded-xl transition-all ${tab===i?'bg-white dark:bg-gray-700 text-brand-600 shadow-sm':'text-gray-500 dark:text-gray-400'}`}>{t}</button>
        ))}
      </div>

      {tab===0 && (
        <div className="space-y-5">
          <div className="card">
            <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-1">Evolução do Saldo</h3>
            <p className="text-xs text-gray-400 font-semibold mb-4">Últimos 6 meses · baseado nas suas transações</p>
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={evolucaoMensal}>
                <XAxis dataKey="mes" tick={{fontSize:11,fontWeight:600,fill:'#9ca3af'}} axisLine={false} tickLine={false}/>
                <YAxis hide/>
                <Tooltip formatter={v=>[`R$ ${v.toLocaleString('pt-BR',{minimumFractionDigits:2})}`,'Saldo']} contentStyle={{borderRadius:12,border:'none',fontSize:12}}/>
                <Line type="monotone" dataKey="saldo" stroke="#7c3aed" strokeWidth={3} dot={{r:4,fill:'#7c3aed'}}/>
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="card">
            <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-1">Gastos por Categoria</h3>
            <p className="text-xs text-gray-400 font-semibold mb-4">Calculado das suas despesas reais</p>
            {gastosCat.length===0
              ? <p className="text-sm text-gray-400 font-semibold text-center py-6">Nenhuma despesa registrada ainda</p>
              : <ResponsiveContainer width="100%" height={Math.max(120,gastosCat.length*36)}>
                  <BarChart data={gastosCat} layout="vertical">
                    <XAxis type="number" hide/>
                    <YAxis dataKey="cat" type="category" tick={{fontSize:11,fontWeight:600,fill:'#6b7280'}} axisLine={false} tickLine={false} width={90}/>
                    <Tooltip formatter={v=>[`R$ ${v.toLocaleString('pt-BR',{minimumFractionDigits:2})}`]} contentStyle={{borderRadius:12,border:'none',fontSize:12}}/>
                    <Bar dataKey="valor" radius={[0,8,8,0]}>{gastosCat.map((e,i)=><Cell key={i} fill={e.color}/>)}</Bar>
                  </BarChart>
                </ResponsiveContainer>
            }
          </div>
        </div>
      )}

      {tab===1 && (
        <div className="space-y-2">
          <button onClick={()=>abrirTrans()} className="w-full btn-primary flex items-center justify-center gap-2 mb-3"><Plus size={18}/>Adicionar transação</button>
          {transacoes.length===0 && <div className="card text-center py-8"><p className="text-sm font-bold text-gray-400">Nenhuma transação ainda</p></div>}
          {[...transacoes].reverse().map(t=>(
            <div key={t.id} className="card flex items-center gap-3 py-3">
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${t.valor>0?'bg-emerald-100 dark:bg-emerald-900':'bg-red-50 dark:bg-red-950'}`}>
                {t.valor>0?<TrendingUp size={18} className="text-emerald-500"/>:<TrendingDown size={18} className="text-red-400"/>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">{t.desc}</p>
                <p className="text-xs text-gray-400 font-semibold">{t.data?(() => {try{return new Date(t.data+'T12:00').toLocaleDateString('pt-BR')}catch{return t.data}})():''} · {t.cat}</p>
              </div>
              <span className={`text-sm font-black flex-shrink-0 ${t.valor>0?'text-emerald-600':'text-red-500'}`}>{t.valor>0?'+':''}R$ {Math.abs(t.valor).toFixed(2)}</span>
              <button onClick={()=>abrirTrans(t)} className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"><Edit2 size={14} className="text-gray-400"/></button>
              <button onClick={()=>setTransacoes(p=>p.filter(x=>x.id!==t.id))} className="p-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950"><Trash2 size={14} className="text-red-400"/></button>
            </div>
          ))}
        </div>
      )}

      {tab===2 && (
        <div className="space-y-4">
          {cartoes.map(c=>(
            <div key={c.id} className={`bg-gradient-to-br ${c.cor} rounded-3xl p-5 text-white shadow-lg`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3"><CreditCard size={22} className="text-white/70"/><div><p className="font-black text-lg">{c.nome}</p><p className="text-xs text-white/60">{c.bandeira} · Vence dia {c.vencimento}</p></div></div>
                <div className="flex gap-2">
                  <button onClick={()=>abrirCartao(c)} className="p-1.5 bg-white/20 rounded-xl hover:bg-white/30"><Edit2 size={14}/></button>
                  <button onClick={()=>setCartoes(p=>p.filter(x=>x.id!==c.id))} className="p-1.5 bg-white/20 rounded-xl hover:bg-white/30"><Trash2 size={14}/></button>
                </div>
              </div>
              <p className="text-sm text-white/70 font-bold mb-1">Fatura atual</p>
              <p className="text-3xl font-black mb-3">R$ {(+c.fatura).toFixed(2)}</p>
              <div className="bg-white/20 h-2 rounded-full overflow-hidden"><div className="bg-white h-full rounded-full" style={{width:`${Math.min((c.fatura/c.limite)*100,100)}%`}}/></div>
              <p className="text-xs text-white/70 font-bold mt-2">R$ {(+c.fatura).toFixed(2)} de R$ {(+c.limite).toLocaleString()} ({Math.round((c.fatura/c.limite)*100)}% usado)</p>
            </div>
          ))}
          {cartoes.length===0 && <div className="card text-center py-8"><CreditCard size={32} className="text-gray-200 dark:text-gray-700 mx-auto mb-2"/><p className="text-sm font-bold text-gray-400">Nenhum cartão cadastrado</p></div>}
          <button onClick={()=>abrirCartao()} className="w-full btn-primary flex items-center justify-center gap-2"><Plus size={18}/>Adicionar cartão</button>
        </div>
      )}

      {tab===3 && (
        <div className="space-y-3">
          <button onClick={()=>abrirMeta()} className="w-full btn-primary flex items-center justify-center gap-2 mb-1"><Plus size={18}/>Nova meta financeira</button>
          {metas.length===0 && <div className="card text-center py-8"><p className="text-sm font-bold text-gray-400">Nenhuma meta cadastrada</p></div>}
          {metas.map(m=>(
            <div key={m.id} className="card">
              <div className="flex items-center justify-between mb-3">
                <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">{m.nome}</p>
                <div className="flex gap-2">
                  <button onClick={()=>abrirMeta(m)} className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"><Edit2 size={14} className="text-gray-400"/></button>
                  <button onClick={()=>setMetas(p=>p.filter(x=>x.id!==m.id))} className="p-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950"><Trash2 size={14} className="text-red-400"/></button>
                </div>
              </div>
              <div className="flex justify-between text-xs font-bold text-gray-400 mb-2"><span>R$ {(+m.atual).toLocaleString('pt-BR')}</span><span>R$ {(+m.meta).toLocaleString('pt-BR')}</span></div>
              <div className="progress-bar h-2.5"><div className="progress-fill" style={{width:`${Math.min((m.atual/m.meta)*100,100)}%`,backgroundColor:m.cor}}/></div>
              <p className="text-xs text-gray-400 font-semibold mt-1">{Math.round((m.atual/m.meta)*100)}% da meta</p>
            </div>
          ))}
        </div>
      )}

      {modalTrans && (
        <Modal titulo={modalTrans==='novo'?'Nova transação':'Editar transação'} onClose={()=>setModalTrans(null)} onConfirm={salvarTrans} confirmLabel="Salvar transação">
          <div className="space-y-4">
            <div className="flex gap-2">
              {['receita','despesa'].map(t=>(
                <button key={t} onClick={()=>setFTrans(p=>({...p,tipo:t}))}
                  className={clsx('flex-1 py-3 rounded-2xl text-sm font-bold border transition-all',
                    fTrans.tipo===t?t==='receita'?'bg-emerald-500 text-white border-emerald-500':'bg-red-500 text-white border-red-500':'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700')}>
                  {t==='receita'?'↑ Receita':'↓ Despesa'}
                </button>
              ))}
            </div>
            <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Descrição</label><input type="text" value={fTrans.desc} onChange={e=>setFTrans(p=>({...p,desc:e.target.value}))} placeholder="Ex: Supermercado" className="input" autoFocus/></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Valor (R$)</label><input type="number" step="0.01" value={fTrans.valor} onChange={e=>setFTrans(p=>({...p,valor:e.target.value}))} placeholder="0,00" className="input"/></div>
              <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Data</label><input type="date" value={fTrans.data} onChange={e=>setFTrans(p=>({...p,data:e.target.value}))} className="input"/></div>
            </div>
            <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Categoria</label><div className="flex flex-wrap gap-2">{CATS.map(c=><button key={c} onClick={()=>setFTrans(p=>({...p,cat:c}))} className={chip(fTrans.cat===c)}>{c}</button>)}</div></div>
          </div>
        </Modal>
      )}

      {modalCartao && (
        <Modal titulo={modalCartao==='novo'?'Novo cartão':'Editar cartão'} onClose={()=>setModalCartao(null)} onConfirm={salvarCartao} confirmLabel="Salvar cartão">
          <div className="space-y-4">
            <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Nome do cartão</label><input type="text" value={fCartao.nome} onChange={e=>setFCartao(p=>({...p,nome:e.target.value}))} placeholder="Ex: Nubank" className="input" autoFocus/></div>
            <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Bandeira</label><div className="flex flex-wrap gap-2">{BANDEIRAS.map(b=><button key={b} onClick={()=>setFCartao(p=>({...p,bandeira:b}))} className={chip(fCartao.bandeira===b)}>{b}</button>)}</div></div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Limite (R$)</label><input type="number" value={fCartao.limite} onChange={e=>setFCartao(p=>({...p,limite:e.target.value}))} placeholder="5000" className="input"/></div>
              <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Fatura (R$)</label><input type="number" value={fCartao.fatura} onChange={e=>setFCartao(p=>({...p,fatura:e.target.value}))} placeholder="0" className="input"/></div>
              <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Vencimento</label><input type="number" min="1" max="31" value={fCartao.vencimento} onChange={e=>setFCartao(p=>({...p,vencimento:e.target.value}))} placeholder="10" className="input"/></div>
            </div>
          </div>
        </Modal>
      )}

      {modalMeta && (
        <Modal titulo={modalMeta==='novo'?'Nova meta':'Editar meta'} onClose={()=>setModalMeta(null)} onConfirm={salvarMeta} confirmLabel="Salvar meta">
          <div className="space-y-4">
            <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Nome da meta</label><input type="text" value={fMeta.nome} onChange={e=>setFMeta(p=>({...p,nome:e.target.value}))} placeholder="Ex: Reserva de emergência" className="input" autoFocus/></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Meta (R$)</label><input type="number" value={fMeta.meta} onChange={e=>setFMeta(p=>({...p,meta:e.target.value}))} placeholder="15000" className="input"/></div>
              <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Atual (R$)</label><input type="number" value={fMeta.atual} onChange={e=>setFMeta(p=>({...p,atual:e.target.value}))} placeholder="0" className="input"/></div>
            </div>
            <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Cor</label><div className="flex gap-3">{CORES_META.map(cor=><button key={cor} onClick={()=>setFMeta(p=>({...p,cor}))} className={clsx('w-9 h-9 rounded-xl transition-all',fMeta.cor===cor?'ring-2 ring-offset-2 ring-gray-400 scale-110':'')} style={{backgroundColor:cor}}/>)}</div></div>
          </div>
        </Modal>
      )}
    </div>
  )
}
