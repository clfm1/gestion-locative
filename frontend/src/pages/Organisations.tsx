import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { useThemeStore } from '../store/themeStore'

interface Bien {
  id: string
  adresse: string
  ville: string
  codePostal?: string
  type: string
  loyerBase: number
  organisationId?: string
}

interface Organisation {
  id: string
  nom: string
  description?: string
  adresse?: string
  biens: Bien[]
}

export default function Organisations() {
  const [showForm, setShowForm] = useState(false)
  const [editingOrganisation, setEditingOrganisation] = useState<Organisation | null>(null)
  const [selectedOrganisation, setSelectedOrganisation] = useState<Organisation | null>(null)
  const [showBienSelector, setShowBienSelector] = useState(false)
  const [formData, setFormData] = useState({
    nom: '',
    description: '',
    adresse: '',
  })

  const queryClient = useQueryClient()
  const { getBackground } = useThemeStore()
  const background = getBackground() || { gradient: 'from-white via-gray-50 to-white' }

  const { data: organisations, isLoading } = useQuery({
    queryKey: ['organisations'],
    queryFn: async () => {
      const { data } = await api.get('/organisations')
      return data
    },
    staleTime: 30000,
  })

  const { data: allBiens } = useQuery({
    queryKey: ['biens'],
    queryFn: async () => {
      const { data } = await api.get('/biens')
      return data
    },
    staleTime: 30000,
    enabled: showBienSelector,
  })

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await api.post('/organisations', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organisations'] })
      resetForm()
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await api.put(`/organisations/${id}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organisations'] })
      resetForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/organisations/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organisations'] })
    },
  })

  const addBiensMutation = useMutation({
    mutationFn: async ({ orgId, bienIds }: { orgId: string; bienIds: string[] }) => {
      return await api.post(`/organisations/${orgId}/biens`, { bienIds })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organisations'] })
      queryClient.invalidateQueries({ queryKey: ['biens'] })
      setShowBienSelector(false)
    },
  })

  const removeBienMutation = useMutation({
    mutationFn: async ({ orgId, bienId }: { orgId: string; bienId: string }) => {
      return await api.delete(`/organisations/${orgId}/biens/${bienId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organisations'] })
      queryClient.invalidateQueries({ queryKey: ['biens'] })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      ...formData,
      description: formData.description || undefined,
      adresse: formData.adresse || undefined,
    }

    if (editingOrganisation) {
      updateMutation.mutate({ id: editingOrganisation.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleEdit = (organisation: Organisation) => {
    setEditingOrganisation(organisation)
    setFormData({
      nom: organisation.nom,
      description: organisation.description || '',
      adresse: organisation.adresse || '',
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      nom: '',
      description: '',
      adresse: '',
    })
    setEditingOrganisation(null)
    setShowForm(false)
  }

  const handleAddBiens = (orgId: string, selectedBienIds: string[]) => {
    addBiensMutation.mutate({ orgId, bienIds: selectedBienIds })
  }

  const getAvailableBiens = useMemo(() => {
    return (organisation: Organisation) => {
      if (!allBiens) return []
      const orgBienIds = organisation.biens.map(b => b.id)
      return allBiens.filter((bien: Bien) => !bien.organisationId && !orgBienIds.includes(bien.id))
    }
  }, [allBiens])

  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${background.gradient} flex items-center justify-center`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg font-medium">Chargement des organisations...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${background.gradient}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className={`text-4xl font-bold ${background.isDark ? 'text-white' : 'text-gray-900'}`}>
              Organisations / Bâtiments
            </h1>
            <p className={`mt-2 ${background.isDark ? 'text-gray-300' : 'text-gray-600'}`}>Regroupez vos biens immobiliers en organisations</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
          >
            {showForm ? '✕ Annuler' : '+ Nouvelle organisation'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white shadow-2xl rounded-2xl p-8 mb-8 border border-gray-100 animate-fadeIn">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingOrganisation ? '📝 Modifier l\'organisation' : '✨ Nouvelle organisation'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">🏢 Nom de l'organisation</label>
                <input
                  type="text"
                  required
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all border px-4 py-3"
                  placeholder="Bâtiment 1, Résidence Soleil..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">📍 Adresse</label>
                <input
                  type="text"
                  value={formData.adresse}
                  onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all border px-4 py-3"
                  placeholder="123 rue de la Paix, 75001 Paris"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">📝 Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all border px-4 py-3"
                  placeholder="Description de l'organisation..."
                />
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
                  {editingOrganisation ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {organisations?.map((org: Organisation) => (
            <div key={org.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="bg-gradient-to-br from-blue-100 to-purple-100 p-6">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900">{org.nom}</h3>
                  <span className="px-3 py-1 bg-white text-blue-800 text-xs font-semibold rounded-full">
                    {org.biens.length} bien{org.biens.length > 1 ? 's' : ''}
                  </span>
                </div>
                {org.adresse && (
                  <p className="text-sm text-gray-700">📍 {org.adresse}</p>
                )}
              </div>

              <div className="p-6">
                {org.description && (
                  <p className="text-sm text-gray-600 mb-4">{org.description}</p>
                )}

                {org.biens.length > 0 ? (
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Biens dans cette organisation:</h4>
                    <div className="space-y-2">
                      {org.biens.map((bien) => (
                        <div key={bien.id} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{bien.adresse}</p>
                            <p className="text-xs text-gray-600">{bien.ville} - {bien.type}</p>
                          </div>
                          <button
                            onClick={() => removeBienMutation.mutate({ orgId: org.id, bienId: bien.id })}
                            className="ml-2 p-1 text-red-600 hover:bg-red-50 rounded"
                            title="Retirer de l'organisation"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic mb-4">Aucun bien dans cette organisation</p>
                )}

                <button
                  onClick={() => {
                    setSelectedOrganisation(org)
                    setShowBienSelector(true)
                  }}
                  className="w-full px-4 py-2 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-all font-medium text-sm mb-2"
                >
                  + Ajouter des biens
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(org)}
                    className="flex-1 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all font-medium text-sm"
                  >
                    ✏️ Modifier
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Supprimer cette organisation ? Les biens ne seront pas supprimés.')) {
                        deleteMutation.mutate(org.id)
                      }
                    }}
                    className="flex-1 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all font-medium text-sm"
                  >
                    🗑️ Supprimer
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {organisations?.length === 0 && (
          <div className="text-center py-16">
            <span className="text-8xl mb-4 block">🏢</span>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">Aucune organisation pour le moment</h3>
            <p className="text-gray-600">Créez votre première organisation pour regrouper vos biens</p>
          </div>
        )}
      </div>

      {showBienSelector && selectedOrganisation && (
        <BienSelector
          organisation={selectedOrganisation}
          availableBiens={getAvailableBiens(selectedOrganisation)}
          onClose={() => {
            setShowBienSelector(false)
            setSelectedOrganisation(null)
          }}
          onAdd={(bienIds) => handleAddBiens(selectedOrganisation.id, bienIds)}
        />
      )}
    </div>
  )
}

interface BienSelectorProps {
  organisation: Organisation
  availableBiens: Bien[]
  onClose: () => void
  onAdd: (bienIds: string[]) => void
}

function BienSelector({ organisation, availableBiens, onClose, onAdd }: BienSelectorProps) {
  const [selectedBiens, setSelectedBiens] = useState<string[]>([])

  const toggleBien = (bienId: string) => {
    setSelectedBiens(prev =>
      prev.includes(bienId)
        ? prev.filter(id => id !== bienId)
        : [...prev, bienId]
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="max-w-2xl w-full bg-white rounded-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              Ajouter des biens à "{organisation.nom}"
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-all"
            >
              <span className="text-2xl">✕</span>
            </button>
          </div>
        </div>

        <div className="p-6 max-h-96 overflow-y-auto">
          {availableBiens.length > 0 ? (
            <div className="space-y-2">
              {availableBiens.map((bien) => (
                <label
                  key={bien.id}
                  className={`flex items-center p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedBiens.includes(bien.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={selectedBiens.includes(bien.id)}
                    onChange={() => toggleBien(bien.id)}
                    className="w-5 h-5 text-blue-600 rounded"
                  />
                  <div className="ml-3 flex-1">
                    <p className="font-medium text-gray-900">{bien.adresse}</p>
                    <p className="text-sm text-gray-600">
                      {bien.ville} - {bien.type} - {bien.loyerBase}€/mois
                    </p>
                  </div>
                </label>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Aucun bien disponible à ajouter</p>
              <p className="text-sm text-gray-500 mt-2">
                Tous vos biens sont déjà assignés à une organisation ou font partie de celle-ci.
              </p>
            </div>
          )}
        </div>

        {availableBiens.length > 0 && (
          <div className="bg-gray-50 p-6 flex justify-between items-center">
            <p className="text-sm text-gray-600">
              {selectedBiens.length} bien{selectedBiens.length > 1 ? 's' : ''} sélectionné{selectedBiens.length > 1 ? 's' : ''}
            </p>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border-2 border-gray-300 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-all"
              >
                Annuler
              </button>
              <button
                onClick={() => {
                  if (selectedBiens.length > 0) {
                    onAdd(selectedBiens)
                  }
                }}
                disabled={selectedBiens.length === 0}
                className="px-6 py-2 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Ajouter ({selectedBiens.length})
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
