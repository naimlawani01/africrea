'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/dashboard/Header'
import { 
  Trophy, 
  Clock, 
  Filter, 
  Plus,
  ChevronRight,
  Palette,
  Box,
  Film,
  Upload,
  Star,
  MessageSquare,
  X
} from 'lucide-react'

// Mock data
const challenges = [
  {
    id: '1',
    title: 'Identité Visuelle - Startup Tech',
    description: 'Créez une identité visuelle complète pour une startup technologique spécialisée dans l\'IA.',
    brief: 'La startup "NeuraTech" recherche une identité moderne et futuriste. Vous devez créer : un logo, une palette de couleurs, et une carte de visite.',
    pole: 'GRAPHISME',
    difficulty: 'INTERMEDIATE',
    deadline: '2024-01-25',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400',
    submissions: 12,
    isNew: true,
  },
  {
    id: '2',
    title: 'Animation de Personnage 3D',
    description: 'Animez un personnage 3D dans une séquence de marche et de course réaliste.',
    brief: 'Utilisez le rig fourni pour créer une animation de 10 secondes montrant une transition fluide entre la marche et la course.',
    pole: 'ANIMATION_3D',
    difficulty: 'ADVANCED',
    deadline: '2024-01-28',
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
    submissions: 8,
    isNew: false,
  },
  {
    id: '3',
    title: 'Court-métrage - La Rencontre',
    description: 'Réalisez un court-métrage de 3 minutes sur le thème de la rencontre inattendue.',
    brief: 'Écrivez le scénario, créez le storyboard, et tournez une scène clé. Format : 16:9, qualité minimale 1080p.',
    pole: 'AUDIOVISUEL',
    difficulty: 'EXPERT',
    deadline: '2024-02-05',
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400',
    submissions: 5,
    isNew: true,
  },
  {
    id: '4',
    title: 'Affiche de Concert',
    description: 'Créez une affiche promotionnelle pour un festival de musique afro-jazz.',
    brief: 'L\'affiche doit refléter l\'énergie du jazz africain avec des éléments visuels dynamiques. Format A3, print-ready.',
    pole: 'GRAPHISME',
    difficulty: 'BEGINNER',
    deadline: '2024-01-22',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
    submissions: 18,
    isNew: false,
  },
]

const mySubmissions = [
  {
    id: 's1',
    challengeId: '1',
    challengeTitle: 'Identité Visuelle - Startup Tech',
    status: 'REVIEWING',
    submittedAt: '2024-01-18',
    grade: null,
    feedback: null,
  },
  {
    id: 's2',
    challengeId: '4',
    challengeTitle: 'Affiche de Concert',
    status: 'APPROVED',
    submittedAt: '2024-01-15',
    grade: 88,
    feedback: 'Excellent travail sur les couleurs ! La composition est dynamique.',
  },
]

const poleIcons: Record<string, React.ElementType> = {
  GRAPHISME: Palette,
  ANIMATION_3D: Box,
  AUDIOVISUEL: Film,
}

const poleColors: Record<string, { bg: string; text: string; border: string }> = {
  GRAPHISME: { bg: 'bg-purple-500/10', text: 'text-purple-400', border: 'border-purple-500/30' },
  ANIMATION_3D: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/30' },
  AUDIOVISUEL: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
}

