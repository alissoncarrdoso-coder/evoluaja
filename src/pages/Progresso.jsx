import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts'

const areas = [
  { area: 'Disciplina', valor: 78 },
  { area: 'Finanças', valor: 62 },
  { area: 'Saúde', valor: 85 },
  { area: 'Estudos', valor: 55 },
  { area: 'Relacionamentos', valor: 70 },
  { area: 'Bem-estar', valor: 68 },
]

const conquistas = [
  { emoji: '🔥', titulo: '7 dias seguidos', desc: 'Manteve streak por uma semana' },
  { emoji: '💪', titulo: 'Guerreiro do Treino', desc: '20 treinos completados' },
  { emoji: '💧', titulo: 'Hidratado', desc: '7 dias bebendo 2L' },
  { emoji: '📚', titulo: 'Estudante Dedicado', desc: '10 horas de estudo' },
]

export default function Progresso() {
  return (
    <div className="page-container animate-fade-in-up">
      <h1 className="text-2xl font-black text-gray-800 mb-5">Progresso & Bônus</h1>

      {/* Radar de áreas */}
      <div className="card mb-5">
        <h2 className="section-title">Áreas da Vida</h2>
        <ResponsiveContainer width="100%" height={220}>
          <RadarChart data={areas}>
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis dataKey="area" tick={{ fontSize: 10, fontWeight: 700, fill: '#6b7280' }} />
            <Radar dataKey="valor" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.18} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Barras horizontais */}
      <div className="card mb-5">
        <h2 className="section-title">Nível de Desenvolvimento</h2>
        <div className="space-y-4">
          {areas.map((a, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm font-bold mb-1.5">
                <span className="text-gray-700">{a.area}</span>
                <span className="text-brand-600">{a.valor}%</span>
              </div>
              <div className="progress-bar h-3">
                <div
                  className="progress-fill bg-gradient-to-r from-brand-400 to-brand-600"
                  style={{ width: `${a.valor}%`, transition: 'width 1s ease' }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conquistas */}
      <div className="card">
        <h2 className="section-title">Conquistas</h2>
        <div className="grid grid-cols-2 gap-3">
          {conquistas.map((c, i) => (
            <div key={i} className="bg-brand-50 rounded-2xl p-4 text-center border border-brand-100">
              <span className="text-3xl">{c.emoji}</span>
              <p className="text-xs font-black text-brand-700 mt-2">{c.titulo}</p>
              <p className="text-[10px] font-semibold text-brand-400 mt-0.5">{c.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
