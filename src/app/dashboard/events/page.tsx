'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Header from '@/components/dashboard/Header'
import { 
  Calendar, 
  MapPin,
  Clock,
  Users,
  Video,
  ChevronLeft,
  ChevronRight,
  Check,
  Star,
  Presentation,
  Wrench,
  Mic,
  Network,
  Loader2,
  AlertCircle,
  X,
  UserCheck
} from 'lucide-react'

interface Event {
  id: string
  title: string
  description: string
  type: string
  date: string
  endDate: string | null
  location: string
  isOnline: boolean
  meetingLink: string | null
  maxAttendees: number | null
  thumbnail: string | null
  creator: {
    firstName: string
    lastName: string
  }
  registrations: {
    id: string
    status: string
    userId: string
  }[]
  isRegistered: boolean
  myRegistrationStatus: string | null
}

const typeConfig: Record<string, { label: string; bg: string; text: string; icon: React.ElementType }> = {
  MASTERCLASS: { label: 'Masterclass', bg: 'bg-purple-500/10', text: 'text-purple-400', icon: Star },
  WORKSHOP: { label: 'Atelier', bg: 'bg-blue-500/10', text: 'text-blue-400', icon: Wrench },
  STUDIO_SESSION: { label: 'Session Studio', bg: 'bg-orange-500/10', text: 'text-orange-400', icon: Presentation },
  CONFERENCE: { label: 'Conférence', bg: 'bg-green-500/10', text: 'text-green-400', icon: Mic },
  NETWORKING: { label: 'Networking', bg: 'bg-pink-500/10', text: 'text-pink-400', icon: Network },
}

const months = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre']
const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

