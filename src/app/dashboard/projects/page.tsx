'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/dashboard/Header'
import { 
  Briefcase, 
  Film, 
  Camera,
  Clapperboard,
  Radio,
  ShoppingBag,
  Calendar,
  MapPin,
  Users,
  X,
  Loader2,
  Check,
  AlertCircle
} from 'lucide-react'

interface Project {
  id: string
  title: string
  description: string
  type: string
  status: string
  startDate: string
  endDate: string | null
  location: string
  maxParticipants: number | null
  requirements: string | null
  thumbnail: string | null
  roles: string[]
  creator: {
    firstName: string
    lastName: string
  }
  participants: {
    userId: string
    status: string
    role: string
    user: {
      id: string
      firstName: string
      lastName: string
    }
  }[]
}

const typeConfig: Record<string, { label: string; bg: string; text: string; icon: React.ElementType }> = {
  FILM_SHOOTING: { label: 'Tournage Film', bg: 'bg-purple-500/10', text: 'text-purple-400', icon: Clapperboard },
  PHOTO_SHOOT: { label: 'Shooting Photo', bg: 'bg-pink-500/10', text: 'text-pink-400', icon: Camera },
  POST_PRODUCTION: { label: 'Post-Production', bg: 'bg-blue-500/10', text: 'text-blue-400', icon: Film },
  LIVE_EVENT: { label: 'Événement Live', bg: 'bg-orange-500/10', text: 'text-orange-400', icon: Radio },
  COMMERCIAL: { label: 'Pub / Commercial', bg: 'bg-green-500/10', text: 'text-green-400', icon: ShoppingBag },
}

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  UPCOMING: { label: 'À venir', bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
  IN_PROGRESS: { label: 'En cours', bg: 'bg-blue-500/10', text: 'text-blue-400' },
  COMPLETED: { label: 'Terminé', bg: 'bg-green-500/10', text: 'text-green-400' },
  CANCELLED: { label: 'Annulé', bg: 'bg-red-500/10', text: 'text-red-400' },
}

