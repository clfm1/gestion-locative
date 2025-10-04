import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../lib/api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data } = await api.post('/auth/login', { email, password })
      setAuth(data.user, data.token)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de la connexion')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover scale-105"
      >
        <source src="/background.mp4" type="video/mp4" />
      </video>
      
      {/* Animated Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/60 via-purple-900/50 to-pink-900/60"></div>
      <div className="absolute inset-0 bg-black/30"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
      </div>
      
      {/* Content */}
      <div className="max-w-6xl w-full relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left side - Welcome message */}
          <div className="text-white space-y-6 animate-fadeIn hidden md:block">
            <div className="inline-block">
              <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md rounded-2xl px-6 py-3 border border-white/20">
                <span className="text-3xl">🏠</span>
                <span className="text-xl font-bold">Gestion Locative</span>
              </div>
            </div>
            
            <h1 className="text-6xl font-bold leading-tight">
              <span className="inline-block animate-fadeIn">Bienvenue</span>{' '}
              <span className="inline-block animate-fadeIn" style={{animationDelay: '0.2s'}}>sur</span>{' '}
              <span className="inline-block animate-fadeIn" style={{animationDelay: '0.4s'}}>votre</span>
              <span className="block mt-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 via-cyan-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                plateforme de gestion
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 leading-relaxed animate-fadeIn" style={{animationDelay: '0.6s', opacity: 0, animationFillMode: 'forwards'}}>
              Gérez vos biens immobiliers, locataires et paiements en toute simplicité avec notre solution moderne et intuitive.
            </p>
            
            <div className="flex gap-4 pt-4">
              <div className="flex items-center gap-3 animate-fadeIn" style={{animationDelay: '0.8s', opacity: 0, animationFillMode: 'forwards'}}>
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">📊</span>
                </div>
                <div>
                  <p className="font-semibold">Tableau de bord</p>
                  <p className="text-sm text-gray-400">Vue d'ensemble complète</p>
                </div>
              </div>
              <div className="flex items-center gap-3 animate-fadeIn" style={{animationDelay: '1s', opacity: 0, animationFillMode: 'forwards'}}>
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">💰</span>
                </div>
                <div>
                  <p className="font-semibold">Suivi financier</p>
                  <p className="text-sm text-gray-400">Gestion des paiements</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Login form */}
          <div className="animate-slideInFromLeft">
            <div className="max-w-md w-full bg-gradient-to-r from-blue-800 to-purple-600 rounded-xl shadow-2xl overflow-hidden p-8 space-y-8">
              <h2 className="text-center text-4xl font-extrabold text-white animate-appear">
                Bienvenue
              </h2>
              <p className="text-center text-gray-200 animate-appear" style={{animationDelay: '0.5s'}}>
                Connectez-vous à votre compte
              </p>

              {error && (
                <div className="rounded-xl bg-red-900/30 border border-red-400 p-4 animate-fadeIn">
                  <div className="flex items-start">
                    <span className="text-red-300 text-xl mr-3">⚠️</span>
                    <p className="text-sm text-red-200 font-medium">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative pt-4">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder=" "
                    className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent focus:outline-none focus:border-purple-300 transition-all"
                  />
                  <label
                    htmlFor="email"
                    className={`absolute left-0 text-gray-400 transition-all duration-200 ${
                      email ? '-top-3.5 text-sm text-purple-300' : 'top-2 text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-purple-300'
                    }`}
                  >
                    Adresse email
                  </label>
                </div>

                <div className="relative pt-4">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder=" "
                    className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent focus:outline-none focus:border-purple-300 transition-all"
                  />
                  <label
                    htmlFor="password"
                    className={`absolute left-0 text-gray-400 transition-all duration-200 ${
                      password ? '-top-3.5 text-sm text-purple-300' : 'top-2 text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-purple-300'
                    }`}
                  >
                    Mot de passe
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-purple-500 hover:bg-purple-700 rounded-md shadow-lg text-white font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Connexion en cours...' : 'Se connecter'}
                </button>
              </form>

              <div className="text-center text-gray-300">
                Pas encore de compte ?{' '}
                <Link to="/register" className="text-purple-300 hover:underline font-semibold">
                  S'inscrire
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
