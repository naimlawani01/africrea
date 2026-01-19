'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  LayoutDashboard,
  Trophy,
  FolderOpen,
  Film,
  Camera,
  Calendar,
  Users,
  Settings,
  LogOut,
  ChevronRight,
  Briefcase,
  ClipboardList,
  PlusCircle,
  Shield,
} from 'lucide-react'

interface SidebarProps {
  user: {
    name: string
    email: string
    role: string
    pole?: string | null
  }
}

const menuItems = [
  { 
    name: 'Tableau de bord', 
    href: '/dashboard', 
    icon: LayoutDashboard,
    roles: ['ADMIN', 'TRAINER', 'STUDENT']
  },
  { 
    name: 'Défis', 
    href: '/dashboard/challenges', 
    icon: Trophy,
    roles: ['ADMIN', 'TRAINER', 'STUDENT']
  },
  { 
    name: 'Créer un Défi', 
    href: '/dashboard/challenges/create', 
    icon: PlusCircle,
    roles: ['ADMIN', 'TRAINER']
  },
  { 
    name: 'Mon Portfolio', 
    href: '/dashboard/portfolio', 
    icon: FolderOpen,
    roles: ['STUDENT']
  },
  { 
    name: 'Vidéothèque', 
    href: '/dashboard/videos', 
    icon: Film,
    roles: ['ADMIN', 'TRAINER', 'STUDENT']
  },
  { 
    name: 'Ajouter Vidéo', 
    href: '/dashboard/videos/create', 
    icon: PlusCircle,
    roles: ['ADMIN', 'TRAINER']
  },
  { 
    name: 'Projets Pro', 
    href: '/dashboard/projects', 
    icon: Briefcase,
    roles: ['ADMIN', 'TRAINER', 'STUDENT']
  },
  { 
    name: 'Créer Projet', 
    href: '/dashboard/projects/create', 
    icon: PlusCircle,
    roles: ['ADMIN', 'TRAINER']
  },
  { 
    name: 'Matériel', 
    href: '/dashboard/equipment', 
    icon: Camera,
    roles: ['ADMIN', 'TRAINER', 'STUDENT']
  },
  { 
    name: 'Réservations', 
    href: '/dashboard/admin/reservations', 
    icon: ClipboardList,
    roles: ['ADMIN', 'TRAINER']
  },
  { 
    name: 'Événements', 
    href: '/dashboard/events', 
    icon: Calendar,
    roles: ['ADMIN', 'TRAINER', 'STUDENT']
  },
  { 
    name: 'Étudiants', 
    href: '/dashboard/students', 
    icon: Users,
    roles: ['ADMIN', 'TRAINER']
  },
  { 
    name: 'Administration', 
    href: '/dashboard/admin', 
    icon: Shield,
    roles: ['ADMIN']
  },
  { 
    name: 'Paramètres', 
    href: '/dashboard/settings', 
    icon: Settings,
    roles: ['ADMIN', 'TRAINER', 'STUDENT']
  },
]

const poleColors: Record<string, string> = {
  GRAPHISME: 'bg-purple-500',
  ANIMATION_3D: 'bg-blue-500',
  AUDIOVISUEL: 'bg-orange-500',
}

const poleNames: Record<string, string> = {
  GRAPHISME: 'Graphisme',
  ANIMATION_3D: 'Animation 3D',
  AUDIOVISUEL: 'Audiovisuel',
}

const roleConfig: Record<string, { label: string; color: string }> = {
  ADMIN: { label: 'Administrateur', color: 'bg-red-500' },
  TRAINER: { label: 'Formateur', color: 'bg-africrea-gold-500' },
  STUDENT: { label: 'Étudiant', color: 'bg-africrea-green-500' },
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user.role)
  )

  return (
    <aside className="fixed left-0 top-0 h-screen w-72 bg-[#0d0d0d] border-r border-white/5 flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-white/5">
        <Link href="/dashboard" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Africréa"
            width={180}
            height={60}
            priority
            className="h-12 w-auto"
          />
        </Link>
      </div>

      {/* User Info */}
      <div className="p-4 mx-4 mt-4 rounded-xl bg-white/5 border border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-africrea-green-500 to-africrea-green-600 flex items-center justify-center text-white font-semibold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-white font-medium truncate">{user.name}</div>
            <div className="text-white/40 text-sm truncate">{user.email}</div>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          {/* Role Badge */}
          <span className={`px-2 py-1 rounded-md text-xs font-medium text-white ${roleConfig[user.role]?.color || 'bg-gray-500'}`}>
            {roleConfig[user.role]?.label || user.role}
          </span>
          {/* Pole Badge */}
          {user.pole && (
            <span className={`px-2 py-1 rounded-md text-xs font-medium text-white ${poleColors[user.pole] || 'bg-gray-500'}`}>
              {poleNames[user.pole] || user.pole}
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-6 px-4 overflow-y-auto">
        <ul className="space-y-1">
          {filteredMenuItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-africrea-green-500/10 text-africrea-green-400'
                      : 'text-white/60 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-africrea-green-500 rounded-r-full"
                    />
                  )}
                  <item.icon className={`w-5 h-5 ${isActive ? 'text-africrea-green-400' : 'text-white/40 group-hover:text-white/60'}`} />
                  <span className="flex-1">{item.name}</span>
                  {isActive && (
                    <ChevronRight className="w-4 h-4 text-africrea-green-400" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={() => {
            // Sign out logic
            window.location.href = '/api/auth/signout'
          }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/60 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  )
}

