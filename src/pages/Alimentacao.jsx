import { useState } from 'react'
import { Plus, Droplets, ChevronDown, ChevronRight, Trash2, Edit2, X, Check } from 'lucide-react'
import clsx from 'clsx'

const metasIniciais = { cal: 2400, prot: 160, carb: 280, gord: 70, agua: 2000 }

const refeicoesIniciais = [
  { id: 1, nome: 'Café da Manhã', emoji: '🌅', hora: '07:00', alimentos: [
    { id: 11, nome: 'Aveia com banana', cals: 280, prot: 8, carb: 52, gord: 5 },
    { id: 12, nome: 'Ovo mexido (2 ovos)', cals: 140, prot: 12, carb: 1, gord: 10 },
  ]},
  { id: 2, nome: 'Almoço', emoji: '☀️', hora: '12:30', alimentos: [
    { id: 21, nome: 'Frango grelhado 150g', cals: 250, prot: 42, carb: 0, gord: 8 },
    { id: 22, nome: 'Arroz integral 100g', cals: 130, prot: 3, carb: 28, gord: 1 },
    { id: 23, nome: 'Brócolis refogado', cals: 60, prot: 4, carb: 10, gord: 2 },
  ]},
  { id: 3, nome: 'Lanche', emoji: '🍎', hora: '16:00', alimentos: [
    { id: 31, nome: 'Whey protein', cals: 130, prot: 25, carb: 5, gord: 2 },
  ]},
  { id: 4, nome: 'Jantar', emoji: '🌙', hora: '19:30', alimentos: [] },
]

const EMOJIS_REFEICAO = ['🌅','☀️','🍎','🌙','🥗','🍽️','☕','🥐']
const alimentoVazio = { nome: '', cals: '', prot: '', carb: '', gord: '' }
const refeicaoVazia = { nome: '', emoji: '🍽️', hora: '12:00' }

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

