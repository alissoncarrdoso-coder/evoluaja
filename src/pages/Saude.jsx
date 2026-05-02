import { useState } from 'react'
import { Heart, Pill, Calendar, Plus, Clock, CheckCircle2, Circle, Trash2, Edit2, AlertCircle, X } from 'lucide-react'
import clsx from 'clsx'
import { useLocalStorage } from '../hooks/useLocalStorage'
import Modal from '../components/ui/Modal'

const consultasDefault = [
  {id:1,medico:'Dr. Carlos Silva',especialidade:'Clínico Geral',data:'2025-07-28',hora:'09:00',local:'Clínica São Lucas',status:'agendada',obs:''},
  {id:2,medico:'Dra. Ana Souza',especialidade:'Dermatologista',data:'2025-08-15',hora:'14:30',local:'Consultório Centro',status:'agendada',obs:''},
  {id:3,medico:'Dr. Pedro Lima',especialidade:'Ortopedista',data:'2025-06-10',hora:'11:00',local:'Hospital Geral',status:'concluída',obs:'Retorno em 3 meses'},
]
const medsDefault = [
  {id:1,nome:'Vitamina D 2000UI',dose:'1 cápsula',horarios:['08:00'],estoque:24,unidade:'cápsulas',done:true},
  {id:2,nome:'Ômega 3',dose:'2 cápsulas',horarios:['13:00'],estoque:45,unidade:'cápsulas',done:false},
  {id:3,nome:'Creatina 5g',dose:'1 colher',horarios:['pré-treino'],estoque:120,unidade:'doses',done:true},
]

const ESPECIALIDADES = ['Clínico Geral','Cardiologista','Dermatologista','Ortopedista','Nutricionista','Psicólogo','Dentista','Oftalmologista','Outro']
const STATUS_C = ['agendada','concluída','cancelada']
const TABS = ['Consultas','Medicamentos']
const statusColor = {agendada:'badge-purple',concluída:'badge-green',cancelada:'badge-red'}

