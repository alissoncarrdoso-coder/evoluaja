// EvoluaJá — Gerador de Rotina com IA
// Node.js (ESM) + OpenAI API
// Instalar: npm install openai express cors dotenv

import express from 'express'
import cors from 'cors'
import OpenAI from 'openai'
import 'dotenv/config'

const app = express()
app.use(express.json())
app.use(cors())

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

// ─── Sistema de prompt ───────────────────────────────────────────────────────
const SYSTEM_PROMPT = `
Você é um coach de produtividade especialista em planejamento de rotinas saudáveis e equilibradas.

REGRAS OBRIGATÓRIAS:
1. Gere uma rotina completa para UM dia, do horário de acordar até dormir.
2. NUNCA sobreponha horários. Respeite duração realista de cada atividade.
3. Inclua obrigatoriamente: refeições, higiene pessoal, pausas/descanso, e atividades do objetivo principal.
4. Adapte a intensidade do treino ao nível de atividade informado.
5. Distribua o tempo de forma equilibrada — não sobrecarregue o usuário.
6. Retorne APENAS um array JSON válido, sem nenhum texto adicional, sem markdown, sem explicações.

FORMATO DE RESPOSTA (array JSON puro):
[
  {
    "horario_inicio": "06:00",
    "horario_fim": "06:10",
    "titulo_tarefa": "Acordar e alongamento leve",
    "categoria": "Saúde",
    "prioridade": "alta",
    "emoji": "🧘"
  }
]

Categorias permitidas: Saúde, Alimentação, Treino, Trabalho, Estudos, Hábitos, Casa, Lazer, Higiene
Prioridades permitidas: alta, media, baixa
`.trim()

// ─── Rota principal ───────────────────────────────────────────────────────────
app.post('/api/gerar-rotina', async (req, res) => {
  const {
    objetivo_principal = 'produtividade geral',
    nivel_atividade = 'moderado',
    tipo_treino = 'musculação',
    disponibilidade = '16 horas acordado (06:00 às 22:00)',
    horario_acordar = '06:00',
    horario_dormir = '22:30',
    trabalha = true,
    horas_trabalho = 8,
  } = req.body

  const userPrompt = `
Crie uma rotina diária personalizada para um usuário com as seguintes características:

- Objetivo principal: ${objetivo_principal}
- Nível de atividade física: ${nivel_atividade}
- Tipo de treino preferido: ${tipo_treino}
- Horário que acorda: ${horario_acordar}
- Horário que dorme: ${horario_dormir}
- Trabalha/estuda: ${trabalha ? `Sim (${horas_trabalho} horas por dia)` : 'Não'}
- Disponibilidade total: ${disponibilidade}

Lembre-se: retorne APENAS o array JSON, sem texto adicional.
  `.trim()

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      temperature: 0.7,
      max_tokens: 2000,
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: userPrompt },
      ],
    })

    const raw = completion.choices[0].message.content.trim()

    // Remove possíveis blocos de markdown
    const clean = raw.replace(/```json|```/gi, '').trim()
    const rotina = JSON.parse(clean)

    // Validação básica
    if (!Array.isArray(rotina) || rotina.length === 0) {
      return res.status(500).json({ error: 'Rotina gerada inválida' })
    }

    return res.json({
      success: true,
      rotina,
      tokens_usados: completion.usage?.total_tokens,
    })
  } catch (err) {
    console.error('Erro ao gerar rotina:', err.message)
    return res.status(500).json({
      error: 'Erro ao gerar rotina com IA',
      detalhes: err.message,
    })
  }
})

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`✅ EvoluaJá API rodando na porta ${PORT}`))
