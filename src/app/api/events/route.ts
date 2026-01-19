import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET - Récupérer tous les événements
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    const userId = session?.user?.id

    const events = await prisma.event.findMany({
      include: {
        creator: {
          select: { firstName: true, lastName: true }
        },
        registrations: {
          select: { id: true, status: true, userId: true }
        }
      },
      orderBy: { date: 'asc' }
    })

    // Ajouter isRegistered pour chaque événement
    const eventsWithRegistrationStatus = events.map(event => ({
      ...event,
      isRegistered: userId ? event.registrations.some(r => r.userId === userId) : false,
      myRegistrationStatus: userId 
        ? event.registrations.find(r => r.userId === userId)?.status 
        : null
    }))

    return NextResponse.json(eventsWithRegistrationStatus)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des événements' },
      { status: 500 }
    )
  }
}
