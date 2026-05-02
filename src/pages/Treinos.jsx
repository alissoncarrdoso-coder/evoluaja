import { useState } from 'react'
import { ChevronDown, ChevronRight, CheckCircle2, Circle, TrendingUp, Plus, Trash2, Edit2 } from 'lucide-react'
import clsx from 'clsx'
import { useLocalStorage } from '../hooks/useLocalStorage'
import Modal from '../components/ui/Modal'

const GRUPOS = ['Peito','Costas','Ombros','Bíceps','Tríceps','Pernas','Glúteos','Abdômen','Cardio','Funcional']
const CORES = ['from-red-500 to-rose-600','from-blue-500 to-indigo-600','from-emerald-500 to-teal-600','from-orange-500 to-amber-600','from-purple-500 to-violet-600']

const fichasDefault = [
  {id:1,nome:'Treino A – Peito e Tríceps',dia:'Segunda / Quinta',cor:'from-red-500 to-rose-600',exercicios:[
    {id:11,nome:'Supino Reto',series:4,reps:'8-12',carga:60},
    {id:12,nome:'Supino Inclinado Halteres',series:3,reps:'10-12',carga:24},
    {id:13,nome:'Tríceps Corda',series:4,reps:'12-15',carga:30},
  ]},
  {id:2,nome:'Treino B – Costas e Bíceps',dia:'Terça / Sexta',cor:'from-blue-500 to-indigo-600',exercicios:[
    {id:21,nome:'Puxada Frontal',series:4,reps:'8-12',carga:55},
    {id:22,nome:'Remada Curvada',series:4,reps:'8-10',carga:50},
    {id:23,nome:'Rosca Direta',series:3,reps:'10-12',carga:30},
  ]},
  {id:3,nome:'Treino C – Pernas',dia:'Quarta / Sábado',cor:'from-emerald-500 to-teal-600',exercicios:[
    {id:31,nome:'Agachamento Livre',series:4,reps:'8-10',carga:70},
    {id:32,nome:'Leg Press 45°',series:4,reps:'12-15',carga:150},
  ]},
]

