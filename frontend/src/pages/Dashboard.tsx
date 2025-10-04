import { useQuery } from '@tanstack/react-query'
import api from '../lib/api'
import { useThemeStore } from '../store/themeStore'

export default function Dashboard() {
  const { getBackground } = useThemeStore()
  const background = getBackground() || { gradient: 'from-white via-gray-50 to-white' }

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

  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const { data } = await api.get('/locations')
      return data
    },
  })

  const locationsActives = locations?.filter((l: any) => l.statut === 'active') || []
  const revenuMensuel = locationsActives.reduce((sum: number, l: any) => sum + l.loyerMensuel, 0)
  
  const fraisNonPayes = locations?.reduce((sum: number, l: any) => {
    const frais = l.frais?.filter((f: any) => !f.estPaye) || []
    return sum + frais.reduce((s: number, f: any) => s + f.montant, 0)
  }, 0) || 0

  const revenuAnnuel = revenuMensuel * 12
  const tauxOccupation = biens?.length > 0 ? ((locationsActives.length / biens.length) * 100).toFixed(0) : 0

  const getPhotos = (bien: any): string[] => {
    if (!bien.photos) return []
    try {
      return JSON.parse(bien.photos)
    } catch {
      return []
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${background.gradient}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className={`text-4xl font-bold ${background.isDark ? 'text-white' : 'text-gray-900'}`}>
            Tableau de bord
          </h1>
          <p className={`mt-2 ${background.isDark ? 'text-gray-300' : 'text-gray-600'}`}>Vue d'ensemble de votre activité</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm font-medium mb-1">Biens immobiliers</p>
                <p className="text-4xl font-bold">{biens?.length || 0}</p>
              </div>
              <div className="bg-blue-400 bg-opacity-30 rounded-full p-3">
                <span className="text-4xl">🏠</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm font-medium mb-1">Locataires</p>
                <p className="text-4xl font-bold">{locataires?.length || 0}</p>
              </div>
              <div className="bg-purple-400 bg-opacity-30 rounded-full p-3">
                <span className="text-4xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm font-medium mb-1">Locations actives</p>
                <p className="text-4xl font-bold">{locationsActives.length}</p>
                <p className="text-green-100 text-xs mt-1">Taux: {tauxOccupation}%</p>
              </div>
              <div className="bg-green-400 bg-opacity-30 rounded-full p-3">
                <span className="text-4xl">📋</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-orange-500 rounded-2xl shadow-xl p-6 text-white transform hover:scale-105 transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100 text-sm font-medium mb-1">Revenu mensuel</p>
                <p className="text-4xl font-bold">{revenuMensuel.toFixed(0)}€</p>
                <p className="text-yellow-100 text-xs mt-1">Annuel: {revenuAnnuel.toFixed(0)}€</p>
              </div>
              <div className="bg-yellow-400 bg-opacity-30 rounded-full p-3">
                <span className="text-4xl">💰</span>
              </div>
            </div>
          </div>
        </div>

        {fraisNonPayes > 0 && (
          <div className="bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 p-6 rounded-xl mb-8 shadow-md">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-4xl">⚠️</span>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-bold text-red-900">Paiements en attente</h3>
                <p className="text-red-700 mt-1">
                  {fraisNonPayes.toFixed(2)}€ de frais non payés à collecter
                </p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>📈</span> Statistiques financières
            </h2>
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Revenu mensuel moyen</span>
                  <span className="text-2xl font-bold text-blue-600">{revenuMensuel.toFixed(0)}€</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Revenu annuel estimé</span>
                  <span className="text-2xl font-bold text-green-600">{revenuAnnuel.toFixed(0)}€</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-4 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-medium">Loyer moyen par bien</span>
                  <span className="text-2xl font-bold text-orange-600">
                    {locationsActives.length > 0 ? (revenuMensuel / locationsActives.length).toFixed(0) : 0}€
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <span>📊</span> Vue d'ensemble
            </h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-medium">Taux d'occupation</span>
                  <span className="text-lg font-bold text-gray-900">{tauxOccupation}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${tauxOccupation}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-medium">Biens avec photos</span>
                  <span className="text-lg font-bold text-gray-900">
                    {biens?.filter((b: any) => getPhotos(b).length > 0).length || 0} / {biens?.length || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-emerald-500 h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${biens?.length > 0 ? ((biens.filter((b: any) => getPhotos(b).length > 0).length / biens.length) * 100) : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-700 font-medium">Locations actives</span>
                  <span className="text-lg font-bold text-gray-900">
                    {locationsActives.length} / {locations?.length || 0}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 h-3 rounded-full transition-all duration-500"
                    style={{ 
                      width: `${locations?.length > 0 ? ((locationsActives.length / locations.length) * 100) : 0}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span>📋</span> Locations récentes
          </h2>
          {locations && locations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Locataires
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Bien
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Loyer
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Statut
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {locations?.slice(0, 5).map((location: any) => (
                    <tr key={location.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex flex-col">
                          {location.locataires?.map((l: any) => (
                            <span key={l.locataire.id} className="text-sm font-medium text-gray-900">
                              {l.locataire.prenom} {l.locataire.nom}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{location.bien?.adresse}</div>
                        <div className="text-xs text-gray-500">{location.bien?.ville}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-lg font-bold text-gray-900">{location.loyerMensuel}€</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${
                          location.statut === 'active' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {location.statut === 'active' ? '✓ Active' : '✕ Terminée'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <span className="text-6xl mb-4 block">📊</span>
              <p className="text-gray-600">Aucune location pour le moment</p>
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {biens?.slice(0, 3).map((bien: any) => {
            const photos = getPhotos(bien)
            return (
              <div key={bien.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300">
                {photos.length > 0 ? (
                  <div className="relative h-40">
                    <img src={photos[0]} alt={bien.adresse} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      {bien.loyerBase}€
                    </div>
                  </div>
                ) : (
                  <div className="h-40 bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <span className="text-5xl">🏠</span>
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1">{bien.adresse}</h3>
                  <p className="text-sm text-gray-600">{bien.ville}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
