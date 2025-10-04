import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useAuthStore } from '../store/authStore'
import { useThemeStore, themes, backgrounds, ThemeType, BackgroundType } from '../store/themeStore'
import api from '../lib/api'

export default function Settings() {
  const { user, setAuth } = useAuthStore()
  const { currentTheme, currentBackground, setTheme, setBackground, getTheme, getBackground } = useThemeStore()
  const theme = getTheme()
  const background = getBackground() || { gradient: 'from-white via-gray-50 to-white' }
  
  const [profileData, setProfileData] = useState({
    nom: user?.nom || '',
    prenom: user?.prenom || '',
    email: user?.email || '',
  })
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      return await api.put('/auth/profile', data)
    },
    onSuccess: (response) => {
      setAuth(response.data.user, useAuthStore.getState().token!)
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès!' })
      setTimeout(() => setMessage(null), 3000)
    },
    onError: () => {
      setMessage({ type: 'error', text: 'Erreur lors de la mise à jour du profil' })
      setTimeout(() => setMessage(null), 3000)
    },
  })

  const updatePasswordMutation = useMutation({
    mutationFn: async (data: any) => {
      return await api.put('/auth/password', data)
    },
    onSuccess: () => {
      setMessage({ type: 'success', text: 'Mot de passe modifié avec succès!' })
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setMessage(null), 3000)
    },
    onError: () => {
      setMessage({ type: 'error', text: 'Erreur lors du changement de mot de passe' })
      setTimeout(() => setMessage(null), 3000)
    },
  })

  const handleProfileSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateProfileMutation.mutate(profileData)
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' })
      setTimeout(() => setMessage(null), 3000)
      return
    }
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Le mot de passe doit contenir au moins 6 caractères' })
      setTimeout(() => setMessage(null), 3000)
      return
    }
    updatePasswordMutation.mutate({
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword,
    })
  }

  const handleThemeChange = (newTheme: ThemeType) => {
    setTheme(newTheme)
    setMessage({ type: 'success', text: `Thème "${themes[newTheme].name}" appliqué!` })
    setTimeout(() => setMessage(null), 2000)
  }

  const handleBackgroundChange = (newBackground: BackgroundType) => {
    setBackground(newBackground)
    setMessage({ type: 'success', text: `Fond "${backgrounds[newBackground].name}" appliqué!` })
    setTimeout(() => setMessage(null), 2000)
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${background.gradient} bg-animated`}>
      <div className={`bg-circles`}>
        <div className={`bg-circle bg-gradient-to-br ${theme.gradient}`}></div>
        <div className={`bg-circle bg-gradient-to-br ${theme.gradient}`}></div>
        <div className={`bg-circle bg-gradient-to-br ${theme.gradient}`}></div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 py-8 relative z-10">
        <div className="mb-8">
          <h1 className={`text-4xl font-bold ${background.isDark ? 'text-white' : 'text-gray-900'}`}>
            ⚙️ Paramètres
          </h1>
          <p className={`mt-2 ${background.isDark ? 'text-gray-300' : 'text-gray-600'}`}>Personnalisez votre compte et votre expérience</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl animate-fadeIn ${
            message.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}>
            <div className="flex items-center">
              <span className="text-xl mr-3">{message.type === 'success' ? '✓' : '⚠️'}</span>
              <p>{message.text}</p>
            </div>
          </div>
        )}

        <div className="space-y-6">
          {/* Fond d'écran */}
          <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-8 animate-fadeIn border-2 border-white">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span>🌈</span> Couleur de fond
            </h2>
            <p className="text-gray-600 text-sm mb-6">Choisissez entre le mode clair ou sombre</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {(Object.entries(backgrounds) as [BackgroundType, typeof backgrounds[BackgroundType]][]).map(([key, bgOption]) => (
                <button
                  key={key}
                  onClick={() => handleBackgroundChange(key)}
                  className={`relative group rounded-2xl transition-all transform hover:scale-105 overflow-hidden ${
                    currentBackground === key 
                      ? 'ring-4 ring-offset-2 ring-blue-600 shadow-2xl' 
                      : 'hover:shadow-xl ring-2 ring-gray-200'
                  }`}
                >
                  <div className={`w-full h-40 bg-gradient-to-br ${bgOption.gradient} relative flex items-center justify-center`}>
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all"></div>
                    <span className="text-6xl relative z-10">{bgOption.isDark ? '🌙' : '☀️'}</span>
                  </div>
                  <div className="p-5 bg-white">
                    <p className="text-base font-bold text-gray-900 mb-1">{bgOption.name}</p>
                    <p className="text-sm text-gray-600">{bgOption.description}</p>
                  </div>
                  {currentBackground === key && (
                    <div className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-lg ring-2 ring-blue-600">
                      <span className="text-blue-600 text-lg font-bold">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Thème de couleur */}
          <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-8 animate-fadeIn border-2 border-white">
            <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
              <span>🎨</span> Thème de couleur
            </h2>
            <p className="text-gray-600 text-sm mb-6">Choisissez les couleurs des boutons et éléments actifs</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {(Object.entries(themes) as [ThemeType, typeof themes[ThemeType]][]).map(([key, themeOption]) => (
                <button
                  key={key}
                  onClick={() => handleThemeChange(key)}
                  className={`relative group p-6 rounded-xl transition-all transform hover:scale-105 ${
                    currentTheme === key 
                      ? 'ring-4 ring-offset-2 ring-blue-600 shadow-2xl' 
                      : 'hover:shadow-xl bg-gray-50 ring-2 ring-gray-200'
                  }`}
                >
                  <div className={`w-full h-24 rounded-lg bg-gradient-to-br ${themeOption.gradient} mb-3 animate-gradient shadow-lg`}></div>
                  <p className="text-sm font-semibold text-gray-900">{themeOption.name}</p>
                  {currentTheme === key && (
                    <div className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-lg ring-2 ring-blue-600">
                      <span className="text-blue-600 text-lg font-bold">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Profil */}
          <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-8 animate-slideIn border-2 border-white">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>👤</span> Informations du profil
            </h2>
            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Prénom</label>
                  <input
                    type="text"
                    required
                    value={profileData.prenom}
                    onChange={(e) => setProfileData({ ...profileData, prenom: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nom</label>
                  <input
                    type="text"
                    required
                    value={profileData.nom}
                    onChange={(e) => setProfileData({ ...profileData, nom: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  required
                  value={profileData.email}
                  onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={updateProfileMutation.isPending}
                className={`w-full px-6 py-3 rounded-xl shadow-lg text-base font-medium text-white bg-gradient-to-r ${theme.buttonGradient} hover:${theme.hoverGradient} transition-all transform hover:scale-105 disabled:opacity-50`}
              >
                {updateProfileMutation.isPending ? '⏳ Enregistrement...' : '💾 Enregistrer les modifications'}
              </button>
            </form>
          </div>

          {/* Mot de passe */}
          <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-8 animate-slideIn border-2 border-white">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>🔒</span> Modifier le mot de passe
            </h2>
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Mot de passe actuel</label>
                <input
                  type="password"
                  required
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Nouveau mot de passe</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Minimum 6 caractères"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirmer le mot de passe</label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Répétez le mot de passe"
                />
              </div>
              <button
                type="submit"
                disabled={updatePasswordMutation.isPending}
                className={`w-full px-6 py-3 rounded-xl shadow-lg text-base font-medium text-white bg-gradient-to-r ${theme.buttonGradient} hover:${theme.hoverGradient} transition-all transform hover:scale-105 disabled:opacity-50`}
              >
                {updatePasswordMutation.isPending ? '⏳ Modification...' : '🔑 Changer le mot de passe'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
