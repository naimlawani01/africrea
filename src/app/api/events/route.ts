import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET - Récupérer tous les événements
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        creator: {
          select: { firstName: true, lastName: true }
        },
        registrations: {
          select: { id: true, status: true }
        }
      },
      orderBy: { date: 'asc' }
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des événements' },
      { status: 500 }
    )
  }
}

