import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  Home, Calendar, Dumbbell, Wallet, User,
  Utensils, BookOpen, ShoppingCart, Heart,
  TrendingUp, Smile, X, Menu, ChevronRight,
  Sun, Moon, Monitor
} from 'lucide-react'
import clsx from 'clsx'
import { useTheme } from '../../context/ThemeContext'
import { useLocalStorage } from '../../hooks/useLocalStorage'

const bottomNav = [
  { path: '/',          label: 'Início',   icon: Home },
  { path: '/rotina',    label: 'Rotina',   icon: Calendar },
  { path: '/financas',  label: 'Finanças', icon: Wallet },
  { path: '/treinos',   label: 'Treinos',  icon: Dumbbell },
  { path: '/perfil',    label: 'Perfil',   icon: User },
]

const allModules = [
  { path: '/',            label: 'Início',         icon: Home,         color: 'text-brand-600' },
  { path: '/rotina',      label: 'Minha Rotina',   icon: Calendar,     color: 'text-blue-600' },
  { path: '/habitos',     label: 'Meus Hábitos',   icon: Smile,        color: 'text-emerald-600' },
  { path: '/financas',    label: 'Finanças',        icon: Wallet,       color: 'text-green-600' },
  { path: '/alimentacao', label: 'Alimentação',     icon: Utensils,     color: 'text-orange-600' },
  { path: '/treinos',     label: 'Treinos',         icon: Dumbbell,     color: 'text-red-600' },
  { path: '/estudos',     label: 'Estudos',         icon: BookOpen,     color: 'text-indigo-600' },
  { path: '/casa',        label: 'Casa & Compras',  icon: ShoppingCart, color: 'text-yellow-600' },
  { path: '/saude',       label: 'Saúde',           icon: Heart,        color: 'text-pink-600' },
  { path: '/progresso',   label: 'Progresso',       icon: TrendingUp,   color: 'text-brand-600' },
  { path: '/perfil',      label: 'Perfil',          icon: User,         color: 'text-gray-600' },
]

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const { theme, toggle, setSystem } = useTheme()
  const [streak] = useLocalStorage('evoluaja_streak', 7)

  const goTo = (path) => { navigate(path); setDrawerOpen(false) }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 relative">

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center justify-between max-w-md mx-auto">
        <button onClick={() => setDrawerOpen(true)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
          <Menu size={22} className="text-gray-700 dark:text-gray-300" />
        </button>
        <div className="flex items-center gap-2">
          <img src="/icon.svg" alt="EvoluaJá" className="w-7 h-7" />
          <span className="font-black text-brand-600 text-lg tracking-tight">EvoluaJá</span>
        </div>
        {/* Theme toggle */}
        <button
          onClick={toggle}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          title={theme === 'dark' ? 'Mudar para claro' : 'Mudar para escuro'}
        >
          {theme === 'dark'
            ? <Sun size={20} className="text-amber-400" />
            : <Moon size={20} className="text-gray-500" />
          }
        </button>
      </header>

      {/* Drawer Overlay */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm" onClick={() => setDrawerOpen(false)} />
      )}

      {/* Sidebar Drawer */}
      <aside className={clsx(
        'fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 z-50 shadow-2xl transition-transform duration-300 ease-out flex flex-col',
        drawerOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <div className="flex items-center justify-between p-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <img src="/icon.svg" alt="EvoluaJá" className="w-8 h-8" />
            <span className="font-black text-brand-600 text-xl">EvoluaJá</span>
          </div>
          <button onClick={() => setDrawerOpen(false)} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800">
            <X size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-3">Módulos</p>
          {allModules.map((mod) => {
            const Icon = mod.icon
            const isActive = location.pathname === mod.path
            return (
              <button key={mod.path} onClick={() => goTo(mod.path)}
                className={clsx('w-full flex items-center gap-3 px-3 py-3 rounded-2xl mb-1 transition-all duration-150 group',
                  isActive ? 'bg-brand-50 dark:bg-brand-950 text-brand-700' : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                )}>
                <div className={clsx('p-2 rounded-xl', isActive ? 'bg-brand-100 dark:bg-brand-900' : 'bg-gray-100 dark:bg-gray-800 group-hover:bg-gray-200 dark:group-hover:bg-gray-700')}>
                  <Icon size={18} className={isActive ? 'text-brand-600' : mod.color} />
                </div>
                <span className={clsx('font-semibold text-sm flex-1 text-left', isActive && 'text-brand-700 dark:text-brand-300')}>
                  {mod.label}
                </span>
                {isActive && <ChevronRight size={16} className="text-brand-400" />}
              </button>
            )
          })}
        </nav>

        {/* Tema no drawer */}
        <div className="px-4 pb-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">Tema</p>
          <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 rounded-2xl p-1">
            {[
              { id: 'light', icon: Sun, label: 'Claro' },
              { id: 'dark',  icon: Moon, label: 'Escuro' },
              { id: 'system', icon: Monitor, label: 'Sistema' },
            ].map(({ id, icon: Icon, label }) => (
              <button key={id}
                onClick={() => id === 'system' ? setSystem() : id === theme ? null : toggle()}
                className={clsx('flex-1 flex flex-col items-center gap-1 py-2 rounded-xl text-[10px] font-bold transition-all',
                  (id === theme || (id === 'system' && !localStorage.getItem('evoluaja_theme')))
                    ? 'bg-white dark:bg-gray-700 text-brand-600 shadow-sm'
                    : 'text-gray-400 dark:text-gray-500'
                )}>
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-800">
          <div className="bg-brand-50 dark:bg-brand-950 rounded-2xl p-4">
            <p className="text-xs font-bold text-brand-700 dark:text-brand-300 mb-1">🔥 Streak atual</p>
            <p className="text-2xl font-black text-brand-600">{streak} dias</p>
            <p className="text-xs text-brand-500 mt-0.5">Continue assim!</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="max-w-md mx-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-100 dark:border-gray-800 px-2 py-2">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {bottomNav.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <button key={item.path} onClick={() => goTo(item.path)}
                className={clsx('nav-item flex-1', isActive ? 'active' : '')}>
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className={clsx('text-[10px] font-bold', isActive ? 'text-brand-600' : 'text-gray-400 dark:text-gray-600')}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
