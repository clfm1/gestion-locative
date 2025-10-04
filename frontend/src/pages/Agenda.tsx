import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { useThemeStore } from '../store/themeStore'

interface Event {
  id: string
  titre: string
  description?: string
  dateDebut: string
  dateFin?: string
  type: string
  couleur: string
  rappel: boolean
  createdAt: string
  updatedAt: string
}

const eventTypes = [
  { value: 'general', name: 'Général', icon: '📅' },
  { value: 'visite', name: 'Visite', icon: '🏠' },
  { value: 'travaux', name: 'Travaux', icon: '🔧' },
  { value: 'paiement', name: 'Paiement', icon: '💰' },
  { value: 'reunion', name: 'Réunion', icon: '👥' },
  { value: 'autre', name: 'Autre', icon: '📌' },
]

const eventColors = [
  { value: 'blue', name: 'Bleu', bg: 'bg-blue-500', text: 'text-blue-500', light: 'bg-blue-100' },
  { value: 'green', name: 'Vert', bg: 'bg-green-500', text: 'text-green-500', light: 'bg-green-100' },
  { value: 'red', name: 'Rouge', bg: 'bg-red-500', text: 'text-red-500', light: 'bg-red-100' },
  { value: 'purple', name: 'Violet', bg: 'bg-purple-500', text: 'text-purple-500', light: 'bg-purple-100' },
  { value: 'orange', name: 'Orange', bg: 'bg-orange-500', text: 'text-orange-500', light: 'bg-orange-100' },
  { value: 'pink', name: 'Rose', bg: 'bg-pink-500', text: 'text-pink-500', light: 'bg-pink-100' },
]

