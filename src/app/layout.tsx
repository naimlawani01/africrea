import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Africréa - Plateforme de Formation Créative',
  description: 'Plateforme de gestion et suivi des étudiants créatifs - Graphisme, Animation 3D, Audiovisuel',
  keywords: ['formation', 'créatif', 'graphisme', 'animation 3D', 'audiovisuel', 'cinéma', 'Africréa'],
  authors: [{ name: 'Africréa' }],
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}

