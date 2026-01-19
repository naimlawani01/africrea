'use client'

import { useState, useEffect } from 'react'
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
  Loader2
} from 'lucide-react'

interface Equipment {
  id: string
  name: string
  description: string | null
  category: string
  status: string
  image: string | null
  reservations: {
    user: { firstName: string; lastName: string }
    endDate: string
  }[]
}

interface Reservation {
  id: string
  startDate: string
  endDate: string
  purpose: string
  status: string
  equipment: {
    name: string
  }
}

const categoryIcons: Record<string, typeof Camera> = {
  CAMERA: Camera,
  LENS: Aperture,
  LIGHTING: Sun,
  AUDIO: Mic,
  COMPUTER: Monitor,
  SOFTWARE: Monitor,
  OTHER: Package,
}

const categoryLabels: Record<string, string> = {
  CAMERA: 'Caméras',
  LENS: 'Objectifs',
  LIGHTING: 'Éclairage',
  AUDIO: 'Audio',
  COMPUTER: 'Ordinateurs',
  SOFTWARE: 'Logiciels',
  OTHER: 'Autre',
}

const statusConfig: Record<string, { label: string; bg: string; text: string; icon: typeof Check }> = {
  AVAILABLE: { label: 'Disponible', bg: 'bg-green-500/20', text: 'text-green-400', icon: Check },
  RESERVED: { label: 'Réservé', bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: Clock },
  IN_USE: { label: 'En cours', bg: 'bg-blue-500/20', text: 'text-blue-400', icon: Clock },
  MAINTENANCE: { label: 'Maintenance', bg: 'bg-red-500/20', text: 'text-red-400', icon: AlertCircle },
  UNAVAILABLE: { label: 'Indisponible', bg: 'bg-gray-500/20', text: 'text-gray-400', icon: X },
}