function MacroBar({ label, atual, meta, cor, unit = 'g' }) {
  const pct = Math.min((atual / meta) * 100, 100)
  return (
    <div className="flex-1">
      <div className="flex justify-between text-[10px] font-bold text-gray-400 mb-1">
        <span>{label}</span><span>{atual}{unit}</span>
      </div>
      <div className="progress-bar h-2">
        <div className={`progress-fill ${cor}`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[10px] font-bold text-gray-300 mt-0.5">/{meta}{unit}</p>
    </div>
  )
}

export default function Alimentacao() {
  const [metas, setMetas] = useState(metasIniciais)
  const [refeicoes, setRefeicoes] = useState(refeicoesIniciais)
  const [abertas, setAbertas] = useState({ 1: true, 2: true, 3: true })
  const [agua, setAgua] = useState(6)
  const [modalAlimento, setModalAlimento] = useState(null) // { refeicaoId, alimentoId|'novo' }
  const [modalRefeicao, setModalRefeicao] = useState(null)
  const [modalMetas, setModalMetas] = useState(false)
  const [formAlimento, setFormAlimento] = useState(alimentoVazio)
  const [formRefeicao, setFormRefeicao] = useState(refeicaoVazia)
  const [formMetas, setFormMetas] = useState(metas)

  const toggle = (id) => setAbertas(p => ({ ...p, [id]: !p[id] }))

  // totais do dia
  const totais = refeicoes.reduce((acc, r) => {
    r.alimentos.forEach(a => { acc.cal += +a.cals; acc.prot += +a.prot; acc.carb += +a.carb; acc.gord += +a.gord })
    return acc
  }, { cal: 0, prot: 0, carb: 0, gord: 0 })

  // Alimentos
  const abrirAlimento = (refeicaoId, alimento = null) => {
    setFormAlimento(alimento ? { nome: alimento.nome, cals: alimento.cals, prot: alimento.prot, carb: alimento.carb, gord: alimento.gord } : alimentoVazio)
    setModalAlimento({ refeicaoId, alimentoId: alimento ? alimento.id : 'novo' })
  }
  const salvarAlimento = () => {
    if (!formAlimento.nome) return
    const { refeicaoId, alimentoId } = modalAlimento
    setRefeicoes(p => p.map(r => {
      if (r.id !== refeicaoId) return r
      if (alimentoId === 'novo') return { ...r, alimentos: [...r.alimentos, { ...formAlimento, id: Date.now(), cals: +formAlimento.cals, prot: +formAlimento.prot, carb: +formAlimento.carb, gord: +formAlimento.gord }] }
      return { ...r, alimentos: r.alimentos.map(a => a.id === alimentoId ? { ...a, ...formAlimento, cals: +formAlimento.cals, prot: +formAlimento.prot, carb: +formAlimento.carb, gord: +formAlimento.gord } : a) }
    }))
    setModalAlimento(null)
  }
  const excluirAlimento = (refeicaoId, alimentoId) => setRefeicoes(p => p.map(r => r.id !== refeicaoId ? r : { ...r, alimentos: r.alimentos.filter(a => a.id !== alimentoId) }))

  // Refeições
  const abrirRefeicao = (r = null) => { setFormRefeicao(r ? { nome: r.nome, emoji: r.emoji, hora: r.hora } : refeicaoVazia); setModalRefeicao(r ? r.id : 'novo') }
  const salvarRefeicao = () => {
    if (!formRefeicao.nome) return
    if (modalRefeicao === 'novo') setRefeicoes(p => [...p, { ...formRefeicao, id: Date.now(), alimentos: [] }])
    else setRefeicoes(p => p.map(r => r.id === modalRefeicao ? { ...r, ...formRefeicao } : r))
    setModalRefeicao(null)
  }

  // Metas
  const salvarMetas = () => { setMetas(formMetas); setModalMetas(false) }

  const calPct = Math.min((totais.cal / metas.cal) * 100, 100)

  return (
    <div className="page-container animate-fade-in-up">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-black text-gray-800">Alimentação</h1>
        <button onClick={() => { setFormMetas(metas); setModalMetas(true) }} className="btn-ghost py-1.5 text-xs">Editar metas</button>
      </div>

      {/* Macros */}
      <div className="card mb-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Calorias hoje</p>
            <p className="text-3xl font-black text-gray-800">{totais.cal} <span className="text-base font-bold text-gray-400">/ {metas.cal} kcal</span></p>
          </div>
          <div className="relative w-16 h-16">
            <svg viewBox="0 0 64 64" className="-rotate-90 w-full h-full">
              <circle cx="32" cy="32" r="28" fill="none" stroke="#ede9fe" strokeWidth="6" />
              <circle cx="32" cy="32" r="28" fill="none" stroke="#7c3aed" strokeWidth="6"
                strokeDasharray={2 * Math.PI * 28} strokeDashoffset={2 * Math.PI * 28 * (1 - calPct / 100)}
                strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }} />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-xs font-black text-brand-700">{Math.round(calPct)}%</span>
          </div>
        </div>
        <div className="flex gap-3">
          <MacroBar label="Proteínas" atual={totais.prot} meta={metas.prot} cor="bg-red-400" />
          <MacroBar label="Carboidratos" atual={totais.carb} meta={metas.carb} cor="bg-amber-400" />
          <MacroBar label="Gorduras" atual={totais.gord} meta={metas.gord} cor="bg-blue-400" />
        </div>
      </div>

      {/* Hidratação */}
      <div className="card mb-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Droplets size={20} className="text-blue-500" />
            <span className="font-bold text-gray-700">Hidratação</span>
          </div>
          <span className="font-black text-blue-600">{agua * 250}ml / {metas.agua}ml</span>
        </div>
        <div className="flex gap-2">
          {Array.from({ length: Math.round(metas.agua / 250) }).map((_, i) => (
            <button key={i} onClick={() => setAgua(i < agua ? i : i + 1)}
              className={clsx('flex-1 h-8 rounded-xl transition-all', i < agua ? 'bg-blue-400' : 'bg-gray-100')} />
          ))}
        </div>
        <p className="text-xs font-bold text-gray-400 mt-2">{agua} copos de 250ml</p>
      </div>

      {/* Refeições */}
      <div className="space-y-3 mb-4">
        {refeicoes.map(r => (
          <div key={r.id} className="card">
            <div className="flex items-center gap-3">
              <button onClick={() => toggle(r.id)} className="flex items-center gap-3 flex-1 text-left">
                <span className="text-xl">{r.emoji}</span>
                <div className="flex-1">
                  <p className="font-bold text-gray-800 text-sm">{r.nome}</p>
                  <p className="text-xs text-gray-400 font-semibold">{r.hora} · {r.alimentos.reduce((s, a) => s + +a.cals, 0)} kcal</p>
                </div>
                {abertas[r.id] ? <ChevronDown size={18} className="text-gray-400" /> : <ChevronRight size={18} className="text-gray-400" />}
              </button>
              <button onClick={() => abrirRefeicao(r)} className="p-1.5 rounded-xl hover:bg-gray-100"><Edit2 size={14} className="text-gray-400" /></button>
              <button onClick={() => setRefeicoes(p => p.filter(x => x.id !== r.id))} className="p-1.5 rounded-xl hover:bg-red-50"><Trash2 size={14} className="text-red-400" /></button>
            </div>

            {abertas[r.id] && (
              <div className="mt-3 pt-3 border-t border-gray-50 space-y-2">
                {r.alimentos.length === 0 && <p className="text-xs text-gray-300 font-semibold text-center py-1">Nenhum alimento registrado</p>}
                {r.alimentos.map(a => (
                  <div key={a.id} className="flex items-center gap-2 py-1">
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-700">{a.nome}</p>
                      <p className="text-[10px] font-semibold text-gray-400">{a.cals}kcal · P:{a.prot}g · C:{a.carb}g · G:{a.gord}g</p>
                    </div>
                    <button onClick={() => abrirAlimento(r.id, a)} className="p-1 rounded-lg hover:bg-gray-100"><Edit2 size={13} className="text-gray-400" /></button>
                    <button onClick={() => excluirAlimento(r.id, a.id)} className="p-1 rounded-lg hover:bg-red-50"><Trash2 size={13} className="text-red-400" /></button>
                  </div>
                ))}
                <button onClick={() => abrirAlimento(r.id)} className="w-full flex items-center gap-2 py-2 text-brand-500 font-bold text-xs hover:text-brand-600">
                  <Plus size={14} /> Adicionar alimento
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={() => abrirRefeicao()} className="w-full btn-primary flex items-center justify-center gap-2">
        <Plus size={18} /> Nova refeição
      </button>

      {/* Modal Alimento */}
      {modalAlimento && (
        <Modal titulo={modalAlimento.alimentoId === 'novo' ? 'Adicionar alimento' : 'Editar alimento'} onClose={() => setModalAlimento(null)}>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Nome do alimento</label>
              <input type="text" value={formAlimento.nome} onChange={e => setFormAlimento(p => ({ ...p, nome: e.target.value }))} placeholder="Ex: Frango grelhado 150g" className="input" autoFocus />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Calorias (kcal)</label>
                <input type="number" value={formAlimento.cals} onChange={e => setFormAlimento(p => ({ ...p, cals: e.target.value }))} placeholder="0" className="input" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Proteínas (g)</label>
                <input type="number" value={formAlimento.prot} onChange={e => setFormAlimento(p => ({ ...p, prot: e.target.value }))} placeholder="0" className="input" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Carboidratos (g)</label>
                <input type="number" value={formAlimento.carb} onChange={e => setFormAlimento(p => ({ ...p, carb: e.target.value }))} placeholder="0" className="input" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Gorduras (g)</label>
                <input type="number" value={formAlimento.gord} onChange={e => setFormAlimento(p => ({ ...p, gord: e.target.value }))} placeholder="0" className="input" />
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setModalAlimento(null)} className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-bold text-gray-500">Cancelar</button>
              <button onClick={salvarAlimento} className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"><Check size={16} /> Salvar</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Refeição */}
      {modalRefeicao && (
        <Modal titulo={modalRefeicao === 'novo' ? 'Nova refeição' : 'Editar refeição'} onClose={() => setModalRefeicao(null)}>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Nome</label>
              <input type="text" value={formRefeicao.nome} onChange={e => setFormRefeicao(p => ({ ...p, nome: e.target.value }))} placeholder="Ex: Jantar" className="input" autoFocus />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Horário</label>
              <input type="time" value={formRefeicao.hora} onChange={e => setFormRefeicao(p => ({ ...p, hora: e.target.value }))} className="input" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Emoji</label>
              <div className="flex gap-3 flex-wrap">
                {EMOJIS_REFEICAO.map(em => (
                  <button key={em} onClick={() => setFormRefeicao(p => ({ ...p, emoji: em }))}
                    className={clsx('text-2xl w-10 h-10 rounded-xl flex items-center justify-center', formRefeicao.emoji === em ? 'bg-brand-100 ring-2 ring-brand-500' : 'hover:bg-gray-100')}>
                    {em}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-2 pt-1">
              <button onClick={() => setModalRefeicao(null)} className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-bold text-gray-500">Cancelar</button>
              <button onClick={salvarRefeicao} className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"><Check size={16} /> Salvar</button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal Metas */}
      {modalMetas && (
        <Modal titulo="Editar metas nutricionais" onClose={() => setModalMetas(false)}>
          <div className="space-y-3">
            {[
              { key: 'cal', label: 'Calorias diárias (kcal)' },
              { key: 'prot', label: 'Proteínas (g)' },
              { key: 'carb', label: 'Carboidratos (g)' },
              { key: 'gord', label: 'Gorduras (g)' },
              { key: 'agua', label: 'Água diária (ml)' },
            ].map(f => (
              <div key={f.key}>
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">{f.label}</label>
                <input type="number" value={formMetas[f.key]} onChange={e => setFormMetas(p => ({ ...p, [f.key]: +e.target.value }))} className="input" />
              </div>
            ))}
            <div className="flex gap-2 pt-1">
              <button onClick={() => setModalMetas(false)} className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-bold text-gray-500">Cancelar</button>
              <button onClick={salvarMetas} className="flex-1 btn-primary py-3 flex items-center justify-center gap-2"><Check size={16} /> Salvar</button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
