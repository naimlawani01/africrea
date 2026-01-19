'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Header from '@/components/dashboard/Header'
import { 
  Briefcase,
  Loader2,
  Check,
  AlertCircle,
  X,
  ArrowLeft,
  Calendar,
  MapPin,
  Users,
  Plus,
  Trash2
} from 'lucide-react'
import Link from 'next/link'

export default function CreateProjectPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [newRole, setNewRole] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: '',
    startDate: '',
    endDate: '',
    location: '',
    maxParticipants: '',
    requirements: '',
    thumbnail: '',
    roles: [] as string[]
  })

  const handleAddRole = () => {
    if (newRole.trim() && !formData.roles.includes(newRole.trim())) {
      setFormData({ ...formData, roles: [...formData.roles, newRole.trim()] })
      setNewRole('')
    }
  }

  const handleRemoveRole = (role: string) => {
    setFormData({ ...formData, roles: formData.roles.filter(r => r !== role) })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('/api/projects/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: 'Projet créé avec succès !' })
        setTimeout(() => {
          router.push('/dashboard/projects')
        }, 1500)
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la création' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion' })
    } finally {
      setLoading(false)
    }
  }

  const projectTypes = [
    { value: 'FILM_SHOOTING', label: 'Tournage Film' },
    { value: 'PHOTO_SHOOT', label: 'Shooting Photo' },
    { value: 'POST_PRODUCTION', label: 'Post-Production' },
    { value: 'LIVE_EVENT', label: 'Événement Live' },
    { value: 'COMMERCIAL', label: 'Publicité / Commercial' },
  ]

  return (
    <>
      <Header 
        title="Créer un Projet Pro" 
        subtitle="Proposez un projet aux étudiants pour acquérir de l'expérience terrain"
      />
      
      <div className="p-8">
        <Link 
          href="/dashboard/projects"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux projets
        </Link>

        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}
          >
            {message.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
            <button onClick={() => setMessage(null)} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="max-w-2xl">
          <div className="bg-[#141414] border border-white/5 rounded-2xl p-8 space-y-6">
            {/* Title */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Titre du projet *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-africrea-green-500"
                placeholder="Ex: Tournage Publicité 'Origine'"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Description *
              </label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-africrea-green-500 resize-none"
                placeholder="Décrivez le projet et ce que vous recherchez..."
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-3">
                Type de projet *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {projectTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, type: type.value })}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      formData.type === type.value
                        ? 'border-africrea-green-500 bg-africrea-green-500/10 text-africrea-green-400'
                        : 'border-white/10 hover:border-white/20 text-white/60'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Date de début *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-4 py-3 pl-12 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-africrea-green-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-white/70 text-sm font-medium mb-2">
                  Date de fin
                </label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-4 py-3 pl-12 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-africrea-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Lieu *
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-3 pl-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-africrea-green-500"
                  placeholder="Ex: Studio Africréa, Plateau"
                />
              </div>
            </div>

            {/* Max Participants */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Nombre max de participants
              </label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="number"
                  value={formData.maxParticipants}
                  onChange={(e) => setFormData({ ...formData, maxParticipants: e.target.value })}
                  className="w-full px-4 py-3 pl-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-africrea-green-500"
                  placeholder="Ex: 10"
                />
              </div>
            </div>

            {/* Roles */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Rôles recherchés
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRole())}
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-africrea-green-500"
                  placeholder="Ex: Assistant caméra"
                />
                <button
                  type="button"
                  onClick={handleAddRole}
                  className="px-4 py-3 bg-africrea-green-500 hover:bg-africrea-green-600 text-white rounded-xl transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
              {formData.roles.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.roles.map((role) => (
                    <span
                      key={role}
                      className="px-3 py-1.5 bg-white/10 text-white rounded-lg flex items-center gap-2"
                    >
                      {role}
                      <button
                        type="button"
                        onClick={() => handleRemoveRole(role)}
                        className="text-white/50 hover:text-red-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Requirements */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Prérequis
              </label>
              <textarea
                rows={2}
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-africrea-green-500 resize-none"
                placeholder="Compétences ou expériences requises..."
              />
            </div>

            {/* Thumbnail URL */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                URL de l&apos;image
              </label>
              <input
                type="url"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-africrea-green-500"
                placeholder="https://..."
              />
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <Link
                href="/dashboard/projects"
                className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors text-center"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={loading || !formData.title || !formData.description || !formData.type || !formData.startDate || !formData.location}
                className="flex-1 py-4 bg-africrea-green-500 hover:bg-africrea-green-600 disabled:bg-africrea-green-500/50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Briefcase className="w-5 h-5" />
                    Créer le projet
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </>
  )
}

