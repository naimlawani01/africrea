'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/dashboard/Header'
import { 
  Trophy, 
  Clock, 
  Filter, 
  Palette,
  Box,
  Film,
  Upload,
  Star,
  MessageSquare,
  X,
  Loader2,
  Check,
  AlertCircle
} from 'lucide-react'

interface Challenge {
  id: string
  title: string
  description: string
  brief: string
  pole: string
  difficulty: string
  deadline: string | null
  thumbnail: string | null
  creator: {
    firstName: string
    lastName: string
  }
  _count: {
    submissions: number
  }
}

interface Submission {
  id: string
  challengeId: string
  fileUrl: string
  description: string
  status: string
  submittedAt: string
  grade: number | null
  challenge: {
    title: string
  }
  feedback: {
    content: string
    trainer: {
      firstName: string
      lastName: string
    }
  }[]
}

const poleIcons: Record<string, React.ElementType> = {
  GRAPHISME: Palette,
  ANIMATION_3D: Box,
  AUDIOVISUEL: Film,
}

const poleColors: Record<string, { bg: string; text: string; border: string }> = {
  GRAPHISME: { bg: 'bg-purple-100 dark:bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', border: 'border-purple-300 dark:border-purple-500/30' },
  ANIMATION_3D: { bg: 'bg-blue-100 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', border: 'border-blue-300 dark:border-blue-500/30' },
  AUDIOVISUEL: { bg: 'bg-orange-100 dark:bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400', border: 'border-orange-300 dark:border-orange-500/30' },
}

const difficultyColors: Record<string, { bg: string; text: string }> = {
  BEGINNER: { bg: 'bg-green-100 dark:bg-green-500/10', text: 'text-green-600 dark:text-green-400' },
  INTERMEDIATE: { bg: 'bg-yellow-100 dark:bg-yellow-500/10', text: 'text-yellow-600 dark:text-yellow-400' },
  ADVANCED: { bg: 'bg-orange-100 dark:bg-orange-500/10', text: 'text-orange-600 dark:text-orange-400' },
  EXPERT: { bg: 'bg-red-100 dark:bg-red-500/10', text: 'text-red-600 dark:text-red-400' },
}

const difficultyLabels: Record<string, string> = {
  BEGINNER: 'Débutant',
  INTERMEDIATE: 'Intermédiaire',
  ADVANCED: 'Avancé',
  EXPERT: 'Expert',
}

const statusColors: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: 'bg-gray-100 dark:bg-gray-500/10', text: 'text-gray-600 dark:text-gray-400' },
  REVIEWING: { bg: 'bg-blue-100 dark:bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400' },
  APPROVED: { bg: 'bg-green-100 dark:bg-green-500/10', text: 'text-green-600 dark:text-green-400' },
  REVISION: { bg: 'bg-yellow-100 dark:bg-yellow-500/10', text: 'text-yellow-600 dark:text-yellow-400' },
  REJECTED: { bg: 'bg-red-100 dark:bg-red-500/10', text: 'text-red-600 dark:text-red-400' },
}

const statusLabels: Record<string, string> = {
  PENDING: 'En attente',
  REVIEWING: 'En correction',
  APPROVED: 'Validé',
  REVISION: 'À réviser',
  REJECTED: 'Refusé',
}

