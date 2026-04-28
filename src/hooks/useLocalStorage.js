import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {}
  }, [key, value])

  return [value, setValue]
}

export function clearAllStorage() {
  const keys = Object.keys(localStorage).filter(k => k.startsWith('evoluaja_'))
  keys.forEach(k => localStorage.removeItem(k))
}

// ── Streak logic ─────────────────────────────────────────────────
// Chama no App Load e em qualquer ação do usuário
export function checkAndUpdateStreak() {
  const hoje = new Date().toISOString().split('T')[0]

  try {
    const lastActive = localStorage.getItem('evoluaja_last_active')
    const streakRaw   = localStorage.getItem('evoluaja_streak')
    const streak      = streakRaw ? JSON.parse(streakRaw) : 0

    if (!lastActive) {
      // Primeira vez: inicia streak em 1
      localStorage.setItem('evoluaja_last_active', hoje)
      localStorage.setItem('evoluaja_streak', '1')
      return 1
    }

    if (lastActive === hoje) {
      // Já registrou hoje — mantém
      return streak
    }

    // Verifica se foi ontem
    const ontem = new Date()
    ontem.setDate(ontem.getDate() - 1)
    const ontemKey = ontem.toISOString().split('T')[0]

    if (lastActive === ontemKey) {
      // Veio no dia seguinte — incrementa
      const novoStreak = streak + 1
      localStorage.setItem('evoluaja_last_active', hoje)
      localStorage.setItem('evoluaja_streak', String(novoStreak))
      return novoStreak
    } else {
      // Pulou um ou mais dias — zera
      localStorage.setItem('evoluaja_last_active', hoje)
      localStorage.setItem('evoluaja_streak', '0')
      return 0
    }
  } catch {
    return 0
  }
}