const reservationStatusConfig: Record<string, { label: string; bg: string; text: string }> = {
  PENDING: { label: 'En attente', bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
  APPROVED: { label: 'Approuvé', bg: 'bg-green-500/20', text: 'text-green-400' },
  REJECTED: { label: 'Refusé', bg: 'bg-red-500/20', text: 'text-red-400' },
  ACTIVE: { label: 'En cours', bg: 'bg-blue-500/20', text: 'text-blue-400' },
  COMPLETED: { label: 'Terminé', bg: 'bg-gray-500/20', text: 'text-gray-400' },
  CANCELLED: { label: 'Annulé', bg: 'bg-gray-500/20', text: 'text-gray-400' },
}

export default function EquipmentPage() {
  const [activeTab, setActiveTab] = useState<'catalog' | 'reservations'>('catalog')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showReservationModal, setShowReservationModal] = useState(false)
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null)
  
  const [equipment, setEquipment] = useState<Equipment[]>([])
  const [myReservations, setMyReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Form state
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [purpose, setPurpose] = useState('')

  // Fetch equipment
  useEffect(() => {
    fetchEquipment()
    fetchMyReservations()
  }, [])

  const fetchEquipment = async () => {
    try {
      const res = await fetch('/api/equipment')
      if (res.ok) {
        const data = await res.json()
        setEquipment(data)
      }
    } catch (error) {
      console.error('Error fetching equipment:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchMyReservations = async () => {
    try {
      const res = await fetch('/api/equipment/reserve')
      if (res.ok) {
        const data = await res.json()
        setMyReservations(data)
      }
    } catch (error) {
      console.error('Error fetching reservations:', error)
    }
  }

  const handleReservation = async () => {
    if (!selectedEquipment || !startDate || !endDate || !purpose) {
      setMessage({ type: 'error', text: 'Veuillez remplir tous les champs' })
      return
    }

    setSubmitting(true)
    setMessage(null)

    try {
      const res = await fetch('/api/equipment/reserve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          equipmentId: selectedEquipment.id,
          startDate,
          endDate,
          purpose
        })
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: 'Réservation créée avec succès !' })
        setShowReservationModal(false)
        setStartDate('')
        setEndDate('')
        setPurpose('')
        fetchEquipment()
        fetchMyReservations()
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur lors de la réservation' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion' })
    } finally {
      setSubmitting(false)
    }
  }

  const filteredEquipment = selectedCategory
    ? equipment.filter(e => e.category === selectedCategory)
    : equipment

  const availableCategories = Array.from(new Set(equipment.map(e => e.category)))

  if (loading) {
    return (
      <>
        <Header title="Gestion du Matériel" subtitle="Chargement..." />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 text-africrea-green-500 animate-spin" />
        </div>
      </>
    )
  }

  return (
    <>
      <Header 
        title="Gestion du Matériel" 
        subtitle="Réservez caméras, éclairages et équipements"
      />
      
      <div className="p-8">
        {/* Message */}
        {message && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 rounded-xl flex items-center gap-3 ${
              message.type === 'success' 
                ? 'bg-green-500/10 border border-green-500/30 text-green-400'
                : 'bg-red-500/10 border border-red-500/30 text-red-400'
            }`}
          >
            {message.type === 'success' ? <Check className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
            {message.text}
          </motion.div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'catalog'
                ? 'bg-africrea-green-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Catalogue
          </button>
          <button
            onClick={() => setActiveTab('reservations')}
            className={`px-6 py-3 rounded-xl font-medium transition-all ${
              activeTab === 'reservations'
                ? 'bg-africrea-green-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            Mes Réservations
          </button>
        </div>

        {activeTab === 'catalog' ? (
          <>
            {/* Category Filter */}
            <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-all ${
                  !selectedCategory
                    ? 'bg-africrea-green-500 text-white'
                    : 'bg-white/5 text-white/60 hover:bg-white/10'
                }`}
              >
                <Filter className="w-4 h-4" />
                Tous
              </button>
              {availableCategories.map((cat) => {
                const Icon = categoryIcons[cat] || Package
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
                    {categoryLabels[cat] || cat}
                  </button>
                )
              })}
            </div>

            {/* Equipment Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEquipment.map((item) => {
                const CategoryIcon = categoryIcons[item.category] || Package
                const status = statusConfig[item.status] || statusConfig.UNAVAILABLE
                const StatusIcon = status.icon
                const currentReservation = item.reservations?.[0]
                
                return (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -4 }}
                    className="bg-[#141414] border border-white/5 rounded-2xl overflow-hidden hover:border-africrea-green-500/30 transition-all duration-300"
                  >
                    <div className="relative h-44 overflow-hidden bg-white/5">
                      {item.image ? (
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <CategoryIcon className="w-16 h-16 text-white/20" />
                        </div>
                      )}
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
                      <p className="text-white/50 text-sm mb-4">{item.description || 'Pas de description'}</p>
                      
                      {currentReservation && (
                        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg text-sm">
                          <span className="text-yellow-400">
                            Réservé par {currentReservation.user.firstName} {currentReservation.user.lastName}
                          </span>
                          <br />
                          <span className="text-yellow-400/70">
                            Jusqu&apos;au {new Date(currentReservation.endDate).toLocaleDateString('fr-FR')}
                          </span>
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

            {filteredEquipment.length === 0 && (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-white/60 text-lg">Aucun matériel trouvé</h3>
              </div>
            )}
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
                const statusConf = reservationStatusConfig[reservation.status] || reservationStatusConfig.PENDING
                return (
                  <motion.div
                    key={reservation.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-6 bg-[#141414] border border-white/5 rounded-2xl"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold text-lg">{reservation.equipment.name}</h3>
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
                    <input 
                      type="date" 
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-africrea-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">Date de fin</label>
                    <input 
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      min={startDate || new Date().toISOString().split('T')[0]}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-africrea-green-500"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">Motif de la réservation</label>
                  <textarea
                    rows={3}
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-africrea-green-500 resize-none"
                    placeholder="Décrivez l'utilisation prévue..."
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      setShowReservationModal(false)
                      setStartDate('')
                      setEndDate('')
                      setPurpose('')
                    }}
                    className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    onClick={handleReservation}
                    disabled={submitting}
                    className="flex-1 py-3 bg-africrea-green-500 hover:bg-africrea-green-600 disabled:bg-africrea-green-500/50 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    {submitting ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      'Confirmer'
                    )}
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
