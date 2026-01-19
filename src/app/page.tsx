'use client'

import { motion } from 'framer-motion'
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
  ArrowRight
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
  return (
    <div className="min-h-screen bg-[#0a0a0a] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-pattern-grid opacity-30" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-africrea-green-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-africrea-gold-500/10 rounded-full blur-[120px]" />
      
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.png"
            alt="Africréa"
            width={220}
            height={80}
            priority
            className="h-16 w-auto"
          />
        </Link>
        
        <div className="flex items-center gap-4">
          <Link 
            href="/login"
            className="px-5 py-2.5 text-white/80 hover:text-white transition-colors font-medium"
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
      </nav>

      {/* Hero Section */}
      <motion.main 
        className="relative z-10 px-8 pt-16 pb-24"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <div className="max-w-7xl mx-auto">
          {/* Hero */}
          <motion.div variants={itemVariants} className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-africrea-green-500/10 border border-africrea-green-500/30 rounded-full text-africrea-green-400 text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              Plateforme de formation créative
            </div>
            
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6 leading-tight">
              Libérez votre<br />
              <span className="gradient-text">potentiel créatif</span>
            </h1>
            
            <p className="text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
              Rejoignez Africréa et développez vos compétences en graphisme, animation 3D 
              et audiovisuel avec des défis pratiques et des experts du métier.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link 
                href="/register"
                className="px-8 py-4 bg-africrea-green-500 hover:bg-africrea-green-600 text-white rounded-xl font-semibold text-lg transition-all duration-300 flex items-center gap-3 glow-green"
              >
                Commencer gratuitement
                <ChevronRight className="w-5 h-5" />
              </Link>
              <Link 
                href="/login"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold text-lg transition-all duration-300 border border-white/10"
              >
                J&apos;ai déjà un compte
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div 
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20"
          >
            {stats.map((stat) => (
              <div 
                key={stat.label}
                className="flex items-center gap-4 p-6 bg-white/5 border border-white/10 rounded-2xl hover:border-africrea-green-500/30 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-africrea-green-500/10 flex items-center justify-center">
                  <stat.icon className="w-7 h-7 text-africrea-green-400" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-white/50">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Poles */}
          <motion.div variants={itemVariants}>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
                Nos Pôles Métiers
              </h2>
              <p className="text-white/60 max-w-xl mx-auto">
                Choisissez votre spécialisation et développez vos compétences avec des experts du domaine
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {poles.map((pole) => (
                <motion.div
                  key={pole.id}
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                  className={`relative p-8 rounded-3xl ${pole.bgColor} border ${pole.borderColor} cursor-pointer group overflow-hidden`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${pole.color} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                  
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${pole.color} flex items-center justify-center mb-6`}>
                    <pole.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3">{pole.name}</h3>
                  <p className="text-white/60 mb-6 leading-relaxed">{pole.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-white/40 text-sm">{pole.students} étudiants</span>
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${pole.color} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300`}>
                      <ChevronRight className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Features */}
          <motion.div variants={itemVariants} className="mt-24">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-gradient-to-br from-africrea-green-500/10 to-transparent border border-africrea-green-500/20 rounded-3xl">
                <h3 className="text-2xl font-bold text-white mb-4">Défis Hebdomadaires</h3>
                <p className="text-white/60 mb-6">
                  Relevez des défis techniques chaque semaine, recevez des feedbacks personnalisés 
                  de nos experts et améliorez vos compétences progressivement.
                </p>
                <ul className="space-y-3">
                  {['Briefings créatifs détaillés', 'Corrections interactives', 'Tips & astuces des pros'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-white/80">
                      <div className="w-2 h-2 rounded-full bg-africrea-green-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="p-8 bg-gradient-to-br from-africrea-gold-500/10 to-transparent border border-africrea-gold-500/20 rounded-3xl">
                <h3 className="text-2xl font-bold text-white mb-4">Portfolio Automatique</h3>
                <p className="text-white/60 mb-6">
                  Tous vos travaux validés sont automatiquement compilés dans un portfolio 
                  professionnel que vous pouvez partager avec vos futurs clients.
                </p>
                <ul className="space-y-3">
                  {['Historique complet', 'Export professionnel', 'Partage facile'].map((item) => (
                    <li key={item} className="flex items-center gap-3 text-white/80">
                      <div className="w-2 h-2 rounded-full bg-africrea-gold-500" />
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
      <footer className="relative z-10 border-t border-white/10 py-8 px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/">
            <Image
              src="/logo.png"
              alt="Africréa"
              width={160}
              height={55}
              className="h-12 w-auto opacity-80 hover:opacity-100 transition-opacity"
            />
          </Link>
          <p className="text-white/40 text-sm">
            © 2024 Africréa. Plateforme de formation créative.
          </p>
        </div>
      </footer>
    </div>
  )
}
