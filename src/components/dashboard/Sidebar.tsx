'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { signOut } from 'next-auth/react'
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
  Menu,
  X,
} from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

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
  ADMIN: { label: 'Admin', color: 'bg-red-500' },
  TRAINER: { label: 'Formateur', color: 'bg-africrea-gold-500' },
  STUDENT: { label: 'Étudiant', color: 'bg-africrea-green-500' },
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user.role)
  )

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-white/5">
        <Link href="/dashboard" className="flex items-center justify-center lg:justify-start">
          <Image
            src="/logo.png"
            alt="Africréa"
            width={180}
            height={60}
            priority
            className="h-10 lg:h-12 w-auto object-contain"
          />
        </Link>
      </div>

      {/* User Info */}
      <div className="p-3 lg:p-4 mx-3 lg:mx-4 mt-3 lg:mt-4 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 lg:w-11 lg:h-11 rounded-full bg-gradient-to-br from-africrea-green-500 to-africrea-green-600 flex items-center justify-center text-white font-semibold text-sm lg:text-base flex-shrink-0">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-gray-900 dark:text-white font-medium truncate text-sm lg:text-base">{user.name}</div>
            <div className="text-gray-500 dark:text-white/40 text-xs lg:text-sm truncate">{user.email}</div>
          </div>
        </div>
        <div className="mt-2 lg:mt-3 flex items-center gap-2 flex-wrap">
          <span className={`px-2 py-0.5 lg:py-1 rounded-md text-xs font-medium text-white ${roleConfig[user.role]?.color || 'bg-gray-500'}`}>
            {roleConfig[user.role]?.label || user.role}
          </span>
          {user.pole && (
            <span className={`px-2 py-0.5 lg:py-1 rounded-md text-xs font-medium text-white ${poleColors[user.pole] || 'bg-gray-500'}`}>
              {poleNames[user.pole] || user.pole}
            </span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 lg:py-6 px-3 lg:px-4 overflow-y-auto">
        <ul className="space-y-1">
          {filteredMenuItems.map((item) => {
            const isActive = pathname === item.href || 
              (item.href !== '/dashboard' && pathname.startsWith(item.href))
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`relative flex items-center gap-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'bg-africrea-green-500/10 text-africrea-green-600 dark:text-africrea-green-400'
                      : 'text-gray-600 dark:text-white/60 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 lg:h-6 bg-africrea-green-500 rounded-r-full"
                    />
                  )}
                  <item.icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-africrea-green-600 dark:text-africrea-green-400' : 'text-gray-400 dark:text-white/40 group-hover:text-gray-600 dark:group-hover:text-white/60'}`} />
                  <span className="flex-1 text-sm lg:text-base">{item.name}</span>
                  {isActive && (
                    <ChevronRight className="w-4 h-4 text-africrea-green-600 dark:text-africrea-green-400 hidden lg:block" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Theme Toggle & Logout */}
      <div className="p-2 lg:p-3 border-t border-gray-200 dark:border-white/5 flex items-center justify-between gap-2">
        <ThemeToggle />
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all text-sm"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden lg:block">Quitter</span>
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-[#0d0d0d] border-b border-gray-200 dark:border-white/5 flex items-center justify-between px-4 z-50">
        <Link href="/dashboard" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Africréa"
            width={120}
            height={40}
            priority
            className="h-8 w-auto object-contain"
          />
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="lg:hidden fixed left-0 top-16 bottom-0 w-72 bg-white dark:bg-[#0d0d0d] border-r border-gray-200 dark:border-white/5 flex flex-col z-50 overflow-hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-72 bg-white dark:bg-[#0d0d0d] border-r border-gray-200 dark:border-white/5 flex-col z-50">
        <SidebarContent />
      </aside>
    </>
  )
}
