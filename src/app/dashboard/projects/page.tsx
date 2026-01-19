'use client'

import { useState } from 'react'
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
  Clock,
  Check,
  X,
  ChevronRight
} from 'lucide-react'

const projects = [
  {
    id: '1',
    title: 'Tournage Publicité "Origine"',
    description: 'Tournage d\'une publicité pour une marque de cosmétiques locaux. Recherche de techniciens lumière et assistants caméra.',
    type: 'COMMERCIAL',
    status: 'UPCOMING',
    startDate: '2024-02-01',
    endDate: '2024-02-03',
    location: 'Studio Africréa + Extérieurs',
    maxParticipants: 8,
    currentParticipants: 5,
    requirements: 'Expérience en éclairage studio souhaitée',
    thumbnail: 'https://images.unsplash.com/photo-1522512115668-c09775d6f424?w=400',
    roles: ['Assistant caméra', 'Technicien lumière', 'Perchiste'],
    creator: 'Jean-Marc K.',
  },
  {
    id: '2',
    title: 'Court-métrage "L\'Héritage"',
    description: 'Production d\'un court-métrage de 15 minutes sur le thème de la transmission. Équipe complète recherchée.',
    type: 'FILM_SHOOTING',
    status: 'IN_PROGRESS',
    startDate: '2024-01-15',
    endDate: '2024-02-15',
    location: 'Village de Bingerville',
    maxParticipants: 12,
    currentParticipants: 10,
    requirements: 'Disponibilité les week-ends',
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400',
    roles: ['Chef électro', 'Script', 'Régisseur'],
    creator: 'Aminata D.',
  },
  {
    id: '3',
    title: 'Shooting Photo Collection Mode',
    description: 'Séance photo pour une collection de mode africaine contemporaine. Photographes et stylistes bienvenus.',
    type: 'PHOTO_SHOOT',
    status: 'UPCOMING',
    startDate: '2024-02-10',
    endDate: '2024-02-10',
    location: 'Plateau, Abidjan',
    maxParticipants: 6,
    currentParticipants: 3,
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400',
    roles: ['Photographe assistant', 'Styliste', 'Retoucheur'],
    creator: 'Marie L.',
  },
  {
    id: '4',
    title: 'Post-Production Documentaire',
    description: 'Montage et étalonnage d\'un documentaire sur l\'artisanat ivoirien. Recherche monteurs et coloristes.',
    type: 'POST_PRODUCTION',
    status: 'IN_PROGRESS',
    startDate: '2024-01-20',
    endDate: '2024-03-01',
    location: 'Studio Post-Prod Africréa',
    maxParticipants: 4,
    currentParticipants: 2,
    requirements: 'Maîtrise de DaVinci Resolve ou Premiere Pro',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400',
    roles: ['Monteur', 'Coloriste'],
    creator: 'Paul T.',
  },
  {
    id: '5',
    title: 'Captation Live - Concert Jazz',
    description: 'Captation multicaméra d\'un concert de jazz. Expérience en live souhaitée.',
    type: 'LIVE_EVENT',
    status: 'UPCOMING',
    startDate: '2024-02-20',
    endDate: '2024-02-20',
    location: 'Institut Français, Plateau',
    maxParticipants: 10,
    currentParticipants: 6,
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
    roles: ['Cadreur', 'Réalisateur plateau', 'Ingé son'],
    creator: 'Sophie M.',
  },
]

