'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/dashboard/Header'
import { 
  Film, 
  Play, 
  Clock,
  BookOpen,
  Filter,
  Search,
  X,
  ChevronRight,
  Eye
} from 'lucide-react'

const videos = [
  {
    id: '1',
    title: 'Analyse : "Parasite" de Bong Joon-ho',
    description: 'Étude approfondie de la mise en scène et du symbolisme dans ce chef-d\'œuvre coréen.',
    thumbnail: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400',
    duration: 2340, // seconds
    category: 'FILM_ANALYSIS',
    analysisGuide: 'Observez particulièrement : les contrastes verticaux, l\'utilisation de la lumière naturelle, et les transitions entre les deux maisons.',
    views: 1234,
  },
  {
    id: '2',
    title: 'Techniques d\'éclairage 3 points',
    description: 'Maîtrisez le setup d\'éclairage classique utilisé dans toutes les productions professionnelles.',
    thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400',
    duration: 1820,
    category: 'TECHNIQUE',
    views: 856,
  },
  {
    id: '3',
    title: 'Tutoriel DaVinci Resolve - Color Grading',
    description: 'Apprenez les bases de l\'étalonnage colorimétrique sur DaVinci Resolve.',
    thumbnail: 'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400',
    duration: 3600,
    category: 'TUTORIAL',
    views: 2156,
  },
  {
    id: '4',
    title: 'Making-of : Publicité Coca-Cola',
    description: 'Découvrez les coulisses d\'un tournage publicitaire professionnel.',
    thumbnail: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=400',
    duration: 2100,
    category: 'REFERENCE',
    views: 678,
  },
  {
    id: '5',
    title: 'Travail étudiant : "L\'Aurore"',
    description: 'Court-métrage réalisé par Marie K., promotion 2023.',
    thumbnail: 'https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=400',
    duration: 480,
    category: 'STUDENT_WORK',
    views: 432,
  },
]

const categoryLabels: Record<string, string> = {
  FILM_ANALYSIS: 'Analyse de film',
  TECHNIQUE: 'Technique',
  TUTORIAL: 'Tutoriel',
  REFERENCE: 'Référence',
  STUDENT_WORK: 'Travail étudiant',
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  FILM_ANALYSIS: { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  TECHNIQUE: { bg: 'bg-blue-500/10', text: 'text-blue-400' },
  TUTORIAL: { bg: 'bg-green-500/10', text: 'text-green-400' },
  REFERENCE: { bg: 'bg-orange-500/10', text: 'text-orange-400' },
  STUDENT_WORK: { bg: 'bg-pink-500/10', text: 'text-pink-400' },
}

const formatDuration = (seconds: number) => {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  if (hours > 0) {
    return `${hours}h ${minutes}min`
  }
  return `${minutes} min`
}

export default function VideosPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedVideo, setSelectedVideo] = useState<typeof videos[0] | null>(null)

  const filteredVideos = videos.filter(video => {
    const matchesCategory = !selectedCategory || video.category === selectedCategory
    const matchesSearch = video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          video.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  return (
    <>
      <Header 
        title="Vidéothèque" 
        subtitle="Films, tutoriels et références pour votre apprentissage"
      />
      
      <div className="p-8">
        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
            <input
              type="text"
              placeholder="Rechercher une vidéo..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-field pl-12"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
            <Filter className="w-5 h-5 text-white/60 flex-shrink-0" />
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                !selectedCategory
                  ? 'bg-africrea-green-500 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              Tout
            </button>
            {Object.entries(categoryLabels).map(([cat, label]) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? `${categoryColors[cat].bg} ${categoryColors[cat].text}`
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((video) => {
            const colors = categoryColors[video.category]
            
            return (
              <motion.div
                key={video.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ y: -4 }}
                className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden hover:border-africrea-green-500/30 transition-all duration-300 cursor-pointer group"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="relative h-44 overflow-hidden">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 rounded-full bg-africrea-green-500 flex items-center justify-center">
                      <Play className="w-8 h-8 text-white ml-1" />
                    </div>
                  </div>
                  
                  <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 rounded text-white text-xs font-medium">
                    {formatDuration(video.duration)}
                  </div>
                  
                  <div className={`absolute top-3 left-3 px-3 py-1 rounded-lg text-xs font-medium ${colors.bg} ${colors.text}`}>
                    {categoryLabels[video.category]}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-white font-semibold mb-2 group-hover:text-africrea-green-400 transition-colors line-clamp-2">
                    {video.title}
                  </h3>
                  <p className="text-white/50 text-sm mb-4 line-clamp-2">{video.description}</p>
                  
                  <div className="flex items-center gap-2 text-white/40 text-sm">
                    <Eye className="w-4 h-4" />
                    {video.views} vues
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {filteredVideos.length === 0 && (
          <div className="text-center py-16">
            <Film className="w-16 h-16 text-white/20 mx-auto mb-4" />
            <h3 className="text-white/60 text-lg">Aucune vidéo trouvée</h3>
            <p className="text-white/40 mt-2">Essayez avec d&apos;autres critères de recherche</p>
          </div>
        )}
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
            onClick={() => setSelectedVideo(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-4xl bg-[#141414] border border-white/10 rounded-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Video Player Placeholder */}
              <div className="relative aspect-video bg-black">
                <img 
                  src={selectedVideo.thumbnail} 
                  alt={selectedVideo.title}
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <button className="w-20 h-20 rounded-full bg-africrea-green-500 hover:bg-africrea-green-600 flex items-center justify-center transition-colors">
                    <Play className="w-10 h-10 text-white ml-1" />
                  </button>
                </div>
                
                <button
                  onClick={() => setSelectedVideo(null)}
                  className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video Info */}
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium ${categoryColors[selectedVideo.category].bg} ${categoryColors[selectedVideo.category].text}`}>
                    {categoryLabels[selectedVideo.category]}
                  </span>
                  <span className="text-white/40 text-sm flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {formatDuration(selectedVideo.duration)}
                  </span>
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-3">{selectedVideo.title}</h2>
                <p className="text-white/60 mb-6">{selectedVideo.description}</p>
                
                {selectedVideo.analysisGuide && (
                  <div className="p-4 bg-africrea-green-500/10 border border-africrea-green-500/20 rounded-xl">
                    <div className="flex items-center gap-2 text-africrea-green-400 mb-2">
                      <BookOpen className="w-5 h-5" />
                      <span className="font-medium">Guide d&apos;analyse</span>
                    </div>
                    <p className="text-white/70">{selectedVideo.analysisGuide}</p>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