export default function EventsPage() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [registering, setRegistering] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events')
      if (res.ok) {
        const data = await res.json()
        setEvents(data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (eventId: string) => {
    setRegistering(eventId)
    setMessage(null)

    try {
      const res = await fetch('/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId })
      })

      const data = await res.json()

      if (res.ok) {
        setMessage({ type: 'success', text: 'Inscription réussie !' })
        fetchEvents() // Recharger pour mettre à jour isRegistered
        setSelectedEvent(null)
      } else {
        setMessage({ type: 'error', text: data.error || 'Erreur lors de l\'inscription' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion' })
    } finally {
      setRegistering(null)
    }
  }

  const handleUnregister = async (eventId: string) => {
    setRegistering(eventId)
    setMessage(null)

    try {
      const res = await fetch(`/api/events/register?eventId=${eventId}`, {
        method: 'DELETE'
      })

      if (res.ok) {
        setMessage({ type: 'success', text: 'Désinscription réussie' })
        fetchEvents()
        setSelectedEvent(null)
      } else {
        const data = await res.json()
        setMessage({ type: 'error', text: data.error || 'Erreur' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Erreur de connexion' })
    } finally {
      setRegistering(null)
    }
  }

  const getRegistrationCount = (event: Event) => {
    return event.registrations?.filter(r => r.status === 'CONFIRMED').length || 0
  }

  const isEventFull = (event: Event) => {
    if (!event.maxAttendees) return false
    return getRegistrationCount(event) >= event.maxAttendees
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()
    
    const calendarDays: { day: number | null; isCurrentMonth: boolean; events?: Event[] }[] = []
    
    for (let i = 0; i < startingDay; i++) {
      calendarDays.push({ day: null, isCurrentMonth: false })
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
      // Comparer les dates correctement
      const dayEvents = events.filter(e => {
        const eventDate = new Date(e.date)
        return eventDate.getFullYear() === year && 
               eventDate.getMonth() === month && 
               eventDate.getDate() === i
      })
      calendarDays.push({ day: i, isCurrentMonth: true, events: dayEvents })
    }
    
    return calendarDays
  }

  const calendarDays = getDaysInMonth(currentDate)
  const registeredCount = events.filter(e => e.isRegistered).length

  if (loading) {
    return (
      <>
        <Header title="Événements" subtitle="Chargement..." />
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 text-africrea-green-500 animate-spin" />
        </div>
      </>
    )
  }

  return (
    <>
      <Header 
        title="Événements" 
        subtitle="Masterclass, ateliers et rencontres professionnelles"
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
            <button onClick={() => setMessage(null)} className="ml-auto">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* View Toggle */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex bg-white/5 rounded-xl p-1">
            <button
              onClick={() => setViewMode('list')}
              className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
                viewMode === 'list' ? 'bg-africrea-green-500 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              Liste
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-5 py-2.5 rounded-lg font-medium transition-colors ${
                viewMode === 'calendar' ? 'bg-africrea-green-500 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              Calendrier
            </button>
          </div>

          <div className="flex items-center gap-4 text-white/50 text-sm">
            <span>{events.length} événement(s)</span>
            {registeredCount > 0 && (
              <span className="flex items-center gap-1 text-africrea-green-400">
                <UserCheck className="w-4 h-4" />
                {registeredCount} inscription(s)
              </span>
            )}
          </div>
        </div>

        {viewMode === 'list' ? (
          /* List View */
          <div className="space-y-6">
            {events.length === 0 ? (
              <div className="text-center py-16">
                <Calendar className="w-16 h-16 text-white/20 mx-auto mb-4" />
                <h3 className="text-white/60 text-lg">Aucun événement à venir</h3>
              </div>
            ) : (
              events.map((event) => {
                const config = typeConfig[event.type] || typeConfig.WORKSHOP
                const TypeIcon = config.icon
                const isFull = isEventFull(event)
                const attendeeCount = getRegistrationCount(event)
                
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ x: 4 }}
                    className={`flex gap-6 p-6 bg-[#141414] border rounded-2xl hover:border-africrea-green-500/30 transition-all cursor-pointer ${
                      event.isRegistered ? 'border-africrea-green-500/50' : 'border-white/5'
                    }`}
                    onClick={() => setSelectedEvent(event)}
                  >
                    {/* Date Badge */}
                    <div className="flex-shrink-0 w-20 h-20 rounded-2xl bg-africrea-green-500/10 flex flex-col items-center justify-center">
                      <span className="text-africrea-green-400 text-sm font-medium">
                        {months[new Date(event.date).getMonth()].slice(0, 3)}
                      </span>
                      <span className="text-white text-2xl font-bold">
                        {new Date(event.date).getDate()}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`px-3 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 ${config.bg} ${config.text}`}>
                          <TypeIcon className="w-3.5 h-3.5" />
                          {config.label}
                        </span>
                        {event.isOnline && (
                          <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-lg flex items-center gap-1">
                            <Video className="w-3 h-3" />
                            En ligne
                          </span>
                        )}
                        {event.isRegistered && (
                          <span className="px-2 py-1 bg-africrea-green-500/10 text-africrea-green-400 text-xs rounded-lg flex items-center gap-1">
                            <Check className="w-3 h-3" />
                            Inscrit
                          </span>
                        )}
                      </div>
                      
                      <h3 className="text-white font-semibold text-lg mb-2">{event.title}</h3>
                      <p className="text-white/50 text-sm mb-4 line-clamp-2">{event.description}</p>
                      
                      <div className="flex items-center gap-6 text-white/40 text-sm">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          {new Date(event.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="w-4 h-4" />
                          {event.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users className="w-4 h-4" />
                          {attendeeCount}{event.maxAttendees ? `/${event.maxAttendees}` : ''} places
                        </span>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex-shrink-0 flex items-center">
                      {event.isRegistered ? (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            handleUnregister(event.id)
                          }}
                          disabled={registering === event.id}
                          className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-xl font-medium transition-colors flex items-center gap-2"
                        >
                          {registering === event.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "Se désinscrire"
                          )}
                        </button>
                      ) : isFull ? (
                        <button className="px-5 py-2.5 bg-white/10 text-white/60 rounded-xl font-medium cursor-not-allowed">
                          Complet
                        </button>
                      ) : (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRegister(event.id)
                          }}
                          disabled={registering === event.id}
                          className="px-5 py-2.5 bg-africrea-green-500 hover:bg-africrea-green-600 disabled:bg-africrea-green-500/50 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
                        >
                          {registering === event.id ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            "S'inscrire"
                          )}
                        </button>
                      )}
                    </div>
                  </motion.div>
                )
              })
            )}
          </div>
        ) : (
          /* Calendar View */
          <div className="bg-[#141414] border border-white/5 rounded-2xl p-6">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={goToPreviousMonth}
                className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold text-white">
                {months[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h3>
              <button
                onClick={goToNextMonth}
                className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day Headers */}
              {days.map((day) => (
                <div key={day} className="text-center text-white/40 text-sm py-2">
                  {day}
                </div>
              ))}
              
              {/* Calendar Days */}
              {calendarDays.map((dayData, index) => (
                <div
                  key={index}
                  className={`min-h-24 p-2 rounded-xl border transition-colors ${
                    dayData.isCurrentMonth
                      ? 'bg-white/5 border-white/5 hover:border-africrea-green-500/30'
                      : 'bg-transparent border-transparent'
                  }`}
                >
                  {dayData.day && (
                    <>
                      <span className="text-white/60 text-sm">{dayData.day}</span>
                      {dayData.events && dayData.events.length > 0 && (
                        <div className="mt-1 space-y-1">
                          {dayData.events.slice(0, 2).map((event) => {
                            const config = typeConfig[event.type] || typeConfig.WORKSHOP
                            return (
                              <div
                                key={event.id}
                                onClick={() => setSelectedEvent(event)}
                                className={`text-xs px-2 py-1 rounded ${config.bg} ${config.text} truncate cursor-pointer hover:opacity-80 ${
                                  event.isRegistered ? 'ring-1 ring-africrea-green-500' : ''
                                }`}
                              >
                                {event.title}
                              </div>
                            )
                          })}
                          {dayData.events.length > 2 && (
                            <div className="text-xs text-white/40">
                              +{dayData.events.length - 2} autres
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedEvent(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#141414] border border-white/10 rounded-3xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {selectedEvent.thumbnail && (
                <img 
                  src={selectedEvent.thumbnail} 
                  alt={selectedEvent.title}
                  className="w-full h-48 object-cover"
                />
              )}
              
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium ${(typeConfig[selectedEvent.type] || typeConfig.WORKSHOP).bg} ${(typeConfig[selectedEvent.type] || typeConfig.WORKSHOP).text}`}>
                    {(typeConfig[selectedEvent.type] || typeConfig.WORKSHOP).label}
                  </span>
                  {selectedEvent.isOnline && (
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-lg flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      En ligne
                    </span>
                  )}
                  {selectedEvent.isRegistered && (
                    <span className="px-2 py-1 bg-africrea-green-500/10 text-africrea-green-400 text-xs rounded-lg flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Inscrit
                    </span>
                  )}
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-3">{selectedEvent.title}</h2>
                <p className="text-white/60 mb-6">{selectedEvent.description}</p>
                
                <div className="mb-4 p-3 bg-africrea-gold-500/10 border border-africrea-gold-500/20 rounded-xl">
                  <span className="text-africrea-gold-400 text-sm">
                    Organisé par : {selectedEvent.creator.firstName} {selectedEvent.creator.lastName}
                  </span>
                </div>
                
                <div className="space-y-3 mb-6 text-white/60">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-africrea-green-400" />
                    <span>{new Date(selectedEvent.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-africrea-green-400" />
                    <span>{new Date(selectedEvent.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-africrea-green-400" />
                    <span>{selectedEvent.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-africrea-green-400" />
                    <span>{getRegistrationCount(selectedEvent)}{selectedEvent.maxAttendees ? `/${selectedEvent.maxAttendees}` : ''} participants</span>
                  </div>
                </div>
                
                {selectedEvent.isRegistered ? (
                  <button
                    onClick={() => handleUnregister(selectedEvent.id)}
                    disabled={registering === selectedEvent.id}
                    className="w-full py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30"
                  >
                    {registering === selectedEvent.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      "Se désinscrire"
                    )}
                  </button>
                ) : (
                  <button
                    onClick={() => handleRegister(selectedEvent.id)}
                    disabled={registering === selectedEvent.id || isEventFull(selectedEvent)}
                    className={`w-full py-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${
                      isEventFull(selectedEvent)
                        ? 'bg-white/10 text-white/60 cursor-not-allowed'
                        : 'bg-africrea-green-500 hover:bg-africrea-green-600 text-white'
                    }`}
                  >
                    {registering === selectedEvent.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : isEventFull(selectedEvent) ? (
                      'Événement complet'
                    ) : (
                      "S'inscrire à cet événement"
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
