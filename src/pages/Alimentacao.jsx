import { useState } from 'react'
import { Plus, Droplets, ChevronDown, ChevronRight, Trash2, Edit2, X, Check } from 'lucide-react'
import clsx from 'clsx'
import { useLocalStorage } from '../hooks/useLocalStorage'

const metasDefault = { cal: 2400, prot: 160, carb: 280, gord: 70, agua: 2000 }
const refeicoesDefault = [
  { id: 1, nome: 'Café da Manhã', emoji: '🌅', hora: '07:00', alimentos: [
    { id: 11, nome: 'Aveia com banana', cals: 280, prot: 8, carb: 52, gord: 5 },
    { id: 12, nome: 'Ovo mexido (2 ovos)', cals: 140, prot: 12, carb: 1, gord: 10 },
  ]},
  { id: 2, nome: 'Almoço', emoji: '☀️', hora: '12:30', alimentos: [
    { id: 21, nome: 'Frango grelhado 150g', cals: 250, prot: 42, carb: 0, gord: 8 },
    { id: 22, nome: 'Arroz integral 100g', cals: 130, prot: 3, carb: 28, gord: 1 },
  ]},
  { id: 3, nome: 'Lanche', emoji: '🍎', hora: '16:00', alimentos: [
    { id: 31, nome: 'Whey protein', cals: 130, prot: 25, carb: 5, gord: 2 },
  ]},
  { id: 4, nome: 'Jantar', emoji: '🌙', hora: '19:30', alimentos: [] },
]
const EMOJIS_R = ['🌅','☀️','🍎','🌙','🥗','🍽️','☕','🥐']

