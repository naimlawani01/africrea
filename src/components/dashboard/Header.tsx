'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bell, Search, Menu, X } from 'lucide-react'

interface HeaderProps {
  title: string
  subtitle?: string
}

export default function Header({ title, subtitle }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const notifications = [
    { id: 1, title: 'Nouveau défi disponible', message: 'Le défi "Logo Minimaliste" est ouvert', time: 'Il y a 2h', unread: true },
    { id: 2, title: 'Feedback reçu', message: 'Marie a commenté votre travail', time: 'Il y a 5h', unread: true },
    { id: 3, title: 'Masterclass demain', message: 'N\'oubliez pas la session avec Jean-Marc', time: 'Hier', unread: false },
  ]

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0a]/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center justify-between px-8 py-5">
        {/* Title */}
        <div>
          <h1 className="text-2xl font-display font-bold text-white">{title}</h1>
          {subtitle && <p className="text-white/50 mt-1">{subtitle}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <AnimatePresence>
              {searchOpen && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 280, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="absolute right-0 top-1/2 -translate-y-1/2"
                >
                  <input
                    type="text"
                    placeholder="Rechercher..."
                    autoFocus
                    className="w-full px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder:text-white/40 focus:outline-none focus:border-africrea-green-500"
                    onBlur={() => setSearchOpen(false)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            >
              {searchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-africrea-green-500 rounded-full" />
            </button>

            <AnimatePresence>
              {notificationsOpen && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-40"
                    onClick={() => setNotificationsOpen(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-2 w-80 bg-[#141414] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-white/10">
                      <h3 className="text-white font-semibold">Notifications</h3>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${
                            notif.unread ? 'bg-africrea-green-500/5' : ''
                          }`}
                        >
                          <div className="flex items-start gap-3">
                            {notif.unread && (
                              <div className="w-2 h-2 rounded-full bg-africrea-green-500 mt-2" />
                            )}
                            <div className={notif.unread ? '' : 'ml-5'}>
                              <div className="text-white text-sm font-medium">{notif.title}</div>
                              <div className="text-white/50 text-sm mt-0.5">{notif.message}</div>
                              <div className="text-white/30 text-xs mt-1">{notif.time}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-white/5">
                      <button className="w-full text-center text-africrea-green-400 text-sm font-medium hover:text-africrea-green-300 transition-colors">
                        Voir toutes les notifications
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Mobile menu */}
          <button className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-colors lg:hidden">
            <Menu className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}

