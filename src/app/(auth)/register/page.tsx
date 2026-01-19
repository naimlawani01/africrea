'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { 
  Mail, Lock, User, Eye, EyeOff, AlertCircle, 
  Palette, Box, Film, ChevronRight, Check
} from 'lucide-react'

const poles = [
  {
    id: 'GRAPHISME',
    name: 'Graphisme',
    icon: Palette,
    color: 'from-purple-500 to-pink-500',
    bgColor: 'bg-purple-500/10',
    borderColor: 'border-purple-500/30',
    activeColor: 'border-purple-500',
  },
  {
    id: 'ANIMATION_3D',
    name: 'Animation 3D',
    icon: Box,
    color: 'from-blue-500 to-cyan-500',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/30',
    activeColor: 'border-blue-500',
  },
  {
    id: 'AUDIOVISUEL',
    name: 'Audiovisuel',
    icon: Film,
    color: 'from-orange-500 to-red-500',
    bgColor: 'bg-orange-500/10',
    borderColor: 'border-orange-500/30',
    activeColor: 'border-orange-500',
  },
]

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    pole: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setError('Les mots de passe ne correspondent pas')
      return
    }
    if (formData.password.length < 6) {
      setError('Le mot de passe doit contenir au moins 6 caractères')
      return
    }
    setError('')
    setStep(2)
  }

  const handleSubmit = async () => {
    if (!formData.pole) {
      setError('Veuillez choisir un pôle')
      return
    }
    
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Une erreur est survenue')
        return
      }

      router.push('/login?registered=true')
    } catch {
      setError('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden px-4 py-12">
      {/* Background effects */}
      <div className="absolute inset-0 bg-pattern-grid opacity-20" />
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-africrea-green-500/20 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-africrea-gold-500/10 rounded-full blur-[150px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center mb-10">
          <Image
            src="/logo.png"
            alt="Africréa"
            width={280}
            height={100}
            priority
            className="h-20 w-auto"
          />
        </Link>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-8">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                step >= s 
                  ? 'bg-africrea-green-500 text-white' 
                  : 'bg-white/10 text-white/40'
              }`}>
                {step > s ? <Check className="w-5 h-5" /> : s}
              </div>
              {s < 2 && (
                <div className={`w-16 h-1 rounded-full transition-all duration-300 ${
                  step > s ? 'bg-africrea-green-500' : 'bg-white/10'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Form Card */}
        <div className="bg-[#141414] border border-white/10 rounded-3xl p-8 shadow-2xl">
          {step === 1 ? (
            <>
              <h1 className="text-2xl font-bold text-white mb-2 text-center">
                Créez votre compte
              </h1>
              <p className="text-white/50 text-center mb-8">
                Rejoignez la communauté Africréa
              </p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl mb-6"
                >
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 text-sm">{error}</span>
                </motion.div>
              )}

              <form onSubmit={handleStep1} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">
                      Prénom
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <User className="w-5 h-5 text-white/40" />
                      </div>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => updateFormData('firstName', e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-africrea-green-500 focus:ring-1 focus:ring-africrea-green-500 transition-all"
                        placeholder="Jean"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-white/70 text-sm font-medium mb-2">
                      Nom
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => updateFormData('lastName', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 px-4 text-white placeholder:text-white/30 focus:outline-none focus:border-africrea-green-500 focus:ring-1 focus:ring-africrea-green-500 transition-all"
                      placeholder="Dupont"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Adresse email
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Mail className="w-5 h-5 text-white/40" />
                    </div>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateFormData('email', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-africrea-green-500 focus:ring-1 focus:ring-africrea-green-500 transition-all"
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Lock className="w-5 h-5 text-white/40" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={(e) => updateFormData('password', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-12 text-white placeholder:text-white/30 focus:outline-none focus:border-africrea-green-500 focus:ring-1 focus:ring-africrea-green-500 transition-all"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-white/70 text-sm font-medium mb-2">
                    Confirmer le mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                      <Lock className="w-5 h-5 text-white/40" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder:text-white/30 focus:outline-none focus:border-africrea-green-500 focus:ring-1 focus:ring-africrea-green-500 transition-all"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-africrea-green-500 hover:bg-africrea-green-600 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Continuer
                  <ChevronRight className="w-5 h-5" />
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-white mb-2 text-center">
                Choisissez votre pôle
              </h1>
              <p className="text-white/50 text-center mb-8">
                Sélectionnez votre spécialisation principale
              </p>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-xl mb-6"
                >
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <span className="text-red-400 text-sm">{error}</span>
                </motion.div>
              )}

              <div className="space-y-4 mb-8">
                {poles.map((pole) => (
                  <motion.button
                    key={pole.id}
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => updateFormData('pole', pole.id)}
                    className={`w-full p-5 rounded-2xl border-2 transition-all duration-300 flex items-center gap-4 ${
                      formData.pole === pole.id
                        ? `${pole.bgColor} ${pole.activeColor}`
                        : `bg-white/5 border-white/10 hover:${pole.bgColor} hover:${pole.borderColor}`
                    }`}
                  >
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${pole.color} flex items-center justify-center`}>
                      <pole.icon className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-left flex-1">
                      <div className="text-white font-semibold text-lg">{pole.name}</div>
                    </div>
                    {formData.pole === pole.id && (
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${pole.color} flex items-center justify-center`}>
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </motion.button>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl transition-all duration-300"
                >
                  Retour
                </button>
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading || !formData.pole}
                  className="flex-1 py-4 bg-africrea-green-500 hover:bg-africrea-green-600 disabled:bg-africrea-green-500/50 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <div className="spinner w-5 h-5 border-2" />
                  ) : (
                    "S'inscrire"
                  )}
                </button>
              </div>
            </>
          )}

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-white/50">
              Déjà un compte ?{' '}
              <Link href="/login" className="text-africrea-green-400 hover:text-africrea-green-300 font-medium transition-colors">
                Connectez-vous
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