const difficultyColors: Record<string, { bg: string; text: string }> = {
  BEGINNER: { bg: 'bg-green-500/10', text: 'text-green-400' },
  INTERMEDIATE: { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
  ADVANCED: { bg: 'bg-orange-500/10', text: 'text-orange-400' },
  EXPERT: { bg: 'bg-red-500/10', text: 'text-red-400' },
}

const difficultyLabels: Record<string, string> = {
  BEGINNER: 'Débutant',
  INTERMEDIATE: 'Intermédiaire',
  ADVANCED: 'Avancé',
  EXPERT: 'Expert',
}

const statusColors: Record<string, { bg: string; text: string }> = {
  PENDING: { bg: 'bg-gray-500/10', text: 'text-gray-400' },
  REVIEWING: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  APPROVED: { bg: 'bg-green-500/10', text: 'text-green-400' },
  REVISION: { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
  REJECTED: { bg: 'bg-red-500/10', text: 'text-red-400' },
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
  const [selectedChallenge, setSelectedChallenge] = useState<typeof challenges[0] | null>(null)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [activeTab, setActiveTab] = useState<'available' | 'submissions'>('available')

  const filteredChallenges = selectedPole 
    ? challenges.filter(c => c.pole === selectedPole)
    : challenges

  const getDaysRemaining = (deadline: string) => {
    const days = Math.ceil((new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    return days > 0 ? `${days} jours` : 'Terminé'
  }

  return (
    <>
      <Header 
        title="Défis Hebdomadaires" 
        subtitle="Relevez des défis et améliorez vos compétences"
      />
      
      <div className="p-8">
        {/* Tabs */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('available')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'available'
                ? 'bg-africrea-green-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <Trophy className="w-5 h-5 inline-block mr-2" />
            Défis disponibles
          </button>
          <button
            onClick={() => setActiveTab('submissions')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'submissions'
                ? 'bg-africrea-green-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <Upload className="w-5 h-5 inline-block mr-2" />
            Mes soumissions
          </button>
        </div>

        {activeTab === 'available' ? (
          <>
            {/* Filters */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center gap-2 text-white/60">
                <Filter className="w-5 h-5" />
                <span>Filtrer par pôle:</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedPole(null)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    !selectedPole
                      ? 'bg-africrea-green-500 text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
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
                          : 'bg-white/5 text-white/60 hover:bg-white/10'
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredChallenges.map((challenge) => {
                const Icon = poleIcons[challenge.pole]
                const poleColor = poleColors[challenge.pole]
                const diffColor = difficultyColors[challenge.difficulty]
                
                return (
                  <motion.div
                    key={challenge.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -4 }}
                    className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden hover:border-africrea-green-500/30 transition-all duration-300 cursor-pointer group"
                    onClick={() => setSelectedChallenge(challenge)}
                  >
                    {/* Thumbnail */}
                    <div className="relative h-40 overflow-hidden">
                      <img 
                        src={challenge.thumbnail} 
                        alt={challenge.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      {challenge.isNew && (
                        <div className="absolute top-3 left-3 px-3 py-1 bg-africrea-green-500 text-white text-xs font-semibold rounded-full">
                          Nouveau
                        </div>
                      )}
                      
                      <div className={`absolute top-3 right-3 p-2 rounded-lg ${poleColor.bg}`}>
                        <Icon className={`w-5 h-5 ${poleColor.text}`} />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-white font-semibold text-lg mb-2 group-hover:text-africrea-green-400 transition-colors">
                        {challenge.title}
                      </h3>
                      <p className="text-white/50 text-sm mb-4 line-clamp-2">
                        {challenge.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium ${diffColor.bg} ${diffColor.text}`}>
                          {difficultyLabels[challenge.difficulty]}
                        </span>
                        <div className="flex items-center gap-2 text-white/40 text-sm">
                          <Clock className="w-4 h-4" />
                          {getDaysRemaining(challenge.deadline)}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </>
        ) : (
          /* Submissions List */
          <div className="space-y-4">
            {mySubmissions.length === 0 ? (
              <div className="text-center py-16">
                <Upload className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-white/60 text-lg">Aucune soumission</h3>
                <p className="text-white/40 mt-2">Participez à un défi pour voir vos travaux ici</p>
              </div>
            ) : (
              mySubmissions.map((submission) => {
                const statusColor = statusColors[submission.status]
                return (
                  <motion.div
                    key={submission.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-[#141414] border border-white/5 rounded-2xl hover:border-africrea-green-500/30 transition-all duration-300"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold text-lg">{submission.challengeTitle}</h3>
                      <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${statusColor.bg} ${statusColor.text}`}>
                        {statusLabels[submission.status]}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-white/40 text-sm">
                        Soumis le {new Date(submission.submittedAt).toLocaleDateString('fr-FR')}
                      </div>
                      
                      {submission.grade && (
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-africrea-gold-500" />
                          <span className="text-white font-bold text-xl">{submission.grade}/100</span>
                        </div>
                      )}
                    </div>
                    
                    {submission.feedback && (
                      <div className="mt-4 p-4 bg-africrea-green-500/10 border border-africrea-green-500/20 rounded-xl">
                        <div className="flex items-center gap-2 text-africrea-green-400 mb-2">
                          <MessageSquare className="w-4 h-4" />
                          <span className="font-medium">Feedback</span>
                        </div>
                        <p className="text-white/70">{submission.feedback}</p>
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
        {selectedChallenge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedChallenge(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-2xl bg-[#141414] border border-white/10 rounded-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header Image */}
              <div className="relative h-48">
                <img 
                  src={selectedChallenge.thumbnail} 
                  alt={selectedChallenge.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] to-transparent" />
                <button
                  onClick={() => setSelectedChallenge(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-8 -mt-8 relative">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium ${poleColors[selectedChallenge.pole].bg} ${poleColors[selectedChallenge.pole].text}`}>
                    {selectedChallenge.pole.replace('_', ' ')}
                  </span>
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium ${difficultyColors[selectedChallenge.difficulty].bg} ${difficultyColors[selectedChallenge.difficulty].text}`}>
                    {difficultyLabels[selectedChallenge.difficulty]}
                  </span>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-4">{selectedChallenge.title}</h2>
                
                <div className="mb-6">
                  <h4 className="text-white/60 text-sm font-medium mb-2">Brief créatif</h4>
                  <p className="text-white/80 leading-relaxed">{selectedChallenge.brief}</p>
                </div>
                
                <div className="flex items-center gap-6 mb-8 text-white/50">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    <span>Deadline: {new Date(selectedChallenge.deadline).toLocaleDateString('fr-FR')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Upload className="w-5 h-5" />
                    <span>{selectedChallenge.submissions} soumissions</span>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setSelectedChallenge(null)
                    setShowSubmitModal(true)
                  }}
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
        {showSubmitModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowSubmitModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#141414] border border-white/10 rounded-3xl p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white mb-6">Soumettre mon travail</h2>
              
              <div className="space-y-6">
                {/* File Upload */}
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Fichiers
                  </label>
                  <div className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-africrea-green-500/50 transition-colors cursor-pointer">
                    <Upload className="w-10 h-10 text-white/40 mx-auto mb-3" />
                    <p className="text-white/60">Glissez vos fichiers ici</p>
                    <p className="text-white/40 text-sm mt-1">ou cliquez pour parcourir</p>
                    <p className="text-white/30 text-xs mt-3">PNG, JPG, PDF, MP4, ZIP jusqu&apos;à 100MB</p>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Description (optionnel)
                  </label>
                  <textarea
                    rows={3}
                    className="input-field resize-none"
                    placeholder="Décrivez votre travail, les choix créatifs..."
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowSubmitModal(false)}
                    className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    className="flex-1 py-3 bg-africrea-green-500 hover:bg-africrea-green-600 text-white font-medium rounded-xl transition-colors"
                  >
                    Envoyer
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

