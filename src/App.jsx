import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AppProvider } from './context/AppContext'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Rotina from './pages/Rotina'
import Habitos from './pages/Habitos'
import Financas from './pages/Financas'
import Alimentacao from './pages/Alimentacao'
import Treinos from './pages/Treinos'
import Estudos from './pages/Estudos'
import Casa from './pages/Casa'
import Saude from './pages/Saude'
import Progresso from './pages/Progresso'
import Perfil from './pages/Perfil'
import GerarRotina from './pages/GerarRotina'

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <BrowserRouter>
          <Routes>
            {/* Página de chat da IA — sem o Layout (barra de navegação) */}
            <Route path="/gerar-rotina" element={<GerarRotina />} />

            {/* Páginas normais com Layout */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="rotina" element={<Rotina />} />
              <Route path="habitos" element={<Habitos />} />
              <Route path="financas" element={<Financas />} />
              <Route path="alimentacao" element={<Alimentacao />} />
              <Route path="treinos" element={<Treinos />} />
              <Route path="estudos" element={<Estudos />} />
              <Route path="casa" element={<Casa />} />
              <Route path="saude" element={<Saude />} />
              <Route path="progresso" element={<Progresso />} />
              <Route path="perfil" element={<Perfil />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  )
}
