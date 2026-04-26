import { useState } from 'react'
import { Heart, Pill, Calendar, Plus, Clock, CheckCircle2, Circle, Trash2, Edit2, X, Check, AlertCircle } from 'lucide-react'
import clsx from 'clsx'

const consultasIniciais = [
  { id: 1, medico: 'Dr. Carlos Silva', especialidade: 'Clínico Geral', data: '2025-07-28', hora: '09:00', local: 'Clínica São Lucas', status: 'agendada', obs: '' },
  { id: 2, medico: 'Dra. Ana Souza', especialidade: 'Dermatologista', data: '2025-08-15', hora: '14:30', local: 'Consultório Centro', status: 'agendada', obs: '' },
  { id: 3, medico: 'Dr. Pedro Lima', especialidade: 'Ortopedista', data: '2025-06-10', hora: '11:00', local: 'Hospital Geral', status: 'concluída', obs: 'Retorno em 3 meses' },
]

const medicamentosIniciais = [
  { id: 1, nome: 'Vitamina D 2000UI', dose: '1 cápsula', horarios: ['08:00'], estoque: 24, unidade: 'cápsulas', done: true },
  { id: 2, nome: 'Ômega 3', dose: '2 cápsulas', horarios: ['13:00'], estoque: 45, unidade: 'cápsulas', done: false },
  { id: 3, nome: 'Creatina 5g', dose: '1 colher', horarios: ['pré-treino'], estoque: 120, unidade: 'doses', done: true },
  { id: 4, nome: 'Whey Protein', dose: '30g', horarios: ['pós-treino'], estoque: 800, unidade: 'g', done: true },
]

const ESPECIALIDADES = ['Clínico Geral', 'Cardiologista', 'Dermatologista', 'Ortopedista', 'Nutricionista', 'Psicólogo', 'Dentista', 'Oftalmologista', 'Neurologista', 'Outro']
const STATUS_CONSULTA = ['agendada', 'concluída', 'cancelada']
const TABS = ['Consultas', 'Medicamentos']

const consultaVazia = { medico: '', especialidade: 'Clínico Geral', data: '', hora: '', local: '', status: 'agendada', obs: '' }
const medVazio = { nome: '', dose: '', horarios: ['08:00'], estoque: '', unidade: 'comprimidos' }

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

const statusColor = { agendada: 'badge-purple', concluída: 'badge-green', cancelada: 'badge-red' }
const statusIcon = { agendada: Calendar, concluída: CheckCircle2, cancelada: AlertCircle }

