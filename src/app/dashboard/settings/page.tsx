'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '@/components/dashboard/Header'
import { 
  User, 
  Mail,
  Lock,
  Bell,
  Palette,
  Shield,
  Save,
  Camera
} from 'lucide-react'

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    // Simulate save
    await new Promise(resolve => setTimeout(resolve, 1000))
    setSaving(false)
  }

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'appearance', label: 'Apparence', icon: Palette },
  ]

  return (
    <>
      <Header 
        title="Paramètres" 
        subtitle="Gérez votre compte et vos préférences"
      />
      
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          {/* Tabs */}
          <div className="flex gap-2 mb-8 overflow-x-auto pb-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-3 rounded-xl font-medium flex items-center gap-2 whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-africrea-green-500 text-white'
                      : 'bg-white/5 text-white/60 hover:bg-white/10'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Avatar */}
              <div className="bg-[#141414] border border-white/5 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-6">Photo de profil</h3>
                <div className="flex items-center gap-6">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-africrea-green-500 to-africrea-green-600 flex items-center justify-center text-white text-3xl font-bold">
                      J
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-africrea-green-500 rounded-full text-white hover:bg-africrea-green-600 transition-colors">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm mb-2">
                      JPG, PNG ou GIF. Max 2MB.
                    </p>
                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg font-medium transition-colors">
                      Changer la photo
                    </button>
                  </div>
                </div>
              </div>

              {/* Personal Info */}
              <div className="bg-[#141414] border border-white/5 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-6">Informations personnelles</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">
                      Prénom
                    </label>
                    <input
                      type="text"
                      defaultValue="Jean"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      defaultValue="Dupont"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="email"
                        defaultValue="jean.dupont@email.com"
                        className="input-field pl-12"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">
                      Téléphone
                    </label>
                    <input
                      type="tel"
                      defaultValue="+225 07 XX XX XX XX"
                      className="input-field"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-white/70 text-sm font-medium mb-2">
                      Bio
                    </label>
                    <textarea
                      rows={3}
                      className="input-field resize-none"
                      defaultValue="Passionné de graphisme et d'identité visuelle..."
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={saving}
                className="px-6 py-3 bg-africrea-green-500 hover:bg-africrea-green-600 disabled:bg-africrea-green-500/50 text-white font-semibold rounded-xl transition-colors flex items-center gap-2"
              >
                {saving ? (
                  <div className="spinner w-5 h-5 border-2" />
                ) : (
                  <Save className="w-5 h-5" />
                )}
                Enregistrer les modifications
              </button>
            </motion.div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#141414] border border-white/5 rounded-2xl p-6"
            >
              <h3 className="text-white font-semibold mb-6">Préférences de notification</h3>
              <div className="space-y-6">
                {[
                  { id: 'newChallenge', label: 'Nouveau défi disponible', description: 'Être notifié quand un nouveau défi est publié', default: true },
                  { id: 'feedback', label: 'Feedback reçu', description: 'Notification quand un formateur commente votre travail', default: true },
                  { id: 'event', label: 'Événements et Masterclass', description: 'Rappels pour les événements à venir', default: true },
                  { id: 'project', label: 'Projets professionnels', description: 'Nouveaux projets correspondant à votre profil', default: false },
                  { id: 'newsletter', label: 'Newsletter', description: 'Actualités et conseils d\'Africréa', default: false },
                ].map((notification) => (
                  <div key={notification.id} className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div>
                      <div className="text-white font-medium">{notification.label}</div>
                      <div className="text-white/50 text-sm">{notification.description}</div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        defaultChecked={notification.default}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-africrea-green-500"></div>
                    </label>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="bg-[#141414] border border-white/5 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-6">Changer le mot de passe</h3>
                <div className="space-y-5 max-w-md">
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">
                      Mot de passe actuel
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="password"
                        className="input-field pl-12"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">
                      Nouveau mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="password"
                        className="input-field pl-12"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">
                      Confirmer le nouveau mot de passe
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40" />
                      <input
                        type="password"
                        className="input-field pl-12"
                        placeholder="••••••••"
                      />
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-africrea-green-500 hover:bg-africrea-green-600 text-white font-semibold rounded-xl transition-colors">
                    Mettre à jour
                  </button>
                </div>
              </div>

              <div className="bg-[#141414] border border-white/5 rounded-2xl p-6">
                <h3 className="text-white font-semibold mb-4">Sessions actives</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div>
                      <div className="text-white font-medium">Chrome sur MacOS</div>
                      <div className="text-white/50 text-sm">Abidjan, Côte d&apos;Ivoire • Actif maintenant</div>
                    </div>
                    <span className="px-3 py-1 bg-africrea-green-500/20 text-africrea-green-400 text-xs rounded-lg">
                      Session actuelle
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
                    <div>
                      <div className="text-white font-medium">Safari sur iPhone</div>
                      <div className="text-white/50 text-sm">Abidjan, Côte d&apos;Ivoire • Il y a 2 jours</div>
                    </div>
                    <button className="px-3 py-1 bg-red-500/20 text-red-400 text-xs rounded-lg hover:bg-red-500/30 transition-colors">
                      Déconnecter
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#141414] border border-white/5 rounded-2xl p-6"
            >
              <h3 className="text-white font-semibold mb-6">Thème</h3>
              <div className="grid grid-cols-3 gap-4 max-w-md">
                <button className="p-4 rounded-xl border-2 border-africrea-green-500 bg-africrea-green-500/10">
                  <div className="w-full h-20 bg-[#0a0a0a] rounded-lg mb-3" />
                  <span className="text-white text-sm">Sombre</span>
                </button>
                <button className="p-4 rounded-xl border-2 border-white/10 hover:border-white/30 transition-colors">
                  <div className="w-full h-20 bg-white rounded-lg mb-3" />
                  <span className="text-white/60 text-sm">Clair</span>
                </button>
                <button className="p-4 rounded-xl border-2 border-white/10 hover:border-white/30 transition-colors">
                  <div className="w-full h-20 bg-gradient-to-b from-white to-[#0a0a0a] rounded-lg mb-3" />
                  <span className="text-white/60 text-sm">Système</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </>
  )
}

