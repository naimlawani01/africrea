'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/dashboard/Header'
import { 
  FolderOpen, 
  ExternalLink, 
  Star,
  Download,
  Share2,
  Palette,
  Box,
  Film,
  Filter,
  Grid,
  List,
  Loader2,
  Trophy
} from 'lucide-react'

interface PortfolioItem {
  id: string
  title: string
  description: string
  category: string
  thumbnail: string | null
  grade: number | null
  createdAt: string
  challengeId: string
  fileUrl: string
  feedback: string | null
}

interface PortfolioData {
  items: PortfolioItem[]
  stats: {
    totalProjects: number
    averageGrade: number
  }
}

const categoryIcons: Record<string, React.ElementType> = {
  GRAPHISME: Palette,
  ANIMATION_3D: Box,
  AUDIOVISUEL: Film,
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  GRAPHISME: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  ANIMATION_3D: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  AUDIOVISUEL: { bg: 'bg-orange-500/10', text: 'text-orange-400' },
}

export default function PortfolioPage() {
  const [data, setData] = useState<PortfolioData | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  useEffect(() => {
    fetchPortfolio()
  }, [])

  const fetchPortfolio = async () => {
    try {
      const res = await fetch('/api/portfolio')
      if (res.ok) {
        setData(await res.json())
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <>
        <Header title="Mon Portfolio" subtitle="Chargement..." />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 text-africrea-green-500 animate-spin" />
        </div>
      </>
    )
  }

  const items = data?.items || []
  const stats = data?.stats || { totalProjects: 0, averageGrade: 0 }

  const filteredItems = selectedCategory 
    ? items.filter(item => item.category === selectedCategory)
    : items

  return (
    <>
      <Header 
        title="Mon Portfolio" 
        subtitle="Tous vos travaux validés en un seul endroit"
      />
      
      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="p-5 bg-[#141414] border border-white/5 rounded-2xl">
            <div className="text-3xl font-bold text-white mb-1">{stats.totalProjects}</div>
            <div className="text-white/50">Projets validés</div>
          </div>
          <div className="p-5 bg-[#141414] border border-white/5 rounded-2xl">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-6 h-6 text-africrea-gold-500" />
              <span className="text-3xl font-bold text-white">{stats.averageGrade || '—'}</span>
            </div>
            <div className="text-white/50">Note moyenne</div>
          </div>
          <div className="p-5 bg-[#141414] border border-white/5 rounded-2xl flex items-center justify-center">
            <button className="px-4 py-2.5 bg-africrea-green-500 hover:bg-africrea-green-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Partager le portfolio
            </button>
          </div>
        </div>

        {items.length === 0 ? (
          /* Empty State */
          <div className="text-center py-16">
            <FolderOpen className="w-20 h-20 text-white/10 mx-auto mb-6" />
            <h3 className="text-white text-xl font-semibold mb-2">Votre portfolio est vide</h3>
            <p className="text-white/50 mb-6 max-w-md mx-auto">
              Participez aux défis et faites valider vos travaux par les formateurs pour construire votre portfolio professionnel.
            </p>
            <a 
              href="/dashboard/challenges"
              className="inline-flex items-center gap-2 px-6 py-3 bg-africrea-green-500 hover:bg-africrea-green-600 text-white rounded-xl font-medium transition-colors"
            >
              <Trophy className="w-5 h-5" />
              Voir les défis
            </a>
          </div>
        ) : (
          <>
            {/* Actions Bar */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-white/60">
                  <Filter className="w-5 h-5" />
                  <span>Catégorie:</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSelectedCategory(null)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      !selectedCategory
                        ? 'bg-africrea-green-500 text-white'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    Tous
                  </button>
                  {Object.entries(categoryColors).map(([cat, colors]) => {
                    const Icon = categoryIcons[cat]
                    return (
                      <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all ${
                          selectedCategory === cat
                            ? `${colors.bg} ${colors.text}`
                            : 'bg-white/5 text-white/60 hover:bg-white/10'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                        {cat.replace('_', ' ')}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="flex bg-white/5 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-white/40'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-white/40'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Portfolio Grid/List */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => {
                  const Icon = categoryIcons[item.category] || FolderOpen
                  const colors = categoryColors[item.category] || { bg: 'bg-gray-500/10', text: 'text-gray-400' }
                  
                  return (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -4 }}
                      className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden hover:border-africrea-green-500/30 transition-all duration-300 group"
                    >
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-africrea-green-500/10 to-africrea-gold-500/10">
                        {item.thumbnail ? (
                          <img 
                            src={item.thumbnail} 
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Icon className="w-16 h-16 text-white/20" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                        
                        <div className={`absolute top-3 right-3 p-2 rounded-lg ${colors.bg}`}>
                          <Icon className={`w-5 h-5 ${colors.text}`} />
                        </div>

                        {item.grade && (
                          <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-1 bg-africrea-gold-500 rounded-lg text-black text-xs font-bold">
                            <Star className="w-3.5 h-3.5" />
                            {item.grade}/100
                          </div>
                        )}
                      </div>

                      <div className="p-5">
                        <h3 className="text-white font-semibold group-hover:text-africrea-green-400 transition-colors mb-2">
                          {item.title}
                        </h3>
                        <p className="text-white/50 text-sm mb-4 line-clamp-2">{item.description}</p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-white/30 text-xs">
                            {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                          </span>
                          {item.fileUrl && (
                            <a 
                              href={item.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-africrea-green-400 hover:text-africrea-green-300 flex items-center gap-1 text-sm"
                            >
                              <Download className="w-4 h-4" />
                              Télécharger
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredItems.map((item) => {
                  const Icon = categoryIcons[item.category] || FolderOpen
                  const colors = categoryColors[item.category] || { bg: 'bg-gray-500/10', text: 'text-gray-400' }
                  
                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-6 p-5 bg-[#141414] border border-white/5 rounded-2xl hover:border-africrea-green-500/30 transition-all"
                    >
                      <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-africrea-green-500/10 to-africrea-gold-500/10 flex items-center justify-center overflow-hidden">
                        {item.thumbnail ? (
                          <img 
                            src={item.thumbnail} 
                            alt={item.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Icon className="w-8 h-8 text-white/30" />
                        )}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-white font-semibold">{item.title}</h3>
                          {item.grade && (
                            <span className="flex items-center gap-1 text-africrea-gold-500 text-sm">
                              <Star className="w-4 h-4" />
                              {item.grade}/100
                            </span>
                          )}
                        </div>
                        <p className="text-white/50 text-sm mb-2">{item.description}</p>
                        <span className="text-white/30 text-xs">
                          {new Date(item.createdAt).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      
                      <div className={`p-2 rounded-lg ${colors.bg}`}>
                        <Icon className={`w-5 h-5 ${colors.text}`} />
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}

            {filteredItems.length === 0 && (
              <div className="text-center py-16">
                <FolderOpen className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-white/60 text-lg">Aucun projet dans cette catégorie</h3>
              </div>
            )}
          </>
        )}
      </div>
    </>
  )
}