export default function Saude() {
  const [tab, setTab] = useState(0)
  const [consultas, setConsultas] = useState(consultasIniciais)
  const [medicamentos, setMedicamentos] = useState(medicamentosIniciais)
  const [modalConsulta, setModalConsulta] = useState(null)
  const [modalMed, setModalMed] = useState(null)
  const [formConsulta, setFormConsulta] = useState(consultaVazia)
  const [formMed, setFormMed] = useState(medVazio)
  const [novoHorario, setNovoHorario] = useState('')

  // Consultas
  const abrirConsulta = (c = null) => {
    setFormConsulta(c ? { medico: c.medico, especialidade: c.especialidade, data: c.data, hora: c.hora, local: c.local, status: c.status, obs: c.obs } : consultaVazia)
    setModalConsulta(c ? c.id : 'novo')
  }
  const salvarConsulta = () => {
    if (!formConsulta.medico || !formConsulta.data) return
    if (modalConsulta === 'novo') setConsultas(p => [...p, { ...formConsulta, id: Date.now() }])
    else setConsultas(p => p.map(c => c.id === modalConsulta ? { ...c, ...formConsulta } : c))
    setModalConsulta(null)
  }

  // Medicamentos
  const abrirMed = (m = null) => {
    setFormMed(m ? { nome: m.nome, dose: m.dose, horarios: [...m.horarios], estoque: m.estoque, unidade: m.unidade } : medVazio)
    setNovoHorario('')
    setModalMed(m ? m.id : 'novo')
  }
  const salvarMed = () => {
    if (!formMed.nome) return
    if (modalMed === 'novo') setMedicamentos(p => [...p, { ...formMed, id: Date.now(), done: false, estoque: +formMed.estoque || 0 }])
    else setMedicamentos(p => p.map(m => m.id === modalMed ? { ...m, ...formMed, estoque: +formMed.estoque } : m))
    setModalMed(null)
  }
  const toggleMed = (id) => setMedicamentos(p => p.map(m => m.id === id ? { ...m, done: !m.done } : m))
  const addHorario = () => {
    if (!novoHorario) return
    setFormMed(p => ({ ...p, horarios: [...p.horarios, novoHorario] }))
    setNovoHorario('')
  }
  const remHorario = (i) => setFormMed(p => ({ ...p, horarios: p.horarios.filter((_, idx) => idx !== i) }))

  const proximas = consultas.filter(c => c.status === 'agendada').sort((a, b) => a.data.localeCompare(b.data))
  const concluidas = consultas.filter(c => c.status !== 'agendada')
  const medsTomados = medicamentos.filter(m => m.done).length

  return (
    <div className="page-container animate-fade-in-up">
      <h1 className="text-2xl font-black text-gray-800 mb-5">Saúde & Compromissos</h1>

      <div className="flex gap-1 bg-gray-100 rounded-2xl p-1 mb-5">
        {TABS.map((t, i) => (
          <button key={t} onClick={() => setTab(i)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all ${tab === i ? 'bg-white text-brand-600 shadow-sm' : 'text-gray-500'}`}>
            {t}
          </button>
        ))}
      </div>

      {/* ABA CONSULTAS */}
      {tab === 0 && (
        <div>
          <button onClick={() => abrirConsulta()} className="w-full btn-primary flex items-center justify-center gap-2 mb-4">
            <Plus size={18} /> Nova consulta
          </button>

          {proximas.length > 0 && (
            <>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Próximas</h3>
              <div className="space-y-3 mb-5">
                {proximas.map(c => {
                  const Icon = statusIcon[c.status]
                  return (
                    <div key={c.id} className="card">
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 bg-pink-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                          <Heart size={18} className="text-pink-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="font-bold text-gray-800 text-sm">{c.medico}</p>
                            <span className={`badge ${statusColor[c.status]}`}>{c.status}</span>
                          </div>
                          <p className="text-xs text-gray-400 font-semibold">{c.especialidade}</p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <Calendar size={12} className="text-gray-300" />
                            <span className="text-xs font-bold text-gray-500">
                              {new Date(c.data + 'T12:00').toLocaleDateString('pt-BR')} às {c.hora}
                            </span>
                          </div>
                          {c.local && <p className="text-xs text-gray-400 font-semibold mt-0.5">📍 {c.local}</p>}
                          {c.obs && <p className="text-xs text-gray-400 italic mt-0.5">{c.obs}</p>}
                        </div>
                        <div className="flex gap-1.5 flex-shrink-0">
                          <button onClick={() => abrirConsulta(c)} className="p-1.5 rounded-xl hover:bg-gray-100"><Edit2 size={14} className="text-gray-400" /></button>
                          <button onClick={() => setConsultas(p => p.filter(x => x.id !== c.id))} className="p-1.5 rounded-xl hover:bg-red-50"><Trash2 size={14} className="text-red-400" /></button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {concluidas.length > 0 && (
            <>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Histórico</h3>
              <div className="space-y-3">
                {concluidas.map(c => (
                  <div key={c.id} className="card opacity-70">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 bg-gray-100 rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Heart size={18} className="text-gray-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-bold text-gray-600 text-sm">{c.medico}</p>
                          <span className={`badge ${statusColor[c.status]}`}>{c.status}</span>
                        </div>
                        <p className="text-xs text-gray-400 font-semibold">{c.especialidade}</p>
                        <p className="text-xs text-gray-400 font-semibold mt-1">
                          {new Date(c.data + 'T12:00').toLocaleDateString('pt-BR')} às {c.hora}
                        </p>
                        {c.obs && <p className="text-xs text-gray-400 italic mt-0.5">{c.obs}</p>}
                      </div>
                      <div className="flex gap-1.5 flex-shrink-0">
                        <button onClick={() => abrirConsulta(c)} className="p-1.5 rounded-xl hover:bg-gray-100"><Edit2 size={14} className="text-gray-400" /></button>
                        <button onClick={() => setConsultas(p => p.filter(x => x.id !== c.id))} className="p-1.5 rounded-xl hover:bg-red-50"><Trash2 size={14} className="text-red-400" /></button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {consultas.length === 0 && (
            <div className="card text-center py-8">
              <Heart size={32} className="text-gray-200 mx-auto mb-2" />
              <p className="text-sm font-bold text-gray-400">Nenhuma consulta cadastrada</p>
            </div>
          )}
        </div>
      )}

      {/* ABA MEDICAMENTOS */}
      {tab === 1 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-gray-500">{medsTomados}/{medicamentos.length} tomados hoje</p>
            <button onClick={() => abrirMed()} className="btn-primary py-2 px-4 text-xs flex items-center gap-1.5">
              <Plus size={14} /> Adicionar
            </button>
          </div>

          {medicamentos.length > 0 && (
            <div className="progress-bar mb-4">
              <div className="progress-fill bg-emerald-400" style={{ width: `${medicamentos.length ? (medsTomados / medicamentos.length) * 100 : 0}%` }} />
            </div>
          )}

          <div className="space-y-3">
            {medicamentos.map(m => (
              <div key={m.id} className={clsx('card flex items-center gap-3 transition-all', m.done && 'bg-emerald-50 border-emerald-100')}>
                <button onClick={() => toggleMed(m.id)} className="flex-shrink-0">
                  {m.done ? <CheckCircle2 size={22} className="text-emerald-500" /> : <Circle size={22} className="text-gray-300" />}
                </button>
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${m.done ? 'bg-emerald-100' : 'bg-gray-100'}`}>
                  <Pill size={18} className={m.done ? 'text-emerald-500' : 'text-gray-400'} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-800 text-sm">{m.nome}</p>
                  <p className="text-xs text-gray-400 font-semibold">{m.dose}</p>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <Clock size={11} className="text-gray-300" />
                    <span className="text-xs font-bold text-gray-400">{m.horarios.join(', ')}</span>
                    <span className="badge badge-blue">Estoque: {m.estoque} {m.unidade}</span>
                  </div>
                </div>
                <button onClick={() => abrirMed(m)} className="p-1.5 rounded-xl hover:bg-gray-100 flex-shrink-0"><Edit2 size={14} className="text-gray-400" /></button>
                <button onClick={() => setMedicamentos(p => p.filter(x => x.id !== m.id))} className="p-1.5 rounded-xl hover:bg-red-50 flex-shrink-0"><Trash2 size={14} className="text-red-400" /></button>
              </div>
            ))}

            {medicamentos.length === 0 && (
              <div className="card text-center py-8">
                <Pill size={32} className="text-gray-200 mx-auto mb-2" />
                <p className="text-sm font-bold text-gray-400">Nenhum medicamento cadastrado</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Consulta */}
      {modalConsulta && (
        <Modal titulo={modalConsulta === 'novo' ? 'Nova consulta' : 'Editar consulta'} onClose={() => setModalConsulta(null)}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Nome do médico</label>
              <input type="text" value={formConsulta.medico} onChange={e => setFormConsulta(p => ({ ...p, medico: e.target.value }))} placeholder="Dr. Nome Sobrenome" className="input" autoFocus />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Especialidade</label>
              <div className="flex flex-wrap gap-2">
                {ESPECIALIDADES.map(e => (
                  <button key={e} onClick={() => setFormConsulta(p => ({ ...p, especialidade: e }))}
                    className={clsx('px-3 py-1.5 rounded-xl text-xs font-bold border transition-all', formConsulta.especialidade === e ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-gray-600 border-gray-200')}>
                    {e}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Data</label>
                <input type="date" value={formConsulta.data} onChange={e => setFormConsulta(p => ({ ...p, data: e.target.value }))} className="input" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Horário</label>
                <input type="time" value={formConsulta.hora} onChange={e => setFormConsulta(p => ({ ...p, hora: e.target.value }))} className="input" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Local / Clínica</label>
              <input type="text" value={formConsulta.local} onChange={e => setFormConsulta(p => ({ ...p, local: e.target.value }))} placeholder="Ex: Clínica São Lucas" className="input" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Status</label>
              <div className="flex gap-2">
                {STATUS_CONSULTA.map(s => (
                  <button key={s} onClick={() => setFormConsulta(p => ({ ...p, status: s }))}
                    className={clsx('flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all capitalize', formConsulta.status === s ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-gray-600 border-gray-200')}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Observações</label>
              <textarea value={formConsulta.obs} onChange={e => setFormConsulta(p => ({ ...p, obs: e.target.value }))} placeholder="Anotações sobre a consulta..." rows={2} className="input resize-none" />
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setModalConsulta(null)} className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-bold text-gray-500">Cancelar</button>
              <button onClick={salvarConsulta} className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"><Check size={16} /> Salvar</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Medicamento */}
      {modalMed && (
        <Modal titulo={modalMed === 'novo' ? 'Novo medicamento' : 'Editar medicamento'} onClose={() => setModalMed(null)}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Nome do medicamento</label>
              <input type="text" value={formMed.nome} onChange={e => setFormMed(p => ({ ...p, nome: e.target.value }))} placeholder="Ex: Vitamina D 2000UI" className="input" autoFocus />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Dose</label>
              <input type="text" value={formMed.dose} onChange={e => setFormMed(p => ({ ...p, dose: e.target.value }))} placeholder="Ex: 1 cápsula" className="input" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Estoque atual</label>
                <input type="number" value={formMed.estoque} onChange={e => setFormMed(p => ({ ...p, estoque: e.target.value }))} placeholder="0" className="input" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Unidade</label>
                <input type="text" value={formMed.unidade} onChange={e => setFormMed(p => ({ ...p, unidade: e.target.value }))} placeholder="cápsulas" className="input" />
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Horários de uso</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formMed.horarios.map((h, i) => (
                  <span key={i} className="flex items-center gap-1 px-3 py-1.5 bg-brand-100 text-brand-700 rounded-xl text-xs font-bold">
                    {h}
                    <button onClick={() => remHorario(i)} className="ml-1"><X size={12} /></button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input type="text" value={novoHorario} onChange={e => setNovoHorario(e.target.value)} placeholder="08:00 ou pré-treino" className="input flex-1" />
                <button onClick={addHorario} className="px-4 py-2.5 bg-brand-100 text-brand-600 rounded-2xl font-bold text-sm hover:bg-brand-200"><Plus size={16} /></button>
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setModalMed(null)} className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-bold text-gray-500">Cancelar</button>
              <button onClick={salvarMed} className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"><Check size={16} /> Salvar</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
