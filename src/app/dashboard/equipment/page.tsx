'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/dashboard/Header'
import { 
  Camera, 
  Aperture,
  Sun,
  Mic,
  Monitor,
  Package,
  Calendar,
  Check,
  X,
  AlertCircle,
  Clock,
  Filter,
  ChevronRight
} from 'lucide-react'

const equipment = [
  {
    id: '1',
    name: 'Sony A7 III',
    description: 'Caméra plein format 24.2MP, 4K HDR',
    category: 'CAMERA',
    status: 'AVAILABLE',
    image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
    specifications: { sensor: 'Full Frame', resolution: '24.2MP', video: '4K 30fps' },
  },
  {
    id: '2',
    name: 'Canon EOS R5',
    description: 'Caméra mirrorless 45MP, 8K RAW',
    category: 'CAMERA',
    status: 'RESERVED',
    image: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400',
    specifications: { sensor: 'Full Frame', resolution: '45MP', video: '8K 30fps' },
    reservedBy: 'Jean-Marc K.',
    reservedUntil: '2024-01-25',
  },
  {
    id: '3',
    name: 'Objectif Canon 24-70mm f/2.8',
    description: 'Zoom standard professionnel série L',
    category: 'LENS',
    status: 'AVAILABLE',
    image: 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?w=400',
    specifications: { focal: '24-70mm', aperture: 'f/2.8', mount: 'Canon RF' },
  },
  {
    id: '4',
    name: 'Kit Aputure 600d Pro',
    description: 'Éclairage LED 600W avec softbox',
    category: 'LIGHTING',
    status: 'IN_USE',
    image: 'https://images.unsplash.com/photo-1598549746738-3fb2d6bdb0da?w=400',
    specifications: { power: '600W', temperature: '5600K', CRI: '96+' },
    inUseBy: 'Production "Aurora"',
    returnDate: '2024-01-28',
  },
  {
    id: '5',
    name: 'Rode NTG5',
    description: 'Micro canon broadcast ultra-léger',
    category: 'AUDIO',
    status: 'AVAILABLE',
    image: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?w=400',
    specifications: { type: 'Shotgun', frequency: '20Hz-20kHz', weight: '76g' },
  },
  {
    id: '6',
    name: 'iMac Pro 27"',
    description: 'Station de montage - 64GB RAM, 1TB SSD',
    category: 'COMPUTER',
    status: 'MAINTENANCE',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400',
    specifications: { processor: 'Intel Xeon W', ram: '64GB', storage: '1TB SSD' },
    maintenanceNote: 'Mise à jour système en cours',
  },
]

const myReservations = [
  {
    id: 'r1',
    equipmentName: 'Sony A7 III',
    startDate: '2024-01-22',
    endDate: '2024-01-24',
    status: 'APPROVED',
    purpose: 'Tournage court-métrage',
  },
  {
    id: 'r2',
    equipmentName: 'Kit Aputure 600d Pro',
    startDate: '2024-01-29',
    endDate: '2024-01-30',
    status: 'PENDING',
    purpose: 'Shooting portrait',
  },
]

const categoryIcons: Record<string, React.ElementType> = {
  CAMERA: Camera,
  LENS: Aperture,
  LIGHTING: Sun,
  AUDIO: Mic,
  COMPUTER: Monitor,
  GRIP: Package,
  SOFTWARE: Package,
  OTHER: Package,
}

const categoryLabels: Record<string, string> = {
  CAMERA: 'Caméras',
  LENS: 'Objectifs',
  LIGHTING: 'Éclairage',
  AUDIO: 'Audio',
  COMPUTER: 'Ordinateurs',
  GRIP: 'Grip',
  SOFTWARE: 'Logiciels',
  OTHER: 'Autre',
}

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: React.ElementType }> = {
  AVAILABLE: { label: 'Disponible', bg: 'bg-green-500/10', text: 'text-green-400', icon: Check },
  RESERVED: { label: 'Réservé', bg: 'bg-yellow-500/10', text: 'text-yellow-400', icon: Calendar },
  IN_USE: { label: 'En utilisation', bg: 'bg-blue-500/10', text: 'text-blue-400', icon: Clock },
  MAINTENANCE: { label: 'Maintenance', bg: 'bg-red-500/10', text: 'text-red-400', icon: AlertCircle },
  UNAVAILABLE: { label: 'Indisponible', bg: 'bg-gray-500/10', text: 'text-gray-400', icon: X },
}