function ExercicioRow({ex,onEdit,onDelete}) {
  const [registros,setRegistros] = useState(Array.from({length:ex.series},(_,i)=>({id:i,peso:String(ex.carga),reps:ex.reps.split('-')[0],done:false})))
  const toggleSerie = (i) => setRegistros(p=>p.map((r,idx)=>idx===i?{...r,done:!r.done}:r))
  const update = (i,key,val) => setRegistros(p=>p.map((r,idx)=>idx===i?{...r,[key]:val}:r))
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-bold text-gray-700 dark:text-gray-300">{ex.nome}</p>
        <div className="flex items-center gap-2">
          <span className="badge badge-purple">{ex.series}x{ex.reps}</span>
          <button onClick={()=>onEdit(ex)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><Edit2 size={13} className="text-gray-400"/></button>
          <button onClick={()=>onDelete(ex.id)} className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950"><Trash2 size={13} className="text-red-400"/></button>
        </div>
      </div>
      <div className="space-y-1.5">
        {registros.map((r,i)=>(
          <div key={i} className={clsx('flex items-center gap-2 p-2 rounded-xl',r.done?'bg-emerald-50 dark:bg-emerald-950':'bg-gray-50 dark:bg-gray-800')}>
            <span className="text-xs font-bold text-gray-400 w-6">S{i+1}</span>
            <input type="number" value={r.peso} onChange={e=>update(i,'peso',e.target.value)}
              className="w-16 text-center text-xs font-bold border border-gray-200 dark:border-gray-700 rounded-lg py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-brand-300"/>
            <span className="text-xs text-gray-400">kg</span>
            <span className="text-gray-300">×</span>
            <input type="number" value={r.reps} onChange={e=>update(i,'reps',e.target.value)}
              className="w-14 text-center text-xs font-bold border border-gray-200 dark:border-gray-700 rounded-lg py-1 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-brand-300"/>
            <span className="text-xs text-gray-400 flex-1">reps</span>
            <button onClick={()=>toggleSerie(i)}>
              {r.done?<CheckCircle2 size={20} className="text-emerald-500"/>:<Circle size={20} className="text-gray-300 dark:text-gray-600"/>}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Treinos() {
  const [fichas, setFichas] = useLocalStorage('evoluaja_fichas', fichasDefault)
  const [aberto, setAberto] = useState(null)
  const [modalFicha, setModalFicha] = useState(null)
  const [modalEx, setModalEx] = useState(null)
  const [fFicha, setFFicha] = useState({nome:'',dia:'',cor:CORES[0]})
  const [fEx, setFEx] = useState({nome:'',series:3,reps:'10-12',carga:0})

  const abrirFicha = (f=null) => { setFFicha(f?{nome:f.nome,dia:f.dia,cor:f.cor}:{nome:'',dia:'',cor:CORES[0]}); setModalFicha(f?f.id:'novo') }
  const salvarFicha = () => {
    if (!fFicha.nome) return
    if (modalFicha==='novo') setFichas(p=>[...p,{...fFicha,id:Date.now(),exercicios:[]}])
    else setFichas(p=>p.map(f=>f.id===modalFicha?{...f,...fFicha}:f))
    setModalFicha(null)
  }

  const abrirEx = (fichaId,ex=null) => { setFEx(ex?{nome:ex.nome,series:ex.series,reps:ex.reps,carga:ex.carga}:{nome:'',series:3,reps:'10-12',carga:0}); setModalEx({fichaId,exId:ex?ex.id:'novo'}) }
  const salvarEx = () => {
    if (!fEx.nome) return
    const {fichaId,exId} = modalEx
    setFichas(p=>p.map(f=>{
      if (f.id!==fichaId) return f
      const item={...fEx,id:exId==='novo'?Date.now():exId,series:+fEx.series,carga:+fEx.carga}
      return exId==='novo'?{...f,exercicios:[...f.exercicios,item]}:{...f,exercicios:f.exercicios.map(e=>e.id===exId?item:e)}
    }))
    setModalEx(null)
  }

  const chip = (ativo) => clsx('px-3 py-1.5 rounded-xl text-xs font-bold border transition-all',
    ativo?'bg-brand-500 text-white border-brand-500':'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700')

  return (
    <div className="page-container animate-fade-in-up">
      <h1 className="text-2xl font-black text-gray-800 dark:text-gray-100 mb-5">Treinos</h1>

      <div className="card mb-5 flex gap-4">
        <div className="flex-1 text-center"><p className="text-xs font-bold text-gray-400 mb-1">Fichas</p><p className="text-lg font-black text-gray-800 dark:text-gray-100">{fichas.length}</p></div>
        <div className="w-px bg-gray-100 dark:bg-gray-800"/>
        <div className="flex-1 text-center"><p className="text-xs font-bold text-gray-400 mb-1">Exercícios</p><p className="text-lg font-black text-gray-800 dark:text-gray-100">{fichas.reduce((s,f)=>s+f.exercicios.length,0)}</p></div>
        <div className="w-px bg-gray-100 dark:bg-gray-800"/>
        <div className="flex-1 text-center"><p className="text-xs font-bold text-gray-400 mb-1">Volume est.</p><p className="text-lg font-black text-gray-800 dark:text-gray-100">{fichas.reduce((s,f)=>s+f.exercicios.reduce((es,e)=>es+e.series*e.carga,0),0).toLocaleString()}kg</p></div>
      </div>

      <div className="space-y-3 mb-4">
        {fichas.map(ficha=>(
          <div key={ficha.id} className="card overflow-hidden">
            <div className="flex items-center gap-3">
              <button onClick={()=>setAberto(aberto===ficha.id?null:ficha.id)} className="flex items-center gap-3 flex-1 text-left">
                <div className={`bg-gradient-to-br ${ficha.cor} w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0`}><TrendingUp size={20} className="text-white"/></div>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">{ficha.nome}</p>
                  <p className="text-xs text-gray-400 font-semibold">{ficha.dia} · {ficha.exercicios.length} exercícios</p>
                </div>
                {aberto===ficha.id?<ChevronDown size={18} className="text-gray-400"/>:<ChevronRight size={18} className="text-gray-400"/>}
              </button>
              <button onClick={()=>abrirFicha(ficha)} className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"><Edit2 size={15} className="text-gray-400"/></button>
              <button onClick={()=>{setFichas(p=>p.filter(f=>f.id!==ficha.id));if(aberto===ficha.id)setAberto(null)}} className="p-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950"><Trash2 size={15} className="text-red-400"/></button>
            </div>
            {aberto===ficha.id && (
              <div className="mt-4 pt-4 border-t border-gray-50 dark:border-gray-800">
                {ficha.exercicios.map(ex=>(
                  <ExercicioRow key={ex.id} ex={ex}
                    onEdit={e=>abrirEx(ficha.id,e)}
                    onDelete={id=>setFichas(p=>p.map(f=>f.id!==ficha.id?f:{...f,exercicios:f.exercicios.filter(e=>e.id!==id)}))}/>
                ))}
                <button onClick={()=>abrirEx(ficha.id)}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-gray-400 font-bold text-sm hover:border-brand-300 hover:text-brand-500 transition-colors mt-3">
                  <Plus size={16}/> Adicionar exercício
                </button>
                <button className="w-full btn-primary mt-3 flex items-center justify-center gap-2"><CheckCircle2 size={18}/> Finalizar treino</button>
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={()=>abrirFicha()} className="w-full btn-primary flex items-center justify-center gap-2"><Plus size={18}/> Nova ficha de treino</button>

      {modalFicha && (
        <Modal titulo={modalFicha==='novo'?'Nova ficha':'Editar ficha'} onClose={()=>setModalFicha(null)} onConfirm={salvarFicha} confirmLabel="Salvar ficha">
          <div className="space-y-4">
            <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Nome da ficha</label><input type="text" value={fFicha.nome} onChange={e=>setFFicha(p=>({...p,nome:e.target.value}))} placeholder="Ex: Treino A – Peito" className="input" autoFocus/></div>
            <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Dias da semana</label><input type="text" value={fFicha.dia} onChange={e=>setFFicha(p=>({...p,dia:e.target.value}))} placeholder="Ex: Segunda / Quinta" className="input"/></div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Cor</label>
              <div className="flex gap-3">{CORES.map(c=><button key={c} onClick={()=>setFFicha(p=>({...p,cor:c}))} className={clsx('w-10 h-10 rounded-2xl flex-shrink-0',`bg-gradient-to-br ${c}`,fFicha.cor===c?'ring-2 ring-offset-2 ring-gray-400':'')}/>)}</div>
            </div>
          </div>
        </Modal>
      )}

      {modalEx && (
        <Modal titulo={modalEx.exId==='novo'?'Novo exercício':'Editar exercício'} onClose={()=>setModalEx(null)} onConfirm={salvarEx} confirmLabel="Salvar exercício">
          <div className="space-y-4">
            <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Nome do exercício</label><input type="text" value={fEx.nome} onChange={e=>setFEx(p=>({...p,nome:e.target.value}))} placeholder="Ex: Supino Reto" className="input" autoFocus/></div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Grupo muscular</label>
              <div className="flex flex-wrap gap-2">{GRUPOS.map(g=><button key={g} className="px-3 py-1.5 rounded-xl text-xs font-bold border bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-brand-300">{g}</button>)}</div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Séries</label><input type="number" value={fEx.series} onChange={e=>setFEx(p=>({...p,series:e.target.value}))} className="input text-center"/></div>
              <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Reps</label><input type="text" value={fEx.reps} onChange={e=>setFEx(p=>({...p,reps:e.target.value}))} placeholder="8-12" className="input text-center"/></div>
              <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Carga (kg)</label><input type="number" value={fEx.carga} onChange={e=>setFEx(p=>({...p,carga:e.target.value}))} placeholder="0" className="input text-center"/></div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
