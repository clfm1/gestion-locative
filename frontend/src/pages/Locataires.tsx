import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { useThemeStore } from '../store/themeStore'

interface Locataire {
  id: string
  nom: string
  prenom: string
  email: string
  telephone?: string
  adresse?: string
}

export default function Locataires() {
  const [showForm, setShowForm] = useState(false)
  const [editingLocataire, setEditingLocataire] = useState<Locataire | null>(null)
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
  })

  const queryClient = useQueryClient()
  const { getTheme, getBackground } = useThemeStore()
  const theme = getTheme()
  const background = getBackground() || { gradient: 'from-white via-gray-50 to-white' }

  const { data: locataires, isLoading } = useQuery({
    queryKey: ['locataires'],
    queryFn: async () => {
      const { data } = await api.get('/locataires')
      return data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await api.post('/locataires', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locataires'] })
      resetForm()
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await api.put(`/locataires/${id}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locataires'] })
      resetForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/locataires/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locataires'] })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingLocataire) {
      updateMutation.mutate({ id: editingLocataire.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleEdit = (locataire: Locataire) => {
    setEditingLocataire(locataire)
    setFormData({
      nom: locataire.nom,
      prenom: locataire.prenom,
      email: locataire.email,
      telephone: locataire.telephone || '',
      adresse: locataire.adresse || '',
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      nom: '',
      prenom: '',
      email: '',
      telephone: '',
      adresse: '',
    })
    setEditingLocataire(null)
    setShowForm(false)
  }

  if (isLoading) {
    return <div className="text-center py-8">Chargement...</div>
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${background.gradient}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className={`text-4xl font-bold ${background.isDark ? 'text-white' : 'text-gray-900'}`}>👥 Locataires</h1>
            <p className={`mt-2 ${background.isDark ? 'text-gray-300' : 'text-gray-600'}`}>Gérez vos locataires et leurs informations</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`mt-4 sm:mt-0 inline-flex items-center gap-2 px-6 py-3 rounded-xl shadow-lg text-base font-medium text-white bg-gradient-to-r ${theme.buttonGradient} hover:scale-105 transition-all`}
          >
            {showForm ? '✖️ Annuler' : '➕ Ajouter un locataire'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-8 mb-8 animate-fadeIn border-2 border-white">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {editingLocataire ? '✏️ Modifier le locataire' : '➕ Nouveau locataire'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Prénom</label>
                  <input
                    type="text"
                    required
                    value={formData.prenom}
                    onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Jean"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Nom</label>
                  <input
                    type="text"
                    required
                    value={formData.nom}
                    onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Dupont"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="jean.dupont@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Téléphone</label>
                  <input
                    type="tel"
                    value={formData.telephone}
                    onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="06 12 34 56 78"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Adresse</label>
                <input
                  type="text"
                  value={formData.adresse}
                  onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="12 Rue de la Paix, 75000 Paris"
                />
              </div>
              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 rounded-xl border-2 border-gray-300 text-base font-medium text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className={`px-6 py-3 rounded-xl shadow-lg text-base font-medium text-white bg-gradient-to-r ${theme.buttonGradient} hover:scale-105 transition-all`}
                >
                  {editingLocataire ? '💾 Mettre à jour' : '✓ Créer'}
                </button>
              </div>
            </form>
          </div>
        )}

      {/* Mobile view - Cards */}
      <div className="md:hidden space-y-4">
        {locataires?.map((locataire: Locataire) => (
          <div key={locataire.id} className="bg-white shadow rounded-lg p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {locataire.prenom} {locataire.nom}
                </h3>
                {locataire.adresse && (
                  <p className="text-sm text-gray-500 mt-1 break-words">
                    📍 {locataire.adresse}
                  </p>
                )}
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex items-start">
                <span className="text-gray-500 text-sm mr-2">📧</span>
                <a 
                  href={`mailto:${locataire.email}`} 
                  className="text-sm text-blue-600 hover:text-blue-800 break-all"
                >
                  {locataire.email}
                </a>
              </div>
              
              {locataire.telephone && (
                <div className="flex items-start">
                  <span className="text-gray-500 text-sm mr-2">📞</span>
                  <a 
                    href={`tel:${locataire.telephone}`} 
                    className="text-sm text-blue-600 hover:text-blue-800 break-all"
                  >
                    {locataire.telephone}
                  </a>
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-3 border-t border-gray-200">
              <button
                onClick={() => handleEdit(locataire)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                ✏️ Modifier
              </button>
              <button
                onClick={() => {
                  if (confirm(`Supprimer ${locataire.prenom} ${locataire.nom} ?`)) {
                    deleteMutation.mutate(locataire.id)
                  }
                }}
                className="flex-1 px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors"
              >
                🗑️ Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

        {/* Desktop view - Cards */}
        <div className="hidden md:grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {locataires?.map((locataire: Locataire) => (
            <div key={locataire.id} className="bg-white/95 backdrop-blur-sm shadow-xl rounded-2xl p-6 hover:shadow-2xl transition-all transform hover:scale-105 border-2 border-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-2xl">
                    👤
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {locataire.prenom} {locataire.nom}
                    </h3>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3 mb-6">
                {locataire.adresse && (
                  <div className="flex items-start gap-2">
                    <span className="text-lg mt-0.5">📍</span>
                    <p className="text-sm text-gray-600 break-words">{locataire.adresse}</p>
                  </div>
                )}
                
                <div className="flex items-start gap-2">
                  <span className="text-lg mt-0.5">📧</span>
                  <a 
                    href={`mailto:${locataire.email}`} 
                    className="text-sm text-blue-600 hover:text-blue-800 break-all hover:underline"
                  >
                    {locataire.email}
                  </a>
                </div>
                
                {locataire.telephone && (
                  <div className="flex items-start gap-2">
                    <span className="text-lg mt-0.5">📞</span>
                    <a 
                      href={`tel:${locataire.telephone}`} 
                      className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                    >
                      {locataire.telephone}
                    </a>
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleEdit(locataire)}
                  className={`flex-1 px-4 py-2.5 bg-gradient-to-r ${theme.buttonGradient} text-white text-sm font-medium rounded-xl hover:scale-105 transition-all shadow-md`}
                >
                  ✏️ Modifier
                </button>
                <button
                  onClick={() => {
                    if (confirm(`Supprimer ${locataire.prenom} ${locataire.nom} ?`)) {
                      deleteMutation.mutate(locataire.id)
                    }
                  }}
                  className="flex-1 px-4 py-2.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-sm font-medium rounded-xl hover:scale-105 transition-all shadow-md"
                >
                  🗑️ Supprimer
                </button>
              </div>
            </div>
          ))}
        </div>

        {locataires?.length === 0 && (
          <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl">
            <span className="text-8xl mb-4 block">👥</span>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">Aucun locataire</h3>
            <p className="text-gray-600">Commencez par ajouter votre premier locataire</p>
          </div>
        )}
      </div>
    </div>
  )
}
