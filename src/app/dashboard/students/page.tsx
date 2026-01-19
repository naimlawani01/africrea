'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/dashboard/Header'
import { 
  Users, 
  Search,
  Filter,
  Palette,
  Box,
  Film,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  Mail,
  MessageSquare,
  Eye,
  Award,
  AlertTriangle
} from 'lucide-react'

const students = [
  {
    id: '1',
    firstName: 'Aminata',
    lastName: 'Koné',
    email: 'aminata.kone@email.com',
    pole: 'GRAPHISME',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
    joinedAt: '2023-09-01',
    challengesCompleted: 12,
    avgGrade: 88,
    progression: 'UP',
    readyForMasterclass: true,
    lastActive: '2024-01-18',
  },
  {
    id: '2',
    firstName: 'Jean-Marc',
    lastName: 'Dupont',
    email: 'jm.dupont@email.com',
    pole: 'ANIMATION_3D',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    joinedAt: '2023-10-15',
    challengesCompleted: 8,
    avgGrade: 75,
    progression: 'STABLE',
    readyForMasterclass: false,
    lastActive: '2024-01-17',
  },
  {
    id: '3',
    firstName: 'Sophie',
    lastName: 'Mensah',
    email: 'sophie.m@email.com',
    pole: 'AUDIOVISUEL',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
    joinedAt: '2023-08-20',
    challengesCompleted: 15,
    avgGrade: 92,
    progression: 'UP',
    readyForMasterclass: true,
    lastActive: '2024-01-18',
  },
  {
    id: '4',
    firstName: 'Paul',
    lastName: 'Touré',
    email: 'paul.toure@email.com',
    pole: 'GRAPHISME',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100',
    joinedAt: '2023-11-01',
    challengesCompleted: 5,
    avgGrade: 65,
    progression: 'DOWN',
    readyForMasterclass: false,
    needsAttention: true,
    lastActive: '2024-01-10',
  },
  {
    id: '5',
    firstName: 'Marie',
    lastName: 'Diallo',
    email: 'marie.diallo@email.com',
    pole: 'ANIMATION_3D',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
    joinedAt: '2023-09-15',
    challengesCompleted: 10,
    avgGrade: 82,
    progression: 'UP',
    readyForMasterclass: false,
    lastActive: '2024-01-16',
  },
  {
    id: '6',
    firstName: 'Kouamé',
    lastName: 'Assi',
    email: 'kouame.assi@email.com',
    pole: 'AUDIOVISUEL',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
    joinedAt: '2023-12-01',
    challengesCompleted: 3,
    avgGrade: 78,
    progression: 'STABLE',
    readyForMasterclass: false,
    lastActive: '2024-01-18',
  },
]

const poleConfig: Record<string, { label: string; bg: string; text: string; icon: React.ElementType }> = {
  GRAPHISME: { label: 'Graphisme', bg: 'bg-purple-500/10', text: 'text-purple-400', icon: Palette },
  ANIMATION_3D: { label: 'Animation 3D', bg: 'bg-blue-500/10', text: 'text-blue-400', icon: Box },
  AUDIOVISUEL: { label: 'Audiovisuel', bg: 'bg-orange-500/10', text: 'text-orange-400', icon: Film },
}

const progressionConfig: Record<string, { icon: React.ElementType; color: string; label: string }> = {
  UP: { icon: TrendingUp, color: 'text-green-400', label: 'En progression' },
  DOWN: { icon: TrendingDown, color: 'text-red-400', label: 'En difficulté' },
  STABLE: { icon: Minus, color: 'text-yellow-400', label: 'Stable' },
}

