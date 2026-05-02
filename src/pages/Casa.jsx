import { useState } from 'react'
import { CheckCircle2, Circle, Plus, ShoppingCart, Home, Trash2, Edit2 } from 'lucide-react'
import clsx from 'clsx'
import { useLocalStorage } from '../hooks/useLocalStorage'
import Modal from '../components/ui/Modal'

const tarefasDefault = {
  Diárias: [
    {id:1,nome:'Lavar louça',done:true},
    {id:2,nome:'Varrer o chão',done:true},
    {id:3,nome:'Tirar o lixo',done:false},
    {id:4,nome:'Arrumar a cama',done:true},
  ],
  Semanais: [
    {id:5,nome:'Limpar banheiro',done:false},
    {id:6,nome:'Aspirar o tapete',done:false},
    {id:7,nome:'Lavar roupas',done:true},
    {id:8,nome:'Limpar janelas',done:false},
  ],
}
const comprasDefault = [
  {id:1,nome:'Frango (1kg)',cat:'Supermercado',done:false,qtd:'1kg'},
  {id:2,nome:'Arroz integral',cat:'Supermercado',done:false,qtd:'2 pct'},
  {id:3,nome:'Ovos (12 un)',cat:'Supermercado',done:true,qtd:'1 cx'},
  {id:4,nome:'Protetor solar',cat:'Farmácia',done:false,qtd:'1 un'},
]
const CATS = ['Supermercado','Farmácia','Padaria','Hortifruti','Limpeza','Outro']
const FREQS = ['Diárias','Semanais']