function Modal({ titulo, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
      <div className="w-full bg-white dark:bg-gray-900 rounded-t-3xl p-5 max-w-md mx-auto max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-black text-gray-800 dark:text-gray-100 text-lg">{titulo}</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"><X size={20} className="text-gray-400" /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

function MacroBar({ label, atual, meta, cor }) {
  const pct = Math.min((atual / meta) * 100, 100)
  return (
    <div className="flex-1">
      <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1"><span>{label}</span><span>{Math.round(atual)}g</span></div>
      <div className="progress-bar h-2"><div className={`progress-fill ${cor}`} style={{ width: `${pct}%` }} /></div>
      <p className="text-[10px] font-bold text-gray-300 dark:text-gray-600 mt-0.5">/{meta}g</p>
    </div>
  )
}

export default function Alimentacao() {
  const [metas, setMetas] = useLocalStorage('evoluaja_nutri_metas', metasDefault)
  const [refeicoes, setRefeicoes] = useLocalStorage('evoluaja_refeicoes', refeicoesDefault)
  const [agua, setAgua] = useLocalStorage('evoluaja_agua', 6)
  const [abertas, setAbertas] = useState({ 1: true, 2: true, 3: true })
  const [modalAl, setModalAl] = useState(null)
  const [modalRef, setModalRef] = useState(null)
  const [modalMetas, setModalMetas] = useState(false)
  const [fAl, setFAl] = useState({ nome: '', cals: '', prot: '', carb: '', gord: '' })
  const [fRef, setFRef] = useState({ nome: '', emoji: '🍽️', hora: '12:00' })
  const [fMetas, setFMetas] = useState(metas)

  const toggle = (id) => setAbertas(p => ({ ...p, [id]: !p[id] }))

  const totais = refeicoes.reduce((acc, r) => {
    r.alimentos.forEach(a => { acc.cal += +a.cals; acc.prot += +a.prot; acc.carb += +a.carb; acc.gord += +a.gord })
    return acc
  }, { cal: 0, prot: 0, carb: 0, gord: 0 })

  const abrirAl = (refId, al = null) => { setFAl(al ? { nome: al.nome, cals: al.cals, prot: al.prot, carb: al.carb, gord: al.gord } : { nome: '', cals: '', prot: '', carb: '', gord: '' }); setModalAl({ refId, alId: al ? al.id : 'novo' }) }
  const salvarAl = () => {
    if (!fAl.nome) return
    const { refId, alId } = modalAl
    setRefeicoes(p => p.map(r => {
      if (r.id !== refId) return r
      const item = { ...fAl, id: alId === 'novo' ? Date.now() : alId, cals: +fAl.cals, prot: +fAl.prot, carb: +fAl.carb, gord: +fAl.gord }
      return alId === 'novo' ? { ...r, alimentos: [...r.alimentos, item] } : { ...r, alimentos: r.alimentos.map(a => a.id === alId ? item : a) }
    }))
    setModalAl(null)
  }
  const excluirAl = (refId, alId) => setRefeicoes(p => p.map(r => r.id !== refId ? r : { ...r, alimentos: r.alimentos.filter(a => a.id !== alId) }))

  const abrirRef = (r = null) => { setFRef(r ? { nome: r.nome, emoji: r.emoji, hora: r.hora } : { nome: '', emoji: '🍽️', hora: '12:00' }); setModalRef(r ? r.id : 'novo') }
  const salvarRef = () => {
    if (!fRef.nome) return
    if (modalRef === 'novo') setRefeicoes(p => [...p, { ...fRef, id: Date.now(), alimentos: [] }])
    else setRefeicoes(p => p.map(r => r.id === modalRef ? { ...r, ...fRef } : r))
    setModalRef(null)
  }

  const calPct = Math.min((totais.cal / metas.cal) * 100, 100)
  const copos = Math.round(metas.agua / 250)
  const chip = (ativo) => clsx('px-3 py-1.5 rounded-xl text-xs font-bold border transition-all', ativo ? 'bg-brand-500 text-white border-brand-500' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700')

  return (
    <div className="page-container animate-fade-in-up">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-black text-gray-800 dark:text-gray-100">Alimentação</h1>
        <button onClick={() => { setFMetas(metas); setModalMetas(true) }} className="btn-ghost py-1.5 text-xs">Editar metas</button>
      </div>

      <div className="card mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Calorias hoje</p>
            <p className="text-3xl font-black text-gray-800 dark:text-gray-100">{Math.round(totais.cal)} <span className="text-base font-bold text-gray-400">/ {metas.cal} kcal</span></p>
          </div>
          <div className="relative w-16 h-16">
            <svg viewBox="0 0 64 64" className="-rotate-90 w-full h-full">
              <circle cx="32" cy="32" r="28" fill="none" stroke="#ede9fe" strokeWidth="6" className="dark:stroke-brand-950" />
              <circle cx="32" cy="32" r="28" fill="none" stroke="#7c3aed" strokeWidth="6"
                strokeDasharray={2 * Math.PI * 28} strokeDashoffset={2 * Math.PI * 28 * (1 - calPct / 100)}
                strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-brand-700 dark:text-brand-300">{Math.round(calPct)}%</span>
          </div>
        </div>
        <div className="flex gap-3">
          <MacroBar label="Proteínas" atual={totais.prot} meta={metas.prot} cor="bg-red-400" />
          <MacroBar label="Carboidratos" atual={totais.carb} meta={metas.carb} cor="bg-amber-400" />
          <MacroBar label="Gorduras" atual={totais.gord} meta={metas.gord} cor="bg-blue-400" />
        </div>
      </div>

      <div className="card mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Droplets size={20} className="text-blue-500" />
            <span className="font-bold text-gray-700 dark:text-gray-300">Hidratação</span>
          </div>
          <span className="font-black text-blue-600">{agua * 250}ml / {metas.agua}ml</span>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: copos }).map((_, i) => (
            <button key={i} onClick={() => setAgua(i < agua ? i : i + 1)}
              className={clsx('flex-1 h-8 rounded-xl transition-all', i < agua ? 'bg-blue-400' : 'bg-gray-100 dark:bg-gray-800')} />
          ))}
        </div>
        <p className="text-xs font-bold text-gray-400 mt-2">{agua} copos de 250ml</p>
      </div>

      <div className="space-y-3 mb-4">
        {refeicoes.map(r => (
          <div key={r.id} className="card">
            <div className="flex items-center gap-3">
              <button onClick={() => toggle(r.id)} className="flex items-center gap-3 flex-1 text-left">
                <span className="text-xl">{r.emoji}</span>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 dark:text-gray-100 text-sm">{r.nome}</p>
                  <p className="text-xs text-gray-400 font-semibold">{r.hora} · {r.alimentos.reduce((s, a) => s + +a.cals, 0)} kcal</p>
                </div>
                {abertas[r.id] ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
              </button>
              <button onClick={() => abrirRef(r)} className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"><Edit2 size={14} className="text-gray-400" /></button>
              <button onClick={() => setRefeicoes(p => p.filter(x => x.id !== r.id))} className="p-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950"><Trash2 size={14} className="text-red-400" /></button>
            </div>
            {abertas[r.id] && (
              <div className="mt-3 pt-3 border-t border-gray-50 dark:border-gray-800 space-y-2">
                {r.alimentos.length === 0 && <p className="text-xs text-gray-300 dark:text-gray-600 font-semibold text-center py-1">Nenhum alimento registrado</p>}
                {r.alimentos.map(a => (
                  <div key={a.id} className="flex items-center gap-2 py-1">
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-700 dark:text-gray-300">{a.nome}</p>
                      <p className="text-[10px] font-semibold text-gray-400">{a.cals}kcal · P:{a.prot}g · C:{a.carb}g · G:{a.gord}g</p>
                    </div>
                    <button onClick={() => abrirAl(r.id, a)} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"><Edit2 size={13} className="text-gray-400" /></button>
                    <button onClick={() => excluirAl(r.id, a.id)} className="p-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950"><Trash2 size={13} className="text-red-400" /></button>
                  </div>
                ))}
                <button onClick={() => abrirAl(r.id)} className="w-full flex items-center gap-2 py-2 text-brand-500 font-bold text-xs hover:text-brand-600">
                  <Plus size={14} /> Adicionar alimento
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={() => abrirRef()} className="w-full btn-primary flex items-center justify-center gap-2"><Plus size={18} /> Nova refeição</button>

      {modalAl && (
        <Modal titulo={modalAl.alId === 'novo' ? 'Adicionar alimento' : 'Editar alimento'} onClose={() => setModalAl(null)}>
          <div className="space-y-3">
            <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Nome</label><input type="text" value={fAl.nome} onChange={e => setFAl(p => ({ ...p, nome: e.target.value }))} placeholder="Ex: Frango grelhado 150g" className="input" autoFocus /></div>
            <div className="grid grid-cols-2 gap-3">
              {[['cals','Calorias (kcal)'],['prot','Proteínas (g)'],['carb','Carboidratos (g)'],['gord','Gorduras (g)']].map(([k,l]) => (
                <div key={k}><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">{l}</label><input type="number" value={fAl[k]} onChange={e => setFAl(p => ({ ...p, [k]: e.target.value }))} placeholder="0" className="input" /></div>
              ))}
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setModalAl(null)} className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-500">Cancelar</button>
              <button onClick={salvarAl} className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"><Check size={16} /> Salvar</button>
            </div>
          </div>
        </Modal>
      )}

      {modalRef && (
        <Modal titulo={modalRef === 'novo' ? 'Nova refeição' : 'Editar refeição'} onClose={() => setModalRef(null)}>
          <div className="space-y-4">
            <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Nome</label><input type="text" value={fRef.nome} onChange={e => setFRef(p => ({ ...p, nome: e.target.value }))} placeholder="Ex: Jantar" className="input" autoFocus /></div>
            <div><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Horário</label><input type="time" value={fRef.hora} onChange={e => setFRef(p => ({ ...p, hora: e.target.value }))} className="input" /></div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Emoji</label>
              <div className="flex gap-3 flex-wrap">
                {EMOJIS_R.map(em => <button key={em} onClick={() => setFRef(p => ({ ...p, emoji: em }))} className={clsx('text-2xl w-10 h-10 rounded-xl flex items-center justify-center', fRef.emoji === em ? 'bg-brand-100 dark:bg-brand-900 ring-2 ring-brand-500' : 'hover:bg-gray-100 dark:hover:bg-gray-800')}>{em}</button>)}
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setModalRef(null)} className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-500">Cancelar</button>
              <button onClick={salvarRef} className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"><Check size={16} /> Salvar</button>
            </div>
          </div>
        </Modal>
      )}

      {modalMetas && (
        <Modal titulo="Editar metas nutricionais" onClose={() => setModalMetas(false)}>
          <div className="space-y-3">
            {[['cal','Calorias diárias (kcal)'],['prot','Proteínas (g)'],['carb','Carboidratos (g)'],['gord','Gorduras (g)'],['agua','Água diária (ml)']].map(([k,l]) => (
              <div key={k}><label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">{l}</label><input type="number" value={fMetas[k]} onChange={e => setFMetas(p => ({ ...p, [k]: +e.target.value }))} className="input" /></div>
            ))}
            <div className="flex gap-2 pt-1">
              <button onClick={() => setModalMetas(false)} className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-500">Cancelar</button>
              <button onClick={() => { setMetas(fMetas); setModalMetas(false) }} className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"><Check size={16} /> Salvar</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
