import { useMemo } from 'react'
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useApp } from '../context/AppContext'

function toKey(date) { return date.toISOString().split('T')[0] }
const hojeKey = toKey(new Date())

// Definição de conquistas com condição calculada
const CONQUISTAS_DEF = [
  { id: 'streak3',    emoji: '🔥', titulo: '3 dias seguidos',       desc: 'Manteve streak por 3 dias',         check: ({ streak }) => streak >= 3 },
  { id: 'streak7',    emoji: '👑', titulo: '1 semana de sequência', desc: 'Manteve streak por 7 dias',         check: ({ streak }) => streak >= 7 },
  { id: 'streak14',   emoji: '🏆', titulo: '2 semanas seguidas',    desc: 'Manteve streak por 14 dias',        check: ({ streak }) => streak >= 14 },
  { id: 'streak30',   emoji: '💎', titulo: '1 mês de sequência',    desc: 'Incrível! 30 dias seguidos',        check: ({ streak }) => streak >= 30 },
  { id: 'hab5',       emoji: '✅', titulo: '5 hábitos criados',     desc: 'Cadastrou 5 hábitos',               check: ({ habitos }) => habitos.length >= 5 },
  { id: 'hab100',     emoji: '🌟', titulo: 'Centurião dos hábitos', desc: '100 registros de hábito',           check: ({ totalRegHabitos }) => totalRegHabitos >= 100 },
  { id: 'fin1',       emoji: '💰', titulo: 'Financeiro ativo',      desc: 'Registrou 1 transação',             check: ({ transacoes }) => transacoes.length >= 1 },
  { id: 'fin10',      emoji: '📊', titulo: 'Gestor financeiro',     desc: '10 transações registradas',         check: ({ transacoes }) => transacoes.length >= 10 },
  { id: 'treino1',    emoji: '💪', titulo: 'Primeira ficha',        desc: 'Criou a primeira ficha de treino',  check: ({ fichas }) => fichas.length >= 1 },
  { id: 'treino5',    emoji: '🏋️', titulo: 'Atleta dedicado',      desc: '5 fichas de treino criadas',        check: ({ fichas }) => fichas.length >= 5 },
  { id: 'estudo1',    emoji: '📚', titulo: 'Estudante',             desc: 'Criou a primeira matéria',          check: ({ materias }) => materias.length >= 1 },
  { id: 'pom1',       emoji: '⏱️', titulo: 'Primeiro Pomodoro',    desc: 'Completou 1 ciclo Pomodoro',        check: ({ pomodoroCiclos }) => pomodoroCiclos >= 1 },
  { id: 'pom10',      emoji: '🧠', titulo: 'Foco total',           desc: '10 ciclos Pomodoro completados',    check: ({ pomodoroCiclos }) => pomodoroCiclos >= 10 },
  { id: 'refeicao1',  emoji: '🥗', titulo: 'Controle alimentar',   desc: 'Registrou a primeira refeição',     check: ({ refeicoes }) => refeicoes.some(r => r.alimentos.length > 0) },
  { id: 'consulta1',  emoji: '❤️', titulo: 'Cuidando da saúde',   desc: 'Agendou uma consulta médica',       check: ({ consultas }) => consultas.length >= 1 },
  { id: 'meta1',      emoji: '🎯', titulo: 'Primeira meta',        desc: 'Criou uma meta financeira',         check: ({ metasFin }) => metasFin.length >= 1 },
]

