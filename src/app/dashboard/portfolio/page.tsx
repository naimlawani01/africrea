'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/dashboard/Header'
import { 
  FolderOpen, 
  Plus, 
  ExternalLink, 
  Star,
  Eye,
  Download,
  Share2,
  Palette,
  Box,
  Film,
  Filter,
  Grid,
  List
} from 'lucide-react'

const portfolioItems = [
  {
    id: '1',
    title: 'Identité Visuelle NeuraTech',
    description: 'Logo et charte graphique pour une startup IA',
    category: 'GRAPHISME',
    thumbnail: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400',
    files: ['logo.png', 'charte.pdf', 'mockups.zip'],
    tags: ['Logo', 'Branding', 'Tech'],
    isFeatured: true,
    grade: 92,
    createdAt: '2024-01-15',
    views: 234,
  },
  {
    id: '2',
    title: 'Animation Robot Companion',
    description: 'Séquence d\'animation 3D d\'un robot domestique',
    category: 'ANIMATION_3D',
    thumbnail: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400',
    files: ['animation.mp4', 'scene.blend'],
    tags: ['Animation', '3D', 'Robot'],
    isFeatured: false,
    grade: 88,
    createdAt: '2024-01-10',
    views: 156,
  },
  {
    id: '3',
    title: 'Court-métrage "L\'Attente"',
    description: 'Film de 5 minutes sur la patience et l\'espoir',
    category: 'AUDIOVISUEL',
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400',
    files: ['film.mp4', 'making-of.pdf'],
    tags: ['Court-métrage', 'Drama', 'Fiction'],
    isFeatured: true,
    grade: 95,
    createdAt: '2024-01-05',
    views: 412,
  },
  {
    id: '4',
    title: 'Affiche Festival Jazz',
    description: 'Affiche promotionnelle pour un festival de jazz africain',
    category: 'GRAPHISME',
    thumbnail: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=400',
    files: ['affiche.png', 'sources.ai'],
    tags: ['Affiche', 'Musique', 'Print'],
    isFeatured: false,
    grade: 85,
    createdAt: '2024-01-02',
    views: 98,
  },
]

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
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedItem, setSelectedItem] = useState<typeof portfolioItems[0] | null>(null)

  const filteredItems = selectedCategory 
    ? portfolioItems.filter(item => item.category === selectedCategory)
    : portfolioItems

  const totalViews = portfolioItems.reduce((acc, item) => acc + item.views, 0)
  const avgGrade = Math.round(portfolioItems.reduce((acc, item) => acc + item.grade, 0) / portfolioItems.length)

  return (
    <>
      <Header 
        title="Mon Portfolio" 
        subtitle="Tous vos travaux validés en un seul endroit"
      />
      
      <div className="p-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="p-5 bg-[#141414] border border-white/5 rounded-2xl">
            <div className="text-3xl font-bold text-white mb-1">{portfolioItems.length}</div>
            <div className="text-white/50">Projets validés</div>
          </div>
          <div className="p-5 bg-[#141414] border border-white/5 rounded-2xl">
            <div className="text-3xl font-bold text-white mb-1">{portfolioItems.filter(i => i.isFeatured).length}</div>
            <div className="text-white/50">Projets mis en avant</div>
          </div>
          <div className="p-5 bg-[#141414] border border-white/5 rounded-2xl">
            <div className="text-3xl font-bold text-white mb-1">{totalViews}</div>
            <div className="text-white/50">Vues totales</div>
          </div>
          <div className="p-5 bg-[#141414] border border-white/5 rounded-2xl">
            <div className="flex items-center gap-2 mb-1">
              <Star className="w-6 h-6 text-africrea-gold-500" />
              <span className="text-3xl font-bold text-white">{avgGrade}</span>
            </div>
            <div className="text-white/50">Note moyenne</div>
          </div>
        </div>

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

          <div className="flex items-center gap-4">
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
            
            <button className="px-4 py-2.5 bg-africrea-green-500 hover:bg-africrea-green-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
              <Share2 className="w-4 h-4" />
              Partager le portfolio
            </button>
          </div>
        </div>

        {/* Portfolio Grid/List */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => {
              const Icon = categoryIcons[item.category]
              const colors = categoryColors[item.category]
              
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ y: -4 }}
                  className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden hover:border-africrea-green-500/30 transition-all duration-300 cursor-pointer group"
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={item.thumbnail} 
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    
                    {item.isFeatured && (
                      <div className="absolute top-3 left-3 px-3 py-1 bg-africrea-gold-500 text-black text-xs font-semibold rounded-full flex items-center gap-1">
                        <Star className="w-3 h-3" />
                        Featured
                      </div>
                    )}
                    
                    <div className={`absolute top-3 right-3 p-2 rounded-lg ${colors.bg}`}>
                      <Icon className={`w-5 h-5 ${colors.text}`} />
                    </div>

                    <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-1 bg-black/50 rounded-lg text-white/80 text-xs">
                      <Eye className="w-3.5 h-3.5" />
                      {item.views}
                    </div>
                  </div>

                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-white font-semibold group-hover:text-africrea-green-400 transition-colors">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-africrea-gold-500" />
                        <span className="text-white font-medium">{item.grade}</span>
                      </div>
                    </div>
                    <p className="text-white/50 text-sm mb-4">{item.description}</p>
                    
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-white/5 text-white/60 text-xs rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => {
              const Icon = categoryIcons[item.category]
              const colors = categoryColors[item.category]
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-6 p-5 bg-[#141414] border border-white/5 rounded-2xl hover:border-africrea-green-500/30 transition-all cursor-pointer"
                  onClick={() => setSelectedItem(item)}
                >
                  <img 
                    src={item.thumbnail} 
                    alt={item.title}
                    className="w-24 h-24 object-cover rounded-xl"
                  />
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-semibold">{item.title}</h3>
                      {item.isFeatured && (
                        <Star className="w-4 h-4 text-africrea-gold-500" />
                      )}
                    </div>
                    <p className="text-white/50 text-sm mb-2">{item.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span key={tag} className="px-2 py-1 bg-white/5 text-white/60 text-xs rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  
                  <div className="flex items-center gap-4 text-white/50 text-sm">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      {item.views}
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-africrea-gold-500" />
                      <span className="text-white font-medium">{item.grade}</span>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <FolderOpen className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-white/60 text-lg">Aucun projet dans cette catégorie</h3>
            <p className="text-white/40 mt-2">Participez aux défis pour enrichir votre portfolio</p>
          </div>
        )}
      </div>
    </>
  )
}

