import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Send, Sparkles, ArrowLeft, Check, Edit2, Trash2,
  Plus, X, ChevronRight, RefreshCw, Save, Clock
} from 'lucide-react'
import clsx from 'clsx'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useApp } from '../context/AppContext'

// ── Helpers ──────────────────────────────────────────────────────
function toKey(date) { return date.toISOString().split('T')[0] }
const hojeKey = toKey(new Date())

const CATEGORIAS = ['Trabalho','Estudos','Treino','Alimentação','Saúde','Casa','Hábitos','Lazer','Outro']
const catColors = {
  'Trabalho':    'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300',
  'Estudos':     'bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300',
  'Treino':      'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300',
  'Alimentação': 'bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300',
  'Saúde':       'bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-300',
  'Casa':        'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300',
  'Hábitos':     'bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300',
  'Lazer':       'bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-300',
  'Outro':       'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
}

// ── System Prompt para o Claude ──────────────────────────────────
const SYSTEM_PROMPT = `Você é um assistente especialista em produtividade pessoal e planejamento de rotinas chamado EvoluaIA, integrado ao app EvoluaJá.

Seu objetivo é conversar com o usuário para entender seu dia e montar uma rotina personalizada.

REGRAS OBRIGATÓRIAS:
1. Seja BREVE e DIRETO. Respostas curtas e simpáticas.
2. Faça UMA pergunta por vez para entender o dia do usuário.
3. Pergunte sobre: horário que acorda e dorme, trabalho/estudos, treino, refeições, tarefas importantes.
4. Quando tiver informação suficiente (após 3-5 trocas), gere a rotina em JSON.
5. Use linguagem informal e motivadora em português brasileiro.
6. NUNCA gere o JSON antes de ter informações básicas suficientes.

QUANDO GERAR A ROTINA:
Inclua SEMPRE no final da sua mensagem um bloco JSON assim (exatamente neste formato):

\`\`\`rotina
[
  {"hora":"06:30","titulo":"Acordar e alongamento","cat":"Saúde","status":"pending"},
  {"hora":"07:00","titulo":"Café da manhã","cat":"Alimentação","status":"pending"}
]
\`\`\`

CATEGORIAS DISPONÍVEIS: Trabalho, Estudos, Treino, Alimentação, Saúde, Casa, Hábitos, Lazer, Outro

Regras da rotina:
- Horários realistas sem sobreposição
- Entre 6 e 14 tarefas no total
- Inclua sempre refeições e pausas
- Adapte ao objetivo e estilo de vida informados`

// ── Componente de mensagem ────────────────────────────────────────
function Mensagem({ msg }) {
  const isUser = msg.role === 'user'
  return (
    <div className={clsx('flex gap-2 mb-4', isUser ? 'flex-row-reverse' : 'flex-row')}>
      {!isUser && (
        <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-2xl flex items-center justify-center flex-shrink-0 text-sm shadow-sm">
          ✨
        </div>
      )}
      <div className={clsx(
        'max-w-[80%] rounded-2xl px-4 py-3 text-sm font-medium leading-relaxed',
        isUser
          ? 'bg-brand-500 text-white rounded-tr-sm'
          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded-tl-sm shadow-sm border border-gray-100 dark:border-gray-700'
      )}>
        {msg.text}
      </div>
    </div>
  )
}

// ── Card de tarefa editável ───────────────────────────────────────
function TarefaCard({ tarefa, index, onEdit, onDelete }) {
  return (
    <div className="card flex items-center gap-3 py-3">
      <div className="flex-shrink-0 w-14 text-center">
        <p className="text-xs font-black text-gray-500 dark:text-gray-400">{tarefa.hora}</p>
      </div>
      <div className="w-px h-8 bg-gray-100 dark:bg-gray-700" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">{tarefa.titulo}</p>
        <span className={`badge mt-0.5 inline-block text-[10px] ${catColors[tarefa.cat] || catColors['Outro']}`}>
          {tarefa.cat}
        </span>
      </div>
      <button onClick={() => onEdit(index)} className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 flex-shrink-0">
        <Edit2 size={14} className="text-gray-400" />
      </button>
      <button onClick={() => onDelete(index)} className="p-1.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-950 flex-shrink-0">
        <Trash2 size={14} className="text-red-400" />
      </button>
    </div>
  )
}

