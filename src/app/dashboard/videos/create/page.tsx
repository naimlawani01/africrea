'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Header from '@/components/dashboard/Header'
import { 
  Film,
  Loader2,
  Check,
  AlertCircle,
  X,
  ArrowLeft,
  Link as LinkIcon,
  Clock
} from 'lucide-react'
import Link from 'next/link'

export default function CreateVideoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnail: '',
    duration: '',
    category: '',
    analysisGuide: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('/api/videos/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: 'Vidéo ajoutée avec succès !' })
        setTimeout(() => {
          router.push('/dashboard/videos')
        }, 1500)
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur lors de l\'ajout' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion' })
    } finally {
      setLoading(false)
    }
  }

  const categories = [
    { value: 'FILM_ANALYSIS', label: 'Analyse de film' },
    { value: 'TECHNIQUE', label: 'Technique' },
    { value: 'TUTORIAL', label: 'Tutoriel' },
    { value: 'REFERENCE', label: 'Référence' },
    { value: 'STUDENT_WORK', label: 'Travail étudiant' },
  ]

  return (
    <>
      <Header 
        title="Ajouter une Vidéo" 
        subtitle="Enrichissez la vidéothèque pour les étudiants"
      />
      
      <div className="p-8">
        <Link 
          href="/dashboard/videos"
          className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à la vidéothèque
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
                Titre de la vidéo *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-africrea-green-500"
                placeholder="Ex: Analyse du film 'Parasite'"
              />
            </div>

            {/* Video URL */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                URL de la vidéo *
              </label>
              <div className="relative">
                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="url"
                  required
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="w-full px-4 py-3 pl-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-africrea-green-500"
                  placeholder="https://youtube.com/watch?v=... ou https://vimeo.com/..."
                />
              </div>
              <p className="text-white/40 text-xs mt-2">YouTube, Vimeo ou lien direct vers le fichier vidéo</p>
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
                placeholder="Décrivez le contenu de la vidéo..."
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-3">
                Catégorie *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, category: cat.value })}
                    className={`p-3 rounded-xl border-2 text-center transition-all ${
                      formData.category === cat.value
                        ? 'border-africrea-green-500 bg-africrea-green-500/10 text-africrea-green-400'
                        : 'border-white/10 hover:border-white/20 text-white/60'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Durée (en secondes)
              </label>
              <div className="relative">
                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                <input
                  type="number"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  className="w-full px-4 py-3 pl-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-africrea-green-500"
                  placeholder="Ex: 1800 pour 30 minutes"
                />
              </div>
            </div>

            {/* Thumbnail URL */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                URL de la miniature
              </label>
              <input
                type="url"
                value={formData.thumbnail}
                onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-africrea-green-500"
                placeholder="https://..."
              />
            </div>

            {/* Analysis Guide */}
            <div>
              <label className="block text-white/70 text-sm font-medium mb-2">
                Guide d&apos;analyse (pour les analyses de films)
              </label>
              <textarea
                rows={3}
                value={formData.analysisGuide}
                onChange={(e) => setFormData({ ...formData, analysisGuide: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-africrea-green-500 resize-none"
                placeholder="Points clés à observer, questions de réflexion..."
              />
            </div>

            {/* Submit */}
            <div className="flex gap-4 pt-4">
              <Link
                href="/dashboard/videos"
                className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors text-center"
              >
                Annuler
              </Link>
              <button
                type="submit"
                disabled={loading || !formData.title || !formData.videoUrl || !formData.description || !formData.category}
                className="flex-1 py-4 bg-africrea-green-500 hover:bg-africrea-green-600 disabled:bg-africrea-green-500/50 text-white font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Film className="w-5 h-5" />
                    Ajouter la vidéo
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