const myParticipations = [
  { projectId: '2', status: 'APPROVED', role: 'Assistant caméra' },
  { projectId: '5', status: 'PENDING', role: 'Cadreur' },
]

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
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null)
  const [showApplyModal, setShowApplyModal] = useState(false)
  const [selectedRole, setSelectedRole] = useState('')
  const [activeTab, setActiveTab] = useState<'available' | 'participating'>('available')

  const getParticipation = (projectId: string) => {
    return myParticipations.find(p => p.projectId === projectId)
  }

  const participatingProjects = projects.filter(p => 
    myParticipations.some(mp => mp.projectId === p.id)
  )

  return (
    <>
      <Header 
        title="Projets Professionnels" 
        subtitle="Participez à des vrais projets avec des experts"
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
            <Briefcase className="w-5 h-5 inline-block mr-2" />
            Projets disponibles
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
            Mes participations ({myParticipations.length})
          </button>
        </div>

        {activeTab === 'available' ? (
          /* Available Projects */
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {projects.map((project) => {
              const config = typeConfig[project.type]
              const status = statusConfig[project.status]
              const TypeIcon = config.icon
              const participation = getParticipation(project.id)
              
              return (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -4 }}
                  className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden hover:border-africrea-green-500/30 transition-all duration-300"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img 
                      src={project.thumbnail} 
                      alt={project.title}
                      className="w-full h-full object-cover"
                    />
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
                        {new Date(project.startDate).toLocaleDateString('fr-FR')} - {new Date(project.endDate).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {project.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {project.currentParticipants}/{project.maxParticipants} participants
                      </div>
                    </div>

                    {/* Roles needed */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.roles.map((role) => (
                        <span key={role} className="px-2 py-1 bg-white/5 text-white/60 text-xs rounded-md">
                          {role}
                        </span>
                      ))}
                    </div>
                    
                    {participation ? (
                      <div className={`w-full py-3 rounded-xl font-medium text-center ${participationStatusConfig[participation.status].bg} ${participationStatusConfig[participation.status].text}`}>
                        {participation.status === 'APPROVED' ? `Accepté - ${participation.role}` : participationStatusConfig[participation.status].label}
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedProject(project)
                          setShowApplyModal(true)
                        }}
                        disabled={project.currentParticipants >= project.maxParticipants}
                        className={`w-full py-3 rounded-xl font-medium transition-colors ${
                          project.currentParticipants >= project.maxParticipants
                            ? 'bg-white/10 text-white/40 cursor-not-allowed'
                            : 'bg-africrea-green-500 hover:bg-africrea-green-600 text-white'
                        }`}
                      >
                        {project.currentParticipants >= project.maxParticipants ? 'Complet' : 'Postuler'}
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          /* My Participations */
          <div className="space-y-4">
            {participatingProjects.length === 0 ? (
              <div className="text-center py-16">
                <Briefcase className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-white/60 text-lg">Aucune participation</h3>
                <p className="text-white/40 mt-2">Postulez aux projets pour acquérir de l&apos;expérience terrain</p>
              </div>
            ) : (
              participatingProjects.map((project) => {
                const participation = getParticipation(project.id)!
                const pStatus = participationStatusConfig[participation.status]
                
                return (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-[#141414] border border-white/5 rounded-2xl"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold text-lg">{project.title}</h3>
                      <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${pStatus.bg} ${pStatus.text}`}>
                        {pStatus.label}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-white/40">Rôle</span>
                        <p className="text-white">{participation.role}</p>
                      </div>
                      <div>
                        <span className="text-white/40">Dates</span>
                        <p className="text-white">{new Date(project.startDate).toLocaleDateString('fr-FR')} - {new Date(project.endDate).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div>
                        <span className="text-white/40">Lieu</span>
                        <p className="text-white">{project.location}</p>
                      </div>
                      <div>
                        <span className="text-white/40">Responsable</span>
                        <p className="text-white">{project.creator}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
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
                
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Message de motivation (optionnel)
                  </label>
                  <textarea
                    rows={3}
                    className="input-field resize-none"
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
                    disabled={!selectedRole}
                    className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                      selectedRole
                        ? 'bg-africrea-green-500 hover:bg-africrea-green-600 text-white'
                        : 'bg-white/10 text-white/40 cursor-not-allowed'
                    }`}
                  >
                    Envoyer ma candidature
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