// ── Modal editar tarefa ───────────────────────────────────────────
function ModalEditar({ tarefa, onSave, onClose }) {
  const [form, setForm] = useState({ ...tarefa })
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
      <div className="w-full bg-white dark:bg-gray-900 rounded-t-3xl p-5 max-w-md mx-auto max-h-[85vh] flex flex-col">
        <div className="flex items-center justify-between mb-5 flex-shrink-0">
          <h2 className="font-black text-gray-800 dark:text-gray-100">Editar tarefa</h2>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={20} className="text-gray-400" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 space-y-4 pb-2">
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Título</label>
            <input type="text" value={form.titulo} onChange={e => setForm(p => ({ ...p, titulo: e.target.value }))} className="input" autoFocus />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Horário</label>
            <input type="time" value={form.hora} onChange={e => setForm(p => ({ ...p, hora: e.target.value }))} className="input" />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Categoria</label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIAS.map(c => (
                <button key={c} onClick={() => setForm(p => ({ ...p, cat: c }))}
                  className={clsx('px-3 py-1.5 rounded-xl text-xs font-bold border transition-all',
                    form.cat === c ? 'bg-brand-500 text-white border-brand-500' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700')}>
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex gap-2 pt-3 flex-shrink-0">
          <button onClick={onClose} className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-500">
            Cancelar
          </button>
          <button onClick={() => onSave(form)} className="flex-1 btn-primary py-3 flex items-center justify-center gap-2">
            <Check size={16} /> Salvar
          </button>
        </div>
      </div>
    </div>
  )
}

// ── Componente principal ──────────────────────────────────────────
export default function GerarRotina() {
  const navigate = useNavigate()
  const { perfil } = useApp()
  const [, setTodasTarefas] = useLocalStorage('evoluaja_tarefas_v2', {})

  const [msgs, setMsgs] = useState([
    {
      role: 'assistant',
      text: `Oi, ${perfil.nome?.split(' ')[0] || 'você'}! 👋 Sou o EvoluaIA e vou montar sua rotina personalizada.\n\nPrimeira pergunta: que horas você costuma acordar hoje?`
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [rotina, setRotina] = useState(null) // rotina gerada
  const [editandoIdx, setEditandoIdx] = useState(null)
  const [salvou, setSalvou] = useState(false)
  const [adicionando, setAdicionando] = useState(false)
  const [novaTask, setNovaTask] = useState({ hora: '08:00', titulo: '', cat: 'Trabalho' })
  const bottomRef = useRef(null)
  const inputRef = useRef(null)

  // Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs, rotina])

  // ── Extrai JSON da resposta ──────────────────────────────────────
  const extrairRotina = (text) => {
    const match = text.match(/```rotina\s*([\s\S]*?)```/)
    if (!match) return null
    try {
      const arr = JSON.parse(match[1].trim())
      if (Array.isArray(arr) && arr.length > 0) {
        return arr
          .map(t => ({ hora: t.hora || '08:00', titulo: t.titulo || '', cat: t.cat || 'Outro', status: 'pending' }))
          .sort((a, b) => a.hora.localeCompare(b.hora))
      }
    } catch {}
    return null
  }

  // ── Limpa texto da resposta (remove bloco JSON) ──────────────────
  const limparTexto = (text) => {
    return text.replace(/```rotina[\s\S]*?```/g, '').trim()
  }

  // ── Enviar mensagem ──────────────────────────────────────────────
  const enviar = async () => {
    const texto = input.trim()
    if (!texto || loading) return

    const novasMsgs = [...msgs, { role: 'user', text: texto }]
    setMsgs(novasMsgs)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: novasMsgs.map(m => ({ role: m.role, content: m.text }))
        })
      })

      const data = await res.json()
      const resposta = data.content?.[0]?.text || 'Desculpe, tive um problema. Pode repetir?'

      // Verifica se tem rotina
      const rotinaExtraida = extrairRotina(resposta)
      const textoLimpo = limparTexto(resposta)

      setMsgs(prev => [...prev, { role: 'assistant', text: textoLimpo || 'Aqui está sua rotina! Veja abaixo 👇' }])

      if (rotinaExtraida) {
        setRotina(rotinaExtraida)
      }
    } catch {
      setMsgs(prev => [...prev, {
        role: 'assistant',
        text: 'Ops, tive um probleminha de conexão. Tenta de novo! 🔄'
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  // ── Pedir nova rotina ────────────────────────────────────────────
  const pedirNovaRotina = async () => {
    setRotina(null)
    const msg = 'Pode gerar uma rotina diferente para mim?'
    const novasMsgs = [...msgs, { role: 'user', text: msg }]
    setMsgs(novasMsgs)
    setLoading(true)

    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: novasMsgs.map(m => ({ role: m.role, content: m.text }))
        })
      })
      const data = await res.json()
      const resposta = data.content?.[0]?.text || ''
      const rotinaExtraida = extrairRotina(resposta)
      const textoLimpo = limparTexto(resposta)

      setMsgs(prev => [...prev, { role: 'assistant', text: textoLimpo || 'Aqui está uma nova opção! 👇' }])
      if (rotinaExtraida) setRotina(rotinaExtraida)
    } catch {
      setMsgs(prev => [...prev, { role: 'assistant', text: 'Ops! Tente novamente.' }])
    } finally {
      setLoading(false)
    }
  }

  // ── Editar tarefa ────────────────────────────────────────────────
  const editarTarefa = (form) => {
    setRotina(prev => prev.map((t, i) => i === editandoIdx ? { ...t, ...form } : t))
    setEditandoIdx(null)
  }

  // ── Excluir tarefa ───────────────────────────────────────────────
  const excluirTarefa = (idx) => {
    setRotina(prev => prev.filter((_, i) => i !== idx))
  }

  // ── Adicionar tarefa manualmente ─────────────────────────────────
  const adicionarTarefa = () => {
    if (!novaTask.titulo.trim()) return
    const nova = { ...novaTask, status: 'pending', id: Date.now() }
    setRotina(prev => [...prev, nova].sort((a, b) => a.hora.localeCompare(b.hora)))
    setNovaTask({ hora: '08:00', titulo: '', cat: 'Trabalho' })
    setAdicionando(false)
  }

  // ── Salvar rotina no dia ─────────────────────────────────────────
  const salvarRotina = () => {
    if (!rotina || rotina.length === 0) return
    const tarefasParaSalvar = rotina.map((t, i) => ({ ...t, id: Date.now() + i }))
    setTodasTarefas(prev => ({ ...prev, [hojeKey]: tarefasParaSalvar }))
    setSalvou(true)
    setTimeout(() => navigate('/rotina'), 1500)
  }

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-gray-50 dark:bg-gray-950">

      {/* ── Header ── */}
      <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
          <ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" />
        </button>
        <div className="w-9 h-9 bg-gradient-to-br from-brand-400 to-brand-600 rounded-2xl flex items-center justify-center text-lg shadow-sm">
          ✨
        </div>
        <div className="flex-1">
          <p className="font-black text-gray-800 dark:text-gray-100 text-sm">EvoluaIA</p>
          <p className="text-xs text-emerald-500 font-bold">● online</p>
        </div>
        {rotina && (
          <button onClick={pedirNovaRotina} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800" title="Gerar outra rotina">
            <RefreshCw size={18} className="text-gray-400" />
          </button>
        )}
      </div>

      {/* ── Área do chat + rotina ── */}
      <div className="flex-1 overflow-y-auto px-4 py-4">

        {/* Mensagens */}
        {msgs.map((m, i) => <Mensagem key={i} msg={m} />)}

        {/* Loading */}
        {loading && (
          <div className="flex gap-2 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-brand-400 to-brand-600 rounded-2xl flex items-center justify-center flex-shrink-0 text-sm">✨</div>
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <div className="flex gap-1.5 items-center h-5">
                <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-brand-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}

        {/* ── Rotina gerada ── */}
        {rotina && (
          <div className="mb-4 animate-fade-in-up">
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">

              {/* Header da rotina */}
              <div className="bg-gradient-to-r from-brand-500 to-brand-600 px-5 py-4">
                <div className="flex items-center gap-3">
                  <Sparkles size={20} className="text-white" />
                  <div>
                    <p className="font-black text-white">Sua rotina está pronta!</p>
                    <p className="text-xs text-brand-200 font-semibold">{rotina.length} tarefas · Edite antes de salvar</p>
                  </div>
                </div>
              </div>

              {/* Lista editável */}
              <div className="p-4 space-y-2">
                {rotina.map((t, i) => (
                  <TarefaCard
                    key={i}
                    tarefa={t}
                    index={i}
                    onEdit={idx => setEditandoIdx(idx)}
                    onDelete={excluirTarefa}
                  />
                ))}

                {/* Adicionar tarefa */}
                {adicionando ? (
                  <div className="card border-brand-200 dark:border-brand-800 bg-brand-50 dark:bg-brand-950 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Horário</label>
                        <input type="time" value={novaTask.hora} onChange={e => setNovaTask(p => ({ ...p, hora: e.target.value }))} className="input" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Categoria</label>
                        <select value={novaTask.cat} onChange={e => setNovaTask(p => ({ ...p, cat: e.target.value }))} className="input">
                          {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Título</label>
                      <input type="text" value={novaTask.titulo} onChange={e => setNovaTask(p => ({ ...p, titulo: e.target.value }))} placeholder="Nome da tarefa" className="input" autoFocus />
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setAdicionando(false)} className="flex-1 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 text-sm font-bold text-gray-500">Cancelar</button>
                      <button onClick={adicionarTarefa} className="flex-1 btn-primary py-2 text-sm">Adicionar</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setAdicionando(true)}
                    className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-gray-400 font-bold text-sm hover:border-brand-300 hover:text-brand-500 transition-colors">
                    <Plus size={16} /> Adicionar tarefa
                  </button>
                )}
              </div>

              {/* Botão salvar */}
              <div className="px-4 pb-4">
                <button onClick={salvarRotina}
                  className={clsx('w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all shadow-md text-base',
                    salvou ? 'bg-emerald-500 shadow-emerald-200' : 'bg-brand-500 hover:bg-brand-600 shadow-brand-200')}>
                  {salvou
                    ? <><Check size={20} /> Rotina salva! Indo para a agenda...</>
                    : <><Save size={20} /> Salvar na minha rotina de hoje</>}
                </button>
                <p className="text-xs text-gray-400 font-semibold text-center mt-2">
                  Será salva em {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
                </p>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ── Input de chat (só aparece se ainda não gerou rotina ou se quer continuar) ── */}
      {!salvou && (
        <div className="flex-shrink-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 px-4 py-3">
          {rotina && (
            <p className="text-xs text-gray-400 font-semibold text-center mb-2">
              Quer ajustar algo? Fale com a IA abaixo ↓
            </p>
          )}
          <div className="flex gap-2 items-end">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); enviar() } }}
              placeholder={rotina ? 'Pedir ajuste na rotina...' : 'Descreva seu dia...'}
              rows={1}
              className="flex-1 input resize-none max-h-24 py-3"
              style={{ lineHeight: '1.5' }}
            />
            <button onClick={enviar} disabled={loading || !input.trim()}
              className={clsx('w-11 h-11 rounded-2xl flex items-center justify-center transition-all flex-shrink-0',
                loading || !input.trim()
                  ? 'bg-gray-100 dark:bg-gray-800 text-gray-300 cursor-not-allowed'
                  : 'bg-brand-500 text-white hover:bg-brand-600 shadow-md shadow-brand-200')}>
              <Send size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Modal editar tarefa */}
      {editandoIdx !== null && rotina && (
        <ModalEditar
          tarefa={rotina[editandoIdx]}
          onSave={editarTarefa}
          onClose={() => setEditandoIdx(null)}
        />
      )}
    </div>
  )
}