export default function Agenda() {
  const { getTheme, getBackground } = useThemeStore()
  const theme = getTheme()
  const background = getBackground() || { gradient: 'from-white via-gray-50 to-white' }

  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'list'>('month')
  const [showForm, setShowForm] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)

  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    dateDebut: '',
    dateFin: '',
    type: 'general',
    couleur: 'blue',
    rappel: false,
  })

  const queryClient = useQueryClient()

  const currentMonth = currentDate.getMonth() + 1
  const currentYear = currentDate.getFullYear()

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['events', currentMonth, currentYear],
    queryFn: async () => {
      const response = await api.get(`/events?month=${currentMonth}&year=${currentYear}`)
      return response.data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await api.post('/events', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      resetForm()
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await api.put(`/events/${id}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
      resetForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/events/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] })
    },
  })

  const resetForm = () => {
    setFormData({
      titre: '',
      description: '',
      dateDebut: '',
      dateFin: '',
      type: 'general',
      couleur: 'blue',
      rappel: false,
    })
    setEditingEvent(null)
    setShowForm(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingEvent) {
      updateMutation.mutate({ id: editingEvent.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormData({
      titre: event.titre,
      description: event.description || '',
      dateDebut: event.dateDebut.split('T')[0] + 'T' + event.dateDebut.split('T')[1].substring(0, 5),
      dateFin: event.dateFin ? event.dateFin.split('T')[0] + 'T' + event.dateFin.split('T')[1].substring(0, 5) : '',
      type: event.type,
      couleur: event.couleur,
      rappel: event.rappel,
    })
    setShowForm(true)
  }

  const handleDateClick = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    setFormData({
      titre: '',
      description: '',
      dateDebut: `${dateStr}T09:00`,
      dateFin: `${dateStr}T10:00`,
      type: 'general',
      couleur: 'blue',
      rappel: false,
    })
    setEditingEvent(null)
    setShowForm(true)
  }

  const getDaysInMonth = () => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startDay = firstDay.getDay()

    const days = []
    for (let i = 0; i < startDay; i++) {
      days.push(null)
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }
    return days
  }

  const getEventsForDate = (date: Date) => {
    return events.filter((event: Event) => {
      const eventDate = new Date(event.dateDebut)
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      )
    })
  }

  const getColorClasses = (couleur: string) => {
    return eventColors.find(c => c.value === couleur) || eventColors[0]
  }

  const getTypeIcon = (type: string) => {
    return eventTypes.find(t => t.value === type)?.icon || '📅'
  }

  const changeMonth = (delta: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + delta, 1))
  }

  const days = getDaysInMonth()
  const monthName = currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })

  const upcomingEvents = useMemo(() => {
    const now = new Date()
    return events
      .filter((event: Event) => new Date(event.dateDebut) >= now)
      .sort((a: Event, b: Event) => new Date(a.dateDebut).getTime() - new Date(b.dateDebut).getTime())
      .slice(0, 5)
  }, [events])

  return (
    <div className={`min-h-screen bg-gradient-to-br ${background.gradient}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className={`text-4xl font-bold ${background.isDark ? 'text-white' : 'text-gray-900'}`}>
              📅 Agenda
            </h1>
            <p className={`mt-2 ${background.isDark ? 'text-gray-300' : 'text-gray-600'}`}>Gérez vos événements et rendez-vous</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setViewMode('month')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'month'
                  ? `bg-gradient-to-r ${theme.buttonGradient} text-white shadow-lg`
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              📅 Mois
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === 'list'
                  ? `bg-gradient-to-r ${theme.buttonGradient} text-white shadow-lg`
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              📋 Liste
            </button>
            <button
              onClick={() => {
                resetForm()
                setShowForm(!showForm)
              }}
              className={`px-6 py-2 rounded-xl shadow-lg text-white bg-gradient-to-r ${theme.buttonGradient} hover:${theme.hoverGradient} transition-all`}
            >
              ➕ Nouveau
            </button>
          </div>
        </div>

        {showForm && (
          <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-8 mb-8 animate-fadeIn border-2 border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingEvent ? '✏️ Modifier l\'événement' : '✨ Nouvel événement'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Titre</label>
                  <input
                    type="text"
                    required
                    value={formData.titre}
                    onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Titre de l'événement..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Description (optionnel)..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Début</label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.dateDebut}
                    onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Fin (optionnel)</label>
                  <input
                    type="datetime-local"
                    value={formData.dateFin}
                    onChange={(e) => setFormData({ ...formData, dateFin: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {eventTypes.map((type) => (
                      <option key={type.value} value={type.value}>
                        {type.icon} {type.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Couleur</label>
                  <div className="grid grid-cols-6 gap-2">
                    {eventColors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, couleur: color.value })}
                        className={`${color.bg} rounded-lg h-10 transition-all ${
                          formData.couleur === color.value ? 'ring-4 ring-blue-500 scale-110' : 'hover:scale-110'
                        }`}
                        title={color.name}
                      />
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 flex items-center">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.rappel}
                      onChange={(e) => setFormData({ ...formData, rappel: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      🔔 Activer un rappel
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className={`flex-1 px-6 py-3 rounded-xl shadow-lg text-white bg-gradient-to-r ${theme.buttonGradient} hover:${theme.hoverGradient} transition-all transform hover:scale-105 disabled:opacity-50`}
                >
                  {editingEvent ? '💾 Enregistrer' : '✨ Créer'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 rounded-xl shadow-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition-all"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Chargement du calendrier...</p>
          </div>
        ) : viewMode === 'month' ? (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-6 animate-fadeIn">
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={() => changeMonth(-1)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all"
              >
                ← Précédent
              </button>
              <h2 className="text-2xl font-bold text-gray-800 capitalize">{monthName}</h2>
              <button
                onClick={() => changeMonth(1)}
                className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-all"
              >
                Suivant →
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2">
              {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
                <div key={day} className="text-center font-bold text-gray-600 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {days.map((date, index) => {
                if (!date) {
                  return <div key={`empty-${index}`} className="aspect-square" />
                }

                const dayEvents = getEventsForDate(date)
                const isToday =
                  date.getDate() === new Date().getDate() &&
                  date.getMonth() === new Date().getMonth() &&
                  date.getFullYear() === new Date().getFullYear()

                return (
                  <div
                    key={index}
                    onClick={() => handleDateClick(date)}
                    className={`aspect-square border-2 rounded-xl p-2 cursor-pointer transition-all hover:shadow-lg ${
                      isToday
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 bg-white'
                    }`}
                  >
                    <div className={`text-sm font-bold mb-1 ${isToday ? 'text-blue-600' : 'text-gray-700'}`}>
                      {date.getDate()}
                    </div>
                    <div className="space-y-1">
                      {dayEvents.slice(0, 2).map((event: Event) => {
                        const color = getColorClasses(event.couleur)
                        return (
                          <div
                            key={event.id}
                            className={`${color.light} text-xs p-1 rounded truncate`}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleEdit(event)
                            }}
                            title={event.titre}
                          >
                            {getTypeIcon(event.type)} {event.titre}
                          </div>
                        )
                      })}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-gray-500 font-medium">
                          +{dayEvents.length - 2} autre{dayEvents.length > 3 ? 's' : ''}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {upcomingEvents.length > 0 ? (
              upcomingEvents.map((event: Event) => {
                const color = getColorClasses(event.couleur)
                const eventDate = new Date(event.dateDebut)
                const endDate = event.dateFin ? new Date(event.dateFin) : null

                return (
                  <div
                    key={event.id}
                    className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all animate-fadeIn border-l-4"
                    style={{ borderColor: color.bg.replace('bg-', '') }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-3xl">{getTypeIcon(event.type)}</span>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">{event.titre}</h3>
                            <p className="text-sm text-gray-500">
                              {eventDate.toLocaleDateString('fr-FR', {
                                weekday: 'long',
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                              {' à '}
                              {eventDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                              {endDate && (
                                <>
                                  {' → '}
                                  {endDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                        {event.description && (
                          <p className="text-gray-600 mt-3 pl-12">{event.description}</p>
                        )}
                        {event.rappel && (
                          <div className="flex items-center gap-2 mt-3 pl-12">
                            <span className="text-yellow-500">🔔</span>
                            <span className="text-sm text-gray-600">Rappel activé</span>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(event)}
                          className="px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 text-sm font-medium transition-all"
                        >
                          ✏️ Modifier
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Supprimer cet événement ?')) {
                              deleteMutation.mutate(event.id)
                            }
                          }}
                          className="px-4 py-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium transition-all"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-gray-200">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Aucun événement à venir</h3>
                <p className="text-gray-600 mb-6">Créez votre premier événement pour commencer</p>
                <button
                  onClick={() => setShowForm(true)}
                  className={`px-6 py-3 rounded-xl shadow-lg text-white bg-gradient-to-r ${theme.buttonGradient} hover:${theme.hoverGradient} transition-all transform hover:scale-105`}
                >
                  ➕ Créer un événement
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
