import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Sidebar from '@/components/dashboard/Sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect('/login')
  }

  const user = {
    name: session.user.name || 'Utilisateur',
    email: session.user.email || '',
    role: session.user.role || 'STUDENT',
    pole: session.user.pole,
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] transition-colors duration-300">
      <Sidebar user={user} />
      {/* pt-16 for mobile header, lg:pt-0 for desktop */}
      {/* lg:ml-72 for desktop sidebar offset */}
      <main className="pt-16 lg:pt-0 lg:ml-72 min-h-screen">
        {children}
      </main>
    </div>
  )
}