const participationStatusConfig: Record<string, { label: string; bg: string; text: string }> = {
  PENDING: { label: 'En attente', bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
  APPROVED: { label: 'Accepté', bg: 'bg-green-500/10', text: 'text-green-400' },
  REJECTED: { label: 'Refusé', bg: 'bg-red-500/10', text: 'text-red-400' },
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState('')
  const [activeTab, setActiveTab] = useState<'available' | 'participating'>('available')
  const [applying, setApplying] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/projects')
      if (res.ok) {
        setProjects(await res.json())
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApply = async () => {
    if (!selectedProject || !selectedRole) return

    setApplying(true)
    setMessage(null)

    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: selectedProject.id,
          role: selectedRole
        })
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: 'Candidature envoyée avec succès !' })
        setShowApplyModal(false)
        setSelectedRole('')
        fetchProjects()
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la candidature' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion' })
    } finally {
      setApplying(false)
    }
  }

  const getParticipantCount = (project: Project) => {
    return project.participants?.filter(p => p.status === 'APPROVED').length || 0
  }

  const isFull = (project: Project) => {
    if (!project.maxParticipants) return false
    return getParticipantCount(project) >= project.maxParticipants
  }

  // For now, we'll check if the current user is a participant
  // In a real app, we'd get the user ID from the session
  const getMyParticipation = (project: Project) => {
    // This would need the actual user ID from session
    return project.participants?.find(p => true) // Placeholder - would filter by userId
  }

  if (loading) {
    return (
      <>
        <Header title="Projets Professionnels" subtitle="Chargement..." />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 text-africrea-green-500 animate-spin" />
        </div>
      </>
    )
  }

  return (
    <>
      <Header 
        title="Projets Professionnels" 
        subtitle="Participez à des vrais projets avec des experts"
      />
      
      <div className="p-8">
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
            <Briefcase className="w-5 h-5 inline-block mr-2" />
            Projets disponibles ({projects.length})
          </button>
          <button
            onClick={() => setActiveTab('participating')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'participating'
                ? 'bg-africrea-green-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <Users className="w-5 h-5 inline-block mr-2" />
            Mes participations
          </button>
        </div>

        {activeTab === 'available' ? (
          /* Available Projects */
          projects.length === 0 ? (
            <div className="text-center py-16">
              <Briefcase className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-white/60 text-lg">Aucun projet disponible</h3>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {projects.map((project) => {
                const config = typeConfig[project.type] || typeConfig.FILM_SHOOTING
                const status = statusConfig[project.status] || statusConfig.UPCOMING
                const TypeIcon = config.icon
                const participantCount = getParticipantCount(project)
                const projectIsFull = isFull(project)
                
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ y: -4 }}
                    className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden hover:border-africrea-green-500/30 transition-all duration-300"
                  >
                    <div className="relative h-40 overflow-hidden bg-gradient-to-br from-africrea-green-500/10 to-africrea-gold-500/10">
                      {project.thumbnail ? (
                        <img 
                          src={project.thumbnail} 
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <TypeIcon className="w-16 h-16 text-white/20" />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      <div className="absolute top-3 left-3 flex gap-2">
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 ${config.bg} ${config.text}`}>
                          <TypeIcon className="w-3.5 h-3.5" />
                          {config.label}
                        </span>
                      </div>
                      
                      <div className={`absolute top-3 right-3 px-3 py-1 rounded-lg text-xs font-medium ${status.bg} ${status.text}`}>
                        {status.label}
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-white font-semibold text-lg mb-2">{project.title}</h3>
                      <p className="text-white/50 text-sm mb-4 line-clamp-2">{project.description}</p>
                      
                      <div className="space-y-2 mb-4 text-white/40 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          {new Date(project.startDate).toLocaleDateString('fr-FR')}
                          {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString('fr-FR')}`}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          {project.location}
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          {participantCount}{project.maxParticipants ? `/${project.maxParticipants}` : ''} participants
                        </div>
                      </div>

                      {/* Roles needed */}
                      {project.roles && project.roles.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {project.roles.map((role) => (
                            <span key={role} className="px-2 py-1 bg-white/5 text-white/60 text-xs rounded-md">
                              {role}
                            </span>
                          ))}
                        </div>
                      )}
                      
                      <button
                        onClick={() => {
                          setSelectedProject(project)
                          setShowApplyModal(true)
                        }}
                        disabled={projectIsFull}
                        className={`w-full py-3 rounded-xl font-medium transition-colors ${
                          projectIsFull
                            ? 'bg-white/10 text-white/40 cursor-not-allowed'
                            : 'bg-africrea-green-500 hover:bg-africrea-green-600 text-white'
                        }`}
                      >
                        {projectIsFull ? 'Complet' : 'Postuler'}
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          )
        ) : (
          /* My Participations */
          <div className="space-y-4">
            <div className="text-center py-16">
              <Briefcase className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-white/60 text-lg">Vos participations apparaîtront ici</h3>
              <p className="text-white/40 mt-2">Postulez aux projets pour acquérir de l&apos;expérience terrain</p>
            </div>
          </div>
        )}
      </div>

      {/* Apply Modal */}
      <AnimatePresence>
        {showApplyModal && selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => {
              setShowApplyModal(false)
              setSelectedRole('')
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#141414] border border-white/10 rounded-3xl p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white mb-2">Postuler au projet</h2>
              <p className="text-white/50 mb-6">{selectedProject.title}</p>
              
              <div className="space-y-5">
                {selectedProject.roles && selectedProject.roles.length > 0 ? (
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-3">
                      Choisissez un rôle
                    </label>
                    <div className="space-y-2">
                      {selectedProject.roles.map((role) => (
                        <button
                          key={role}
                          onClick={() => setSelectedRole(role)}
                          className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                            selectedRole === role
                              ? 'border-africrea-green-500 bg-africrea-green-500/10'
                              : 'border-white/10 hover:border-white/20'
                          }`}
                        >
                          <span className={selectedRole === role ? 'text-africrea-green-400' : 'text-white'}>
                            {role}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">
                      Rôle souhaité
                    </label>
                    <input
                      type="text"
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value)}
                      className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-africrea-green-500"
                      placeholder="Décrivez le rôle que vous souhaitez"
                    />
                  </div>
                )}
                
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Message de motivation (optionnel)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-africrea-green-500 resize-none"
                    placeholder="Présentez-vous et expliquez pourquoi ce projet vous intéresse..."
                  />
                </div>

                {selectedProject.requirements && (
                  <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
                    <span className="text-yellow-400 text-sm font-medium">Prérequis :</span>
                    <p className="text-yellow-400/80 text-sm mt-1">{selectedProject.requirements}</p>
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setShowApplyModal(false)
                      setSelectedRole('')
                    }}
                    className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleApply}
                    disabled={!selectedRole || applying}
                    className={`flex-1 py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                      selectedRole && !applying
                        ? 'bg-africrea-green-500 hover:bg-africrea-green-600 text-white'
                        : 'bg-white/10 text-white/40 cursor-not-allowed'
                    }`}
                  >
                    {applying ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      'Envoyer ma candidature'
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
