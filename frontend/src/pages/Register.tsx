import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import api from '../lib/api'

export default function Register() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nom: '',
    prenom: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { data } = await api.post('/auth/register', formData)
      setAuth(data.user, data.token)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erreur lors de l\'inscription')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
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
      <div className="max-w-md w-full relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="animate-slideInFromLeft bg-gradient-to-r from-blue-800 to-purple-600 rounded-xl shadow-2xl overflow-hidden p-8 space-y-8">
          <h2 className="text-center text-4xl font-extrabold text-white animate-appear">
            Créer un compte
          </h2>
          <p className="text-center text-gray-200 animate-appear" style={{animationDelay: '0.5s'}}>
            Commencez votre gestion locative
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
            <div className="grid grid-cols-2 gap-4">
              <div className="relative pt-4">
                <input
                  id="prenom"
                  name="prenom"
                  type="text"
                  required
                  value={formData.prenom}
                  onChange={handleChange}
                  placeholder=" "
                  className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent focus:outline-none focus:border-purple-300 transition-all"
                />
                <label
                  htmlFor="prenom"
                  className={`absolute left-0 text-gray-400 transition-all duration-200 ${
                    formData.prenom ? '-top-3.5 text-sm text-purple-300' : 'top-2 text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-purple-300'
                  }`}
                >
                  Prénom
                </label>
              </div>

              <div className="relative pt-4">
                <input
                  id="nom"
                  name="nom"
                  type="text"
                  required
                  value={formData.nom}
                  onChange={handleChange}
                  placeholder=" "
                  className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent focus:outline-none focus:border-purple-300 transition-all"
                />
                <label
                  htmlFor="nom"
                  className={`absolute left-0 text-gray-400 transition-all duration-200 ${
                    formData.nom ? '-top-3.5 text-sm text-purple-300' : 'top-2 text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-purple-300'
                  }`}
                >
                  Nom
                </label>
              </div>
            </div>

            <div className="relative pt-4">
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder=" "
                className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent focus:outline-none focus:border-purple-300 transition-all"
              />
              <label
                htmlFor="email"
                className={`absolute left-0 text-gray-400 transition-all duration-200 ${
                  formData.email ? '-top-3.5 text-sm text-purple-300' : 'top-2 text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-purple-300'
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
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder=" "
                className="peer h-10 w-full border-b-2 border-gray-300 text-white bg-transparent focus:outline-none focus:border-purple-300 transition-all"
              />
              <label
                htmlFor="password"
                className={`absolute left-0 text-gray-400 transition-all duration-200 ${
                  formData.password ? '-top-3.5 text-sm text-purple-300' : 'top-2 text-base peer-focus:-top-3.5 peer-focus:text-sm peer-focus:text-purple-300'
                }`}
              >
                Mot de passe (min. 6 caractères)
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-purple-500 hover:bg-purple-700 rounded-md shadow-lg text-white font-semibold transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Inscription en cours...' : 'Créer mon compte'}
            </button>
          </form>

          <div className="text-center text-gray-300">
            Déjà un compte ?{' '}
            <Link to="/login" className="text-purple-300 hover:underline font-semibold">
              Se connecter
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
