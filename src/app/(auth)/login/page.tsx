'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react'
import ThemeToggle from '@/components/ThemeToggle'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError('Email ou mot de passe incorrect')
      } else {
        router.push('/dashboard')
        router.refresh()
      }
    } catch {
      setError('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden px-4 py-8 transition-colors duration-300">
      {/* Theme Toggle - Fixed position */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle />
      </div>

      {/* Background effects */}
      <div className="absolute inset-0 bg-pattern-grid opacity-20 dark:opacity-20" />
      <div className="absolute top-1/4 left-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-africrea-green-500/10 dark:bg-africrea-green-500/20 rounded-full blur-[100px] sm:blur-[150px]" />
      <div className="absolute bottom-1/4 right-1/4 w-64 sm:w-96 h-64 sm:h-96 bg-africrea-gold-500/5 dark:bg-africrea-gold-500/10 rounded-full blur-[100px] sm:blur-[150px]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center mb-6 sm:mb-10">
          <Image
            src="/logo.png"
            alt="Africréa"
            width={280}
            height={100}
            priority
            className="h-14 sm:h-20 w-auto object-contain"
          />
        </Link>

        {/* Form Card */}
        <div className="bg-white dark:bg-[#141414] border border-gray-200 dark:border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-xl dark:shadow-2xl transition-colors duration-300">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2 text-center">
            Bon retour parmi nous !
          </h1>
          <p className="text-gray-500 dark:text-white/50 text-center mb-6 sm:mb-8 text-sm sm:text-base">
            Connectez-vous pour accéder à votre espace
          </p>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-3 sm:p-4 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 rounded-xl mb-4 sm:mb-6"
            >
              <AlertCircle className="w-5 h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
              <span className="text-red-600 dark:text-red-400 text-sm">{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
            <div>
              <label className="block text-gray-700 dark:text-white/70 text-sm font-medium mb-2">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Mail className="w-5 h-5 text-gray-400 dark:text-white/40" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3.5 sm:py-4 pl-12 pr-4 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:border-africrea-green-500 focus:ring-1 focus:ring-africrea-green-500 transition-all"
                  placeholder="votre@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 dark:text-white/70 text-sm font-medium mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                  <Lock className="w-5 h-5 text-gray-400 dark:text-white/40" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-xl py-3.5 sm:py-4 pl-12 pr-12 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-white/30 focus:outline-none focus:border-africrea-green-500 focus:ring-1 focus:ring-africrea-green-500 transition-all"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/40 hover:text-gray-600 dark:hover:text-white/60 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-white/5 text-africrea-green-500 focus:ring-africrea-green-500"
                />
                <span className="text-gray-600 dark:text-white/60">Se souvenir de moi</span>
              </label>
              <Link href="/forgot-password" className="text-africrea-green-600 dark:text-africrea-green-400 hover:text-africrea-green-700 dark:hover:text-africrea-green-300 transition-colors">
                Mot de passe oublié ?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 sm:py-4 bg-africrea-green-500 hover:bg-africrea-green-600 disabled:bg-africrea-green-500/50 text-white font-semibold rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="spinner w-5 h-5 border-2" />
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200 dark:border-white/10 text-center">
            <p className="text-gray-500 dark:text-white/50 text-sm sm:text-base">
              Pas encore de compte ?{' '}
              <Link href="/register" className="text-africrea-green-600 dark:text-africrea-green-400 hover:text-africrea-green-700 dark:hover:text-africrea-green-300 font-medium transition-colors">
                Inscrivez-vous
              </Link>
            </p>
          </div>
        </div>

        {/* Demo credentials */}
        <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-africrea-gold-50 dark:bg-africrea-gold-500/10 border border-africrea-gold-200 dark:border-africrea-gold-500/30 rounded-xl">
          <p className="text-africrea-gold-700 dark:text-africrea-gold-400 text-xs sm:text-sm text-center">
            <strong>Compte démo :</strong> admin@africrea.com / admin123
          </p>
        </div>
      </motion.div>
    </div>
  )
}
