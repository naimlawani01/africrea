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
    <div className="min-h-screen bg-[#0a0a0a]">
      <Sidebar user={user} />
      <main className="ml-72 min-h-screen">
        {children}
      </main>
    </div>
  )
}