export default function Saude() {
  const [tab, setTab] = useState(0)
  const [consultas, setConsultas] = useLocalStorage('evoluaja_consultas', consultasDefault)
  const [medicamentos, setMedicamentos] = useLocalStorage('evoluaja_medicamentos', medsDefault)
  const [modalC, setModalC] = useState(null)
  const [modalM, setModalM] = useState(null)
  const [fC, setFC] = useState({medico:'',especialidade:'Clínico Geral',data:'',hora:'',local:'',status:'agendada',obs:''})
  const [fM, setFM] = useState({nome:'',dose:'',horarios:['08:00'],estoque:'',unidade:'comprimidos'})
  const [novoHorario, setNovoHorario] = useState('')

  const abrirC = (c=null) => {
    setFC(c?{medico:c.medico,especialidade:c.especialidade,data:c.data,hora:c.hora,local:c.local,status:c.status,obs:c.obs}:{medico:'',especialidade:'Clínico Geral',data:'',hora:'',local:'',status:'agendada',obs:''})
    setModalC(c?c.id:'novo')
  }
  const salvarC = () => {
    if (!fC.medico||!fC.data) return
    if (modalC==='novo') setConsultas(p=>[...p,{...fC,id:Date.now()}])
    else setConsultas(p=>p.map(c=>c.id===modalC?{...c,...fC}:c))
    setModalC(null)
  }

  const abrirM = (m=null) => {
    setFM(m?{nome:m.nome,dose:m.dose,horarios:[...m.horarios],estoque:m.estoque,unidade:m.unidade}:{nome:'',dose:'',horarios:['08:00'],estoque:'',unidade:'comprimidos'})
    setNovoHorario('')
    setModalM(m?m.id:'novo')
  }
  const salvarM = () => {
    if (!fM.nome) return
    if (modalM==='novo') setMedicamentos(p=>[...p,{...fM,id:Date.now(),done:false,estoque:+fM.estoque||0}])
    else setMedicamentos(p=>p.map(m=>m.id===modalM?{...m,...fM,estoque:+fM.estoque}:m))
    setModalM(null)
  }
  const toggleM = (id) => setMedicamentos(p=>p.map(m=>m.id===id?{...m,done:!m.done}:m))
  const addHorario = () => { if (!novoHorario) return; setFM(p=>({...p,horarios:[...p.horarios,novoHorario]})); setNovoHorario('') }
  const remHorario = (i) => setFM(p=>({...p,horarios:p.horarios.filter((_,idx)=>idx!==i)}))

  const proximas = consultas.filter(c=>c.status==='agendada').sort((a,b)=>a.data.localeCompare(b.data))
  const historico = consultas.filter(c=>c.status!=='agendada')
  const medsTomados = medicamentos.filter(m=>m.done).length

  const chip = (ativo) => clsx('px-3 py-1.5 rounded-xl text-xs font-bold border transition-all',
    ativo?'bg-brand-500 text-white border-brand-500':'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700')

  return (
    <div className="page-container animate-fade-in-up">
      <h1 className="text-2xl font-black text-gray-800 dark:text-gray-100 mb-5">Saúde & Compromissos</h1>

      <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-2xl p-1 mb-5">
        {TABS.map((t,i)=>(
          <button key={t} onClick={()=>setTab(i)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${tab===i?'bg-white dark:bg-gray-700 text-brand-600 shadow-sm':'text-gray-500 dark:text-gray-400'}`}>{t}</button>
        ))}
      </div>

      {/* CONSULTAS */}
      {tab===0 && (
        <div>
          <button onClick={()=>abrirC()} className="w-full btn-primary flex items-center justify-center gap-2 mb-4"><Plus size={18}/> Nova consulta</button>
          {proximas.length>0 && (
            <>
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Próximas</h3>
              <div className="space-y-3 mb-5">
                {proximas.map(c=>(
                  <div key={c.id} className="card">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 bg-pink-100 dark:bg-pink-950 rounded-2xl flex items-center justify-center flex-shrink-0"><Heart size={18} className="text-pink-500"/></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">{c.medico}</p>
                          <span className={`badge ${statusColor[c.status]}`}>{c.status}</span>
                        </div>
                        <p className="text-xs text-gray-400 font-semibold">{c.especialidade}</p>
                        <div className="flex items-center gap-1.5 mt-1.5">
                          <Calendar size={12} className="text-gray-300 dark:text-gray-600"/>
                          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">{new Date(c.data+'T12:00').toLocaleDateString('pt-BR')} às {c.hora}</span>
                        </div>
                        {c.local&&<p className="text-xs text-gray-400 font-semibold mt-0.5">📍 {c.local}</p>}
                        {c.obs&&<p className="text-xs text-gray-400 italic mt-0.5">{c.obs}</p>}
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button onClick={()=>abrirC(c)} className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"><Edit2 size={14} className="text-gray-400"/></button>
                        <button onClick={()=>setConsultas(p=>p.filter(x=>x.id!==c.id))} className="p-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950"><Trash2 size={14} className="text-red-400"/></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {historico.length>0 && (
            <>
              <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Histórico</h3>
              <div className="space-y-3">
                {historico.map(c=>(
                  <div key={c.id} className="card opacity-70">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 bg-gray-100 dark:bg-gray-800 rounded-2xl flex items-center justify-center flex-shrink-0"><Heart size={18} className="text-gray-400"/></div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-bold text-gray-600 dark:text-gray-400 text-sm">{c.medico}</p>
                          <span className={`badge ${statusColor[c.status]}`}>{c.status}</span>
                        </div>
                        <p className="text-xs text-gray-400 font-semibold">{c.especialidade}</p>
                        <p className="text-xs text-gray-400 font-semibold mt-1">{new Date(c.data+'T12:00').toLocaleDateString('pt-BR')} às {c.hora}</p>
                        {c.obs&&<p className="text-xs text-gray-400 italic mt-0.5">{c.obs}</p>}
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button onClick={()=>abrirC(c)} className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"><Edit2 size={14} className="text-gray-400"/></button>
                        <button onClick={()=>setConsultas(p=>p.filter(x=>x.id!==c.id))} className="p-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950"><Trash2 size={14} className="text-red-400"/></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
          {consultas.length===0&&<div className="card text-center py-8"><Heart size={32} className="text-gray-200 dark:text-gray-700 mx-auto mb-2"/><p className="text-sm font-bold text-gray-400">Nenhuma consulta cadastrada</p></div>}
        </div>
      )}

      {/* MEDICAMENTOS */}
      {tab===1 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-gray-500 dark:text-gray-400">{medsTomados}/{medicamentos.length} tomados hoje</p>
            <button onClick={()=>abrirM()} className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5"><Plus size={14}/> Adicionar</button>
          </div>
          {medicamentos.length>0 && (
            <div className="progress-bar mb-4">
              <div className="progress-fill bg-emerald-400" style={{width:`${medicamentos.length?(medsTomados/medicamentos.length)*100:0}%`}}/>
            </div>
          )}
          <div className="space-y-3">
            {medicamentos.map(m=>(
              <div key={m.id} className={clsx('card flex items-center gap-3 transition-all',m.done&&'bg-emerald-50 dark:bg-emerald-950 border-emerald-100 dark:border-emerald-900')}>
                <button onClick={()=>toggleM(m.id)} className="flex-shrink-0">
                  {m.done?<CheckCircle2 size={22} className="text-emerald-500"/>:<Circle size={22} className="text-gray-300 dark:text-gray-600"/>}
                </button>
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${m.done?'bg-emerald-100 dark:bg-emerald-900':'bg-gray-100 dark:bg-gray-800'}`}>
                  <Pill size={18} className={m.done?'text-emerald-500':'text-gray-400'}/>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">{m.nome}</p>
                  <p className="text-xs text-gray-400 font-semibold">{m.dose}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Clock size={11} className="text-gray-300 dark:text-gray-600"/>
                    <span className="text-xs font-bold text-gray-400">{m.horarios.join(', ')}</span>
                    <span className="badge badge-blue">Estoque: {m.estoque} {m.unidade}</span>
                  </div>
                </div>
                <button onClick={()=>abrirM(m)} className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0"><Edit2 size={14} className="text-gray-400"/></button>
                <button onClick={()=>setMedicamentos(p=>p.filter(x=>x.id!==m.id))} className="p-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950 flex-shrink-0"><Trash2 size={14} className="text-red-400"/></button>
              </div>
            ))}
            {medicamentos.length===0&&<div className="card text-center py-8"><Pill size={32} className="text-gray-200 dark:text-gray-700 mx-auto mb-2"/><p className="text-sm font-bold text-gray-400">Nenhum medicamento cadastrado</p></div>}
          </div>
        </div>
      )}

      {/* Modal Consulta */}
      {modalC && (
        <Modal titulo={modalC==='novo'?'Nova consulta':'Editar consulta'} onClose={()=>setModalC(null)} onConfirm={salvarC} confirmLabel="Salvar consulta">
          <div className="space-y-4">
            <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Nome do médico</label><input type="text" value={fC.medico} onChange={e=>setFC(p=>({...p,medico:e.target.value}))} placeholder="Dr. Nome Sobrenome" className="input" autoFocus/></div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Especialidade</label>
              <div className="flex flex-wrap gap-2">{ESPECIALIDADES.map(e=><button key={e} onClick={()=>setFC(p=>({...p,especialidade:e}))} className={chip(fC.especialidade===e)}>{e}</button>)}</div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Data</label><input type="date" value={fC.data} onChange={e=>setFC(p=>({...p,data:e.target.value}))} className="input"/></div>
              <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Horário</label><input type="time" value={fC.hora} onChange={e=>setFC(p=>({...p,hora:e.target.value}))} className="input"/></div>
            </div>
            <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Local / Clínica</label><input type="text" value={fC.local} onChange={e=>setFC(p=>({...p,local:e.target.value}))} placeholder="Ex: Clínica São Lucas" className="input"/></div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Status</label>
              <div className="flex gap-2">{STATUS_C.map(s=><button key={s} onClick={()=>setFC(p=>({...p,status:s}))} className={clsx('flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all capitalize',fC.status===s?'bg-brand-500 text-white border-brand-500':'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700')}>{s}</button>)}</div>
            </div>
            <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Observações</label><textarea value={fC.obs} onChange={e=>setFC(p=>({...p,obs:e.target.value}))} placeholder="Anotações..." rows={2} className="input resize-none"/></div>
          </div>
        </Modal>
      )}

      {/* Modal Medicamento */}
      {modalM && (
        <Modal titulo={modalM==='novo'?'Novo medicamento':'Editar medicamento'} onClose={()=>setModalM(null)} onConfirm={salvarM} confirmLabel="Salvar medicamento">
          <div className="space-y-4">
            <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Nome</label><input type="text" value={fM.nome} onChange={e=>setFM(p=>({...p,nome:e.target.value}))} placeholder="Ex: Vitamina D 2000UI" className="input" autoFocus/></div>
            <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Dose</label><input type="text" value={fM.dose} onChange={e=>setFM(p=>({...p,dose:e.target.value}))} placeholder="Ex: 1 cápsula" className="input"/></div>
            <div className="grid grid-cols-2 gap-3">
              <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Estoque</label><input type="number" value={fM.estoque} onChange={e=>setFM(p=>({...p,estoque:e.target.value}))} placeholder="0" className="input"/></div>
              <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Unidade</label><input type="text" value={fM.unidade} onChange={e=>setFM(p=>({...p,unidade:e.target.value}))} placeholder="cápsulas" className="input"/></div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Horários de uso</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {fM.horarios.map((h,i)=>(
                  <span key={i} className="flex items-center gap-1 px-3 py-1.5 bg-brand-100 dark:bg-brand-900 text-brand-700 dark:text-brand-300 rounded-xl text-xs font-bold">
                    {h}<button onClick={()=>remHorario(i)} className="ml-1"><X size={12}/></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={novoHorario} onChange={e=>setNovoHorario(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addHorario()} placeholder="08:00 ou pré-treino" className="input flex-1"/>
                <button onClick={addHorario} className="px-4 py-2.5 bg-brand-100 dark:bg-brand-900 text-brand-600 dark:text-brand-400 rounded-2xl font-bold text-sm hover:bg-brand-200"><Plus size={16}/></button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