export default function ChallengesPage() {
  const [selectedPole, setSelectedPole] = useState<string | null>(null)
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'available' | 'submissions'>('available')
  
  const [challenges, setChallenges] = useState<Challenge[]>([])
  const [mySubmissions, setMySubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [submitDescription, setSubmitDescription] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [challengesRes, submissionsRes] = await Promise.all([
        fetch('/api/challenges'),
        fetch('/api/challenges/submit')
      ])

      if (challengesRes.ok) {
        setChallenges(await challengesRes.json())
      }
      if (submissionsRes.ok) {
        setMySubmissions(await submissionsRes.json())
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!selectedChallenge) return

    setSubmitting(true)
    setMessage(null)

    try {
      const res = await fetch('/api/challenges/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          challengeId: selectedChallenge.id,
          description: submitDescription
        })
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: 'Travail soumis avec succès !' })
        setShowSubmitModal(false)
        setSubmitDescription('')
        fetchData()
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la soumission' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Erreur de connexion' })
    } finally {
      setSubmitting(false)
    }
  }

  const filteredChallenges = selectedPole 
    ? challenges.filter(c => c.pole === selectedPole)
    : challenges

  const getDaysRemaining = (deadline: string | null) => {
    if (!deadline) return 'Pas de deadline'
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return days > 0 ? `${days} jours` : 'Terminé'
  }

  if (loading) {
    return (
      <>
        <Header title="Défis Hebdomadaires" subtitle="Chargement..." />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 text-africrea-green-500 animate-spin" />
        </div>
      </>
    )
  }

  return (
    <>
      <Header 
        title="Défis Hebdomadaires" 
        subtitle="Relevez des défis et améliorez vos compétences"
      />
      
      <div className="p-4 md:p-8">
        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-green-100 dark:bg-green-500/10 border border-green-300 dark:border-green-500/30 text-green-700 dark:text-green-400'
                : 'bg-red-100 dark:bg-red-500/10 border border-red-300 dark:border-red-500/30 text-red-700 dark:text-red-400'
            }`}
          >
            {message.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
            <button onClick={() => setMessage(null)} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'available'
                ? 'bg-africrea-green-500 text-white'
                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/10'
            }`}
          >
            <Trophy className="w-5 h-5 inline-block mr-2" />
            Défis ({challenges.length})
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-4 md:px-6 py-2.5 md:py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'submissions'
                ? 'bg-africrea-green-500 text-white'
                : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/10'
            }`}
          >
            <Upload className="w-5 h-5 inline-block mr-2" />
            Mes soumissions ({mySubmissions.length})
          </button>
        </div>

        {activeTab === 'available' ? (
          <>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <div className="flex items-center gap-2 text-gray-500 dark:text-white/60">
                <Filter className="w-5 h-5" />
                <span>Filtrer:</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={() => setSelectedPole(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    !selectedPole
                      ? 'bg-africrea-green-500 text-white'
                      : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/10'
                  }`}
                >
                  Tous
                </button>
                {Object.entries(poleColors).map(([pole, colors]) => {
                  const Icon = poleIcons[pole]
                  return (
                    <button
                      key={pole}
                      onClick={() => setSelectedPole(pole)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all duration-300 ${
                        selectedPole === pole
                          ? `${colors.bg} ${colors.text} border ${colors.border}`
                          : 'bg-gray-100 dark:bg-white/5 text-gray-600 dark:text-white/60 hover:bg-gray-200 dark:hover:bg-white/10'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {pole.replace('_', ' ')}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Challenges Grid */}
            {filteredChallenges.length === 0 ? (
              <div className="text-center py-16">
                <Trophy className="w-16 h-16 text-gray-300 dark:text-white/20 mx-auto mb-4" />
                <h3 className="text-gray-500 dark:text-white/60 text-lg">Aucun défi disponible</h3>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredChallenges.map((challenge) => {
                  const Icon = poleIcons[challenge.pole] || Trophy
                  const poleColor = poleColors[challenge.pole] || poleColors.GRAPHISME
                  const diffColor = difficultyColors[challenge.difficulty] || difficultyColors.BEGINNER
                  
                  return (
                    <motion.div
                      key={challenge.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -4 }}
                      className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/5 rounded-2xl overflow-hidden hover:border-africrea-green-500/30 transition-all duration-300 cursor-pointer group"
                      onClick={() => setSelectedChallenge(challenge)}
                    >
                      {/* Thumbnail */}
                      <div className="relative h-40 overflow-hidden bg-gradient-to-br from-africrea-green-500/20 to-africrea-gold-500/20">
                        {challenge.thumbnail ? (
                          <img 
                            src={challenge.thumbnail} 
                            alt={challenge.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Icon className="w-16 h-16 text-gray-300 dark:text-white/20" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        
                        <div className={`absolute top-3 right-3 p-2 rounded-lg ${poleColor.bg}`}>
                          <Icon className={`w-5 h-5 ${poleColor.text}`} />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-5">
                        <h3 className="text-gray-900 dark:text-white font-semibold text-lg mb-2 group-hover:text-africrea-green-500 dark:group-hover:text-africrea-green-400 transition-colors">
                          {challenge.title}
                        </h3>
                        <p className="text-gray-500 dark:text-white/50 text-sm mb-4 line-clamp-2">
                          {challenge.description}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className={`px-3 py-1 rounded-lg text-xs font-medium ${diffColor.bg} ${diffColor.text}`}>
                            {difficultyLabels[challenge.difficulty] || challenge.difficulty}
                          </span>
                          <div className="flex items-center gap-2 text-gray-400 dark:text-white/40 text-sm">
                            <Clock className="w-4 h-4" />
                            {getDaysRemaining(challenge.deadline)}
                          </div>
                        </div>
                        
                        <div className="mt-3 text-gray-400 dark:text-white/30 text-sm">
                          {challenge._count?.submissions || 0} soumission(s)
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </>
        ) : (
          /* Submissions List */
          <div className="space-y-4">
            {mySubmissions.length === 0 ? (
              <div className="text-center py-16">
                <Upload className="w-16 h-16 text-gray-300 dark:text-white/20 mx-auto mb-4" />
                <h3 className="text-gray-500 dark:text-white/60 text-lg">Aucune soumission</h3>
                <p className="text-gray-400 dark:text-white/40 mt-2">Participez à un défi pour voir vos travaux ici</p>
              </div>
            ) : (
              mySubmissions.map((submission) => {
                const statusColor = statusColors[submission.status] || statusColors.PENDING
                return (
                  <motion.div
                    key={submission.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 md:p-6 bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/5 rounded-2xl hover:border-africrea-green-500/30 transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
                      <h3 className="text-gray-900 dark:text-white font-semibold text-lg">{submission.challenge.title}</h3>
                      <span className={`px-3 py-1.5 rounded-lg text-sm font-medium w-fit ${statusColor.bg} ${statusColor.text}`}>
                        {statusLabels[submission.status] || submission.status}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 md:gap-6">
                      <div className="text-gray-500 dark:text-white/40 text-sm">
                        Soumis le {new Date(submission.submittedAt).toLocaleDateString('fr-FR')}
                      </div>
                      
                      {submission.grade !== null && (
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-africrea-gold-500" />
                          <span className="text-gray-900 dark:text-white font-bold text-xl">{submission.grade}/100</span>
                        </div>
                      )}
                    </div>
                    
                    {submission.feedback && submission.feedback.length > 0 && (
                      <div className="mt-4 p-4 bg-africrea-green-50 dark:bg-africrea-green-500/10 border border-africrea-green-200 dark:border-africrea-green-500/20 rounded-xl">
                        <div className="flex items-center gap-2 text-africrea-green-600 dark:text-africrea-green-400 mb-2">
                          <MessageSquare className="w-4 h-4" />
                          <span className="font-medium">Feedback de {submission.feedback[0].trainer.firstName}</span>
                        </div>
                        <p className="text-gray-700 dark:text-white/70">{submission.feedback[0].content}</p>
                      </div>
                    )}
                  </motion.div>
                )
              })
            )}
          </div>
        )}
      </div>

      {/* Challenge Detail Modal */}
      <AnimatePresence>
        {selectedChallenge && !showSubmitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedChallenge(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 rounded-3xl overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative h-48 bg-gradient-to-br from-africrea-green-500/20 to-africrea-gold-500/20">
                {selectedChallenge.thumbnail ? (
                  <img 
                    src={selectedChallenge.thumbnail} 
                    alt={selectedChallenge.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Trophy className="w-20 h-20 text-gray-300 dark:text-white/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#141414] to-transparent" />
                <button
                  onClick={() => setSelectedChallenge(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 md:p-8 -mt-8 relative">
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium ${(poleColors[selectedChallenge.pole] || poleColors.GRAPHISME).bg} ${(poleColors[selectedChallenge.pole] || poleColors.GRAPHISME).text}`}>
                    {selectedChallenge.pole.replace('_', ' ')}
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium ${(difficultyColors[selectedChallenge.difficulty] || difficultyColors.BEGINNER).bg} ${(difficultyColors[selectedChallenge.difficulty] || difficultyColors.BEGINNER).text}`}>
                    {difficultyLabels[selectedChallenge.difficulty] || selectedChallenge.difficulty}
                  </span>
                </div>
                
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-4">{selectedChallenge.title}</h2>
                
                <div className="mb-6">
                  <h4 className="text-gray-500 dark:text-white/60 text-sm font-medium mb-2">Brief créatif</h4>
                  <p className="text-gray-700 dark:text-white/80 leading-relaxed">{selectedChallenge.brief || selectedChallenge.description}</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-8 text-gray-500 dark:text-white/50">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>Deadline: {selectedChallenge.deadline ? new Date(selectedChallenge.deadline).toLocaleDateString('fr-FR') : 'Pas de deadline'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    <span>{selectedChallenge._count?.submissions || 0} soumissions</span>
                  </div>
                </div>
                
                <button
                  onClick={() => setShowSubmitModal(true)}
                  className="w-full py-4 bg-africrea-green-500 hover:bg-africrea-green-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Soumettre mon travail
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Work Modal */}
      <AnimatePresence>
        {showSubmitModal && selectedChallenge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 dark:bg-black/80 backdrop-blur-sm"
            onClick={() => setShowSubmitModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 rounded-3xl p-6 md:p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2">Soumettre mon travail</h2>
              <p className="text-gray-500 dark:text-white/50 mb-6">Pour : {selectedChallenge.title}</p>
              
              <div className="space-y-6">
                {/* File Upload */}
                <div>
                  <label className="block text-gray-700 dark:text-white/70 text-sm font-medium mb-2">
                    Fichiers
                  </label>
                  <div className="border-2 border-dashed border-gray-300 dark:border-white/20 rounded-xl p-8 text-center hover:border-africrea-green-500/50 transition-colors cursor-pointer">
                    <Upload className="w-10 h-10 text-gray-400 dark:text-white/40 mx-auto mb-3" />
                    <p className="text-gray-600 dark:text-white/60">Glissez vos fichiers ici</p>
                    <p className="text-gray-400 dark:text-white/40 text-sm mt-1">ou cliquez pour parcourir</p>
                    <p className="text-gray-300 dark:text-white/30 text-xs mt-3">PNG, JPG, PDF, MP4, ZIP jusqu&apos;à 100MB</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-700 dark:text-white/70 text-sm font-medium mb-2">
                    Description (optionnel)
                  </label>
                  <textarea
                    rows={3}
                    value={submitDescription}
                    onChange={(e) => setSubmitDescription(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/40 focus:outline-none focus:border-africrea-green-500 resize-none"
                    placeholder="Décrivez votre travail, les choix créatifs..."
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setShowSubmitModal(false)
                      setSubmitDescription('')
                    }}
                    className="flex-1 py-3 bg-gray-100 dark:bg-white/10 hover:bg-gray-200 dark:hover:bg-white/20 text-gray-700 dark:text-white font-medium rounded-xl transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex-1 py-3 bg-africrea-green-500 hover:bg-africrea-green-600 disabled:bg-africrea-green-500/50 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      'Envoyer'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
