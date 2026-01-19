'use client'

import { useState } from 'react'
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
  Network
} from 'lucide-react'

const events = [
  {
    id: '1',
    title: 'Masterclass Design UI/UX',
    description: 'Apprenez les fondamentaux du design d\'interface avec un expert de Google.',
    type: 'MASTERCLASS',
    date: '2024-01-25',
    time: '14:00',
    endTime: '17:00',
    location: 'Studio A',
    isOnline: false,
    maxAttendees: 20,
    currentAttendees: 18,
    thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
    speaker: 'Jean-Marc Dupont',
  },
  {
    id: '2',
    title: 'Atelier Blender - Modélisation',
    description: 'Session pratique de modélisation 3D sur Blender pour les débutants.',
    type: 'WORKSHOP',
    date: '2024-01-28',
    time: '10:00',
    endTime: '13:00',
    location: 'Salle Informatique',
    isOnline: false,
    maxAttendees: 15,
    currentAttendees: 12,
    thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
  },
  {
    id: '3',
    title: 'Conférence - L\'avenir du Cinéma Africain',
    description: 'Discussion sur les tendances et opportunités du cinéma africain.',
    type: 'CONFERENCE',
    date: '2024-02-02',
    time: '18:00',
    endTime: '20:00',
    location: 'Auditorium',
    isOnline: true,
    meetingLink: 'https://meet.google.com/abc-defg-hij',
    maxAttendees: 100,
    currentAttendees: 45,
    thumbnail: 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=400',
    speaker: 'Aminata Diallo',
  },
  {
    id: '4',
    title: 'Session Studio - Éclairage Portrait',
    description: 'Pratique en studio avec notre expert lumière.',
    type: 'STUDIO_SESSION',
    date: '2024-02-05',
    time: '09:00',
    endTime: '12:00',
    location: 'Studio Photo',
    isOnline: false,
    maxAttendees: 8,
    currentAttendees: 8,
    thumbnail: 'https://images.unsplash.com/photo-1598549746738-3fb2d6bdb0da?w=400',
  },
  {
    id: '5',
    title: 'Networking - Créatifs d\'Abidjan',
    description: 'Rencontrez d\'autres créatifs et élargissez votre réseau professionnel.',
    type: 'NETWORKING',
    date: '2024-02-10',
    time: '19:00',
    endTime: '22:00',
    location: 'Rooftop Africréa',
    isOnline: false,
    maxAttendees: 50,
    currentAttendees: 32,
    thumbnail: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=400',
  },
]

