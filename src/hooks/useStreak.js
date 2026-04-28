import { useState, useEffect } from 'react'
import { checkAndUpdateStreak } from './useLocalStorage'

// Frases motivacionais por faixa de streak
const FRASES = {
  0: [
    { emoji: '💪', texto: 'Todo dia zero é o começo de uma nova sequência!' },
    { emoji: '🌱', texto: 'Recomeços fazem parte da jornada. Vai nessa!' },
    { emoji: '🔄', texto: 'Não desanime — hoje é um novo começo.' },
    { emoji: '🚀', texto: 'O melhor momento para começar é agora.' },
    { emoji: '🌅', texto: 'Cada amanhecer traz uma nova chance. Use-a!' },
  ],
  1: [
    { emoji: '🌟', texto: 'Primeiro dia conquistado. O caminho começa aqui!' },
    { emoji: '✅', texto: 'Um dia de cada vez. Você deu o primeiro passo!' },
    { emoji: '🔥', texto: 'A chama foi acesa. Não a deixe apagar!' },
    { emoji: '🎯', texto: 'Foco no alvo. Dia 1 concluído com sucesso!' },
  ],
  2: [
    { emoji: '📈', texto: 'Dois dias seguidos! A consistência está nascendo.' },
    { emoji: '🌊', texto: 'Estamos indo bem — mantenha o ritmo!' },
    { emoji: '🏃', texto: 'Dois passos dados. Continue correndo!' },
  ],
  3: [
    { emoji: '🔥', texto: 'Três dias! Você está construindo um hábito real.' },
    { emoji: '💥', texto: 'A ciência diz: 3 dias seguidos já criam padrão. Parabéns!' },
    { emoji: '⚡', texto: 'A energia está aumentando. Três dias de pura evolução!' },
  ],
  5: [
    { emoji: '🏆', texto: 'Cinco dias! Você é mais forte do que imagina.' },
    { emoji: '🌠', texto: 'Metade da semana conquistada. Brilhante!' },
    { emoji: '💎', texto: 'Consistência é o novo talento. 5 dias provam isso!' },
  ],
  7: [
    { emoji: '🎉', texto: 'UMA SEMANA COMPLETA! Isso é extraordinário!' },
    { emoji: '👑', texto: '7 dias seguidos. Você merece ser chamado(a) de campeão(ã)!' },
    { emoji: '🌈', texto: 'Semana completa! A versão futura de você agradece.' },
  ],
  10: [
    { emoji: '🚀', texto: '10 dias! Você está decolando para outro nível.' },
    { emoji: '🔮', texto: 'Dois dígitos! Sua disciplina é inspiração para todos.' },
    { emoji: '⚡', texto: '10 dias de evolução pura. Nada pode te parar!' },
  ],
  14: [
    { emoji: '🏅', texto: 'Duas semanas! Hábito formado, vida transformada.' },
    { emoji: '🌍', texto: '14 dias seguidos. Você está mudando o seu mundo!' },
    { emoji: '💪', texto: 'Duas semanas sólidas. Você é simplesmente incrível!' },
  ],
  21: [
    { emoji: '🧠', texto: '21 dias! A neurociência diz que seu hábito está gravado no cérebro!' },
    { emoji: '🌟', texto: 'Três semanas! Você reescreveu sua rotina. Lendário(a)!' },
    { emoji: '🏆', texto: '21 dias de ouro. Você virou uma máquina de evolução!' },
  ],
  30: [
    { emoji: '🎊', texto: '30 DIAS! Um mês inteiro de pura disciplina. ÉPICO!' },
    { emoji: '👑', texto: 'Um mês de consistência. Você é uma lenda do autodesenvolvimento!' },
    { emoji: '🌠', texto: '30 dias! A transformação já está visível. Continue!' },
  ],
  50: [
    { emoji: '🔥', texto: '50 dias! Você atingiu um patamar que poucos alcançam.' },
    { emoji: '💎', texto: 'Cinquenta dias de evolução. Você é diamante!' },
  ],
  100: [
    { emoji: '🏆', texto: '100 DIAS!!! Você é uma lenda absoluta. Parabéns!' },
    { emoji: '👑', texto: 'Cem dias seguidos. Você redefiniu o que é possível!' },
  ],
}

// Retorna a frase certa para o streak atual
function getFrase(streak) {
  const faixas = [100, 50, 30, 21, 14, 10, 7, 5, 3, 2, 1, 0]
  for (const faixa of faixas) {
    if (streak >= faixa) {
      const lista = FRASES[faixa]
      if (lista) return lista[Math.floor(Math.random() * lista.length)]
    }
  }
  return FRASES[0][0]
}

export function useStreak() {
  const [streak, setStreak] = useState(() => {
    try {
      const s = localStorage.getItem('evoluaja_streak')
      return s ? JSON.parse(s) : 0
    } catch { return 0 }
  })

  const [frase, setFrase] = useState(() => getFrase(0))
  const [animando, setAnimando] = useState(false)

  useEffect(() => {
    // Verifica o streak ao carregar
    const novoStreak = checkAndUpdateStreak()
    if (novoStreak !== streak) {
      setStreak(novoStreak)
      setFrase(getFrase(novoStreak))
      setAnimando(true)
      setTimeout(() => setAnimando(false), 600)
    } else {
      setFrase(getFrase(novoStreak))
    }
  }, [])

  // Registra uso do app (atualiza last_active)
  const registrarUso = () => {
    const novoStreak = checkAndUpdateStreak()
    if (novoStreak !== streak) {
      setStreak(novoStreak)
      setFrase(getFrase(novoStreak))
      setAnimando(true)
      setTimeout(() => setAnimando(false), 600)
    }
  }

  return { streak, frase, animando, registrarUso }
}

export { getFrase }
