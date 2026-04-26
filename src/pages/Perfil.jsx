import { useState } from 'react'
import {
  User, Target, Activity, Dumbbell, Home, ChevronRight, Sparkles,
  CheckCircle2, Bell, Flag, Shield, Download, LogOut, Camera,
  X, Check, Edit2, Mail, Phone, MapPin, Calendar, ArrowLeft,
  Lock, Eye, EyeOff, Trash2, FileText, AlertTriangle
} from 'lucide-react'
import clsx from 'clsx'

const quizPerguntas = [
  { key: 'objetivo', label: 'Objetivo principal', icon: Target, opcoes: ['Hipertrofia', 'Emagrecimento', 'Definição', 'Estudos', 'Produtividade geral'] },
  { key: 'atividade', label: 'Nível de atividade', icon: Activity, opcoes: ['Sedentário', 'Leve (1-2x/semana)', 'Moderado (3-4x/semana)', 'Intenso (5+x/semana)'] },
  { key: 'treino', label: 'Tipo de treino', icon: Dumbbell, opcoes: ['Musculação', 'Funcional', 'Cardio', 'Misto', 'Não treino'] },
  { key: 'casa', label: 'Frequência tarefas domésticas', icon: Home, opcoes: ['Diariamente', '3-4x por semana', 'Fins de semana', 'Raramente'] },
]

const stats = [
  { label: 'Dias ativos', valor: '7' },
  { label: 'Hábitos', valor: '8' },
  { label: 'Treinos', valor: '12' },
  { label: 'Metas', valor: '4' },
]

const AVATARES = ['😀','😎','🦁','🐯','🦊','🐺','🦅','🐉','🌟','⚡','🔥','💪','🧠','🎯','🚀','🌊']

// ─── Componente base de sub-página ───────────────────────────────
function SubPage({ title, onBack, children }) {
  return (
    <div className="page-container animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6 pt-1">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h1 className="text-xl font-black text-gray-800">{title}</h1>
      </div>
      {children}
    </div>
  )
}

// ─── Toggle reutilizável ─────────────────────────────────────────
function Toggle({ ativo, onClick }) {
  return (
    <button onClick={onClick} className={clsx('w-12 h-6 rounded-full transition-colors relative flex-shrink-0', ativo ? 'bg-brand-500' : 'bg-gray-200')}>
      <span className={clsx('absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all', ativo ? 'left-6' : 'left-0.5')} />
    </button>
  )
}