export default function Progresso() {
  const { streak } = useApp()

  // Lê todos os dados reais
  const [habitos]       = useLocalStorage('evoluaja_habitos_def', [])
  const [registros]     = useLocalStorage('evoluaja_habitos_reg', {})
  const [transacoes]    = useLocalStorage('evoluaja_transacoes', [])
  const [fichas]        = useLocalStorage('evoluaja_fichas', [])
  const [materias]      = useLocalStorage('evoluaja_materias', [])
  const [refeicoes]     = useLocalStorage('evoluaja_refeicoes', [])
  const [consultas]     = useLocalStorage('evoluaja_consultas', [])
  const [metasFin]      = useLocalStorage('evoluaja_metas_fin', [])
  const [ciclos]        = useLocalStorage('evoluaja_pomodoro_ciclos', 0)

  // Total de registros de hábito
  const totalRegHabitos = useMemo(() => {
    return Object.values(registros).reduce((total, dia) => {
      return total + Object.values(dia).filter(v => v).length
    }, 0)
  }, [registros])

  // Hábitos concluídos hoje
  const regHoje = registros[hojeKey] || {}
  const habitosDoneHoje = habitos.filter(h => !!regHoje[h.id]).length
  const pctHabitos = habitos.length ? Math.round((habitosDoneHoje / habitos.length) * 100) : 0

  // Calcular áreas dinamicamente
  const areas = useMemo(() => {
    // Disciplina: baseada no streak
    const disciplina = Math.min(100, streak * 3 + (streak >= 7 ? 20 : 0))

    // Finanças: baseada em qtd de transações e metas
    const financas = Math.min(100, transacoes.length * 5 + metasFin.length * 10)

    // Saúde: baseada em consultas, medicamentos, hábitos relacionados
    const saude = Math.min(100, consultas.length * 15 + pctHabitos * 0.5)

    // Estudos: baseada em matérias e pomodoro
    const estudos = Math.min(100,
      materias.reduce((s, m) => s + (m.progresso || 0), 0) / Math.max(materias.length, 1) * 0.8
      + ciclos * 2
    )

    // Treinos: baseada em fichas e exercícios
    const treinos = Math.min(100,
      fichas.length * 15 + fichas.reduce((s, f) => s + f.exercicios.length, 0) * 3
    )

    // Bem-estar: média geral
    const bemestar = Math.min(100, Math.round((disciplina + saude + pctHabitos) / 3))

    return [
      { area: 'Disciplina',     valor: Math.round(disciplina) },
      { area: 'Finanças',       valor: Math.round(financas) },
      { area: 'Saúde',          valor: Math.round(saude) },
      { area: 'Estudos',        valor: Math.round(estudos) },
      { area: 'Treinos',        valor: Math.round(treinos) },
      { area: 'Bem-estar',      valor: Math.round(bemestar) },
    ]
  }, [streak, transacoes, metasFin, consultas, pctHabitos, materias, ciclos, fichas])

  // Conquistas desbloqueadas
  const ctx = { streak, habitos, totalRegHabitos, transacoes, fichas, materias, refeicoes, consultas, metasFin, pomodoroCiclos: ciclos }
  const conquistasDesbloqueadas = CONQUISTAS_DEF.filter(c => c.check(ctx))
  const conquistasBloqueadas = CONQUISTAS_DEF.filter(c => !c.check(ctx))

  const nivelGeral = Math.round(areas.reduce((s, a) => s + a.valor, 0) / areas.length)

  return (
    <div className="page-container animate-fade-in-up">
      <h1 className="text-2xl font-black text-gray-800 dark:text-gray-100 mb-5">Progresso & Conquistas</h1>

      {/* Nível geral */}
      <div className="bg-gradient-to-br from-brand-500 to-brand-700 rounded-3xl p-5 mb-5 text-white shadow-lg shadow-brand-200">
        <p className="text-sm font-bold text-brand-200 mb-1">Evolução geral</p>
        <div className="flex items-end gap-3">
          <p className="text-5xl font-black">{nivelGeral}</p>
          <p className="text-brand-200 font-bold mb-1">/ 100 pontos</p>
        </div>
        <div className="mt-3 bg-white/20 h-3 rounded-full overflow-hidden">
          <div className="bg-white h-full rounded-full transition-all duration-700" style={{ width: `${nivelGeral}%` }} />
        </div>
        <p className="text-xs text-brand-200 font-semibold mt-2">
          {nivelGeral < 20 ? 'Iniciante — continue evoluindo!' :
           nivelGeral < 40 ? 'Aprendiz — bom começo!' :
           nivelGeral < 60 ? 'Intermediário — indo muito bem!' :
           nivelGeral < 80 ? 'Avançado — quase lá!' :
           'Elite — você é extraordinário! 🏆'}
        </p>
      </div>

      {/* Radar */}
      <div className="card mb-5">
        <div className="flex items-center justify-between mb-1">
          <h2 className="section-title mb-0">Áreas da Vida</h2>
          <span className="text-xs text-gray-400 font-semibold">baseado nos seus dados</span>
        </div>
        <p className="text-xs text-gray-400 font-semibold mb-4">Atualiza conforme você usa o app</p>
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={areas}>
            <PolarGrid stroke="#e5e7eb" className="dark:stroke-gray-700" />
            <PolarAngleAxis dataKey="area" tick={{ fontSize: 11, fontWeight: 700, fill: '#6b7280' }} />
            <Radar dataKey="valor" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.2} strokeWidth={2.5} />
            <Tooltip
              formatter={v => [`${v} pts`, '']}
              contentStyle={{ borderRadius: 12, border: 'none', fontSize: 12 }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Barras horizontais */}
      <div className="card mb-5">
        <h2 className="section-title">Nível por Área</h2>
        <div className="space-y-4">
          {areas.map((a, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm font-bold mb-1.5">
                <span className="text-gray-700 dark:text-gray-300">{a.area}</span>
                <span className="text-brand-600">{a.valor} pts</span>
              </div>
              <div className="progress-bar h-3">
                <div className="progress-fill bg-gradient-to-r from-brand-400 to-brand-600"
                  style={{ width: `${a.valor}%`, transition: 'width 1s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conquistas desbloqueadas */}
      {conquistasDesbloqueadas.length > 0 && (
        <div className="card mb-4">
          <h2 className="section-title">
            🏆 Conquistas ({conquistasDesbloqueadas.length}/{CONQUISTAS_DEF.length})
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {conquistasDesbloqueadas.map(c => (
              <div key={c.id} className="bg-gradient-to-br from-brand-50 to-purple-50 dark:from-brand-950 dark:to-purple-950 rounded-2xl p-4 text-center border border-brand-100 dark:border-brand-900">
                <span className="text-3xl">{c.emoji}</span>
                <p className="text-xs font-black text-brand-700 dark:text-brand-300 mt-2 leading-tight">{c.titulo}</p>
                <p className="text-[10px] font-semibold text-brand-400 mt-0.5 leading-tight">{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Conquistas bloqueadas */}
      {conquistasBloqueadas.length > 0 && (
        <div className="card">
          <h2 className="section-title">🔒 Ainda por desbloquear</h2>
          <div className="space-y-2">
            {conquistasBloqueadas.slice(0, 5).map(c => (
              <div key={c.id} className="flex items-center gap-3 opacity-40">
                <span className="text-xl grayscale">{c.emoji}</span>
                <div>
                  <p className="text-xs font-bold text-gray-600 dark:text-gray-400">{c.titulo}</p>
                  <p className="text-[10px] text-gray-400 font-semibold">{c.desc}</p>
                </div>
                <span className="ml-auto text-gray-300 dark:text-gray-600 text-lg">🔒</span>
              </div>
            ))}
            {conquistasBloqueadas.length > 5 && (
              <p className="text-xs text-gray-400 font-semibold text-center pt-1">
                +{conquistasBloqueadas.length - 5} conquistas por desbloquear
              </p>
            )}
          </div>
        </div>
      )}

      {/* Se não tiver nada desbloqueado ainda */}
      {conquistasDesbloqueadas.length === 0 && (
        <div className="card text-center py-8">
          <p className="text-3xl mb-3">🎯</p>
          <p className="text-sm font-black text-gray-700 dark:text-gray-300 mb-1">Comece a usar o app!</p>
          <p className="text-xs text-gray-400 font-semibold">Complete hábitos, registre treinos e conquistas serão desbloqueadas automaticamente.</p>
        </div>
      )}
    </div>
  )
}
