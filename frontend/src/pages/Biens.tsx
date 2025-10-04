import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { useThemeStore } from '../store/themeStore'
import { getCardClasses } from '../utils/cardStyles'

interface Organisation {
  id: string
  nom: string
}

interface Locataire {
  id: string
  nom: string
  prenom: string
  email: string
  telephone?: string
}

interface Bien {
  id: string
  adresse: string
  ville: string
  codePostal: string
  type: string
  superficie?: number
  nbChambres?: number
  loyerBase: number
  charges?: number
  description?: string
  photos?: string
  organisationId?: string
  organisation?: Organisation
  locataires?: Locataire[]
}

export default function Biens() {
  const [showForm, setShowForm] = useState(false)
  const [editingBien, setEditingBien] = useState<Bien | null>(null)
  const [selectedBien, setSelectedBien] = useState<Bien | null>(null)
  const [showLocataireModal, setShowLocataireModal] = useState(false)
  const [selectedBienForLocataires, setSelectedBienForLocataires] = useState<Bien | null>(null)
  const [selectedLocataireIds, setSelectedLocataireIds] = useState<string[]>([])
  const [formData, setFormData] = useState({
    adresse: '',
    ville: '',
    codePostal: '',
    type: 'Appartement',
    superficie: '',
    nbChambres: '',
    loyerBase: '',
    charges: '',
    description: '',
    organisationId: '',
  })
  const [photos, setPhotos] = useState<string[]>([])

  const queryClient = useQueryClient()

  const { data: biens, isLoading } = useQuery({
    queryKey: ['biens'],
    queryFn: async () => {
      const { data } = await api.get('/biens')
      return data
    },
  })

  const { data: organisations } = useQuery({
    queryKey: ['organisations'],
    queryFn: async () => {
      const { data } = await api.get('/organisations')
      return data
    },
  })

  const { data: allLocataires } = useQuery({
    queryKey: ['locataires'],
    queryFn: async () => {
      const { data } = await api.get('/locataires')
      return data
    },
  })

  const { data: bienLocataires } = useQuery({
    queryKey: ['bien-locataires', selectedBienForLocataires?.id],
    queryFn: async () => {
      if (!selectedBienForLocataires) return []
      const { data } = await api.get(`/biens/${selectedBienForLocataires.id}/locataires`)
      return data
    },
    enabled: !!selectedBienForLocataires,
  })

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await api.post('/biens', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['biens'] })
      queryClient.invalidateQueries({ queryKey: ['organisations'] })
      resetForm()
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await api.put(`/biens/${id}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['biens'] })
      queryClient.invalidateQueries({ queryKey: ['organisations'] })
      resetForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/biens/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['biens'] })
      queryClient.invalidateQueries({ queryKey: ['organisations'] })
    },
  })

  const addLocatairesMutation = useMutation({
    mutationFn: async ({ bienId, locataireIds }: { bienId: string; locataireIds: string[] }) => {
      return await api.post(`/biens/${bienId}/locataires`, { locataireIds })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bien-locataires'] })
      queryClient.invalidateQueries({ queryKey: ['biens'] })
      setShowLocataireModal(false)
      setSelectedLocataireIds([])
    },
    onError: (error: any) => {
      console.error('Erreur lors de l\'ajout des locataires:', error)
      alert('Erreur lors de l\'ajout des locataires: ' + (error.response?.data?.error || error.message))
    },
  })

  const removeLocataireMutation = useMutation({
    mutationFn: async ({ bienId, locataireId }: { bienId: string; locataireId: string }) => {
      return await api.delete(`/biens/${bienId}/locataires/${locataireId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bien-locataires'] })
      queryClient.invalidateQueries({ queryKey: ['biens'] })
    },
    onError: (error: any) => {
      console.error('Erreur lors du retrait du locataire:', error)
      alert('Erreur lors du retrait du locataire: ' + (error.response?.data?.error || error.message))
    },
  })

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    Array.from(files).forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotos(prev => [...prev, reader.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      ...formData,
      superficie: formData.superficie ? parseFloat(formData.superficie) : undefined,
      nbChambres: formData.nbChambres ? parseInt(formData.nbChambres) : undefined,
      loyerBase: parseFloat(formData.loyerBase),
      charges: formData.charges ? parseFloat(formData.charges) : undefined,
      photos: photos.length > 0 ? JSON.stringify(photos) : undefined,
      organisationId: formData.organisationId || undefined,
    }

    if (editingBien) {
      updateMutation.mutate({ id: editingBien.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleEdit = (bien: Bien) => {
    setEditingBien(bien)
    setFormData({
      adresse: bien.adresse,
      ville: bien.ville,
      codePostal: bien.codePostal,
      type: bien.type,
      superficie: bien.superficie?.toString() || '',
      nbChambres: bien.nbChambres?.toString() || '',
      loyerBase: bien.loyerBase.toString(),
      charges: bien.charges?.toString() || '',
      description: bien.description || '',
      organisationId: bien.organisationId || '',
    })
    setPhotos(bien.photos ? JSON.parse(bien.photos) : [])
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      adresse: '',
      ville: '',
      codePostal: '',
      type: 'Appartement',
      superficie: '',
      nbChambres: '',
      loyerBase: '',
      charges: '',
      description: '',
      organisationId: '',
    })
    setPhotos([])
    setEditingBien(null)
    setShowForm(false)
  }

  const getPhotos = (bien: Bien): string[] => {
    if (!bien.photos) return []
    try {
      return JSON.parse(bien.photos)
    } catch {
      return []
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const { getBackground, getCardColor } = useThemeStore()
  const background = getBackground() || { gradient: 'from-white via-gray-50 to-white' }
  const cardColor = getCardColor()

  return (
    <div className={`min-h-screen bg-gradient-to-br ${background.gradient}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className={`text-4xl font-bold ${background.isDark ? 'text-white' : 'text-gray-900'}`}>
              Biens immobiliers
            </h1>
            <p className={`mt-2 ${background.isDark ? 'text-gray-300' : 'text-gray-600'}`}>Gérez vos propriétés et leurs informations</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
          >
            {showForm ? '✕ Annuler' : '+ Ajouter un bien'}
          </button>
        </div>

        {showForm && (
          <div className={getCardClasses(cardColor, 'rounded-2xl p-8 mb-8 animate-fadeIn')}>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingBien ? '📝 Modifier le bien' : '✨ Nouveau bien'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">📍 Adresse</label>
                  <input
                    type="text"
                    required
                    value={formData.adresse}
                    onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all border px-4 py-3"
                    placeholder="123 rue de la Paix"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">🏙️ Ville</label>
                  <input
                    type="text"
                    required
                    value={formData.ville}
                    onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all border px-4 py-3"
                    placeholder="Paris"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">📮 Code postal</label>
                  <input
                    type="text"
                    required
                    value={formData.codePostal}
                    onChange={(e) => setFormData({ ...formData, codePostal: e.target.value })}
                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all border px-4 py-3"
                    placeholder="75001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">🏠 Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all border px-4 py-3"
                  >
                    <option>Appartement</option>
                    <option>Maison</option>
                    <option>Studio</option>
                    <option>Loft</option>
                    <option>Duplex</option>
                    <option>Villa</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">📏 Superficie (m²)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.superficie}
                    onChange={(e) => setFormData({ ...formData, superficie: e.target.value })}
                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all border px-4 py-3"
                    placeholder="75"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">🛏️ Nombre de chambres</label>
                  <input
                    type="number"
                    value={formData.nbChambres}
                    onChange={(e) => setFormData({ ...formData, nbChambres: e.target.value })}
                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all border px-4 py-3"
                    placeholder="2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">💰 Loyer de base (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.loyerBase}
                    onChange={(e) => setFormData({ ...formData, loyerBase: e.target.value })}
                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all border px-4 py-3"
                    placeholder="850"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">💳 Charges (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.charges}
                    onChange={(e) => setFormData({ ...formData, charges: e.target.value })}
                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all border px-4 py-3"
                    placeholder="50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">🏢 Organisation</label>
                  <select
                    value={formData.organisationId}
                    onChange={(e) => setFormData({ ...formData, organisationId: e.target.value })}
                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all border px-4 py-3"
                  >
                    <option value="">Aucune organisation</option>
                    {organisations?.map((org: Organisation) => (
                      <option key={org.id} value={org.id}>{org.nom}</option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">📝 Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all border px-4 py-3"
                  placeholder="Bel appartement lumineux..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">📸 Photos</label>
                <div className="mt-2">
                  <label className="cursor-pointer inline-flex items-center px-6 py-3 border-2 border-dashed border-gray-300 rounded-xl text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 transition-all">
                    <span>+ Ajouter des photos</span>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                {photos.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {photos.map((photo, index) => (
                      <div key={index} className="relative group">
                        <img src={photo} alt={`Photo ${index + 1}`} className="w-full h-32 object-cover rounded-lg shadow-md" />
                        <button
                          type="button"
                          onClick={() => removePhoto(index)}
                          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border-2 border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-all"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  {editingBien ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {biens?.map((bien: Bien) => {
            const bienPhotos = getPhotos(bien)
            return (
              <div key={bien.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                {bienPhotos.length > 0 ? (
                  <div className="relative h-48 cursor-pointer" onClick={() => setSelectedBien(bien)}>
                    <img src={bienPhotos[0]} alt={bien.adresse} className="w-full h-full object-cover" />
                    {bienPhotos.length > 1 && (
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-3 py-1 rounded-full text-sm">
                        📸 {bienPhotos.length}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-48 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <span className="text-6xl">🏠</span>
                  </div>
                )}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">{bien.adresse}</h3>
                      <p className="text-sm text-gray-600">{bien.ville}, {bien.codePostal}</p>
                      {bien.organisation && (
                        <p className="text-xs text-purple-600 font-medium mt-1">🏢 {bien.organisation.nom}</p>
                      )}
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                      {bien.type}
                    </span>
                  </div>
                  
                  {(bien.superficie || bien.nbChambres) && (
                    <div className="flex gap-4 mb-3 text-sm text-gray-600">
                      {bien.superficie && <span>📏 {bien.superficie}m²</span>}
                      {bien.nbChambres && <span>🛏️ {bien.nbChambres} ch.</span>}
                    </div>
                  )}

                  <div className="mb-4">
                    <div className="text-2xl font-bold text-gray-900">
                      {bien.loyerBase}€
                      <span className="text-sm font-normal text-gray-600">/mois</span>
                    </div>
                    {bien.charges && (
                      <div className="text-sm text-gray-600">+ {bien.charges}€ de charges</div>
                    )}
                  </div>

                  {bien.description && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{bien.description}</p>
                  )}

                  {bien.locataires && bien.locataires.length > 0 && (
                    <div className="mb-4 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                      <p className="text-xs font-semibold text-green-800 mb-2">👥 Locataires actuels :</p>
                      <div className="space-y-1">
                        {bien.locataires.map((locataire: Locataire) => (
                          <div key={locataire.id} className="flex items-center gap-2">
                            <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                              {locataire.prenom[0]}{locataire.nom[0]}
                            </div>
                            <span className="text-sm text-gray-900 font-medium">
                              {locataire.prenom} {locataire.nom}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => handleEdit(bien)}
                      className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all font-medium text-sm"
                    >
                      ✏️ Modifier
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Supprimer ce bien ?')) deleteMutation.mutate(bien.id)
                      }}
                      className="flex-1 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all font-medium text-sm"
                    >
                      🗑️ Supprimer
                    </button>
                  </div>

                  <div className="border-t border-gray-200 pt-3">
                    <button
                      onClick={() => {
                        setSelectedBienForLocataires(bien)
                        setShowLocataireModal(true)
                      }}
                      className="w-full px-4 py-2 bg-gradient-to-r from-green-50 to-emerald-50 text-green-700 rounded-lg hover:from-green-100 hover:to-emerald-100 transition-all font-medium text-sm border border-green-200"
                    >
                      👥 Gérer les locataires
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {biens?.length === 0 && (
          <div className="text-center py-16">
            <span className="text-8xl mb-4 block">🏠</span>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">Aucun bien pour le moment</h3>
            <p className="text-gray-600">Commencez par ajouter votre premier bien immobilier</p>
          </div>
        )}
      </div>

      {selectedBien && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => setSelectedBien(null)}>
          <div className="max-w-4xl w-full bg-white rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <button
                onClick={() => setSelectedBien(null)}
                className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 z-10"
              >
                <span className="text-xl">✕</span>
              </button>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-4">
                {getPhotos(selectedBien).map((photo, index) => (
                  <img key={index} src={photo} alt={`Photo ${index + 1}`} className="w-full h-64 object-cover rounded-lg" />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {showLocataireModal && selectedBienForLocataires && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={() => {
          setShowLocataireModal(false)
          setSelectedBienForLocataires(null)
          setSelectedLocataireIds([])
        }}>
          <div className="max-w-3xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">👥 Gérer les locataires</h3>
                  <p className="text-sm text-gray-600 mt-1">{selectedBienForLocataires.adresse}</p>
                </div>
                <button
                  onClick={() => {
                    setShowLocataireModal(false)
                    setSelectedBienForLocataires(null)
                    setSelectedLocataireIds([])
                  }}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <span className="text-2xl">✕</span>
                </button>
              </div>
            </div>

            <div className="p-6">
              {/* Current Locataires */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Locataires actuels</h4>
                {bienLocataires && bienLocataires.length > 0 ? (
                  <div className="space-y-2">
                    {bienLocataires.map((locataire: Locataire) => (
                      <div key={locataire.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white font-bold">
                            {locataire.prenom[0]}{locataire.nom[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{locataire.prenom} {locataire.nom}</p>
                            <p className="text-sm text-gray-600">{locataire.email}</p>
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            if (confirm(`Retirer ${locataire.prenom} ${locataire.nom} de ce bien ?`)) {
                              removeLocataireMutation.mutate({
                                bienId: selectedBienForLocataires.id,
                                locataireId: locataire.id
                              })
                            }
                          }}
                          className="px-3 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-all text-sm font-medium"
                        >
                          Retirer
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Aucun locataire associé</p>
                )}
              </div>

              {/* Add New Locataires */}
              <div className="border-t border-gray-200 pt-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-3">Ajouter des locataires</h4>
                {allLocataires && allLocataires.length > 0 ? (
                  <>
                    <div className="max-h-64 overflow-y-auto space-y-2 mb-4">
                      {allLocataires
                        .filter((loc: Locataire) => !bienLocataires?.some((bl: Locataire) => bl.id === loc.id))
                        .map((locataire: Locataire) => (
                          <label
                            key={locataire.id}
                            className="flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 cursor-pointer transition-all"
                          >
                            <input
                              type="checkbox"
                              checked={selectedLocataireIds.includes(locataire.id)}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedLocataireIds([...selectedLocataireIds, locataire.id])
                                } else {
                                  setSelectedLocataireIds(selectedLocataireIds.filter(id => id !== locataire.id))
                                }
                              }}
                              className="w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                            />
                            <div className="ml-3 flex items-center space-x-3 flex-1">
                              <div className="w-10 h-10 bg-gray-400 rounded-full flex items-center justify-center text-white font-bold">
                                {locataire.prenom[0]}{locataire.nom[0]}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900">{locataire.prenom} {locataire.nom}</p>
                                <p className="text-sm text-gray-600">{locataire.email}</p>
                              </div>
                            </div>
                          </label>
                        ))}
                    </div>
                    <button
                      onClick={() => {
                        console.log('Ajout de locataires:', {
                          bienId: selectedBienForLocataires.id,
                          locataireIds: selectedLocataireIds
                        })
                        if (selectedLocataireIds.length > 0) {
                          addLocatairesMutation.mutate({
                            bienId: selectedBienForLocataires.id,
                            locataireIds: selectedLocataireIds
                          })
                        }
                      }}
                      disabled={selectedLocataireIds.length === 0 || addLocatairesMutation.isPending}
                      className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all font-semibold text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {addLocatairesMutation.isPending ? '⏳ Ajout en cours...' : selectedLocataireIds.length > 0 ? `✅ Ajouter ${selectedLocataireIds.length} locataire(s)` : 'Sélectionnez des locataires'}
                    </button>
                  </>
                ) : (
                  <p className="text-gray-500 text-sm">Aucun locataire disponible. Créez d'abord des locataires.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
