'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/dashboard/Header'
import { 
  Users, 
  Trophy, 
  Camera, 
  Calendar,
  TrendingUp,
  Loader2,
  UserCheck,
  GraduationCap,
  Palette,
  Box,
  Film
} from 'lucide-react'

interface Stats {
  totalUsers: number
  totalStudents: number
  totalTrainers: number
  totalChallenges: number
  totalSubmissions: number
  pendingReservations: number
  upcomingEvents: number
  usersByPole: { pole: string; count: number }[]
}

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: string
  pole: string | null
  createdAt: string
  _count: {
    submissions: number
    equipmentReservations: number
    eventRegistrations: number
  }
}

const poleIcons: Record<string, typeof Palette> = {
  GRAPHISME: Palette,
  ANIMATION_3D: Box,
  AUDIOVISUEL: Film,
}

const poleColors: Record<string, string> = {
  GRAPHISME: 'from-purple-500 to-pink-500',
  ANIMATION_3D: 'from-blue-500 to-cyan-500',
  AUDIOVISUEL: 'from-orange-500 to-red-500',
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingUser, setUpdatingUser] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/users')
      ])

      if (statsRes.ok) {
        setStats(await statsRes.json())
      }
      if (usersRes.ok) {
        setUsers(await usersRes.json())
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingUser(userId)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole })
      })

      if (res.ok) {
        fetchData()
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setUpdatingUser(null)
    }
  }

  if (loading) {
    return (
      <>
        <Header title="Administration" subtitle="Chargement..." />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 text-africrea-green-500 animate-spin" />
        </div>
      </>
    )
  }

  return (
    <>
      <Header 
        title="Administration" 
        subtitle="Gérez la plateforme Africréa"
      />
      
      <div className="p-8">
        {/* Stats Grid */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-6 bg-[#141414] border border-white/5 rounded-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-africrea-green-500/10">
                  <Users className="w-6 h-6 text-africrea-green-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{stats.totalUsers}</div>
                  <div className="text-white/50 text-sm">Utilisateurs</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="p-6 bg-[#141414] border border-white/5 rounded-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10">
                  <GraduationCap className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{stats.totalStudents}</div>
                  <div className="text-white/50 text-sm">Étudiants</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 bg-[#141414] border border-white/5 rounded-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-yellow-500/10">
                  <Camera className="w-6 h-6 text-yellow-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{stats.pendingReservations}</div>
                  <div className="text-white/50 text-sm">Résa. en attente</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="p-6 bg-[#141414] border border-white/5 rounded-2xl"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-purple-500/10">
                  <Trophy className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{stats.totalChallenges}</div>
                  <div className="text-white/50 text-sm">Défis actifs</div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Users by Pole */}
        {stats && stats.usersByPole.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Étudiants par Pôle</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {stats.usersByPole.map((pole) => {
                const Icon = poleIcons[pole.pole || ''] || Users
                const gradient = poleColors[pole.pole || ''] || 'from-gray-500 to-gray-600'
                return (
                  <div
                    key={pole.pole}
                    className={`p-6 rounded-2xl bg-gradient-to-br ${gradient} bg-opacity-10`}
                  >
                    <div className="flex items-center gap-4">
                      <Icon className="w-8 h-8 text-white" />
                      <div>
                        <div className="text-2xl font-bold text-white">{pole.count}</div>
                        <div className="text-white/80">{pole.pole?.replace('_', ' ')}</div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Users Management */}
        <div>
          <h2 className="text-xl font-bold text-white mb-4">Gestion des Utilisateurs</h2>
          <div className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left p-4 text-white/50 font-medium">Utilisateur</th>
                  <th className="text-left p-4 text-white/50 font-medium">Email</th>
                  <th className="text-left p-4 text-white/50 font-medium">Rôle</th>
                  <th className="text-left p-4 text-white/50 font-medium">Pôle</th>
                  <th className="text-left p-4 text-white/50 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-africrea-green-500/20 flex items-center justify-center text-africrea-green-400 font-semibold">
                          {user.firstName.charAt(0)}
                        </div>
                        <span className="text-white font-medium">
                          {user.firstName} {user.lastName}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 text-white/60">{user.email}</td>
                    <td className="p-4">
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        disabled={updatingUser === user.id}
                        className="bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-africrea-green-500"
                      >
                        <option value="STUDENT">Étudiant</option>
                        <option value="TRAINER">Formateur</option>
                        <option value="ADMIN">Admin</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.pole 
                          ? 'bg-africrea-green-500/20 text-africrea-green-400' 
                          : 'bg-white/10 text-white/40'
                      }`}>
                        {user.pole?.replace('_', ' ') || 'N/A'}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className="text-white/40 text-sm">
                        {user._count.submissions} travaux
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  )
}

