'use client'

import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  href?: string
  className?: string
}

const sizes = {
  sm: { logo: 32, text: 'text-lg' },
  md: { logo: 44, text: 'text-xl' },
  lg: { logo: 56, text: 'text-2xl' },
  xl: { logo: 80, text: 'text-3xl' },
}

export default function Logo({ size = 'md', showText = true, href, className = '' }: LogoProps) {
  const { logo, text } = sizes[size]
  
  const content = (
    <div className={`flex items-center gap-3 ${className}`}>
      <Image
        src="/logo.svg"
        alt="Africréa"
        width={logo * 3}
        height={logo}
        className="h-auto"
        style={{ width: 'auto', height: logo }}
        priority
      />
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}