export default function StudentsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPole, setSelectedPole] = useState<string | null>(null)
  const [showMasterclassReady, setShowMasterclassReady] = useState(false)
  const [showNeedsAttention, setShowNeedsAttention] = useState(false)

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      `${student.firstName} ${student.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesPole = !selectedPole || student.pole === selectedPole
    const matchesMasterclass = !showMasterclassReady || student.readyForMasterclass
    const matchesAttention = !showNeedsAttention || student.needsAttention
    return matchesSearch && matchesPole && matchesMasterclass && matchesAttention
  })

  const stats = {
    total: students.length,
    byPole: {
      GRAPHISME: students.filter(s => s.pole === 'GRAPHISME').length,
      ANIMATION_3D: students.filter(s => s.pole === 'ANIMATION_3D').length,
      AUDIOVISUEL: students.filter(s => s.pole === 'AUDIOVISUEL').length,
    },
    readyForMasterclass: students.filter(s => s.readyForMasterclass).length,
    needsAttention: students.filter(s => s.needsAttention).length,
  }

  return (
    <>
      <Header 
        title="Gestion des Étudiants" 
        subtitle="Suivez la progression de chaque étudiant"
      />
      
      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="p-5 bg-[#141414] border border-white/5 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Users className="w-5 h-5 text-africrea-green-400" />
              <span className="text-white/50 text-sm">Total</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.total}</div>
          </div>
          
          {Object.entries(poleConfig).map(([pole, config]) => {
            const PoleIcon = config.icon
            return (
              <div key={pole} className="p-5 bg-[#141414] border border-white/5 rounded-2xl">
                <div className="flex items-center gap-3 mb-2">
                  <PoleIcon className={`w-5 h-5 ${config.text}`} />
                  <span className="text-white/50 text-sm">{config.label}</span>
                </div>
                <div className="text-2xl font-bold text-white">
                  {stats.byPole[pole as keyof typeof stats.byPole]}
                </div>
              </div>
            )
          })}
          
          <div className="p-5 bg-[#141414] border border-white/5 rounded-2xl">
            <div className="flex items-center gap-3 mb-2">
              <Award className="w-5 h-5 text-africrea-gold-400" />
              <span className="text-white/50 text-sm">Masterclass</span>
            </div>
            <div className="text-2xl font-bold text-white">{stats.readyForMasterclass}</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Rechercher un étudiant..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-12"
            />
          </div>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-5 h-5 text-white/60" />
            <button
              onClick={() => setSelectedPole(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                !selectedPole
                  ? 'bg-africrea-green-500 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              Tous
            </button>
            {Object.entries(poleConfig).map(([pole, config]) => {
              const PoleIcon = config.icon
              return (
                <button
                  key={pole}
                  onClick={() => setSelectedPole(pole)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                    selectedPole === pole
                      ? `${config.bg} ${config.text}`
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <PoleIcon className="w-4 h-4" />
                  {config.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Quick Filters */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setShowMasterclassReady(!showMasterclassReady)}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
              showMasterclassReady
                ? 'bg-africrea-gold-500/20 text-africrea-gold-400 border border-africrea-gold-500/30'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <Award className="w-4 h-4" />
            Prêts pour Masterclass
          </button>
          <button
            onClick={() => setShowNeedsAttention(!showNeedsAttention)}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
              showNeedsAttention
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <AlertTriangle className="w-4 h-4" />
            Besoin d&apos;attention
          </button>
        </div>

        {/* Students Table */}
        <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left p-4 text-white/50 font-medium">Étudiant</th>
                  <th className="text-left p-4 text-white/50 font-medium">Pôle</th>
                  <th className="text-center p-4 text-white/50 font-medium">Défis</th>
                  <th className="text-center p-4 text-white/50 font-medium">Note moy.</th>
                  <th className="text-center p-4 text-white/50 font-medium">Progression</th>
                  <th className="text-center p-4 text-white/50 font-medium">Statut</th>
                  <th className="text-right p-4 text-white/50 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => {
                  const pole = poleConfig[student.pole]
                  const PoleIcon = pole.icon
                  const progression = progressionConfig[student.progression]
                  const ProgressionIcon = progression.icon
                  
                  return (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={student.avatar}
                            alt={`${student.firstName} ${student.lastName}`}
                            className="w-10 h-10 rounded-full object-cover"
                          />
                          <div>
                            <div className="text-white font-medium">
                              {student.firstName} {student.lastName}
                            </div>
                            <div className="text-white/40 text-sm">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 w-fit ${pole.bg} ${pole.text}`}>
                          <PoleIcon className="w-3.5 h-3.5" />
                          {pole.label}
                        </span>
                      </td>
                      <td className="p-4 text-center text-white">
                        {student.challengesCompleted}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Star className="w-4 h-4 text-africrea-gold-500" />
                          <span className="text-white font-medium">{student.avgGrade}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className={`flex items-center justify-center gap-1 ${progression.color}`}>
                          <ProgressionIcon className="w-4 h-4" />
                          <span className="text-sm">{progression.label}</span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          {student.readyForMasterclass && (
                            <span className="px-2 py-1 bg-africrea-gold-500/20 text-africrea-gold-400 text-xs rounded-lg">
                              Masterclass
                            </span>
                          )}
                          {student.needsAttention && (
                            <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-lg flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              Attention
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                            <Eye className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                            <MessageSquare className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-lg hover:bg-white/10 text-white/40 hover:text-white transition-colors">
                            <Mail className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          
          {filteredStudents.length === 0 && (
            <div className="text-center py-16">
              <Users className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-white/60 text-lg">Aucun étudiant trouvé</h3>
              <p className="text-white/40 mt-2">Essayez avec d&apos;autres critères de recherche</p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

