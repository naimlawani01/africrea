'use client'

import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

interface ThemeToggleProps {
  className?: string
}

export default function ThemeToggle({ className = '' }: ThemeToggleProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // Get initial theme
    const savedTheme = localStorage.getItem('africrea-theme') as 'dark' | 'light' | null
    const initialTheme = savedTheme || (document.documentElement.classList.contains('light') ? 'light' : 'dark')
    setTheme(initialTheme)
  }, [])

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark'
    setTheme(newTheme)
    
    // Apply to DOM
    document.documentElement.classList.remove('light', 'dark')
    document.documentElement.classList.add(newTheme)
    
    // Save to localStorage
    localStorage.setItem('africrea-theme', newTheme)
  }

  // Always render a visible button
  return (
    <button
      onClick={toggleTheme}
      className={`p-3 rounded-xl transition-all duration-300 ${
        mounted && theme === 'light'
          ? 'bg-amber-100 hover:bg-amber-200 text-amber-600'
          : 'bg-slate-800 hover:bg-slate-700 text-yellow-400'
      } ${className}`}
      aria-label={theme === 'dark' ? 'Passer en mode clair' : 'Passer en mode sombre'}
    >
      {mounted && theme === 'light' ? (
        <Moon className="w-5 h-5" />
      ) : (
        <Sun className="w-5 h-5" />
      )}
    </button>
  )
}
