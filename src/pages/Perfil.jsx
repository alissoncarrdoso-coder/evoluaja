import { useState } from 'react'
import { User, Target, Activity, Dumbbell, Home, ChevronRight, Sparkles, CheckCircle2 } from 'lucide-react'

const quizPerguntas = [
  {
    key: 'objetivo',
    label: 'Objetivo principal',
    icon: Target,
    opcoes: ['Hipertrofia', 'Emagrecimento', 'Definição', 'Estudos', 'Produtividade geral'],
  },
  {
    key: 'atividade',
    label: 'Nível de atividade',
    icon: Activity,
    opcoes: ['Sedentário', 'Leve (1-2x/semana)', 'Moderado (3-4x/semana)', 'Intenso (5+x/semana)'],
  },
  {
    key: 'treino',
    label: 'Tipo de treino',
    icon: Dumbbell,
    opcoes: ['Musculação', 'Funcional', 'Cardio', 'Misto', 'Não treino'],
  },
  {
    key: 'casa',
    label: 'Frequência tarefas domésticas',
    icon: Home,
    opcoes: ['Diariamente', '3-4x por semana', 'Fins de semana', 'Raramente'],
  },
]

const stats = [
  { label: 'Dias ativos', valor: '7' },
  { label: 'Hábitos criados', valor: '8' },
  { label: 'Treinos feitos', valor: '12' },
  { label: 'Metas ativas', valor: '4' },
]

export default function Perfil() {
  const [respostas, setRespostas] = useState({})
  const [gerado, setGerado] = useState(false)
  const [gerando, setGerando] = useState(false)

  const selecionar = (key, val) => setRespostas(prev => ({ ...prev, [key]: val }))

  const todosRespondidos = quizPerguntas.every(q => respostas[q.key])

  const gerarRotina = () => {
    if (!todosRespondidos) return
    setGerando(true)
    setTimeout(() => { setGerando(false); setGerado(true) }, 2000)
  }

  return (
    <div className="page-container animate-fade-in-up">
      {/* Avatar e nome */}
      <div className="flex flex-col items-center mb-8 pt-2">
        <div className="w-20 h-20 bg-gradient-to-br from-brand-400 to-brand-600 rounded-full flex items-center justify-center mb-3 shadow-lg shadow-brand-200">
          <User size={36} className="text-white" />
        </div>
        <h1 className="text-2xl font-black text-gray-800">Meu Perfil</h1>
        <p className="text-sm font-semibold text-gray-400">usuario@email.com</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2 mb-6">
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
          {quizPerguntas.map((q) => {
            const Icon = q.icon
            return (
              <div key={q.key}>
                <div className="flex items-center gap-2 mb-2.5">
                  <Icon size={15} className="text-brand-500" />
                  <p className="text-sm font-bold text-gray-700">{q.label}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {q.opcoes.map((o) => (
                    <button
                      key={o}
                      onClick={() => selecionar(q.key, o)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                        respostas[q.key] === o
                          ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-brand-300 hover:text-brand-600'
                      }`}
                    >
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
          {gerando ? (
            <><span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> Gerando rotina...</>
          ) : gerado ? (
            <><CheckCircle2 size={18} /> Rotina gerada com sucesso!</>
          ) : (
            <><Sparkles size={18} /> Gerar minha rotina com IA</>
          )}
        </button>
      </div>

      {/* Configurações */}
      <div className="card">
        <h3 className="font-bold text-gray-700 mb-3">Configurações</h3>
        {[
          'Notificações',
          'Metas pessoais',
          'Privacidade',
          'Exportar dados',
          'Sair da conta',
        ].map((item, i) => (
          <button key={i} className="w-full flex items-center justify-between py-3.5 border-b border-gray-50 last:border-0 hover:text-brand-600 transition-colors">
            <span className="text-sm font-semibold text-gray-700">{item}</span>
            <ChevronRight size={16} className="text-gray-300" />
          </button>
        ))}
      </div>
    </div>
  )
}
