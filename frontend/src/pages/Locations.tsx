import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { useThemeStore } from '../store/themeStore'

interface Location {
  id: string
  dateDebut: string
  dateFin?: string
  loyerMensuel: number
  depot?: number
  statut: string
  bien: any
  locataires: Array<{
    locataire: {
      id: string
      nom: string
      prenom: string
      email: string
      telephone?: string
    }
  }>
  frais: any[]
}

export default function Locations() {
  const [showForm, setShowForm] = useState(false)
  const [showFraisForm, setShowFraisForm] = useState<string | null>(null)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [formData, setFormData] = useState({
    bienId: '',
    locataireIds: [] as string[],
    dateDebut: '',
    dateFin: '',
    loyerMensuel: '',
    depot: '',
    statut: 'active',
  })
  const [fraisData, setFraisData] = useState({
    type: 'Loyer',
    montant: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    estPaye: false,
  })

  const queryClient = useQueryClient()
  const { getBackground } = useThemeStore()
  const background = getBackground() || { gradient: 'from-white via-gray-50 to-white' }

  const { data: locations, isLoading } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data } = await api.get('/locations')
      return data
    },
  })

  const { data: biens } = useQuery({
    queryKey: ['biens'],
    queryFn: async () => {
      const { data } = await api.get('/biens')
      return data
    },
  })

  const { data: locataires } = useQuery({
    queryKey: ['locataires'],
    queryFn: async () => {
      const { data } = await api.get('/locataires')
      return data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await api.post('/locations', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] })
      resetForm()
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await api.put(`/locations/${id}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] })
      resetForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/locations/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] })
    },
  })

  const createFraisMutation = useMutation({
    mutationFn: async (data: any) => {
      return await api.post('/frais', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locations'] })
      resetFraisForm()
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      ...formData,
      loyerMensuel: parseFloat(formData.loyerMensuel),
      depot: formData.depot ? parseFloat(formData.depot) : undefined,
    }

    if (editingLocation) {
      updateMutation.mutate({ id: editingLocation.id, data })
    } else {
      createMutation.mutate(data)
    }
  }

  const handleFraisSubmit = (e: React.FormEvent, locationId: string) => {
    e.preventDefault()
    const data = {
      ...fraisData,
      locationId,
      montant: parseFloat(fraisData.montant),
    }
    createFraisMutation.mutate(data)
  }

  const handleEdit = (location: Location) => {
    setEditingLocation(location)
    setFormData({
      bienId: location.bien.id,
      locataireIds: location.locataires.map(l => l.locataire.id),
      dateDebut: location.dateDebut.split('T')[0],
      dateFin: location.dateFin ? location.dateFin.split('T')[0] : '',
      loyerMensuel: location.loyerMensuel.toString(),
      depot: location.depot?.toString() || '',
      statut: location.statut,
    })
    setShowForm(true)
  }

  const toggleLocataire = (locataireId: string) => {
    setFormData(prev => ({
      ...prev,
      locataireIds: prev.locataireIds.includes(locataireId)
        ? prev.locataireIds.filter(id => id !== locataireId)
        : [...prev.locataireIds, locataireId]
    }))
  }

  const resetForm = () => {
    setFormData({
      bienId: '',
      locataireIds: [],
      dateDebut: '',
      dateFin: '',
      loyerMensuel: '',
      depot: '',
      statut: 'active',
    })
    setEditingLocation(null)
    setShowForm(false)
  }

  const resetFraisForm = () => {
    setFraisData({
      type: 'Loyer',
      montant: '',
      date: new Date().toISOString().split('T')[0],
      description: '',
      estPaye: false,
    })
    setShowFraisForm(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${background.gradient}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="sm:flex sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className={`text-4xl font-bold ${background.isDark ? 'text-white' : 'text-gray-900'}`}>
              📋 Locations
            </h1>
            <p className={`mt-2 ${background.isDark ? 'text-gray-300' : 'text-gray-600'}`}>Gérez vos contrats de location et paiements</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="mt-4 sm:mt-0 inline-flex items-center px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200"
          >
            {showForm ? '✕ Annuler' : '+ Nouvelle location'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white shadow-2xl rounded-2xl p-8 mb-8 border border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingLocation ? '📝 Modifier la location' : '✨ Nouvelle location'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">🏠 Bien</label>
                  <select
                    required
                    value={formData.bienId}
                    onChange={(e) => setFormData({ ...formData, bienId: e.target.value })}
                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all border px-4 py-3"
                  >
                    <option value="">Sélectionner un bien</option>
                    {biens?.map((bien: any) => (
                      <option key={bien.id} value={bien.id}>
                        {bien.adresse} - {bien.ville}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">💰 Loyer mensuel (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.loyerMensuel}
                    onChange={(e) => setFormData({ ...formData, loyerMensuel: e.target.value })}
                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all border px-4 py-3"
                    placeholder="850"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">📅 Date de début</label>
                  <input
                    type="date"
                    required
                    value={formData.dateDebut}
                    onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all border px-4 py-3"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">📅 Date de fin (optionnel)</label>
                  <input
                    type="date"
                    value={formData.dateFin}
                    onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all border px-4 py-3"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">🏦 Dépôt de garantie (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.depot}
                    onChange={(e) => setFormData({ ...formData, depot: e.target.value })}
                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all border px-4 py-3"
                    placeholder="850"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">📊 Statut</label>
                  <select
                    value={formData.statut}
                    onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                    className="w-full rounded-xl border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all border px-4 py-3"
                  >
                    <option value="active">Active</option>
                    <option value="terminee">Terminée</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">👥 Locataires (un ou plusieurs)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {locataires?.map((locataire: any) => (
                    <label
                      key={locataire.id}
                      className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                        formData.locataireIds.includes(locataire.id)
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={formData.locataireIds.includes(locataire.id)}
                        onChange={() => toggleLocataire(locataire.id)}
                        className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <div className="ml-3">
                        <div className="font-medium text-gray-900">
                          {locataire.prenom} {locataire.nom}
                        </div>
                        <div className="text-sm text-gray-600">{locataire.email}</div>
                      </div>
                    </label>
                  ))}
                </div>
                {formData.locataireIds.length === 0 && (
                  <p className="mt-2 text-sm text-red-600">⚠️ Sélectionnez au moins un locataire</p>
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
                  disabled={formData.locataireIds.length === 0}
                  className="px-6 py-3 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {editingLocation ? 'Mettre à jour' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-6">
          {locations?.map((location: Location) => (
            <div key={location.id} className="bg-white shadow-xl rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300">
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      🏠 {location.bien?.adresse}
                    </h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      <div>📅 Du {new Date(location.dateDebut).toLocaleDateString('fr-FR')}</div>
                      {location.dateFin && <div>→ Au {new Date(location.dateFin).toLocaleDateString('fr-FR')}</div>}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2 mt-4 sm:mt-0">
                    <span className={`px-4 py-2 text-sm font-semibold rounded-full ${
                      location.statut === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {location.statut === 'active' ? '✓ Active' : '✕ Terminée'}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(location)}
                        className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all text-sm font-medium"
                      >
                        ✏️ Modifier
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Supprimer cette location ?')) deleteMutation.mutate(location.id)
                        }}
                        className="px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-all text-sm font-medium"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
                    <div className="text-sm text-gray-600 mb-1">Loyer mensuel</div>
                    <div className="text-2xl font-bold text-gray-900">
                      {location.loyerMensuel}€
                    </div>
                  </div>
                  {location.depot && (
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="text-sm text-gray-600 mb-1">Dépôt de garantie</div>
                      <div className="text-2xl font-bold text-gray-900">
                        {location.depot}€
                      </div>
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <div className="text-sm font-semibold text-gray-700 mb-2">
                    👥 Locataire{location.locataires.length > 1 ? 's' : ''} ({location.locataires.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {location.locataires.map(({ locataire }) => (
                      <div key={locataire.id} className="bg-blue-50 px-4 py-2 rounded-lg">
                        <div className="font-medium text-gray-900">
                          {locataire.prenom} {locataire.nom}
                        </div>
                        <div className="text-xs text-gray-600">{locataire.email}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-lg font-bold text-gray-800">💳 Frais et paiements</h4>
                    <button
                      onClick={() => setShowFraisForm(showFraisForm === location.id ? null : location.id)}
                      className="px-4 py-2 text-sm bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
                    >
                      {showFraisForm === location.id ? '✕ Annuler' : '+ Ajouter un frais'}
                    </button>
                  </div>

                  {showFraisForm === location.id && (
                    <form onSubmit={(e) => handleFraisSubmit(e, location.id)} className="mb-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                          <select
                            value={fraisData.type}
                            onChange={(e) => setFraisData({ ...fraisData, type: e.target.value })}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all border px-3 py-2"
                          >
                            <option>Loyer</option>
                            <option>Charges</option>
                            <option>Réparation</option>
                            <option>Assurance</option>
                            <option>Taxe foncière</option>
                            <option>Autre</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Montant (€)</label>
                          <input
                            type="number"
                            step="0.01"
                            required
                            value={fraisData.montant}
                            onChange={(e) => setFraisData({ ...fraisData, montant: e.target.value })}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all border px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                          <input
                            type="date"
                            required
                            value={fraisData.date}
                            onChange={(e) => setFraisData({ ...fraisData, date: e.target.value })}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all border px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <input
                            type="text"
                            value={fraisData.description}
                            onChange={(e) => setFraisData({ ...fraisData, description: e.target.value })}
                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all border px-3 py-2"
                          />
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            checked={fraisData.estPaye}
                            onChange={(e) => setFraisData({ ...fraisData, estPaye: e.target.checked })}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="ml-2 text-sm text-gray-700">Payé</span>
                        </label>
                        <button
                          type="submit"
                          className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all"
                        >
                          Ajouter
                        </button>
                      </div>
                    </form>
                  )}

                  {location.frais && location.frais.length > 0 ? (
                    <div className="space-y-2">
                      {location.frais.map((frais: any) => (
                        <div key={frais.id} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-gray-900">{frais.type}</span>
                              {frais.description && (
                                <span className="text-sm text-gray-600">- {frais.description}</span>
                              )}
                            </div>
                            <p className="text-sm text-gray-500 mt-1">
                              📅 {new Date(frais.date).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-xl font-bold text-gray-900">{frais.montant}€</span>
                            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${
                              frais.estPaye 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {frais.estPaye ? '✓ Payé' : '⏳ En attente'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-gray-500 py-8">Aucun frais enregistré</p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {locations?.length === 0 && (
          <div className="text-center py-16">
            <span className="text-8xl mb-4 block">📋</span>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">Aucune location pour le moment</h3>
            <p className="text-gray-600">Commencez par créer votre première location</p>
          </div>
        )}
      </div>
    </div>
  )
}
