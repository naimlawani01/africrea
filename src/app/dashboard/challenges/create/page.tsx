'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Header from '@/components/dashboard/Header'
import { 
  Trophy,
  Palette,
  Box,
  Film,
  Calendar,
  Loader2,
  Check,
  AlertCircle,
  X,
  ArrowLeft
} from 'lucide-react'
import Link from 'next/link'

export default function CreateChallengePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    brief: '',
    pole: '',
    difficulty: '',
    deadline: '',
    thumbnail: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('/api/challenges/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: 'Défi créé avec succès !' })
        setTimeout(() => {
          router.push('/dashboard/challenges')
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

  const poles = [
    { value: 'GRAPHISME', label: 'Graphisme', icon: Palette, color: 'purple' },
    { value: 'ANIMATION_3D', label: 'Animation 3D', icon: Box, color: 'blue' },
    { value: 'AUDIOVISUEL', label: 'Audiovisuel', icon: Film, color: 'orange' },
  ]

  const difficulties = [
    { value: 'BEGINNER', label: 'Débutant', color: 'green' },
    { value: 'INTERMEDIATE', label: 'Intermédiaire', color: 'yellow' },
    { value: 'ADVANCED', label: 'Avancé', color: 'orange' },
    { value: 'EXPERT', label: 'Expert', color: 'red' },
  ]

  return (
    <>
      <Header 
        title="Créer un Défi" 
        subtitle="Proposez un nouveau défi aux étudiants"
      />
      
      <div className="p-8">
        <Link 
          href="/dashboard/challenges"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux défis
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
                Titre du défi *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-africrea-green-500"
                placeholder="Ex: Identité Visuelle - Startup Tech"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Description courte *
              </label>
              <input
                type="text"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-africrea-green-500"
                placeholder="Une brève description du défi"
              />
            </div>

            {/* Brief */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Brief créatif détaillé
              </label>
              <textarea
                rows={4}
                value={formData.brief}
                onChange={(e) => setFormData({ ...formData, brief: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-africrea-green-500 resize-none"
                placeholder="Détaillez les attentes, les livrables, les critères d'évaluation..."
              />
            </div>

            {/* Pole Selection */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-3">
                Pôle *
              </label>
              <div className="grid grid-cols-3 gap-3">
                {poles.map((pole) => {
                  const Icon = pole.icon
                  return (
                    <button
                      key={pole.value}
                      type="button"
                      onClick={() => setFormData({ ...formData, pole: pole.value })}
                      className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${
                        formData.pole === pole.value
                          ? `border-${pole.color}-500 bg-${pole.color}-500/10`
                          : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <Icon className={`w-6 h-6 ${formData.pole === pole.value ? `text-${pole.color}-400` : 'text-white/60'}`} />
                      <span className={formData.pole === pole.value ? `text-${pole.color}-400` : 'text-white/60'}>
                        {pole.label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Difficulty Selection */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-3">
                Difficulté *
              </label>
              <div className="grid grid-cols-4 gap-3">
                {difficulties.map((diff) => (
                  <button
                    key={diff.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, difficulty: diff.value })}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      formData.difficulty === diff.value
                        ? `border-${diff.color}-500 bg-${diff.color}-500/10 text-${diff.color}-400`
                        : 'border-white/10 hover:border-white/20 text-white/60'
                    }`}
                  >
                    {diff.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Date limite (optionnel)
              </label>
              <div className="relative">
                <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                  className="w-full px-4 py-3 pl-12 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-africrea-green-500"
                />
              </div>
            </div>

            {/* Thumbnail URL */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                URL de l&apos;image (optionnel)
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
                href="/dashboard/challenges"
                className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors text-center"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={loading || !formData.title || !formData.description || !formData.pole || !formData.difficulty}
                className="flex-1 py-4 bg-africrea-green-500 hover:bg-africrea-green-600 disabled:bg-africrea-green-500/50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Trophy className="w-5 h-5" />
                    Créer le défi
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

