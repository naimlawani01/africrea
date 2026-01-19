'use client'

import { motion } from 'framer-motion'
import Header from '@/components/dashboard/Header'
import { 
  Trophy, 
  FolderOpen, 
  Calendar, 
  TrendingUp,
  Clock,
  ChevronRight,
  Star,
  Palette,
  Box,
  Film
} from 'lucide-react'
import Link from 'next/link'

const stats = [
  { 
    label: 'Défis complétés', 
    value: '12', 
    change: '+3 ce mois',
    icon: Trophy, 
    color: 'from-africrea-green-500 to-emerald-500' 
  },
  { 
    label: 'Portfolio', 
    value: '8 projets', 
    change: '+2 validés',
    icon: FolderOpen, 
    color: 'from-africrea-gold-500 to-amber-500' 
  },
  { 
    label: 'Prochaine Masterclass', 
    value: '3 jours', 
    change: 'Design UI',
    icon: Calendar, 
    color: 'from-purple-500 to-pink-500' 
  },
  { 
    label: 'Progression', 
    value: '78%', 
    change: '+12% ce mois',
    icon: TrendingUp, 
    color: 'from-blue-500 to-cyan-500' 
  },
]

const recentChallenges = [
  { 
    id: 1, 
    title: 'Identité Visuelle Restaurant', 
    pole: 'GRAPHISME',
    status: 'completed', 
    grade: 92,
    deadline: 'Terminé'
  },
  { 
    id: 2, 
    title: 'Animation Logo 3D', 
    pole: 'ANIMATION_3D',
    status: 'pending', 
    deadline: '3 jours restants'
  },
  { 
    id: 3, 
    title: 'Court-métrage - Storyboard', 
    pole: 'AUDIOVISUEL',
    status: 'reviewing', 
    deadline: 'En correction'
  },
]

const upcomingEvents = [
  { 
    id: 1, 
    title: 'Masterclass Design UI', 
    date: '22 Jan 2024',
    time: '14:00',
    type: 'masterclass'
  },
  { 
    id: 2, 
    title: 'Atelier Blender', 
    date: '25 Jan 2024',
    time: '10:00',
    type: 'workshop'
  },
  { 
    id: 3, 
    title: 'Tournage Pub Locale', 
    date: '28 Jan 2024',
    time: '08:00',
    type: 'project'
  },
]

const poleIcons: Record<string, React.ElementType> = {
  GRAPHISME: Palette,
  ANIMATION_3D: Box,
  AUDIOVISUEL: Film,
}

const poleColors: Record<string, string> = {
  GRAPHISME: 'bg-purple-500/20 text-purple-400',
  ANIMATION_3D: 'bg-blue-500/20 text-blue-400',
  AUDIOVISUEL: 'bg-orange-500/20 text-orange-400',
}

const statusColors: Record<string, string> = {
  completed: 'bg-green-500/20 text-green-400',
  pending: 'bg-yellow-500/20 text-yellow-400',
  reviewing: 'bg-blue-500/20 text-blue-400',
}

const statusLabels: Record<string, string> = {
  completed: 'Terminé',
  pending: 'En cours',
  reviewing: 'En correction',
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default function DashboardPage() {
  return (
    <>
      <Header 
        title="Tableau de bord" 
        subtitle="Bienvenue ! Voici un résumé de votre activité"
      />
      
      <motion.div 
        className="p-8"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Stats Grid */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div 
              key={stat.label}
              className="p-6 bg-[#141414] border border-white/5 rounded-2xl hover:border-white/10 transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
                <span className="text-africrea-green-400 text-sm font-medium">{stat.change}</span>
              </div>
              <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
              <div className="text-white/50">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Challenges */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Défis récents</h2>
              <Link 
                href="/dashboard/challenges"
                className="text-africrea-green-400 hover:text-africrea-green-300 text-sm font-medium flex items-center gap-1"
              >
                Voir tout <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {recentChallenges.map((challenge) => {
                const PoleIcon = poleIcons[challenge.pole] || Palette
                return (
                  <motion.div
                    key={challenge.id}
                    whileHover={{ x: 4 }}
                    className="p-5 bg-[#141414] border border-white/5 rounded-2xl hover:border-africrea-green-500/30 transition-all duration-300 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl ${poleColors[challenge.pole]} flex items-center justify-center`}>
                        <PoleIcon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-white font-semibold">{challenge.title}</h3>
                        <div className="flex items-center gap-3 mt-1">
                          <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${statusColors[challenge.status]}`}>
                            {statusLabels[challenge.status]}
                          </span>
                          <span className="text-white/40 text-sm flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {challenge.deadline}
                          </span>
                        </div>
                      </div>
                      {challenge.grade && (
                        <div className="flex items-center gap-2">
                          <Star className="w-5 h-5 text-africrea-gold-500" />
                          <span className="text-2xl font-bold text-white">{challenge.grade}</span>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Upcoming Events */}
          <motion.div variants={itemVariants}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">À venir</h2>
              <Link 
                href="/dashboard/events"
                className="text-africrea-green-400 hover:text-africrea-green-300 text-sm font-medium flex items-center gap-1"
              >
                Calendrier <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            
            <div className="space-y-4">
              {upcomingEvents.map((event) => (
                <motion.div
                  key={event.id}
                  whileHover={{ scale: 1.02 }}
                  className="p-4 bg-[#141414] border border-white/5 rounded-xl hover:border-africrea-green-500/30 transition-all duration-300 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-xl bg-africrea-green-500/10 flex flex-col items-center justify-center">
                      <span className="text-africrea-green-400 text-xs font-medium">
                        {event.date.split(' ')[0]}
                      </span>
                      <span className="text-white font-bold text-lg">
                        {event.date.split(' ')[1]}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-white font-medium">{event.title}</h4>
                      <p className="text-white/40 text-sm">{event.time}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-8 p-6 bg-gradient-to-br from-africrea-green-500/10 to-transparent border border-africrea-green-500/20 rounded-2xl">
              <h3 className="text-white font-semibold mb-4">Actions rapides</h3>
              <div className="space-y-3">
                <Link
                  href="/dashboard/challenges"
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <Trophy className="w-5 h-5 text-africrea-green-400" />
                  <span className="text-white/80">Voir les nouveaux défis</span>
                </Link>
                <Link
                  href="/dashboard/equipment"
                  className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors"
                >
                  <Calendar className="w-5 h-5 text-africrea-gold-400" />
                  <span className="text-white/80">Réserver du matériel</span>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </>
  )
}