export default function Casa() {
  const [tab, setTab] = useState(0)
  const [tarefas, setTarefas] = useLocalStorage('evoluaja_tarefas_casa', tarefasDefault)
  const [compras, setCompras] = useLocalStorage('evoluaja_compras', comprasDefault)
  const [modalT, setModalT] = useState(null)
  const [modalC, setModalC] = useState(null)
  const [fT, setFT] = useState({nome:'',freq:'Diárias'})
  const [fC, setFC] = useState({nome:'',cat:'Supermercado',qtd:''})

  const toggleT = (grupo,id) => setTarefas(p=>({...p,[grupo]:p[grupo].map(t=>t.id===id?{...t,done:!t.done}:t)}))
  const toggleC = (id) => setCompras(p=>p.map(c=>c.id===id?{...c,done:!c.done}:c))

  const abrirT = (grupo,t=null) => { setFT(t?{nome:t.nome,freq:grupo}:{nome:'',freq:grupo}); setModalT({grupo,id:t?t.id:'novo'}) }
  const salvarT = () => {
    if (!fT.nome) return
    const {grupo,id} = modalT
    const freq = fT.freq
    if (id==='novo') {
      setTarefas(p=>({...p,[freq]:[...(p[freq]||[]),{id:Date.now(),nome:fT.nome,done:false}]}))
    } else if (freq!==grupo) {
      const tarefa = tarefas[grupo].find(t=>t.id===id)
      setTarefas(p=>({...p,[grupo]:p[grupo].filter(t=>t.id!==id),[freq]:[...p[freq],{...tarefa,nome:fT.nome}]}))
    } else {
      setTarefas(p=>({...p,[grupo]:p[grupo].map(t=>t.id===id?{...t,nome:fT.nome}:t)}))
    }
    setModalT(null)
  }
  const excluirT = (grupo,id) => setTarefas(p=>({...p,[grupo]:p[grupo].filter(t=>t.id!==id)}))

  const abrirC = (c=null) => { setFC(c?{nome:c.nome,cat:c.cat,qtd:c.qtd||''}:{nome:'',cat:'Supermercado',qtd:''}); setModalC(c?c.id:'novo') }
  const salvarC = () => {
    if (!fC.nome) return
    if (modalC==='novo') setCompras(p=>[...p,{...fC,id:Date.now(),done:false}])
    else setCompras(p=>p.map(c=>c.id===modalC?{...c,...fC}:c))
    setModalC(null)
  }

  const cats = [...new Set(compras.map(c=>c.cat))]
  const comprasConcluidas = compras.filter(c=>c.done).length

  const chip = (ativo) => clsx('px-3 py-1.5 rounded-xl text-xs font-bold border transition-all',
    ativo?'bg-brand-500 text-white border-brand-500':'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700')

  return (
    <div className="page-container animate-fade-in-up">
      <h1 className="text-2xl font-black text-gray-800 dark:text-gray-100 mb-5">Casa & Compras</h1>

      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 mb-5">
        {[{label:'Casa',icon:Home},{label:'Compras',icon:ShoppingCart}].map(({label,icon:Icon},i)=>(
          <button key={label} onClick={()=>setTab(i)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${tab===i?'bg-white dark:bg-gray-700 text-brand-600 shadow-sm':'text-gray-500 dark:text-gray-400'}`}>
            <Icon size={14}/>{label}
          </button>
        ))}
      </div>

      {tab===0 && (
        <div className="space-y-5">
          {Object.entries(tarefas).map(([grupo,items])=>{
            const concluidas = items.filter(t=>t.done).length
            return (
              <div key={grupo}>
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h2 className="section-title mb-0">{grupo}</h2>
                    <p className="text-xs text-gray-400 font-semibold">{concluidas}/{items.length} concluídas</p>
                  </div>
                  <button onClick={()=>abrirT(grupo)} className="btn-ghost py-1 text-xs flex items-center gap-1"><Plus size={13}/> Adicionar</button>
                </div>
                <div className="space-y-2">
                  {items.map(t=>(
                    <div key={t.id} className={clsx('card flex items-center gap-3 py-3',t.done&&'bg-gray-50 dark:bg-gray-800/50')}>
                      <button onClick={()=>toggleT(grupo,t.id)} className="flex-shrink-0">
                        {t.done?<CheckCircle2 size={20} className="text-emerald-500"/>:<Circle size={20} className="text-gray-300 dark:text-gray-600"/>}
                      </button>
                      <span className={clsx('flex-1 text-sm font-semibold',t.done?'line-through text-gray-300 dark:text-gray-600':'text-gray-700 dark:text-gray-300')}>{t.nome}</span>
                      <button onClick={()=>abrirT(grupo,t)} className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"><Edit2 size={14} className="text-gray-400"/></button>
                      <button onClick={()=>excluirT(grupo,t.id)} className="p-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950"><Trash2 size={14} className="text-red-400"/></button>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {tab===1 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{comprasConcluidas}/{compras.length} itens comprados</p>
            <button onClick={()=>abrirC()} className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5"><Plus size={14}/> Adicionar</button>
          </div>
          <div className="progress-bar mb-5">
            <div className="progress-fill bg-emerald-400" style={{width:`${compras.length?(comprasConcluidas/compras.length)*100:0}%`}}/>
          </div>
          {cats.map(cat=>(
            <div key={cat} className="mb-5">
              <h2 className="section-title">{cat}</h2>
              <div className="space-y-2">
                {compras.filter(c=>c.cat===cat).map(c=>(
                  <div key={c.id} className={clsx('card flex items-center gap-3 py-3',c.done&&'opacity-50')}>
                    <button onClick={()=>toggleC(c.id)} className="flex-shrink-0">
                      {c.done?<CheckCircle2 size={20} className="text-emerald-500"/>:<Circle size={20} className="text-gray-300 dark:text-gray-600"/>}
                    </button>
                    <div className="flex-1">
                      <span className={clsx('text-sm font-semibold',c.done?'line-through text-gray-400 dark:text-gray-600':'text-gray-700 dark:text-gray-300')}>{c.nome}</span>
                      {c.qtd&&<span className="text-xs text-gray-400 font-semibold ml-2">({c.qtd})</span>}
                    </div>
                    <button onClick={()=>abrirC(c)} className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700"><Edit2 size={14} className="text-gray-400"/></button>
                    <button onClick={()=>setCompras(p=>p.filter(x=>x.id!==c.id))} className="p-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950"><Trash2 size={14} className="text-red-400"/></button>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {compras.length===0&&<div className="card text-center py-8"><ShoppingCart size={32} className="text-gray-200 dark:text-gray-700 mx-auto mb-2"/><p className="text-sm font-bold text-gray-400">Lista de compras vazia</p></div>}
        </div>
      )}

      {modalT && (
        <Modal titulo={modalT.id==='novo'?'Nova tarefa':'Editar tarefa'} onClose={()=>setModalT(null)} onConfirm={salvarT} confirmLabel="Salvar tarefa">
          <div className="space-y-4">
            <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Nome da tarefa</label><input type="text" value={fT.nome} onChange={e=>setFT(p=>({...p,nome:e.target.value}))} placeholder="Ex: Limpar banheiro" className="input" autoFocus/></div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Frequência</label>
              <div className="flex gap-2">{FREQS.map(f=><button key={f} onClick={()=>setFT(p=>({...p,freq:f}))} className={clsx('flex-1 py-3 rounded-2xl text-sm font-bold border transition-all',fT.freq===f?'bg-brand-500 text-white border-brand-500':'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700')}>{f}</button>)}</div>
            </div>
          </div>
        </Modal>
      )}

      {modalC && (
        <Modal titulo={modalC==='novo'?'Novo item':'Editar item'} onClose={()=>setModalC(null)} onConfirm={salvarC} confirmLabel="Salvar item">
          <div className="space-y-4">
            <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Nome do item</label><input type="text" value={fC.nome} onChange={e=>setFC(p=>({...p,nome:e.target.value}))} placeholder="Ex: Frango 1kg" className="input" autoFocus/></div>
            <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Quantidade</label><input type="text" value={fC.qtd} onChange={e=>setFC(p=>({...p,qtd:e.target.value}))} placeholder="Ex: 1kg, 2 un" className="input"/></div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Categoria</label>
              <div className="flex flex-wrap gap-2">{CATS.map(c=><button key={c} onClick={()=>setFC(p=>({...p,cat:c}))} className={chip(fC.cat===c)}>{c}</button>)}</div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
