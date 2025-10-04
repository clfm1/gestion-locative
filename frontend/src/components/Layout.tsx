import { useState } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useThemeStore } from '../store/themeStore'

export default function Layout() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const location = useLocation()
  const { getTheme, getBackground } = useThemeStore()
  const theme = getTheme()
  const background = getBackground() || {
    gradient: 'from-white via-gray-50 to-white',
    isDark: false,
    navbarBg: 'bg-white',
    navbarText: 'text-gray-700',
    navbarBorder: 'border-gray-200',
  }

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
    setMobileMenuOpen(false)
  }

  const isActive = (path: string) => location.pathname === path

  const closeMobileMenu = () => setMobileMenuOpen(false)

  const menuItems = [
    { path: '/', label: 'Tableau de bord', icon: '📊' },
    { path: '/biens', label: 'Biens', icon: '🏠' },
    { path: '/locataires', label: 'Locataires', icon: '👥' },
    { path: '/locations', label: 'Locations', icon: '📋' },
    { path: '/organisations', label: 'Organisations', icon: '🏢' },
    { path: '/notes', label: 'Notes', icon: '📝' },
    { path: '/agenda', label: 'Agenda', icon: '📅' },
    { path: '/settings', label: 'Paramètres', icon: '⚙️' },
  ]

  return (
    <div className={`min-h-screen bg-gradient-to-br ${background.gradient}`}>
      <nav className={`${background.navbarBg} shadow-lg border-b ${background.navbarBorder} sticky top-0 z-50`}>
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            {/* Logo et titre */}
            <div className="flex items-center flex-shrink-0">
              <div className="flex-shrink-0 flex items-center">
                <img 
                  src="/logo.png" 
                  alt="Loca16 Logo" 
                  className="w-10 h-10 rounded-xl object-cover mr-2 sm:mr-3"
                />
                <h1 className={`text-xl md:text-2xl font-bold bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
                  Loca16
                </h1>
              </div>
            </div>

            {/* Desktop menu - centré */}
            <div className="hidden lg:flex lg:items-center lg:space-x-4 lg:flex-1 lg:justify-center">
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive(item.path)
                      ? `bg-gradient-to-r ${theme.gradient} text-white shadow-md`
                      : `${background.navbarText} ${background.isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
            
            {/* User info et déconnexion - à droite */}
            <div className="hidden lg:flex lg:items-center lg:space-x-3 flex-shrink-0">
              <div className={`${background.isDark ? 'bg-gray-800' : 'bg-gray-100'} px-4 py-2 rounded-lg`}>
                <span className={`${background.navbarText} text-sm font-medium`}>
                  👤 {user?.prenom} {user?.nom}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-md transition-all"
              >
                🚪 Déconnexion
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center lg:hidden ml-auto">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`inline-flex items-center justify-center p-2 rounded-lg ${background.navbarText} ${background.isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'} transition-all`}
                aria-label="Menu principal"
              >
                {mobileMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className={`lg:hidden ${background.navbarBg} border-t ${background.navbarBorder}`}>
            <div className="px-4 pt-2 pb-3 space-y-1">
              {/* User info */}
              <div className={`${background.isDark ? 'bg-gray-800' : 'bg-gray-100'} px-4 py-3 rounded-lg mb-3`}>
                <span className={`${background.navbarText} text-sm font-medium`}>
                  👤 {user?.prenom} {user?.nom}
                </span>
              </div>

              {/* Menu items */}
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-base font-medium transition-all ${
                    isActive(item.path)
                      ? `bg-gradient-to-r ${theme.gradient} text-white shadow-md`
                      : `${background.navbarText} ${background.isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100'}`
                  }`}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center px-4 py-3 mt-4 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-md transition-all"
              >
                🚪 Déconnexion
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="pb-20 lg:pb-0">
        <Outlet />
      </main>
    </div>
  )
}
