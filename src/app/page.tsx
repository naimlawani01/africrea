'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Palette, 
  Film, 
  Box, 
  ChevronRight, 
  Users, 
  Trophy, 
  Calendar,
  Sparkles,
  ArrowRight,
  Menu,
  X
} from 'lucide-react'

const poles = [
  {
    id: 'graphisme',
    name: 'Graphisme',
    description: 'Design graphique, identité visuelle, illustration et direction artistique',
    icon: Palette,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    students: 24,
  },
  {
    id: 'animation-3d',
    name: 'Animation 3D',
    description: 'Modélisation, animation, rendu 3D et motion design',
    icon: Box,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    students: 18,
  },
  {
    id: 'audiovisuel',
    name: 'Audiovisuel',
    description: 'Cinéma, réalisation, montage vidéo et production audiovisuelle',
    icon: Film,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    students: 32,
  },
]

const stats = [
  { label: 'Étudiants actifs', value: '74', icon: Users },
  { label: 'Défis complétés', value: '156', icon: Trophy },
  { label: 'Masterclass', value: '12', icon: Calendar },
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
}

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] relative overflow-hidden transition-colors duration-300">
      {/* Background effects */}
      <div className="absolute inset-0 bg-pattern-grid opacity-10 dark:opacity-30" />
      <div className="absolute top-0 left-1/4 w-64 md:w-96 h-64 md:h-96 bg-africrea-green-500/10 dark:bg-africrea-green-500/20 rounded-full blur-[100px] md:blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-64 md:w-96 h-64 md:h-96 bg-africrea-gold-500/5 dark:bg-africrea-gold-500/10 rounded-full blur-[100px] md:blur-[120px]" />
      
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-4 md:px-8 py-4 md:py-6">
        {/* Logo - Centré sur mobile, à gauche sur desktop */}
        <Link href="/" className="flex items-center mx-auto md:mx-0">
          <Image
            src="/logo.png"
            alt="Africréa"
            width={180}
            height={60}
            priority
            className="h-12 md:h-16 w-auto object-contain"
            style={{ objectFit: 'contain' }}
          />
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <Link 
            href="/login"
            className="px-5 py-2.5 text-gray-600 dark:text-white/80 hover:text-gray-900 dark:hover:text-white transition-colors font-medium"
          >
            Connexion
          </Link>
          <Link 
            href="/register"
            className="px-5 py-2.5 bg-africrea-green-500 hover:bg-africrea-green-600 text-white rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
          >
            Rejoindre <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="md:hidden absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-africrea-green-500 text-white"
        >
          <Menu className="w-5 h-5" />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 md:hidden"
          >
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-72 bg-white dark:bg-[#141414] shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-white/10">
                <span className="text-gray-900 dark:text-white font-semibold">Menu</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="p-4 space-y-3">
                <Link 
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-white font-medium"
                >
                  Connexion
                </Link>
                <Link 
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-africrea-green-500 text-white font-medium"
                >
                  Rejoindre Africréa
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
              
              {/* Quick Info */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-white/10">
                <div className="grid grid-cols-3 gap-2 text-center">
                  {stats.map((stat) => (
                    <div key={stat.label} className="p-2">
                      <div className="text-africrea-green-500 font-bold">{stat.value}</div>
                      <div className="text-gray-500 dark:text-white/50 text-xs">{stat.label.split(' ')[0]}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <motion.main 
        className="relative z-10 px-4 md:px-8 pt-8 md:pt-16 pb-16 md:pb-24"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <motion.div variants={itemVariants} className="text-center mb-12 md:mb-20">
            <div className="inline-flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-africrea-green-100 dark:bg-africrea-green-500/10 border border-africrea-green-300 dark:border-africrea-green-500/30 rounded-full text-africrea-green-600 dark:text-africrea-green-400 text-xs md:text-sm font-medium mb-6 md:mb-8">
              <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
              Plateforme de formation créative
            </div>
            
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display font-bold text-gray-900 dark:text-white mb-4 md:mb-6 leading-tight">
              Libérez votre<br />
              <span className="gradient-text">potentiel créatif</span>
            </h1>
            
            <p className="text-base md:text-xl text-gray-600 dark:text-white/60 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed px-4">
              Rejoignez Africréa et développez vos compétences en graphisme, animation 3D 
              et audiovisuel avec des défis pratiques et des experts du métier.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 px-4">
              <Link 
                href="/register"
                className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-africrea-green-500 hover:bg-africrea-green-600 text-white rounded-xl font-semibold text-base md:text-lg transition-all duration-300 flex items-center justify-center gap-2 md:gap-3 glow-green"
              >
                Commencer gratuitement
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/login"
                className="w-full sm:w-auto px-6 md:px-8 py-3 md:py-4 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-gray-800 dark:text-white rounded-xl font-semibold text-base md:text-lg transition-all duration-300 border border-gray-200 dark:border-white/10 text-center"
              >
                J&apos;ai déjà un compte
              </Link>
            </div>
          </motion.div>

          {/* Stats - Hidden on very small mobile */}
          <motion.div 
            variants={itemVariants}
            className="hidden sm:grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-12 md:mb-20"
          >
            {stats.map((stat) => (
              <div 
                key={stat.label}
                className="flex items-center gap-4 p-4 md:p-6 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl hover:border-africrea-green-500/30 transition-all duration-300"
              >
                <div className="w-12 h-12 md:w-14 md:h-14 rounded-xl bg-africrea-green-100 dark:bg-africrea-green-500/10 flex items-center justify-center">
                  <stat.icon className="w-6 h-6 md:w-7 md:h-7 text-africrea-green-500 dark:text-africrea-green-400" />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                  <div className="text-gray-500 dark:text-white/50 text-sm">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Poles */}
          <motion.div variants={itemVariants}>
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-gray-900 dark:text-white mb-3 md:mb-4">
                Nos Pôles Métiers
              </h2>
              <p className="text-gray-600 dark:text-white/60 max-w-xl mx-auto px-4 text-sm md:text-base">
                Choisissez votre spécialisation et développez vos compétences avec des experts du domaine
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {poles.map((pole) => (
                <motion.div
                  key={pole.id}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className={`relative p-6 md:p-8 rounded-2xl md:rounded-3xl ${pole.bgColor} border ${pole.borderColor} cursor-pointer group overflow-hidden`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${pole.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  <div className={`w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-gradient-to-br ${pole.color} flex items-center justify-center mb-4 md:mb-6`}>
                    <pole.icon className="w-6 h-6 md:w-8 md:h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3">{pole.name}</h3>
                  <p className="text-gray-600 dark:text-white/60 mb-4 md:mb-6 leading-relaxed text-sm md:text-base">{pole.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400 dark:text-white/40 text-sm">{pole.students} étudiants</span>
                    <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br ${pole.color} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                      <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Features */}
          <motion.div variants={itemVariants} className="mt-16 md:mt-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
              <div className="p-6 md:p-8 bg-white dark:bg-[#0f1f14] border-2 border-africrea-green-200 dark:border-africrea-green-500/30 rounded-2xl md:rounded-3xl shadow-lg shadow-africrea-green-500/5">
                <div className="w-12 h-12 rounded-xl bg-africrea-green-500 flex items-center justify-center mb-4">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">Défis Hebdomadaires</h3>
                <p className="text-gray-600 dark:text-white/70 mb-4 md:mb-6 text-sm md:text-base">
                  Relevez des défis techniques chaque semaine, recevez des feedbacks personnalisés 
                  de nos experts et améliorez vos compétences progressivement.
                </p>
                <ul className="space-y-2 md:space-y-3">
                  {['Briefings créatifs détaillés', 'Corrections interactives', 'Tips & astuces des pros'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-700 dark:text-white/80 text-sm md:text-base">
                      <div className="w-2 h-2 rounded-full bg-africrea-green-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-6 md:p-8 bg-white dark:bg-[#1f1a0f] border-2 border-africrea-gold-200 dark:border-africrea-gold-500/30 rounded-2xl md:rounded-3xl shadow-lg shadow-africrea-gold-500/5">
                <div className="w-12 h-12 rounded-xl bg-africrea-gold-500 flex items-center justify-center mb-4">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3 md:mb-4">Portfolio Automatique</h3>
                <p className="text-gray-600 dark:text-white/70 mb-4 md:mb-6 text-sm md:text-base">
                  Tous vos travaux validés sont automatiquement compilés dans un portfolio 
                  professionnel que vous pouvez partager avec vos futurs clients.
                </p>
                <ul className="space-y-2 md:space-y-3">
                  {['Historique complet', 'Export professionnel', 'Partage facile'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-gray-700 dark:text-white/80 text-sm md:text-base">
                      <div className="w-2 h-2 rounded-full bg-africrea-gold-500 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-200 dark:border-white/10 py-6 md:py-8 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Africréa"
              width={140}
              height={45}
              className="h-10 md:h-12 w-auto object-contain opacity-80 hover:opacity-100 transition-opacity"
              style={{ objectFit: 'contain' }}
            />
          </Link>
          <p className="text-gray-500 dark:text-white/40 text-xs md:text-sm text-center">
            © 2024 Africréa. Plateforme de formation créative.
          </p>
        </div>
      </footer>
    </div>
  )
}
