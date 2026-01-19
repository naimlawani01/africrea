'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/dashboard/Header'
import { 
  Check, 
  X, 
  Clock, 
  Loader2, 
  Camera,
  User,
  Calendar,
  AlertCircle
} from 'lucide-react'

interface Reservation {
  id: string
  startDate: string
  endDate: string
  purpose: string
  status: string
  createdAt: string
  equipment: {
    name: string
    category: string
  }
  user: {
    firstName: string
    lastName: string
    email: string
  }
}

const statusConfig: Record<string, { label: string; bg: string; text: string }> = {
  PENDING: { label: 'En attente', bg: 'bg-yellow-500/20', text: 'text-yellow-400' },
  APPROVED: { label: 'Approuvé', bg: 'bg-green-500/20', text: 'text-green-400' },
  REJECTED: { label: 'Refusé', bg: 'bg-red-500/20', text: 'text-red-400' },
  ACTIVE: { label: 'En cours', bg: 'bg-blue-500/20', text: 'text-blue-400' },
  COMPLETED: { label: 'Terminé', bg: 'bg-gray-500/20', text: 'text-gray-400' },
}

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('PENDING')

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      const res = await fetch('/api/admin/reservations')
      if (res.ok) {
        const data = await res.json()
        setReservations(data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStatus = async (reservationId: string, status: 'APPROVED' | 'REJECTED') => {
    setUpdating(reservationId)
    try {
      const res = await fetch('/api/admin/reservations', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reservationId, status })
      })

      if (res.ok) {
        fetchReservations()
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setUpdating(null)
    }
  }

  const filteredReservations = filter === 'ALL' 
    ? reservations 
    : reservations.filter(r => r.status === filter)

  const pendingCount = reservations.filter(r => r.status === 'PENDING').length

  if (loading) {
    return (
      <>
        <Header title="Gestion des Réservations" subtitle="Chargement..." />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 text-africrea-green-500 animate-spin" />
        </div>
      </>
    )
  }

  return (
    <>
      <Header 
        title="Gestion des Réservations" 
        subtitle={`${pendingCount} réservation(s) en attente`}
      />
      
      <div className="p-8">
        {/* Filters */}
        <div className="flex gap-3 mb-8 flex-wrap">
          {[
            { value: 'PENDING', label: 'En attente', count: reservations.filter(r => r.status === 'PENDING').length },
            { value: 'APPROVED', label: 'Approuvées', count: reservations.filter(r => r.status === 'APPROVED').length },
            { value: 'REJECTED', label: 'Refusées', count: reservations.filter(r => r.status === 'REJECTED').length },
            { value: 'ALL', label: 'Toutes', count: reservations.length },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-xl font-medium transition-all flex items-center gap-2 ${
                filter === f.value
                  ? 'bg-africrea-green-500 text-white'
                  : 'bg-white/5 text-white/60 hover:bg-white/10'
              }`}
            >
              {f.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                filter === f.value ? 'bg-white/20' : 'bg-white/10'
              }`}>
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* Reservations List */}
        <div className="space-y-4">
          {filteredReservations.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-white/60 text-lg">Aucune réservation</h3>
            </div>
          ) : (
            filteredReservations.map((reservation) => {
              const status = statusConfig[reservation.status] || statusConfig.PENDING
              return (
                <motion.div
                  key={reservation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 bg-[#141414] border border-white/5 rounded-2xl"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 rounded-lg bg-africrea-green-500/10">
                          <Camera className="w-5 h-5 text-africrea-green-400" />
                        </div>
                        <div>
                          <h3 className="text-white font-semibold">{reservation.equipment.name}</h3>
                          <span className={`px-2 py-0.5 rounded text-xs ${status.bg} ${status.text}`}>
                            {status.label}
                          </span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <User className="w-4 h-4 text-white/40" />
                          <span className="text-white/70">
                            {reservation.user.firstName} {reservation.user.lastName}
                          </span>
                        </div>
                        <div>
                          <span className="text-white/40">Du </span>
                          <span className="text-white">{new Date(reservation.startDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div>
                          <span className="text-white/40">Au </span>
                          <span className="text-white">{new Date(reservation.endDate).toLocaleDateString('fr-FR')}</span>
                        </div>
                        <div className="col-span-2 md:col-span-1">
                          <span className="text-white/40">Motif: </span>
                          <span className="text-white">{reservation.purpose}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    {reservation.status === 'PENDING' && (
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleUpdateStatus(reservation.id, 'APPROVED')}
                          disabled={updating === reservation.id}
                          className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-500/50 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
                        >
                          {updating === reservation.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          Approuver
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(reservation.id, 'REJECTED')}
                          disabled={updating === reservation.id}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-500/50 text-white font-medium rounded-xl transition-colors flex items-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          Refuser
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )
            })
          )}
        </div>
      </div>
    </>
  )
}

