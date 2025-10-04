import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'

interface Location {
  id: string
  dateDebut: string
  dateFin?: string
  loyerMensuel: number
  depot?: number
  statut: string
  bien: any
  locataire: any
  frais: any[]
}

export default function Locations() {
  const [showForm, setShowForm] = useState(false)
  const [showFraisForm, setShowFraisForm] = useState<string | null>(null)
  const [editingLocation, setEditingLocation] = useState<Location | null>(null)
  const [formData, setFormData] = useState({
    bienId: '',
    locataireId: '',
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
      locataireId: location.locataire.id,
      dateDebut: location.dateDebut.split('T')[0],
      dateFin: location.dateFin ? location.dateFin.split('T')[0] : '',
      loyerMensuel: location.loyerMensuel.toString(),
      depot: location.depot?.toString() || '',
      statut: location.statut,
    })
    setShowForm(true)
  }

  const resetForm = () => {
    setFormData({
      bienId: '',
      locataireId: '',
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
    return <div className="text-center py-8">Chargement...</div>
  }

  return (
    <div className="px-4 py-6">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Locations</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          {showForm ? 'Annuler' : 'Ajouter une location'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingLocation ? 'Modifier la location' : 'Nouvelle location'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Bien</label>
                <select
                  required
                  value={formData.bienId}
                  onChange={(e) => setFormData({ ...formData, bienId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
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
                <label className="block text-sm font-medium text-gray-700">Locataire</label>
                <select
                  required
                  value={formData.locataireId}
                  onChange={(e) => setFormData({ ...formData, locataireId: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
                >
                  <option value="">Sélectionner un locataire</option>
                  {locataires?.map((locataire: any) => (
                    <option key={locataire.id} value={locataire.id}>
                      {locataire.prenom} {locataire.nom}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date de début</label>
                <input
                  type="date"
                  required
                  value={formData.dateDebut}
                  onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Date de fin</label>
                <input
                  type="date"
                  value={formData.dateFin}
                  onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Loyer mensuel (€)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.loyerMensuel}
                  onChange={(e) => setFormData({ ...formData, loyerMensuel: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Dépôt de garantie (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.depot}
                  onChange={(e) => setFormData({ ...formData, depot: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Statut</label>
                <select
                  value={formData.statut}
                  onChange={(e) => setFormData({ ...formData, statut: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
                >
                  <option value="active">Active</option>
                  <option value="terminee">Terminée</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                {editingLocation ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {locations?.map((location: Location) => (
          <div key={location.id} className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {location.bien?.adresse} - {location.locataire?.prenom} {location.locataire?.nom}
                </h3>
                <p className="text-sm text-gray-500">
                  Du {new Date(location.dateDebut).toLocaleDateString()} 
                  {location.dateFin && ` au ${new Date(location.dateFin).toLocaleDateString()}`}
                </p>
                <p className="text-sm text-gray-700 mt-1">
                  Loyer: {location.loyerMensuel}€/mois
                  {location.depot && ` | Dépôt: ${location.depot}€`}
                </p>
              </div>
              <div className="flex space-x-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                  location.statut === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {location.statut}
                </span>
                <button
                  onClick={() => handleEdit(location)}
                  className="text-blue-600 hover:text-blue-900 text-sm"
                >
                  Modifier
                </button>
                <button
                  onClick={() => deleteMutation.mutate(location.id)}
                  className="text-red-600 hover:text-red-900 text-sm"
                >
                  Supprimer
                </button>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-md font-semibold text-gray-800">Frais et paiements</h4>
                <button
                  onClick={() => setShowFraisForm(showFraisForm === location.id ? null : location.id)}
                  className="text-sm text-blue-600 hover:text-blue-900"
                >
                  {showFraisForm === location.id ? 'Annuler' : '+ Ajouter un frais'}
                </button>
              </div>

              {showFraisForm === location.id && (
                <form onSubmit={(e) => handleFraisSubmit(e, location.id)} className="mb-4 p-4 bg-gray-50 rounded">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Type</label>
                      <select
                        value={fraisData.type}
                        onChange={(e) => setFraisData({ ...fraisData, type: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
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
                      <label className="block text-sm font-medium text-gray-700">Montant (€)</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={fraisData.montant}
                        onChange={(e) => setFraisData({ ...fraisData, montant: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Date</label>
                      <input
                        type="date"
                        required
                        value={fraisData.date}
                        onChange={(e) => setFraisData({ ...fraisData, date: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <input
                        type="text"
                        value={fraisData.description}
                        onChange={(e) => setFraisData({ ...fraisData, description: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
                      />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center">
                    <input
                      type="checkbox"
                      checked={fraisData.estPaye}
                      onChange={(e) => setFraisData({ ...fraisData, estPaye: e.target.checked })}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 block text-sm text-gray-700">
                      Payé
                    </label>
                  </div>
                  <div className="mt-3">
                    <button
                      type="submit"
                      className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                    >
                      Ajouter
                    </button>
                  </div>
                </form>
              )}

              {location.frais && location.frais.length > 0 ? (
                <div className="space-y-2">
                  {location.frais.map((frais: any) => (
                    <div key={frais.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                      <div>
                        <span className="font-medium">{frais.type}</span>
                        {frais.description && <span className="text-gray-600"> - {frais.description}</span>}
                        <p className="text-sm text-gray-500">
                          {new Date(frais.date).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="font-semibold">{frais.montant}€</span>
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                          frais.estPaye ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {frais.estPaye ? 'Payé' : 'En attente'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Aucun frais enregistré</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