const reservationStatusConfig: Record<string, { label: string; bg: string; text: string }> = {
  PENDING: { label: 'En attente', bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
  APPROVED: { label: 'Confirmée', bg: 'bg-green-500/10', text: 'text-green-400' },
  REJECTED: { label: 'Refusée', bg: 'bg-red-500/10', text: 'text-red-400' },
}

export default function EquipmentPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showReservationModal, setShowReservationModal] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState<typeof equipment[0] | null>(null)
  const [activeTab, setActiveTab] = useState<'catalog' | 'reservations'>('catalog')

  const filteredEquipment = selectedCategory
    ? equipment.filter(e => e.category === selectedCategory)
    : equipment

  const availableCategories = Array.from(new Set(equipment.map(e => e.category)))

  return (
    <>
      <Header 
        title="Gestion du Matériel" 
        subtitle="Réservez caméras, éclairages et équipements"
      />
      
      <div className="p-8">
        {/* Tabs */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'catalog'
                ? 'bg-africrea-green-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <Camera className="w-5 h-5 inline-block mr-2" />
            Catalogue
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
              activeTab === 'reservations'
                ? 'bg-africrea-green-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <Calendar className="w-5 h-5 inline-block mr-2" />
            Mes réservations
          </button>
        </div>

        {activeTab === 'catalog' ? (
          <>
            {/* Category Filters */}
            <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
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
              {availableCategories.map((cat) => {
                const Icon = categoryIcons[cat]
                return (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-all ${
                      selectedCategory === cat
                        ? 'bg-africrea-green-500 text-white'
                        : 'bg-white/5 text-white/60 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {categoryLabels[cat]}
                  </button>
                )
              })}
            </div>

            {/* Equipment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEquipment.map((item) => {
                const CategoryIcon = categoryIcons[item.category]
                const status = statusConfig[item.status]
                const StatusIcon = status.icon
                
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -4 }}
                    className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden hover:border-africrea-green-500/30 transition-all duration-300"
                  >
                    <div className="relative h-44 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 left-3 p-2 rounded-lg bg-black/50">
                        <CategoryIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className={`absolute top-3 right-3 px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 ${status.bg} ${status.text}`}>
                        <StatusIcon className="w-3.5 h-3.5" />
                        {status.label}
                      </div>
                    </div>

                    <div className="p-5">
                      <h3 className="text-white font-semibold mb-2">{item.name}</h3>
                      <p className="text-white/50 text-sm mb-4">{item.description}</p>
                      
                      {item.status === 'RESERVED' && (
                        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm">
                          <span className="text-yellow-400">Réservé par {item.reservedBy}</span>
                          <br />
                          <span className="text-yellow-400/70">Jusqu&apos;au {item.reservedUntil}</span>
                        </div>
                      )}
                      
                      {item.status === 'IN_USE' && (
                        <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-sm">
                          <span className="text-blue-400">{item.inUseBy}</span>
                          <br />
                          <span className="text-blue-400/70">Retour le {item.returnDate}</span>
                        </div>
                      )}
                      
                      {item.status === 'MAINTENANCE' && (
                        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-sm">
                          <span className="text-red-400">{item.maintenanceNote}</span>
                        </div>
                      )}
                      
                      <button
                        onClick={() => {
                          setSelectedEquipment(item)
                          setShowReservationModal(true)
                        }}
                        disabled={item.status !== 'AVAILABLE'}
                        className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                          item.status === 'AVAILABLE'
                            ? 'bg-africrea-green-500 hover:bg-africrea-green-600 text-white'
                            : 'bg-white/5 text-white/40 cursor-not-allowed'
                        }`}
                      >
                        <Calendar className="w-4 h-4" />
                        {item.status === 'AVAILABLE' ? 'Réserver' : 'Indisponible'}
                      </button>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </>
        ) : (
          /* My Reservations */
          <div className="space-y-4">
            {myReservations.length === 0 ? (
              <div className="text-center py-16">
                <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-white/60 text-lg">Aucune réservation</h3>
                <p className="text-white/40 mt-2">Réservez du matériel depuis le catalogue</p>
              </div>
            ) : (
              myReservations.map((reservation) => {
                const statusConf = reservationStatusConfig[reservation.status]
                return (
                  <motion.div
                    key={reservation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-[#141414] border border-white/5 rounded-2xl"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold text-lg">{reservation.equipmentName}</h3>
                      <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${statusConf.bg} ${statusConf.text}`}>
                        {statusConf.label}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-white/40">Du</span>
                        <p className="text-white">{new Date(reservation.startDate).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div>
                        <span className="text-white/40">Au</span>
                        <p className="text-white">{new Date(reservation.endDate).toLocaleDateString('fr-FR')}</p>
                      </div>
                      <div className="col-span-2 md:col-span-1">
                        <span className="text-white/40">Motif</span>
                        <p className="text-white">{reservation.purpose}</p>
                      </div>
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        )}
      </div>

      {/* Reservation Modal */}
      <AnimatePresence>
        {showReservationModal && selectedEquipment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowReservationModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#141414] border border-white/10 rounded-3xl p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold text-white mb-2">Réserver {selectedEquipment.name}</h2>
              <p className="text-white/50 mb-6">{selectedEquipment.description}</p>
              
              <div className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">Date de début</label>
                    <input type="date" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">Date de fin</label>
                    <input type="date" className="input-field" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">Motif de la réservation</label>
                  <textarea
                    rows={3}
                    className="input-field resize-none"
                    placeholder="Décrivez l'utilisation prévue..."
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowReservationModal(false)}
                    className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    className="flex-1 py-3 bg-africrea-green-500 hover:bg-africrea-green-600 text-white font-medium rounded-xl transition-colors"
                  >
                    Confirmer
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

