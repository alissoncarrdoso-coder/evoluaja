import { useState } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import {
  Home, Calendar, Dumbbell, Wallet, User,
  Utensils, BookOpen, ShoppingCart, Heart,
  TrendingUp, Smile, X, Menu, ChevronRight
} from 'lucide-react'
import clsx from 'clsx'

const bottomNav = [
  { path: '/',          label: 'Início',   icon: Home },
  { path: '/rotina',    label: 'Rotina',   icon: Calendar },
  { path: '/financas',  label: 'Finanças', icon: Wallet },
  { path: '/treinos',   label: 'Treinos',  icon: Dumbbell },
  { path: '/perfil',    label: 'Perfil',   icon: User },
]

const allModules = [
  { path: '/',            label: 'Início',          icon: Home,         color: 'text-brand-600' },
  { path: '/rotina',      label: 'Minha Rotina',    icon: Calendar,     color: 'text-blue-600' },
  { path: '/habitos',     label: 'Meus Hábitos',    icon: Smile,        color: 'text-emerald-600' },
  { path: '/financas',    label: 'Finanças',         icon: Wallet,       color: 'text-green-600' },
  { path: '/alimentacao', label: 'Alimentação',      icon: Utensils,     color: 'text-orange-600' },
  { path: '/treinos',     label: 'Treinos',          icon: Dumbbell,     color: 'text-red-600' },
  { path: '/estudos',     label: 'Estudos',          icon: BookOpen,     color: 'text-indigo-600' },
  { path: '/casa',        label: 'Casa & Compras',   icon: ShoppingCart, color: 'text-yellow-600' },
  { path: '/saude',       label: 'Saúde',            icon: Heart,        color: 'text-pink-600' },
  { path: '/progresso',   label: 'Progresso',        icon: TrendingUp,   color: 'text-brand-600' },
  { path: '/perfil',      label: 'Perfil',           icon: User,         color: 'text-gray-600' },
]

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const goTo = (path) => {
    navigate(path)
    setDrawerOpen(false)
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center justify-between max-w-md mx-auto">
        <button
          onClick={() => setDrawerOpen(true)}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          aria-label="Menu"
        >
          <Menu size={22} className="text-gray-700" />
        </button>
        <div className="flex items-center gap-2">
          <img src="/icon.svg" alt="EvoluaJá" className="w-7 h-7" />
          <span className="font-black text-brand-600 text-lg tracking-tight">EvoluaJá</span>
        </div>
        <div className="w-10" />
      </header>

      {/* Drawer Overlay */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Sidebar Drawer */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl transition-transform duration-300 ease-out flex flex-col',
          drawerOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <img src="/icon.svg" alt="EvoluaJá" className="w-8 h-8" />
            <span className="font-black text-brand-600 text-xl">EvoluaJá</span>
          </div>
          <button
            onClick={() => setDrawerOpen(false)}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider px-3 mb-3">Módulos</p>
          {allModules.map((mod) => {
            const Icon = mod.icon
            const isActive = location.pathname === mod.path
            return (
              <button
                key={mod.path}
                onClick={() => goTo(mod.path)}
                className={clsx(
                  'w-full flex items-center gap-3 px-3 py-3 rounded-2xl mb-1 transition-all duration-150 group',
                  isActive
                    ? 'bg-brand-50 text-brand-700'
                    : 'hover:bg-gray-50 text-gray-600'
                )}
              >
                <div className={clsx('p-2 rounded-xl', isActive ? 'bg-brand-100' : 'bg-gray-100 group-hover:bg-gray-200')}>
                  <Icon size={18} className={isActive ? 'text-brand-600' : mod.color} />
                </div>
                <span className={clsx('font-semibold text-sm flex-1 text-left', isActive && 'text-brand-700')}>
                  {mod.label}
                </span>
                {isActive && <ChevronRight size={16} className="text-brand-400" />}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="bg-brand-50 rounded-2xl p-4">
            <p className="text-xs font-bold text-brand-700 mb-1">🔥 Streak atual</p>
            <p className="text-2xl font-black text-brand-600">7 dias</p>
            <p className="text-xs text-brand-500 mt-0.5">Continue assim!</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="max-w-md mx-auto">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-100 px-2 py-2">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {bottomNav.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path
            return (
              <button
                key={item.path}
                onClick={() => goTo(item.path)}
                className={clsx(
                  'nav-item flex-1',
                  isActive ? 'active' : ''
                )}
              >
                <Icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
                <span className={clsx('text-[10px] font-bold', isActive ? 'text-brand-600' : 'text-gray-400')}>
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
