import { useState } from 'react'
import {
  User, Target, Activity, Dumbbell, Home, ChevronRight, Sparkles,
  CheckCircle2, Bell, Flag, Shield, Download, LogOut, Camera,
  X, Check, Edit2, Mail, Phone, MapPin, Calendar, ArrowLeft,
  Lock, Eye, EyeOff, Trash2, FileText, AlertTriangle, RefreshCw, Sun, Moon, Monitor
} from 'lucide-react'
import clsx from 'clsx'
import { useLocalStorage, clearAllStorage } from '../hooks/useLocalStorage'
import { useTheme } from '../context/ThemeContext'

const quizPerguntas = [
  { key: 'objetivo', label: 'Objetivo principal', icon: Target, opcoes: ['Hipertrofia', 'Emagrecimento', 'Definição', 'Estudos', 'Produtividade geral'] },
  { key: 'atividade', label: 'Nível de atividade', icon: Activity, opcoes: ['Sedentário', 'Leve (1-2x/semana)', 'Moderado (3-4x/semana)', 'Intenso (5+x/semana)'] },
  { key: 'treino', label: 'Tipo de treino', icon: Dumbbell, opcoes: ['Musculação', 'Funcional', 'Cardio', 'Misto', 'Não treino'] },
  { key: 'casa', label: 'Frequência tarefas domésticas', icon: Home, opcoes: ['Diariamente', '3-4x por semana', 'Fins de semana', 'Raramente'] },
]
const AVATARES = ['😀','😎','🦁','🐯','🦊','🐺','🦅','🐉','🌟','⚡','🔥','💪','🧠','🎯','🚀','🌊']

function SubPage({ title, onBack, children }) {
  return (
    <div className="page-container animate-fade-in-up">
      <div className="flex items-center gap-3 mb-6 pt-1">
        <button onClick={onBack} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"><ArrowLeft size={20} className="text-gray-600 dark:text-gray-400" /></button>
        <h1 className="text-xl font-black text-gray-800 dark:text-gray-100">{title}</h1>
      </div>
      {children}
    </div>
  )
}

function Toggle({ ativo, onClick }) {
  return (
    <button onClick={onClick} className={clsx('w-12 h-6 rounded-full transition-colors relative flex-shrink-0', ativo ? 'bg-brand-500' : 'bg-gray-200 dark:bg-gray-700')}>
      <span className={clsx('absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all', ativo ? 'left-6' : 'left-0.5')} />
    </button>
  )
}