// ═══════════════════════════════════════════════════════════════
// EDITAR PERFIL
// ═══════════════════════════════════════════════════════════════
function EditarPerfil({ perfil, onSave, onBack }) {
  const [form, setForm] = useState(perfil)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [saved, setSaved] = useState(false)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const salvar = () => {
    onSave(form)
    setSaved(true)
    setTimeout(() => { setSaved(false); onBack() }, 1200)
  }

  return (
    <SubPage title="Editar Perfil" onBack={onBack}>

      {/* Avatar */}
      <div className="card mb-4 flex flex-col items-center py-6">
        <button
          onClick={() => setAvatarOpen(true)}
          className="w-24 h-24 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-5xl mb-3 shadow-lg shadow-brand-200 hover:scale-105 transition-transform"
        >
          {form.avatar || <User size={40} className="text-white" />}
        </button>
        <button onClick={() => setAvatarOpen(true)} className="flex items-center gap-1.5 text-brand-600 font-bold text-sm hover:text-brand-700">
          <Camera size={14} /> Trocar avatar
        </button>
      </div>

      {/* Modal de avatar */}
      {avatarOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-5 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <p className="font-black text-gray-800">Escolha seu avatar</p>
              <button onClick={() => setAvatarOpen(false)} className="p-1.5 rounded-xl hover:bg-gray-100">
                <X size={20} className="text-gray-400" />
              </button>
            </div>
            <div className="grid grid-cols-8 gap-3 pb-2">
              {AVATARES.map(av => (
                <button
                  key={av}
                  onClick={() => { set('avatar', av); setAvatarOpen(false) }}
                  className={clsx('text-2xl w-10 h-10 rounded-2xl flex items-center justify-center transition-all', form.avatar === av ? 'bg-brand-100 ring-2 ring-brand-500' : 'hover:bg-gray-100')}
                >
                  {av}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Campos do formulário */}
      <div className="card mb-4 space-y-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Informações pessoais</p>
        {[
          { label: 'Nome completo', key: 'nome', type: 'text', icon: User, placeholder: 'Seu nome completo' },
          { label: 'E-mail', key: 'email', type: 'email', icon: Mail, placeholder: 'seu@email.com' },
          { label: 'Telefone', key: 'telefone', type: 'tel', icon: Phone, placeholder: '(00) 00000-0000' },
          { label: 'Cidade', key: 'cidade', type: 'text', icon: MapPin, placeholder: 'Sua cidade' },
          { label: 'Data de nascimento', key: 'nascimento', type: 'date', icon: Calendar, placeholder: '' },
        ].map(f => {
          const Icon = f.icon
          return (
            <div key={f.key}>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">{f.label}</label>
              <div className="relative">
                <Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
                <input
                  type={f.type}
                  value={form[f.key] || ''}
                  onChange={e => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  className="input pl-9"
                />
              </div>
            </div>
          )
        })}
      </div>

      {/* Bio */}
      <div className="card mb-5">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Bio / Motivação</label>
        <textarea
          value={form.bio || ''}
          onChange={e => set('bio', e.target.value)}
          placeholder="Escreva algo sobre você ou seu objetivo de vida..."
          rows={3}
          className="input resize-none"
        />
        <p className="text-xs text-gray-300 font-semibold mt-1 text-right">{(form.bio || '').length}/150</p>
      </div>

      <button onClick={salvar} className={clsx('w-full btn-primary flex items-center justify-center gap-2 py-4', saved && 'bg-emerald-500 shadow-emerald-200')}>
        {saved ? <><CheckCircle2 size={18} /> Perfil salvo!</> : <><Check size={18} /> Salvar alterações</>}
      </button>
    </SubPage>
  )
}

// ═══════════════════════════════════════════════════════════════
// NOTIFICAÇÕES
// ═══════════════════════════════════════════════════════════════
function Notificacoes({ onBack }) {
  const [cfg, setCfg] = useState({
    habitos: true, treinos: true, financas: false,
    agua: true, estudo: false, sono: true, resumoDiario: true,
    horarioResumo: '20:00',
  })
  const [salvo, setSalvo] = useState(false)

  const toggle = k => setCfg(p => ({ ...p, [k]: !p[k] }))

  const salvar = () => {
    setSalvo(true)
    setTimeout(() => setSalvo(false), 2000)
  }

  const grupos = [
    {
      titulo: 'Lembretes de módulos',
      itens: [
        { key: 'habitos', label: 'Hábitos diários', desc: 'Lembrete para marcar seus hábitos' },
        { key: 'treinos', label: 'Treinos', desc: 'Hora de ir para a academia!' },
        { key: 'agua', label: 'Hidratação', desc: 'Beber água ao longo do dia' },
        { key: 'estudo', label: 'Sessões de estudo', desc: 'Hora do Pomodoro' },
        { key: 'financas', label: 'Finanças', desc: 'Registrar gastos do dia' },
        { key: 'sono', label: 'Hora de dormir', desc: 'Lembrete para manter rotina de sono' },
      ]
    },
    {
      titulo: 'Resumo',
      itens: [
        { key: 'resumoDiario', label: 'Resumo diário', desc: 'Um resumo do seu dia ao final' },
      ]
    }
  ]

  return (
    <SubPage title="Notificações" onBack={onBack}>
      {grupos.map(g => (
        <div key={g.titulo} className="card mb-4">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">{g.titulo}</p>
          <div className="space-y-4">
            {g.itens.map(item => (
              <div key={item.key} className="flex items-center justify-between gap-3">
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-800">{item.label}</p>
                  <p className="text-xs text-gray-400 font-semibold">{item.desc}</p>
                </div>
                <Toggle ativo={cfg[item.key]} onClick={() => toggle(item.key)} />
              </div>
            ))}
          </div>
        </div>
      ))}

      {cfg.resumoDiario && (
        <div className="card mb-4">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Horário do resumo diário</label>
          <input
            type="time"
            value={cfg.horarioResumo}
            onChange={e => setCfg(p => ({ ...p, horarioResumo: e.target.value }))}
            className="input"
          />
        </div>
      )}

      <button onClick={salvar} className={clsx('w-full btn-primary flex items-center justify-center gap-2 py-4', salvo && 'bg-emerald-500 shadow-emerald-200')}>
        {salvo ? <><CheckCircle2 size={18} /> Salvo!</> : <><Check size={18} /> Salvar preferências</>}
      </button>
    </SubPage>
  )
}

// ═══════════════════════════════════════════════════════════════
// METAS PESSOAIS
// ═══════════════════════════════════════════════════════════════
function MetasPessoais({ onBack }) {
  const [metas, setMetas] = useState([
    { id: 1, area: 'Saúde', descricao: 'Treinar 4x por semana', prazo: '2025-12-31', prioridade: 'Alta', concluida: false },
    { id: 2, area: 'Finanças', descricao: 'Guardar R$500 por mês', prazo: '2025-12-31', prioridade: 'Alta', concluida: false },
    { id: 3, area: 'Estudos', descricao: 'Finalizar curso de React', prazo: '2025-08-31', prioridade: 'Média', concluida: true },
  ])
  const [nova, setNova] = useState({ area: 'Saúde', descricao: '', prazo: '', prioridade: 'Média' })
  const [adicionando, setAdicionando] = useState(false)

  const areas = ['Saúde', 'Finanças', 'Estudos', 'Treinos', 'Relacionamentos', 'Carreira', 'Bem-estar', 'Outro']
  const prioridades = ['Alta', 'Média', 'Baixa']
  const corPrioridade = { Alta: 'badge-red', Média: 'badge-orange', Baixa: 'badge-blue' }

  const adicionar = () => {
    if (!nova.descricao.trim()) return
    setMetas(p => [...p, { ...nova, id: Date.now(), concluida: false }])
    setNova({ area: 'Saúde', descricao: '', prazo: '', prioridade: 'Média' })
    setAdicionando(false)
  }

  const toggleMeta = id => setMetas(p => p.map(m => m.id === id ? { ...m, concluida: !m.concluida } : m))
  const remover = id => setMetas(p => p.filter(m => m.id !== id))

  const concluidas = metas.filter(m => m.concluida).length

  return (
    <SubPage title="Metas Pessoais" onBack={onBack}>

      {/* Progresso geral */}
      <div className="card mb-4">
        <div className="flex justify-between text-sm font-bold mb-2">
          <span className="text-gray-700">Progresso geral</span>
          <span className="text-brand-600">{concluidas}/{metas.length}</span>
        </div>
        <div className="progress-bar h-3">
          <div className="progress-fill bg-gradient-to-r from-brand-400 to-brand-600" style={{ width: `${metas.length ? (concluidas / metas.length) * 100 : 0}%` }} />
        </div>
      </div>

      {/* Lista */}
      <div className="space-y-3 mb-4">
        {metas.map(m => (
          <div key={m.id} className={clsx('card transition-all', m.concluida && 'opacity-60')}>
            <div className="flex items-start gap-3">
              <button onClick={() => toggleMeta(m.id)} className="mt-0.5 flex-shrink-0">
                {m.concluida
                  ? <CheckCircle2 size={20} className="text-emerald-500" />
                  : <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                }
              </button>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="badge badge-purple">{m.area}</span>
                  <span className={`badge ${corPrioridade[m.prioridade]}`}>{m.prioridade}</span>
                </div>
                <p className={clsx('text-sm font-bold', m.concluida ? 'line-through text-gray-400' : 'text-gray-800')}>
                  {m.descricao}
                </p>
                {m.prazo && (
                  <p className="text-xs text-gray-400 font-semibold mt-0.5">
                    Prazo: {new Date(m.prazo + 'T12:00:00').toLocaleDateString('pt-BR')}
                  </p>
                )}
              </div>
              <button onClick={() => remover(m.id)} className="p-1.5 rounded-xl hover:bg-red-50 transition-colors flex-shrink-0">
                <Trash2 size={15} className="text-red-400" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Form nova meta */}
      {adicionando ? (
        <div className="card mb-4 space-y-4">
          <p className="font-bold text-gray-700 text-sm">Nova meta</p>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Área da vida</label>
            <div className="flex flex-wrap gap-2">
              {areas.map(a => (
                <button key={a} onClick={() => setNova(p => ({ ...p, area: a }))}
                  className={clsx('px-3 py-1.5 rounded-xl text-xs font-bold border transition-all', nova.area === a ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-200')}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Descrição da meta</label>
            <input
              type="text" value={nova.descricao}
              onChange={e => setNova(p => ({ ...p, descricao: e.target.value }))}
              placeholder="Ex: Treinar 4x por semana" className="input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Prazo</label>
              <input type="date" value={nova.prazo} onChange={e => setNova(p => ({ ...p, prazo: e.target.value }))} className="input" />
            </div>
            <div>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">Prioridade</label>
              <div className="flex gap-1.5">
                {prioridades.map(pr => (
                  <button key={pr} onClick={() => setNova(p => ({ ...p, prioridade: pr }))}
                    className={clsx('flex-1 py-2 rounded-xl text-xs font-bold border transition-all', nova.prioridade === pr ? 'bg-brand-500 text-white border-brand-500' : 'bg-white text-gray-600 border-gray-200')}>
                    {pr}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button onClick={() => setAdicionando(false)} className="flex-1 py-3 rounded-2xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50">
              Cancelar
            </button>
            <button onClick={adicionar} className="flex-1 btn-primary py-3">
              Adicionar meta
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdicionando(true)}
          className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-200 rounded-3xl text-gray-400 font-bold text-sm hover:border-brand-300 hover:text-brand-500 transition-colors">
          + Nova meta
        </button>
      )}
    </SubPage>
  )
}

// ═══════════════════════════════════════════════════════════════
// PRIVACIDADE
// ═══════════════════════════════════════════════════════════════
function Privacidade({ onBack }) {
  const [cfg, setCfg] = useState({
    perfilPublico: false, mostrarStreak: true,
    mostrarStats: true, compartilharProgresso: false,
  })
  const [senhaForm, setSenhaForm] = useState({ atual: '', nova: '', confirmar: '' })
  const [verSenha, setVerSenha] = useState({ atual: false, nova: false, confirmar: false })
  const [senhaOk, setSenhaOk] = useState(false)
  const [salvo, setSalvo] = useState(false)

  const toggle = k => setCfg(p => ({ ...p, [k]: !p[k] }))

  const salvarSenha = () => {
    if (!senhaForm.nova || senhaForm.nova !== senhaForm.confirmar) return
    setSenhaOk(true)
    setTimeout(() => setSenhaOk(false), 2500)
    setSenhaForm({ atual: '', nova: '', confirmar: '' })
  }

  const salvarPrivacidade = () => {
    setSalvo(true)
    setTimeout(() => setSalvo(false), 2000)
  }

  const InputSenha = ({ campo, label }) => (
    <div>
      <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">{label}</label>
      <div className="relative">
        <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300" />
        <input
          type={verSenha[campo] ? 'text' : 'password'}
          value={senhaForm[campo]}
          onChange={e => setSenhaForm(p => ({ ...p, [campo]: e.target.value }))}
          placeholder="••••••••"
          className="input pl-9 pr-10"
        />
        <button
          onClick={() => setVerSenha(p => ({ ...p, [campo]: !p[campo] }))}
          className="absolute right-3 top-1/2 -translate-y-1/2"
        >
          {verSenha[campo] ? <EyeOff size={16} className="text-gray-300" /> : <Eye size={16} className="text-gray-300" />}
        </button>
      </div>
    </div>
  )

  const senhaInvalida = senhaForm.nova && senhaForm.confirmar && senhaForm.nova !== senhaForm.confirmar

  return (
    <SubPage title="Privacidade" onBack={onBack}>

      <div className="card mb-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Visibilidade do perfil</p>
        <div className="space-y-4">
          {[
            { key: 'perfilPublico', label: 'Perfil público', desc: 'Outras pessoas podem ver seu perfil' },
            { key: 'mostrarStreak', label: 'Mostrar streak', desc: 'Exibir sua sequência de dias ativos' },
            { key: 'mostrarStats', label: 'Mostrar estatísticas', desc: 'Exibir seus números de treinos e hábitos' },
            { key: 'compartilharProgresso', label: 'Compartilhar progresso', desc: 'Permitir compartilhamento de conquistas' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between gap-3">
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-800">{item.label}</p>
                <p className="text-xs text-gray-400 font-semibold">{item.desc}</p>
              </div>
              <Toggle ativo={cfg[item.key]} onClick={() => toggle(item.key)} />
            </div>
          ))}
        </div>
        <button onClick={salvarPrivacidade} className={clsx('w-full mt-4 btn-primary flex items-center justify-center gap-2', salvo && 'bg-emerald-500')}>
          {salvo ? <><CheckCircle2 size={16} /> Salvo!</> : <><Check size={16} /> Salvar preferências</>}
        </button>
      </div>

      <div className="card mb-4 space-y-3">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Alterar senha</p>
        <InputSenha campo="atual" label="Senha atual" />
        <InputSenha campo="nova" label="Nova senha" />
        <InputSenha campo="confirmar" label="Confirmar nova senha" />
        {senhaInvalida && <p className="text-xs font-bold text-red-500">As senhas não coincidem</p>}
        <button
          onClick={salvarSenha}
          disabled={!!senhaInvalida || !senhaForm.nova}
          className={clsx('w-full btn-primary flex items-center justify-center gap-2 py-3', senhaOk && 'bg-emerald-500', (senhaInvalida || !senhaForm.nova) && 'opacity-40 cursor-not-allowed')}>
          {senhaOk ? <><CheckCircle2 size={16} /> Senha atualizada!</> : <><Lock size={16} /> Atualizar senha</>}
        </button>
      </div>
    </SubPage>
  )
}

// ═══════════════════════════════════════════════════════════════
// EXPORTAR DADOS
// ═══════════════════════════════════════════════════════════════
function ExportarDados({ onBack }) {
  const [exportando, setExportando] = useState(null)
  const [exportados, setExportados] = useState([])

  const modulos = [
    { id: 'habitos', label: 'Hábitos', desc: 'Histórico de todos os hábitos e streaks', emoji: '✅' },
    { id: 'financas', label: 'Finanças', desc: 'Transações, cartões e metas financeiras', emoji: '💰' },
    { id: 'treinos', label: 'Treinos', desc: 'Fichas, séries e progressão de carga', emoji: '💪' },
    { id: 'alimentacao', label: 'Alimentação', desc: 'Log de refeições e macros', emoji: '🥗' },
    { id: 'estudos', label: 'Estudos', desc: 'Matérias e sessões de Pomodoro', emoji: '📚' },
    { id: 'todos', label: 'Exportar tudo', desc: 'Todos os dados em um único arquivo ZIP', emoji: '📦' },
  ]

  const exportar = (id) => {
    setExportando(id)
    setTimeout(() => {
      setExportando(null)
      setExportados(p => [...p, id])
      const dados = { modulo: id, exportadoEm: new Date().toISOString(), versao: '1.0', dados: [] }
      const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `evoluaja-${id}-${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.json`
      a.click()
      URL.revokeObjectURL(url)
    }, 1500)
  }

  return (
    <SubPage title="Exportar Dados" onBack={onBack}>
      <div className="card mb-4 bg-blue-50 border-blue-100">
        <p className="text-sm font-bold text-blue-700 mb-1">Seus dados são seus</p>
        <p className="text-xs text-blue-600 font-semibold">
          Exporte seus dados a qualquer momento em formato JSON — compatível com Excel, Google Sheets e outras ferramentas.
        </p>
      </div>

      <div className="space-y-3 mb-4">
        {modulos.map(m => (
          <div key={m.id} className="card flex items-center gap-4">
            <span className="text-2xl flex-shrink-0">{m.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-800">{m.label}</p>
              <p className="text-xs text-gray-400 font-semibold">{m.desc}</p>
            </div>
            <button
              onClick={() => exportar(m.id)}
              disabled={exportando === m.id}
              className={clsx(
                'flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-all',
                exportados.includes(m.id)
                  ? 'bg-emerald-100'
                  : 'bg-brand-100 hover:bg-brand-200'
              )}
            >
              {exportando === m.id
                ? <span className="w-4 h-4 border-2 border-brand-300 border-t-brand-600 rounded-full animate-spin" />
                : exportados.includes(m.id)
                ? <CheckCircle2 size={18} className="text-emerald-500" />
                : <Download size={17} className="text-brand-600" />
              }
            </button>
          </div>
        ))}
      </div>

      <div className="card">
        <div className="flex items-start gap-3">
          <FileText size={18} className="text-gray-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-gray-400 font-semibold">
            Os arquivos são gerados em <span className="font-bold text-gray-600">JSON</span> e podem ser abertos no Excel ou Google Sheets. Para importar em outra conta, use a opção "Importar dados" quando disponível.
          </p>
        </div>
      </div>
    </SubPage>
  )
}

// ═══════════════════════════════════════════════════════════════
// SAIR DA CONTA
// ═══════════════════════════════════════════════════════════════
function SairConta({ onBack }) {
  const [confirmando, setConfirmando] = useState(false)
  const [saindo, setSaindo] = useState(false)

  const sair = () => {
    setSaindo(true)
    setTimeout(() => {
      setSaindo(false)
      setConfirmando(false)
      onBack()
    }, 1500)
  }

  return (
    <SubPage title="Sair da Conta" onBack={onBack}>
      <div className="card mb-5 flex flex-col items-center py-10 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
          <LogOut size={28} className="text-red-500" />
        </div>
        <h2 className="text-lg font-black text-gray-800 mb-2">Sair da conta?</h2>
        <p className="text-sm text-gray-400 font-semibold max-w-xs leading-relaxed">
          Você será desconectado do EvoluaJá. Seus dados ficam salvos e você pode entrar novamente quando quiser.
        </p>
      </div>

      {!confirmando ? (
        <button
          onClick={() => setConfirmando(true)}
          className="w-full py-4 rounded-2xl bg-red-500 text-white font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition-colors shadow-md shadow-red-100">
          <LogOut size={18} /> Sair da conta
        </button>
      ) : (
        <div className="card border-red-100 bg-red-50">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle size={20} className="text-red-500 flex-shrink-0" />
            <p className="text-sm font-bold text-red-700">Tem certeza que deseja sair?</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setConfirmando(false)} className="flex-1 py-3 rounded-2xl border border-gray-200 bg-white text-sm font-bold text-gray-600 hover:bg-gray-50">
              Cancelar
            </button>
            <button onClick={sair} disabled={saindo} className="flex-1 py-3 rounded-2xl bg-red-500 text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition-colors">
              {saindo
                ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                : 'Sim, sair'
              }
            </button>
          </div>
        </div>
      )}
    </SubPage>
  )
}

// ═══════════════════════════════════════════════════════════════
// PÁGINA PRINCIPAL DO PERFIL
// ═══════════════════════════════════════════════════════════════
export default function Perfil() {
  const [pagina, setPagina] = useState('principal')
  const [respostas, setRespostas] = useState({})
  const [gerado, setGerado] = useState(false)
  const [gerando, setGerando] = useState(false)
  const [perfil, setPerfil] = useState({
    nome: 'Usuário', email: 'usuario@email.com',
    telefone: '', cidade: '', nascimento: '', bio: '', avatar: '😎',
  })

  const selecionar = (key, val) => setRespostas(prev => ({ ...prev, [key]: val }))
  const todosRespondidos = quizPerguntas.every(q => respostas[q.key])

  const gerarRotina = () => {
    if (!todosRespondidos) return
    setGerando(true)
    setTimeout(() => { setGerando(false); setGerado(true) }, 2000)
  }

  // Roteamento interno das sub-páginas
  if (pagina === 'editar')       return <EditarPerfil perfil={perfil} onSave={p => setPerfil(p)} onBack={() => setPagina('principal')} />
  if (pagina === 'notificacoes') return <Notificacoes onBack={() => setPagina('principal')} />
  if (pagina === 'metas')        return <MetasPessoais onBack={() => setPagina('principal')} />
  if (pagina === 'privacidade')  return <Privacidade onBack={() => setPagina('principal')} />
  if (pagina === 'exportar')     return <ExportarDados onBack={() => setPagina('principal')} />
  if (pagina === 'sair')         return <SairConta onBack={() => setPagina('principal')} />

  const configItens = [
    { key: 'notificacoes', label: 'Notificações',   icon: Bell,     desc: 'Lembretes e alertas de módulos' },
    { key: 'metas',        label: 'Metas pessoais', icon: Flag,     desc: 'Seus grandes objetivos de vida' },
    { key: 'privacidade',  label: 'Privacidade',    icon: Shield,   desc: 'Senha e visibilidade do perfil' },
    { key: 'exportar',     label: 'Exportar dados', icon: Download, desc: 'Baixar seus dados em JSON' },
    { key: 'sair',         label: 'Sair da conta',  icon: LogOut,   desc: 'Encerrar sessão atual', danger: true },
  ]

  return (
    <div className="page-container animate-fade-in-up">

      {/* Avatar e nome */}
      <div className="flex flex-col items-center mb-6 pt-2">
        <div className="relative mb-3">
          <div className="w-24 h-24 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-5xl shadow-lg shadow-brand-200">
            {perfil.avatar || <User size={40} className="text-white" />}
          </div>
          <button
            onClick={() => setPagina('editar')}
            className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full border-2 border-brand-200 flex items-center justify-center shadow-sm hover:bg-brand-50 transition-colors"
          >
            <Edit2 size={13} className="text-brand-600" />
          </button>
        </div>
        <h1 className="text-2xl font-black text-gray-800">{perfil.nome}</h1>
        <p className="text-sm font-semibold text-gray-400">{perfil.email}</p>
        {perfil.bio && (
          <p className="text-xs text-gray-400 font-semibold mt-1 text-center max-w-xs px-4">{perfil.bio}</p>
        )}
        {perfil.cidade && (
          <p className="text-xs text-gray-300 font-semibold mt-0.5">📍 {perfil.cidade}</p>
        )}
        <button onClick={() => setPagina('editar')} className="btn-ghost py-1.5 mt-2 text-xs">
          ✏️ Editar perfil
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {stats.map((s, i) => (
          <div key={i} className="card text-center py-4 px-2">
            <p className="text-xl font-black text-brand-600">{s.valor}</p>
            <p className="text-[10px] font-bold text-gray-400 mt-0.5 leading-tight">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quiz IA */}
      <div className="card mb-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-brand-100 rounded-2xl flex items-center justify-center">
            <Sparkles size={20} className="text-brand-600" />
          </div>
          <div>
            <h2 className="font-black text-gray-800">IA de Rotina Automática</h2>
            <p className="text-xs font-semibold text-gray-400">Responda o quiz para personalizar sua rotina</p>
          </div>
        </div>
        <div className="space-y-5">
          {quizPerguntas.map(q => {
            const Icon = q.icon
            return (
              <div key={q.key}>
                <div className="flex items-center gap-2 mb-2.5">
                  <Icon size={15} className="text-brand-500" />
                  <p className="text-sm font-bold text-gray-700">{q.label}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {q.opcoes.map(o => (
                    <button key={o} onClick={() => selecionar(q.key, o)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${respostas[q.key] === o ? 'bg-brand-500 text-white border-brand-500 shadow-sm' : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300 hover:text-brand-600'}`}>
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        <button
          onClick={gerarRotina}
          disabled={!todosRespondidos || gerando}
          className={`w-full mt-5 btn-primary flex items-center justify-center gap-2 ${!todosRespondidos ? 'opacity-40 cursor-not-allowed' : ''}`}
        >
          {gerando
            ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Gerando rotina...</>
            : gerado
            ? <><CheckCircle2 size={18} /> Rotina gerada com sucesso!</>
            : <><Sparkles size={18} /> Gerar minha rotina com IA</>
          }
        </button>
      </div>

      {/* Configurações */}
      <div className="card">
        <h3 className="font-bold text-gray-700 mb-2">Configurações</h3>
        <div className="space-y-1">
          {configItens.map(item => {
            const Icon = item.icon
            return (
              <button
                key={item.key}
                onClick={() => setPagina(item.key)}
                className={clsx(
                  'w-full flex items-center gap-3 py-3 px-2 rounded-2xl transition-all text-left',
                  item.danger ? 'hover:bg-red-50' : 'hover:bg-gray-50'
                )}
              >
                <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', item.danger ? 'bg-red-100' : 'bg-gray-100')}>
                  <Icon size={17} className={item.danger ? 'text-red-500' : 'text-gray-500'} />
                </div>
                <div className="flex-1">
                  <p className={clsx('text-sm font-bold', item.danger ? 'text-red-500' : 'text-gray-800')}>{item.label}</p>
                  <p className="text-xs text-gray-400 font-semibold">{item.desc}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 flex-shrink-0" />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
