'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Sun, Moon } from 'lucide-react'
import { useThemeSafe } from '@/contexts/ThemeContext'

interface ThemeToggleProps {
  className?: string
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const themeContext = useThemeSafe()
  const [localTheme, setLocalTheme] = useState<'dark' | 'light'>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // If no context, manage theme locally
    if (!themeContext) {
      const savedTheme = localStorage.getItem('africrea-theme') as 'dark' | 'light'
      if (savedTheme) {
        setLocalTheme(savedTheme)
      } else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
        setLocalTheme('light')
      }
    }
  }, [themeContext])

  const theme = themeContext?.theme ?? localTheme

  const handleToggle = () => {
    if (themeContext) {
      themeContext.toggleTheme()
    } else {
      // Manage locally if no context
      const newTheme = localTheme === 'dark' ? 'light' : 'dark'
      setLocalTheme(newTheme)
      localStorage.setItem('africrea-theme', newTheme)
      document.documentElement.classList.remove('light', 'dark')
      document.documentElement.classList.add(newTheme)
    }
  }

  if (!mounted) {
    return (
      <div className={`p-2.5 rounded-xl bg-gray-200 dark:bg-white/10 ${className}`}>
        <div className="w-5 h-5" />
      </div>
    )
  }

  return (
    <motion.button
      onClick={handleToggle}
      className={`relative p-2.5 rounded-xl transition-colors ${
        theme === 'dark' 
          ? 'bg-white/10 hover:bg-white/20 text-yellow-400' 
          : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
      } ${className}`}
      whileTap={{ scale: 0.95 }}
      aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === 'dark' ? 0 : 180 }}
        transition={{ duration: 0.3 }}
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