function ModalSheet({ titulo, onClose, children }) {
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

// ── Editar Perfil ────────────────────────────────────────────────
function EditarPerfil({ perfil, onSave, onBack }) {
  const [form, setForm] = useState(perfil)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [saved, setSaved] = useState(false)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))
  const salvar = () => { onSave(form); setSaved(true); setTimeout(() => { setSaved(false); onBack() }, 1200) }

  return (
    <SubPage title="Editar Perfil" onBack={onBack}>
      <div className="card mb-4 flex flex-col items-center py-6">
        <button onClick={() => setAvatarOpen(true)} className="w-24 h-24 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-5xl mb-3 shadow-lg shadow-brand-200 hover:scale-105 transition-transform">
          {form.avatar || <User size={40} className="text-white" />}
        </button>
        <button onClick={() => setAvatarOpen(true)} className="flex items-center gap-1.5 text-brand-600 font-bold text-sm"><Camera size={14} /> Trocar avatar</button>
      </div>
      {avatarOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
          <div className="w-full bg-white dark:bg-gray-900 rounded-t-3xl p-5 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-4">
              <p className="font-black text-gray-800 dark:text-gray-100">Escolha seu avatar</p>
              <button onClick={() => setAvatarOpen(false)} className="p-1.5 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800"><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="grid grid-cols-8 gap-3 pb-2">
              {AVATARES.map(av => (
                <button key={av} onClick={() => { set('avatar', av); setAvatarOpen(false) }}
                  className={clsx('text-2xl w-10 h-10 rounded-2xl flex items-center justify-center transition-all', form.avatar === av ? 'bg-brand-100 dark:bg-brand-900 ring-2 ring-brand-500' : 'hover:bg-gray-100 dark:hover:bg-gray-800')}>
                  {av}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
      <div className="card mb-4 space-y-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Informações pessoais</p>
        {[
          { label: 'Nome completo', key: 'nome', type: 'text', icon: User, placeholder: 'Seu nome' },
          { label: 'E-mail', key: 'email', type: 'email', icon: Mail, placeholder: 'seu@email.com' },
          { label: 'Telefone', key: 'telefone', type: 'tel', icon: Phone, placeholder: '(00) 00000-0000' },
          { label: 'Cidade', key: 'cidade', type: 'text', icon: MapPin, placeholder: 'Sua cidade' },
          { label: 'Data de nascimento', key: 'nascimento', type: 'date', icon: Calendar, placeholder: '' },
        ].map(f => {
          const Icon = f.icon
          return (
            <div key={f.key}>
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">{f.label}</label>
              <div className="relative"><Icon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600" /><input type={f.type} value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)} placeholder={f.placeholder} className="input pl-9" /></div>
            </div>
          )
        })}
      </div>
      <div className="card mb-5">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Bio / Motivação</label>
        <textarea value={form.bio || ''} onChange={e => set('bio', e.target.value)} placeholder="Escreva algo sobre você..." rows={3} className="input resize-none" />
      </div>
      <button onClick={salvar} className={clsx('w-full btn-primary flex items-center justify-center gap-2 py-4', saved && 'bg-emerald-500')}>
        {saved ? <><CheckCircle2 size={18} /> Salvo!</> : <><Check size={18} /> Salvar alterações</>}
      </button>
    </SubPage>
  )
}

// ── Notificações ─────────────────────────────────────────────────
function Notificacoes({ onBack }) {
  const [cfg, setCfg] = useLocalStorage('evoluaja_notif', { habitos: true, treinos: true, financas: false, agua: true, estudo: false, sono: true, resumoDiario: true, horarioResumo: '20:00' })
  const [salvo, setSalvo] = useState(false)
  const toggle = k => setCfg(p => ({ ...p, [k]: !p[k] }))
  const salvar = () => { setSalvo(true); setTimeout(() => setSalvo(false), 2000) }

  return (
    <SubPage title="Notificações" onBack={onBack}>
      <div className="card mb-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Lembretes de módulos</p>
        <div className="space-y-4">
          {[
            { key: 'habitos', label: 'Hábitos diários', desc: 'Lembrete para marcar hábitos' },
            { key: 'treinos', label: 'Treinos', desc: 'Hora de ir para a academia!' },
            { key: 'agua', label: 'Hidratação', desc: 'Beber água ao longo do dia' },
            { key: 'estudo', label: 'Sessões de estudo', desc: 'Hora do Pomodoro' },
            { key: 'financas', label: 'Finanças', desc: 'Registrar gastos do dia' },
            { key: 'sono', label: 'Hora de dormir', desc: 'Manter rotina de sono' },
            { key: 'resumoDiario', label: 'Resumo diário', desc: 'Resumo do seu dia ao final' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between gap-3">
              <div className="flex-1"><p className="text-sm font-bold text-gray-800 dark:text-gray-100">{item.label}</p><p className="text-xs text-gray-400 font-semibold">{item.desc}</p></div>
              <Toggle ativo={cfg[item.key]} onClick={() => toggle(item.key)} />
            </div>
          ))}
        </div>
      </div>
      {cfg.resumoDiario && (
        <div className="card mb-4">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2 block">Horário do resumo</label>
          <input type="time" value={cfg.horarioResumo} onChange={e => setCfg(p => ({ ...p, horarioResumo: e.target.value }))} className="input" />
        </div>
      )}
      <button onClick={salvar} className={clsx('w-full btn-primary flex items-center justify-center gap-2 py-4', salvo && 'bg-emerald-500')}>
        {salvo ? <><CheckCircle2 size={18} /> Salvo!</> : <><Check size={18} /> Salvar preferências</>}
      </button>
    </SubPage>
  )
}

// ── Privacidade ───────────────────────────────────────────────────
function Privacidade({ onBack }) {
  const [cfg, setCfg] = useLocalStorage('evoluaja_priv', { perfilPublico: false, mostrarStreak: true, mostrarStats: true, compartilharProgresso: false })
  const [senhaForm, setSenhaForm] = useState({ atual: '', nova: '', confirmar: '' })
  const [verSenha, setVerSenha] = useState({ atual: false, nova: false, confirmar: false })
  const [senhaOk, setSenhaOk] = useState(false)
  const [salvo, setSalvo] = useState(false)

  const salvarPriv = () => { setSalvo(true); setTimeout(() => setSalvo(false), 2000) }
  const salvarSenha = () => {
    if (!senhaForm.nova || senhaForm.nova !== senhaForm.confirmar) return
    setSenhaOk(true); setTimeout(() => setSenhaOk(false), 2500)
    setSenhaForm({ atual: '', nova: '', confirmar: '' })
  }
  const senhaInvalida = senhaForm.nova && senhaForm.confirmar && senhaForm.nova !== senhaForm.confirmar

  const InputSenha = ({ campo, label }) => (
    <div>
      <label className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-1 block">{label}</label>
      <div className="relative">
        <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 dark:text-gray-600" />
        <input type={verSenha[campo] ? 'text' : 'password'} value={senhaForm[campo]} onChange={e => setSenhaForm(p => ({ ...p, [campo]: e.target.value }))} placeholder="••••••••" className="input pl-9 pr-10" />
        <button onClick={() => setVerSenha(p => ({ ...p, [campo]: !p[campo] }))} className="absolute right-3 top-1/2 -translate-y-1/2">
          {verSenha[campo] ? <EyeOff size={16} className="text-gray-300 dark:text-gray-600" /> : <Eye size={16} className="text-gray-300 dark:text-gray-600" />}
        </button>
      </div>
    </div>
  )

  return (
    <SubPage title="Privacidade" onBack={onBack}>
      <div className="card mb-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">Visibilidade do perfil</p>
        <div className="space-y-4">
          {[
            { key: 'perfilPublico', label: 'Perfil público', desc: 'Outras pessoas podem ver seu perfil' },
            { key: 'mostrarStreak', label: 'Mostrar streak', desc: 'Exibir sua sequência de dias' },
            { key: 'mostrarStats', label: 'Mostrar estatísticas', desc: 'Exibir seus números' },
            { key: 'compartilharProgresso', label: 'Compartilhar progresso', desc: 'Permitir compartilhamento' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between gap-3">
              <div className="flex-1"><p className="text-sm font-bold text-gray-800 dark:text-gray-100">{item.label}</p><p className="text-xs text-gray-400 font-semibold">{item.desc}</p></div>
              <Toggle ativo={cfg[item.key]} onClick={() => setCfg(p => ({ ...p, [item.key]: !p[item.key] }))} />
            </div>
          ))}
        </div>
        <button onClick={salvarPriv} className={clsx('w-full mt-4 btn-primary flex items-center justify-center gap-2', salvo && 'bg-emerald-500')}>
          {salvo ? <><CheckCircle2 size={16} /> Salvo!</> : <><Check size={16} /> Salvar</>}
        </button>
      </div>
      <div className="card mb-4 space-y-3">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Alterar senha</p>
        <InputSenha campo="atual" label="Senha atual" />
        <InputSenha campo="nova" label="Nova senha" />
        <InputSenha campo="confirmar" label="Confirmar nova senha" />
        {senhaInvalida && <p className="text-xs font-bold text-red-500">As senhas não coincidem</p>}
        <button onClick={salvarSenha} disabled={!!senhaInvalida || !senhaForm.nova}
          className={clsx('w-full btn-primary flex items-center justify-center gap-2 py-3', senhaOk && 'bg-emerald-500', (senhaInvalida || !senhaForm.nova) && 'opacity-40 cursor-not-allowed')}>
          {senhaOk ? <><CheckCircle2 size={16} /> Atualizada!</> : <><Lock size={16} /> Atualizar senha</>}
        </button>
      </div>
    </SubPage>
  )
}

// ── Exportar Dados ────────────────────────────────────────────────
function ExportarDados({ onBack }) {
  const [exportando, setExportando] = useState(null)
  const [exportados, setExportados] = useState([])
  const modulos = [
    { id: 'habitos', label: 'Hábitos', emoji: '✅', key: 'evoluaja_habitos' },
    { id: 'financas', label: 'Finanças', emoji: '💰', key: 'evoluaja_transacoes' },
    { id: 'treinos', label: 'Treinos', emoji: '💪', key: 'evoluaja_fichas' },
    { id: 'alimentacao', label: 'Alimentação', emoji: '🥗', key: 'evoluaja_refeicoes' },
    { id: 'estudos', label: 'Estudos', emoji: '📚', key: 'evoluaja_materias' },
    { id: 'todos', label: 'Exportar tudo', emoji: '📦', key: null },
  ]
  const exportar = (id, key) => {
    setExportando(id)
    setTimeout(() => {
      setExportando(null); setExportados(p => [...p, id])
      let dados = {}
      if (key) { try { dados = JSON.parse(localStorage.getItem(key) || '[]') } catch {} }
      else { Object.keys(localStorage).filter(k => k.startsWith('evoluaja_')).forEach(k => { try { dados[k] = JSON.parse(localStorage.getItem(k)) } catch {} }) }
      const blob = new Blob([JSON.stringify({ modulo: id, exportadoEm: new Date().toISOString(), dados }, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = `evoluaja-${id}-${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.json`; a.click()
      URL.revokeObjectURL(url)
    }, 1200)
  }

  return (
    <SubPage title="Exportar Dados" onBack={onBack}>
      <div className="card mb-4 bg-blue-50 dark:bg-blue-950 border-blue-100 dark:border-blue-900">
        <p className="text-sm font-bold text-blue-700 dark:text-blue-300 mb-1">Seus dados são seus</p>
        <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold">Exporte a qualquer momento em formato JSON — compatível com Excel e Google Sheets.</p>
      </div>
      <div className="space-y-3">
        {modulos.map(m => (
          <div key={m.id} className="card flex items-center gap-4">
            <span className="text-2xl flex-shrink-0">{m.emoji}</span>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-100 flex-1">{m.label}</p>
            <button onClick={() => exportar(m.id, m.key)} disabled={exportando === m.id}
              className={clsx('flex-shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center transition-all', exportados.includes(m.id) ? 'bg-emerald-100 dark:bg-emerald-900' : 'bg-brand-100 dark:bg-brand-900 hover:bg-brand-200')}>
              {exportando === m.id ? <span className="w-4 h-4 border-2 border-brand-300 border-t-brand-600 rounded-full animate-spin" /> : exportados.includes(m.id) ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Download size={17} className="text-brand-600 dark:text-brand-400" />}
            </button>
          </div>
        ))}
      </div>
    </SubPage>
  )
}

// ── Reset Geral ───────────────────────────────────────────────────
function ResetGeral({ onBack }) {
  const [confirmando, setConfirmando] = useState(false)
  const [resetando, setResetando] = useState(false)
  const [feito, setFeito] = useState(false)

  const resetar = () => {
    setResetando(true)
    setTimeout(() => {
      clearAllStorage()
      setResetando(false); setFeito(true)
      setTimeout(() => window.location.reload(), 1500)
    }, 1500)
  }

  return (
    <SubPage title="Reiniciar App" onBack={onBack}>
      <div className="card mb-5 flex flex-col items-center py-10 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center mb-4"><RefreshCw size={28} className="text-red-500" /></div>
        <h2 className="text-lg font-black text-gray-800 dark:text-gray-100 mb-2">Reiniciar do zero</h2>
        <p className="text-sm text-gray-400 font-semibold max-w-xs leading-relaxed">
          Todos os dados serão apagados: hábitos, tarefas, finanças, treinos, alimentação, streak e pontuação.<br /><br />
          <span className="font-black text-red-500">Esta ação não pode ser desfeita.</span>
        </p>
      </div>

      {feito ? (
        <div className="card bg-emerald-50 dark:bg-emerald-950 border-emerald-100 dark:border-emerald-900 text-center py-6">
          <CheckCircle2 size={32} className="text-emerald-500 mx-auto mb-2" />
          <p className="font-black text-emerald-700 dark:text-emerald-300">App resetado! Recarregando...</p>
        </div>
      ) : !confirmando ? (
        <button onClick={() => setConfirmando(true)} className="w-full py-4 rounded-2xl bg-red-500 text-white font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition-colors shadow-md shadow-red-100">
          <RefreshCw size={18} /> Reiniciar tudo do zero
        </button>
      ) : (
        <div className="card border-red-100 dark:border-red-900 bg-red-50 dark:bg-red-950">
          <div className="flex items-center gap-3 mb-4"><AlertTriangle size={20} className="text-red-500 flex-shrink-0" /><p className="text-sm font-bold text-red-700 dark:text-red-300">Tem certeza? Todos os dados serão perdidos!</p></div>
          <div className="flex gap-3">
            <button onClick={() => setConfirmando(false)} className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-bold text-gray-600 dark:text-gray-400">Cancelar</button>
            <button onClick={resetar} disabled={resetando} className="flex-1 py-3 rounded-2xl bg-red-500 text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-red-600">
              {resetando ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : 'Sim, apagar tudo'}
            </button>
          </div>
        </div>
      )}
    </SubPage>
  )
}

// ── Sair da Conta ─────────────────────────────────────────────────
function SairConta({ onBack }) {
  const [confirmando, setConfirmando] = useState(false)
  const [saindo, setSaindo] = useState(false)
  const sair = () => { setSaindo(true); setTimeout(() => { setSaindo(false); setConfirmando(false); onBack() }, 1500) }

  return (
    <SubPage title="Sair da Conta" onBack={onBack}>
      <div className="card mb-5 flex flex-col items-center py-10 text-center">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-950 rounded-full flex items-center justify-center mb-4"><LogOut size={28} className="text-red-500" /></div>
        <h2 className="text-lg font-black text-gray-800 dark:text-gray-100 mb-2">Sair da conta?</h2>
        <p className="text-sm text-gray-400 font-semibold max-w-xs leading-relaxed">Você será desconectado. Seus dados ficam salvos e você pode entrar novamente quando quiser.</p>
      </div>
      {!confirmando ? (
        <button onClick={() => setConfirmando(true)} className="w-full py-4 rounded-2xl bg-red-500 text-white font-bold flex items-center justify-center gap-2 hover:bg-red-600 transition-colors shadow-md shadow-red-100"><LogOut size={18} /> Sair da conta</button>
      ) : (
        <div className="card border-red-100 dark:border-red-900 bg-red-50 dark:bg-red-950">
          <div className="flex items-center gap-3 mb-4"><AlertTriangle size={20} className="text-red-500 flex-shrink-0" /><p className="text-sm font-bold text-red-700 dark:text-red-300">Tem certeza que deseja sair?</p></div>
          <div className="flex gap-3">
            <button onClick={() => setConfirmando(false)} className="flex-1 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm font-bold text-gray-600 dark:text-gray-400">Cancelar</button>
            <button onClick={sair} disabled={saindo} className="flex-1 py-3 rounded-2xl bg-red-500 text-white text-sm font-bold flex items-center justify-center gap-2 hover:bg-red-600">
              {saindo ? <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : 'Sim, sair'}
            </button>
          </div>
        </div>
      )}
    </SubPage>
  )
}

// ═══════════════════════════════════════════════════════════════
// PÁGINA PRINCIPAL
// ═══════════════════════════════════════════════════════════════
export default function Perfil() {
  const [pagina, setPagina] = useState('principal')
  const [respostas, setRespostas] = useState({})
  const [gerado, setGerado] = useState(false)
  const [gerando, setGerando] = useState(false)
  const [perfil, setPerfil] = useLocalStorage('evoluaja_perfil', { nome: 'Usuário', email: 'usuario@email.com', telefone: '', cidade: '', nascimento: '', bio: '', avatar: '😎' })
  const [streak] = useLocalStorage('evoluaja_streak', 7)
  const { theme, toggle, setSystem } = useTheme()

  const selecionar = (key, val) => setRespostas(prev => ({ ...prev, [key]: val }))
  const todosRespondidos = quizPerguntas.every(q => respostas[q.key])
  const gerarRotina = () => { if (!todosRespondidos) return; setGerando(true); setTimeout(() => { setGerando(false); setGerado(true) }, 2000) }

  if (pagina === 'editar')       return <EditarPerfil perfil={perfil} onSave={p => setPerfil(p)} onBack={() => setPagina('principal')} />
  if (pagina === 'notificacoes') return <Notificacoes onBack={() => setPagina('principal')} />
  if (pagina === 'privacidade')  return <Privacidade onBack={() => setPagina('principal')} />
  if (pagina === 'exportar')     return <ExportarDados onBack={() => setPagina('principal')} />
  if (pagina === 'reset')        return <ResetGeral onBack={() => setPagina('principal')} />
  if (pagina === 'sair')         return <SairConta onBack={() => setPagina('principal')} />

  const configItens = [
    { key: 'notificacoes', label: 'Notificações',      icon: Bell,       desc: 'Lembretes e alertas' },
    { key: 'privacidade',  label: 'Privacidade',       icon: Shield,     desc: 'Senha e visibilidade' },
    { key: 'exportar',     label: 'Exportar dados',    icon: Download,   desc: 'Baixar seus dados' },
    { key: 'reset',        label: 'Reiniciar do zero', icon: RefreshCw,  desc: 'Apagar todos os dados', danger: true },
    { key: 'sair',         label: 'Sair da conta',     icon: LogOut,     desc: 'Encerrar sessão', danger: true },
  ]

  return (
    <div className="page-container animate-fade-in-up">
      {/* Avatar */}
      <div className="flex flex-col items-center mb-6 pt-2">
        <div className="relative mb-3">
          <div className="w-24 h-24 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center text-5xl shadow-lg shadow-brand-200">{perfil.avatar || <User size={40} className="text-white" />}</div>
          <button onClick={() => setPagina('editar')} className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-gray-800 rounded-full border-2 border-brand-200 flex items-center justify-center shadow-sm hover:bg-brand-50"><Edit2 size={13} className="text-brand-600" /></button>
        </div>
        <h1 className="text-2xl font-black text-gray-800 dark:text-gray-100">{perfil.nome}</h1>
        <p className="text-sm font-semibold text-gray-400">{perfil.email}</p>
        {perfil.bio && <p className="text-xs text-gray-400 font-semibold mt-1 text-center max-w-xs px-4">{perfil.bio}</p>}
        {perfil.cidade && <p className="text-xs text-gray-300 dark:text-gray-600 font-semibold mt-0.5">📍 {perfil.cidade}</p>}
        <button onClick={() => setPagina('editar')} className="btn-ghost py-1.5 mt-2 text-xs">✏️ Editar perfil</button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-5">
        <div className="card text-center py-4">
          <p className="text-3xl font-black text-orange-500">🔥 {streak}</p>
          <p className="text-xs font-bold text-gray-400 mt-0.5">Dias de streak</p>
        </div>
        <div className="card text-center py-4">
          <p className="text-3xl font-black text-brand-600">⚡</p>
          <p className="text-xs font-bold text-gray-400 mt-0.5">Nível Ativo</p>
        </div>
      </div>

      {/* Tema */}
      <div className="card mb-5">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Tema da interface</p>
        <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 rounded-2xl p-1">
          {[{ id: 'light', icon: Sun, label: 'Claro' }, { id: 'dark', icon: Moon, label: 'Escuro' }, { id: 'system', icon: Monitor, label: 'Sistema' }].map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => id === 'system' ? setSystem() : (theme !== id && toggle())}
              className={clsx('flex-1 flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-bold transition-all',
                (id === theme || (id === 'system' && !localStorage.getItem('evoluaja_theme')))
                  ? 'bg-white dark:bg-gray-700 text-brand-600 shadow-sm' : 'text-gray-400 dark:text-gray-500')}>
              <Icon size={18} />{label}
            </button>
          ))}
        </div>
      </div>

      {/* Quiz IA */}
      <div className="card mb-5">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-brand-100 dark:bg-brand-900 rounded-2xl flex items-center justify-center"><Sparkles size={20} className="text-brand-600" /></div>
          <div><h2 className="font-black text-gray-800 dark:text-gray-100">IA de Rotina Automática</h2><p className="text-xs font-semibold text-gray-400">Responda o quiz para personalizar sua rotina</p></div>
        </div>
        <div className="space-y-5">
          {quizPerguntas.map(q => {
            const Icon = q.icon
            return (
              <div key={q.key}>
                <div className="flex items-center gap-2 mb-2.5"><Icon size={15} className="text-brand-500" /><p className="text-sm font-bold text-gray-700 dark:text-gray-300">{q.label}</p></div>
                <div className="flex flex-wrap gap-2">
                  {q.opcoes.map(o => (
                    <button key={o} onClick={() => selecionar(q.key, o)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${respostas[q.key] === o ? 'bg-brand-500 text-white border-brand-500' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700'}`}>
                      {o}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        <button onClick={gerarRotina} disabled={!todosRespondidos || gerando} className={`w-full mt-5 btn-primary flex items-center justify-center gap-2 ${!todosRespondidos ? 'opacity-40 cursor-not-allowed' : ''}`}>
          {gerando ? <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Gerando...</>
            : gerado ? <><CheckCircle2 size={18} /> Rotina gerada!</>
            : <><Sparkles size={18} /> Gerar minha rotina com IA</>}
        </button>
      </div>

      {/* Configurações */}
      <div className="card">
        <h3 className="font-bold text-gray-700 dark:text-gray-300 mb-2">Configurações</h3>
        <div className="space-y-1">
          {configItens.map(item => {
            const Icon = item.icon
            return (
              <button key={item.key} onClick={() => setPagina(item.key)}
                className={clsx('w-full flex items-center gap-3 py-3 px-2 rounded-2xl transition-all text-left', item.danger ? 'hover:bg-red-50 dark:hover:bg-red-950' : 'hover:bg-gray-50 dark:hover:bg-gray-800')}>
                <div className={clsx('w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0', item.danger ? 'bg-red-100 dark:bg-red-950' : 'bg-gray-100 dark:bg-gray-800')}>
                  <Icon size={17} className={item.danger ? 'text-red-500' : 'text-gray-500 dark:text-gray-400'} />
                </div>
                <div className="flex-1">
                  <p className={clsx('text-sm font-bold', item.danger ? 'text-red-500' : 'text-gray-800 dark:text-gray-100')}>{item.label}</p>
                  <p className="text-xs text-gray-400 font-semibold">{item.desc}</p>
                </div>
                <ChevronRight size={16} className="text-gray-300 dark:text-gray-700 flex-shrink-0" />
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
