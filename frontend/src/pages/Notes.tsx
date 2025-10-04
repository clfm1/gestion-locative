import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '../lib/api'
import { useThemeStore } from '../store/themeStore'

interface Note {
  id: string
  titre: string
  contenu: string
  couleur: string
  epingle: boolean
  createdAt: string
  updatedAt: string
}

const noteColors = [
  { value: 'yellow', name: 'Jaune', bg: 'bg-yellow-100', border: 'border-yellow-300', text: 'text-yellow-900' },
  { value: 'blue', name: 'Bleu', bg: 'bg-blue-100', border: 'border-blue-300', text: 'text-blue-900' },
  { value: 'green', name: 'Vert', bg: 'bg-green-100', border: 'border-green-300', text: 'text-green-900' },
  { value: 'pink', name: 'Rose', bg: 'bg-pink-100', border: 'border-pink-300', text: 'text-pink-900' },
  { value: 'purple', name: 'Violet', bg: 'bg-purple-100', border: 'border-purple-300', text: 'text-purple-900' },
  { value: 'orange', name: 'Orange', bg: 'bg-orange-100', border: 'border-orange-300', text: 'text-orange-900' },
]

export default function Notes() {
  const { getTheme, getBackground } = useThemeStore()
  const theme = getTheme()
  const background = getBackground() || { gradient: 'from-white via-gray-50 to-white' }

  const [showForm, setShowForm] = useState(false)
  const [editingNote, setEditingNote] = useState<Note | null>(null)
  const [formData, setFormData] = useState({
    titre: '',
    contenu: '',
    couleur: 'yellow',
    epingle: false,
  })

  const queryClient = useQueryClient()

  const { data: notes = [], isLoading } = useQuery({
    queryKey: ['notes'],
    queryFn: async () => {
      const response = await api.get('/notes')
      return response.data
    },
  })

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return await api.post('/notes', data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      resetForm()
    },
  })

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: any }) => {
      return await api.put(`/notes/${id}`, data)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
      resetForm()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/notes/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notes'] })
    },
  })

  const resetForm = () => {
    setFormData({ titre: '', contenu: '', couleur: 'yellow', epingle: false })
    setEditingNote(null)
    setShowForm(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingNote) {
      updateMutation.mutate({ id: editingNote.id, data: formData })
    } else {
      createMutation.mutate(formData)
    }
  }

  const handleEdit = (note: Note) => {
    setEditingNote(note)
    setFormData({
      titre: note.titre,
      contenu: note.contenu,
      couleur: note.couleur,
      epingle: note.epingle,
    })
    setShowForm(true)
  }

  const handlePin = (note: Note) => {
    updateMutation.mutate({
      id: note.id,
      data: { ...note, epingle: !note.epingle }
    })
  }

  const getColorClasses = (couleur: string) => {
    const color = noteColors.find(c => c.value === couleur) || noteColors[0]
    return color
  }

  const pinnedNotes = notes.filter((note: Note) => note.epingle)
  const unpinnedNotes = notes.filter((note: Note) => !note.epingle)

  return (
    <div className={`min-h-screen bg-gradient-to-br ${background.gradient}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className={`text-4xl font-bold ${background.isDark ? 'text-white' : 'text-gray-900'}`}>
              📝 Bloc-notes
            </h1>
            <p className={`mt-2 ${background.isDark ? 'text-gray-300' : 'text-gray-600'}`}>Organisez vos idées et notes importantes</p>
          </div>
          <button
            onClick={() => {
              resetForm()
              setShowForm(!showForm)
            }}
            className={`px-6 py-3 rounded-xl shadow-lg text-white bg-gradient-to-r ${theme.buttonGradient} hover:${theme.hoverGradient} transition-all transform hover:scale-105`}
          >
            {showForm ? '✖️ Annuler' : '➕ Nouvelle note'}
          </button>
        </div>

        {showForm && (
          <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-8 mb-8 animate-fadeIn border-2 border-gray-100">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">
              {editingNote ? '✏️ Modifier la note' : '✨ Nouvelle note'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Titre</label>
                <input
                  type="text"
                  required
                  value={formData.titre}
                  onChange={(e) => setFormData({ ...formData, titre: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Titre de la note..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Contenu</label>
                <textarea
                  required
                  rows={8}
                  value={formData.contenu}
                  onChange={(e) => setFormData({ ...formData, contenu: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Écrivez votre note ici..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Couleur</label>
                  <div className="grid grid-cols-3 gap-2">
                    {noteColors.map((color) => (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setFormData({ ...formData, couleur: color.value })}
                        className={`${color.bg} ${color.border} border-2 rounded-lg p-3 text-center transition-all ${
                          formData.couleur === color.value ? 'ring-4 ring-blue-500 scale-105' : 'hover:scale-105'
                        }`}
                      >
                        <span className="text-sm font-medium">{color.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.epingle}
                      onChange={(e) => setFormData({ ...formData, epingle: e.target.checked })}
                      className="w-5 h-5 rounded border-gray-300"
                    />
                    <span className="text-sm font-semibold text-gray-700">
                      📌 Épingler cette note
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
                  {editingNote ? '💾 Enregistrer' : '✨ Créer'}
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
            <p className="mt-4 text-gray-600">Chargement des notes...</p>
          </div>
        ) : (
          <>
            {pinnedNotes.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                  <span>📌</span> Notes épinglées
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {pinnedNotes.map((note: Note) => {
                    const colorClasses = getColorClasses(note.couleur)
                    return (
                      <div
                        key={note.id}
                        className={`${colorClasses.bg} ${colorClasses.border} border-2 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 animate-fadeIn`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className={`text-xl font-bold ${colorClasses.text} flex-1 pr-2`}>
                            {note.titre}
                          </h3>
                          <button
                            onClick={() => handlePin(note)}
                            className="text-2xl hover:scale-125 transition-transform"
                            title="Désépingler"
                          >
                            📌
                          </button>
                        </div>
                        <p className={`${colorClasses.text} whitespace-pre-wrap mb-4 text-sm leading-relaxed`}>
                          {note.contenu}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-300">
                          <span className="text-xs text-gray-600">
                            {new Date(note.updatedAt).toLocaleDateString('fr-FR')}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(note)}
                              className="px-3 py-1 rounded-lg bg-white/80 hover:bg-white text-gray-700 text-sm font-medium transition-all"
                            >
                              ✏️ Modifier
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Supprimer cette note ?')) {
                                  deleteMutation.mutate(note.id)
                                }
                              }}
                              className="px-3 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium transition-all"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {unpinnedNotes.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
                  <span>📄</span> Toutes les notes
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {unpinnedNotes.map((note: Note) => {
                    const colorClasses = getColorClasses(note.couleur)
                    return (
                      <div
                        key={note.id}
                        className={`${colorClasses.bg} ${colorClasses.border} border-2 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 animate-fadeIn`}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className={`text-xl font-bold ${colorClasses.text} flex-1 pr-2`}>
                            {note.titre}
                          </h3>
                          <button
                            onClick={() => handlePin(note)}
                            className="text-2xl opacity-30 hover:opacity-100 hover:scale-125 transition-all"
                            title="Épingler"
                          >
                            📌
                          </button>
                        </div>
                        <p className={`${colorClasses.text} whitespace-pre-wrap mb-4 text-sm leading-relaxed`}>
                          {note.contenu}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-gray-300">
                          <span className="text-xs text-gray-600">
                            {new Date(note.updatedAt).toLocaleDateString('fr-FR')}
                          </span>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(note)}
                              className="px-3 py-1 rounded-lg bg-white/80 hover:bg-white text-gray-700 text-sm font-medium transition-all"
                            >
                              ✏️ Modifier
                            </button>
                            <button
                              onClick={() => {
                                if (confirm('Supprimer cette note ?')) {
                                  deleteMutation.mutate(note.id)
                                }
                              }}
                              className="px-3 py-1 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 text-sm font-medium transition-all"
                            >
                              🗑️
                            </button>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {notes.length === 0 && (
              <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl border-2 border-gray-200">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Aucune note</h3>
                <p className="text-gray-600 mb-6">Créez votre première note pour commencer</p>
                <button
                  onClick={() => setShowForm(true)}
                  className={`px-6 py-3 rounded-xl shadow-lg text-white bg-gradient-to-r ${theme.buttonGradient} hover:${theme.hoverGradient} transition-all transform hover:scale-105`}
                >
                  ➕ Créer une note
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
