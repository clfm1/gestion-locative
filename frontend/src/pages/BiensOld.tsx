import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'

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
}

export default function Biens() {
  const [showForm, setShowForm] = useState(false)
  const [editingBien, setEditingBien] = useState<Bien | null>(null)
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
  })

  const queryClient = useQueryClient()

  const { data: biens, isLoading } = useQuery({
    queryKey: ['biens'],
    queryFn: async () => {
      const { data } = await api.get('/biens')
      return data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await api.post('/biens', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['biens'] })
      resetForm()
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await api.put(`/biens/${id}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['biens'] })
      resetForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/biens/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['biens'] })
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = {
      ...formData,
      superficie: formData.superficie ? parseFloat(formData.superficie) : undefined,
      nbChambres: formData.nbChambres ? parseInt(formData.nbChambres) : undefined,
      loyerBase: parseFloat(formData.loyerBase),
      charges: formData.charges ? parseFloat(formData.charges) : undefined,
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
    })
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
    })
    setEditingBien(null)
    setShowForm(false)
  }

  if (isLoading) {
    return <div className="text-center py-8">Chargement...</div>
  }

  return (
    <div className="px-4 py-6">
      <div className="sm:flex sm:items-center sm:justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Biens immobiliers</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="mt-3 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          {showForm ? 'Annuler' : 'Ajouter un bien'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">
            {editingBien ? 'Modifier le bien' : 'Nouveau bien'}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">Adresse</label>
                <input
                  type="text"
                  required
                  value={formData.adresse}
                  onChange={(e) => setFormData({ ...formData, adresse: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Ville</label>
                <input
                  type="text"
                  required
                  value={formData.ville}
                  onChange={(e) => setFormData({ ...formData, ville: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Code postal</label>
                <input
                  type="text"
                  required
                  value={formData.codePostal}
                  onChange={(e) => setFormData({ ...formData, codePostal: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
                >
                  <option>Appartement</option>
                  <option>Maison</option>
                  <option>Studio</option>
                  <option>Loft</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Superficie (m²)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.superficie}
                  onChange={(e) => setFormData({ ...formData, superficie: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Nombre de chambres</label>
                <input
                  type="number"
                  value={formData.nbChambres}
                  onChange={(e) => setFormData({ ...formData, nbChambres: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Loyer de base (€)</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.loyerBase}
                  onChange={(e) => setFormData({ ...formData, loyerBase: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Charges (€)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.charges}
                  onChange={(e) => setFormData({ ...formData, charges: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border px-3 py-2"
              />
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
                {editingBien ? 'Mettre à jour' : 'Créer'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Adresse
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Loyer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {biens?.map((bien: Bien) => (
              <tr key={bien.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{bien.adresse}</div>
                  <div className="text-sm text-gray-500">{bien.ville}, {bien.codePostal}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {bien.type}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {bien.loyerBase}€ {bien.charges && `+ ${bien.charges}€`}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => handleEdit(bien)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(bien.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
