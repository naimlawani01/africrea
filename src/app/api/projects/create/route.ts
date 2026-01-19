import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// POST - Créer un projet pro (Admin/Trainer only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || !['ADMIN', 'TRAINER'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Non autorisé - Réservé aux formateurs et admins' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { title, description, type, startDate, endDate, location, maxParticipants, requirements, thumbnail } = body

    if (!title || !description || !type || !startDate) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      )
    }

    const project = await prisma.project.create({
      data: {
        title,
        description,
        type,
        status: 'UPCOMING',
        startDate: new Date(startDate),
        ...(endDate && { endDate: new Date(endDate) }),
        ...(location && { location }),
        ...(maxParticipants && { maxParticipants: parseInt(maxParticipants) }),
        ...(requirements && { requirements }),
        ...(thumbnail && { thumbnail }),
        creatorId: session.user.id
      }
    })

    return NextResponse.json(project, { status: 201 })
  } catch (error) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création' },
      { status: 500 }
    )
  }
}
