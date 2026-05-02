import { useState, useMemo } from 'react'
import { CheckCircle2, Circle, Clock, ChevronLeft, ChevronRight, AlertCircle, Plus, Trash2, Edit2, Check, CalendarDays } from 'lucide-react'
import clsx from 'clsx'
import { useLocalStorage } from '../hooks/useLocalStorage'
import Modal from '../components/ui/Modal'

const diasSemana = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb']
const meses = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

function inicioSemana(date) {
  const d = new Date(date); d.setHours(0,0,0,0); d.setDate(d.getDate() - d.getDay()); return d
}
function toKey(date) { return date.toISOString().split('T')[0] }
function fromKey(key) { const [y,m,d] = key.split('-').map(Number); return new Date(y,m-1,d) }

const CATS = ['Trabalho','Estudos','Treino','Alimentação','Saúde','Casa','Hábitos','Lazer','Outro']
const catColors = {
  'Trabalho':'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
  'Estudos':'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300',
  'Treino':'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
  'Alimentação':'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300',
  'Saúde':'bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300',
  'Casa':'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
  'Hábitos':'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300',
  'Lazer':'bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300',
  'Outro':'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
}

const hoje = new Date()
const hojeKey = toKey(hoje)
const tarefasDefault = [
  {id:1,hora:'06:30',titulo:'Acordar e alongamento',cat:'Saúde',status:'done'},
  {id:2,hora:'07:00',titulo:'Café da manhã',cat:'Alimentação',status:'done'},
  {id:3,hora:'08:00',titulo:'Trabalho – Relatório mensal',cat:'Trabalho',status:'done'},
  {id:4,hora:'10:30',titulo:'Reunião de equipe',cat:'Trabalho',status:'late'},
  {id:5,hora:'12:00',titulo:'Almoço',cat:'Alimentação',status:'pending'},
  {id:6,hora:'14:00',titulo:'Estudar React',cat:'Estudos',status:'next'},
  {id:7,hora:'16:30',titulo:'Treino B – Costas',cat:'Treino',status:'pending'},
  {id:8,hora:'19:00',titulo:'Jantar',cat:'Alimentação',status:'pending'},
]

