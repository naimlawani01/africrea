'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useTheme } from '@/contexts/ThemeContext'

interface ThemeToggleProps {
  className?: string
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className={`p-2.5 rounded-xl bg-gray-200 dark:bg-white/10 w-10 h-10 ${className}`} />
    )
  }

  return (
    <motion.button
      onClick={toggleTheme}
      className={`relative p-2.5 rounded-xl transition-all duration-300 ${
        theme === 'dark' 
          ? 'bg-slate-800 hover:bg-slate-700 text-yellow-400' 
          : 'bg-amber-100 hover:bg-amber-200 text-amber-600'
      } ${className}`}
      whileTap={{ scale: 0.9 }}
      whileHover={{ scale: 1.05 }}
      aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
    >
      <motion.div
        key={theme}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ duration: 0.3, type: 'spring' }}
      >
        {theme === 'dark' ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
      </motion.div>
    </motion.button>
  )
}