const myRegistrations = [
  { eventId: '1', status: 'CONFIRMED' },
  { eventId: '3', status: 'WAITLIST' },
]

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
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0, 1)) // January 2024
  const [selectedEvent, setSelectedEvent] = useState<typeof events[0] | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')

  const getRegistrationStatus = (eventId: string) => {
    return myRegistrations.find(r => r.eventId === eventId)?.status
  }

  const isEventFull = (event: typeof events[0]) => {
    return event.currentAttendees >= (event.maxAttendees || Infinity)
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
    
    const calendarDays = []
    
    // Previous month days
    for (let i = 0; i < startingDay; i++) {
      calendarDays.push({ day: null, isCurrentMonth: false })
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
      const dayEvents = events.filter(e => e.date === dateStr)
      calendarDays.push({ day: i, isCurrentMonth: true, events: dayEvents })
    }
    
    return calendarDays
  }

  const calendarDays = getDaysInMonth(currentDate)

  return (
    <>
      <Header 
        title="Événements" 
        subtitle="Masterclass, ateliers et rencontres professionnelles"
      />
      
      <div className="p-8">
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

          <div className="text-white/50 text-sm">
            {myRegistrations.length} inscription(s)
          </div>
        </div>

        {viewMode === 'list' ? (
          /* List View */
          <div className="space-y-6">
            {events.map((event) => {
              const config = typeConfig[event.type]
              const TypeIcon = config.icon
              const registrationStatus = getRegistrationStatus(event.id)
              const isFull = isEventFull(event)
              
              return (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ x: 4 }}
                  className="flex gap-6 p-6 bg-[#141414] border border-white/5 rounded-2xl hover:border-africrea-green-500/30 transition-all cursor-pointer"
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
                      {registrationStatus === 'CONFIRMED' && (
                        <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs rounded-lg flex items-center gap-1">
                          <Check className="w-3 h-3" />
                          Inscrit
                        </span>
                      )}
                      {registrationStatus === 'WAITLIST' && (
                        <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 text-xs rounded-lg">
                          Liste d&apos;attente
                        </span>
                      )}
                    </div>
                    
                    <h3 className="text-white font-semibold text-lg mb-2">{event.title}</h3>
                    <p className="text-white/50 text-sm mb-4">{event.description}</p>
                    
                    <div className="flex items-center gap-6 text-white/40 text-sm">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4" />
                        {event.time} - {event.endTime}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin className="w-4 h-4" />
                        {event.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        {event.currentAttendees}/{event.maxAttendees} places
                      </span>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex-shrink-0 flex items-center">
                    {!registrationStatus && !isFull && (
                      <button className="px-5 py-2.5 bg-africrea-green-500 hover:bg-africrea-green-600 text-white rounded-xl font-medium transition-colors">
                        S&apos;inscrire
                      </button>
                    )}
                    {isFull && !registrationStatus && (
                      <button className="px-5 py-2.5 bg-white/10 text-white/60 rounded-xl font-medium cursor-not-allowed">
                        Complet
                      </button>
                    )}
                  </div>
                </motion.div>
              )
            })}
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
                            const config = typeConfig[event.type]
                            return (
                              <div
                                key={event.id}
                                onClick={() => setSelectedEvent(event)}
                                className={`text-xs px-2 py-1 rounded ${config.bg} ${config.text} truncate cursor-pointer hover:opacity-80`}
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
              <img 
                src={selectedEvent.thumbnail} 
                alt={selectedEvent.title}
                className="w-full h-48 object-cover"
              />
              
              <div className="p-6">
                <div className="flex items-center gap-3 mb-4">
                  <span className={`px-3 py-1 rounded-lg text-xs font-medium ${typeConfig[selectedEvent.type].bg} ${typeConfig[selectedEvent.type].text}`}>
                    {typeConfig[selectedEvent.type].label}
                  </span>
                  {selectedEvent.isOnline && (
                    <span className="px-2 py-1 bg-blue-500/10 text-blue-400 text-xs rounded-lg flex items-center gap-1">
                      <Video className="w-3 h-3" />
                      En ligne
                    </span>
                  )}
                </div>
                
                <h2 className="text-2xl font-bold text-white mb-3">{selectedEvent.title}</h2>
                <p className="text-white/60 mb-6">{selectedEvent.description}</p>
                
                {selectedEvent.speaker && (
                  <div className="mb-4 p-3 bg-africrea-gold-500/10 border border-africrea-gold-500/20 rounded-xl">
                    <span className="text-africrea-gold-400 text-sm">Intervenant : {selectedEvent.speaker}</span>
                  </div>
                )}
                
                <div className="space-y-3 mb-6 text-white/60">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-africrea-green-400" />
                    <span>{new Date(selectedEvent.date).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-africrea-green-400" />
                    <span>{selectedEvent.time} - {selectedEvent.endTime}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5 text-africrea-green-400" />
                    <span>{selectedEvent.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-africrea-green-400" />
                    <span>{selectedEvent.currentAttendees}/{selectedEvent.maxAttendees} participants</span>
                  </div>
                </div>
                
                <button
                  className={`w-full py-4 rounded-xl font-semibold transition-colors ${
                    isEventFull(selectedEvent)
                      ? 'bg-white/10 text-white/60 cursor-not-allowed'
                      : 'bg-africrea-green-500 hover:bg-africrea-green-600 text-white'
                  }`}
                  disabled={isEventFull(selectedEvent)}
                >
                  {isEventFull(selectedEvent) ? 'Événement complet' : 'S\'inscrire à cet événement'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