export default function Rotina() {
  const [todasTarefas, setTodasTarefas] = useLocalStorage('evoluaja_tarefas_v2', {[hojeKey]: tarefasDefault})
  const [semanaBase, setSemanaBase] = useState(() => inicioSemana(hoje))
  const [diaSel, setDiaSel] = useState(hojeKey)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState({hora:'08:00',titulo:'',cat:'Trabalho',status:'pending'})

  const diasDaSemana = useMemo(() => Array.from({length:7},(_,i)=>{ const d=new Date(semanaBase); d.setDate(semanaBase.getDate()+i); return d }), [semanaBase])
  const semAnt = () => { const d=new Date(semanaBase); d.setDate(d.getDate()-7); setSemanaBase(d) }
  const proxSem = () => { const d=new Date(semanaBase); d.setDate(d.getDate()+7); setSemanaBase(d) }
  const voltarHoje = () => { setSemanaBase(inicioSemana(hoje)); setDiaSel(hojeKey) }

  const tarefasDia = todasTarefas[diaSel] || []
  const setTarefasDia = (key,fn) => setTodasTarefas(prev=>({...prev,[key]:fn(prev[key]||[])}))

  const toggle = (id) => setTarefasDia(diaSel, prev=>prev.map(t=>t.id===id?{...t,status:t.status==='done'?'pending':'done'}:t))
  const excluir = (id) => setTarefasDia(diaSel, prev=>prev.filter(t=>t.id!==id))

  const abrirNova = () => { setForm({hora:'08:00',titulo:'',cat:'Trabalho',status:'pending'}); setModal('nova') }
  const abrirEditar = (t) => { setForm({hora:t.hora,titulo:t.titulo,cat:t.cat,status:t.status}); setModal(t.id) }

  const salvar = () => {
    if (!form.titulo.trim()) return
    if (modal==='nova') setTarefasDia(diaSel, prev=>[...prev,{...form,id:Date.now()}].sort((a,b)=>a.hora.localeCompare(b.hora)))
    else setTarefasDia(diaSel, prev=>prev.map(t=>t.id===modal?{...t,...form}:t))
    setModal(null)
  }

  const concluidas = tarefasDia.filter(t=>t.status==='done').length
  const pctDia = tarefasDia.length ? Math.round((concluidas/tarefasDia.length)*100) : 0
  const diaSelDate = fromKey(diaSel)
  const mesAno = `${meses[diaSelDate.getMonth()]} ${diaSelDate.getFullYear()}`
  const temTarefas = (key) => (todasTarefas[key]||[]).length > 0
  const qtdDone = (key) => { const t=todasTarefas[key]||[]; return t.length > 0 && t.every(x=>x.status==='done') }

  const chip = (ativo) => clsx('px-3 py-1.5 rounded-xl text-xs font-bold border transition-all',
    ativo ? 'bg-brand-500 text-white border-brand-500' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700')

  return (
    <div className="page-container animate-fade-in-up">
      <div className="flex items-center justify-between mb-5 pt-1">
        <h1 className="text-2xl font-black text-gray-800 dark:text-gray-100">Minha Rotina</h1>
        {diaSel !== hojeKey && (
          <button onClick={voltarHoje} className="btn-ghost py-1.5 text-xs flex items-center gap-1">
            <CalendarDays size={13} /> Hoje
          </button>
        )}
      </div>

      {/* Calendário */}
      <div className="card mb-5">
        <div className="flex items-center justify-between mb-4">
          <button onClick={semAnt} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"><ChevronLeft size={18} className="text-gray-500 dark:text-gray-400" /></button>
          <div className="text-center">
            <p className="font-bold text-gray-700 dark:text-gray-300 text-sm">{mesAno}</p>
            <p className="text-xs text-gray-400 font-semibold mt-0.5">{diasDaSemana[0].getDate()}/{diasDaSemana[0].getMonth()+1} – {diasDaSemana[6].getDate()}/{diasDaSemana[6].getMonth()+1}</p>
          </div>
          <button onClick={proxSem} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"><ChevronRight size={18} className="text-gray-500 dark:text-gray-400" /></button>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {diasDaSemana.map((dia,i) => {
            const key = toKey(dia)
            const isToday = key === hojeKey
            const isSel = key === diaSel
            const hasTasks = temTarefas(key)
            const allDone = qtdDone(key)
            return (
              <button key={key} onClick={() => setDiaSel(key)}
                className={clsx('flex flex-col items-center py-2 rounded-2xl transition-all relative',
                  isSel && isToday ? 'bg-brand-500' : '',
                  isSel && !isToday ? 'bg-brand-100 dark:bg-brand-900' : '',
                  !isSel && isToday ? 'ring-2 ring-brand-400' : '',
                  !isSel && !isToday ? 'hover:bg-gray-50 dark:hover:bg-gray-800' : '')}>
                <span className={clsx('text-[10px] font-bold mb-1',
                  isSel && isToday ? 'text-brand-100' : isSel ? 'text-brand-600 dark:text-brand-300' : isToday ? 'text-brand-500' : 'text-gray-400 dark:text-gray-500')}>
                  {diasSemana[i]}
                </span>
                <span className={clsx('text-sm font-black leading-none',
                  isSel && isToday ? 'text-white' : isSel ? 'text-brand-700 dark:text-brand-200' : isToday ? 'text-brand-600' : 'text-gray-700 dark:text-gray-300')}>
                  {dia.getDate()}
                </span>
                {hasTasks && (
                  <div className={clsx('mt-1 w-1.5 h-1.5 rounded-full',
                    allDone ? 'bg-emerald-400' : isSel && isToday ? 'bg-white/70' : 'bg-brand-300 dark:bg-brand-600')} />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Info do dia */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-sm font-black text-gray-700 dark:text-gray-300">
            {diaSel===hojeKey ? 'Hoje' : diaSel===toKey(new Date(hoje.getTime()-86400000)) ? 'Ontem' : diaSel===toKey(new Date(hoje.getTime()+86400000)) ? 'Amanhã' : fromKey(diaSel).toLocaleDateString('pt-BR',{weekday:'long',day:'numeric',month:'long'})}
          </p>
          <p className="text-xs text-gray-400 font-semibold">{fromKey(diaSel).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit',year:'numeric'})}</p>
        </div>
        {tarefasDia.length > 0 && (
          <span className="text-xs font-bold text-brand-600 bg-brand-50 dark:bg-brand-950 px-3 py-1.5 rounded-xl">{concluidas}/{tarefasDia.length} · {pctDia}%</span>
        )}
      </div>

      {tarefasDia.length > 0 && (
        <div className="progress-bar mb-4">
          <div className="progress-fill bg-brand-500" style={{width:`${pctDia}%`}} />
        </div>
      )}

      {/* Lista */}
      {tarefasDia.length === 0 ? (
        <div className="card text-center py-10 mb-4">
          <CalendarDays size={36} className="text-gray-200 dark:text-gray-700 mx-auto mb-3" />
          <p className="text-sm font-bold text-gray-400 mb-1">Nenhuma tarefa neste dia</p>
          <p className="text-xs text-gray-300 dark:text-gray-600 font-semibold">Clique em "Nova tarefa" para começar</p>
        </div>
      ) : (
        <div className="space-y-2 mb-4">
          {tarefasDia.map(t => (
            <div key={t.id} className={clsx('card flex items-center gap-3 py-3 transition-all', t.status==='done' && 'opacity-60')}>
              <button onClick={()=>toggle(t.id)} className="flex-shrink-0">
                {t.status==='done' ? <CheckCircle2 size={22} className="text-emerald-500" />
                  : t.status==='late' ? <AlertCircle size={22} className="text-red-400" />
                  : t.status==='next' ? <Clock size={22} className="text-brand-500 animate-pulse" />
                  : <Circle size={22} className="text-gray-300 dark:text-gray-600" />}
              </button>
              <div className="flex-1 min-w-0">
                <p className={clsx('text-sm font-bold truncate', t.status==='done' ? 'line-through text-gray-400 dark:text-gray-600' : 'text-gray-800 dark:text-gray-100')}>{t.titulo}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-xs font-semibold text-gray-400">{t.hora}</span>
                  <span className={`badge ${catColors[t.cat]||catColors['Outro']}`}>{t.cat}</span>
                  {t.status==='late' && <span className="badge badge-red">Atrasada</span>}
                  {t.status==='next' && <span className="badge badge-purple">Próxima</span>}
                </div>
              </div>
              <button onClick={()=>abrirEditar(t)} className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0"><Edit2 size={15} className="text-gray-400" /></button>
              <button onClick={()=>excluir(t.id)} className="p-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950 flex-shrink-0"><Trash2 size={15} className="text-red-400" /></button>
            </div>
          ))}
        </div>
      )}

      <button onClick={abrirNova} className="w-full btn-primary flex items-center justify-center gap-2">
        <Plus size={18} /> Nova tarefa {diaSel!==hojeKey && `— ${fromKey(diaSel).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'})}`}
      </button>

      {modal && (
        <Modal titulo={modal==='nova' ? 'Nova tarefa' : 'Editar tarefa'} onClose={()=>setModal(null)} onConfirm={salvar} confirmLabel="Salvar tarefa">
          <div className="space-y-4">
            <div className="bg-brand-50 dark:bg-brand-950 rounded-2xl px-4 py-2.5">
              <p className="text-xs font-bold text-brand-600 dark:text-brand-400">📅 {diaSel===hojeKey ? 'Hoje' : fromKey(diaSel).toLocaleDateString('pt-BR',{weekday:'long',day:'2-digit',month:'long'})}</p>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Título</label>
              <input type="text" value={form.titulo} onChange={e=>setForm(p=>({...p,titulo:e.target.value}))} placeholder="Nome da tarefa" className="input" autoFocus />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Horário</label>
                <input type="time" value={form.hora} onChange={e=>setForm(p=>({...p,hora:e.target.value}))} className="input" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Status</label>
                <select value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))} className="input">
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
                {CATS.map(c => <button key={c} onClick={()=>setForm(p=>({...p,cat:c}))} className={chip(form.cat===c)}>{c}</button>)}
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
