import { createContext, useContext, useState, useEffect } from 'react'
import { checkAndUpdateStreak } from '../hooks/useLocalStorage'
import { getFrase } from '../hooks/useStreak'

const AppContext = createContext()

const perfilDefault = {
  nome: 'Usuário', email: 'usuario@email.com',
  telefone: '', cidade: '', nascimento: '', bio: '', avatar: '😎'
}

function lerLS(key, fallback) {
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch { return fallback }
}

function salvarLS(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
}

export function AppProvider({ children }) {
  const [perfil, _setPerfil] = useState(() => lerLS('evoluaja_perfil', perfilDefault))
  const [streak, setStreak] = useState(() => lerLS('evoluaja_streak', 0))
  const [frase, setFrase] = useState(() => getFrase(lerLS('evoluaja_streak', 0)))
  const [animando, setAnimando] = useState(false)

  // Sincroniza streak ao montar
  useEffect(() => {
    const s = checkAndUpdateStreak()
    setStreak(s)
    setFrase(getFrase(s))
  }, [])

  // Atualiza perfil e persiste
  const setPerfil = (novo) => {
    _setPerfil(novo)
    salvarLS('evoluaja_perfil', novo)
  }

  // Registra uso do app (chama em ações)
  const registrarUso = () => {
    const s = checkAndUpdateStreak()
    if (s !== streak) {
      setStreak(s)
      setFrase(getFrase(s))
      setAnimando(true)
      setTimeout(() => setAnimando(false), 800)
    }
  }

  return (
    <AppContext.Provider value={{ perfil, setPerfil, streak, frase, animando, registrarUso }}>
      {children}
    </AppContext.Provider>
  )
}

export const useApp = () => useContext(AppContext)
