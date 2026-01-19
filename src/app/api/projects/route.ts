import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET - Récupérer tous les projets
export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        creator: {
          select: { firstName: true, lastName: true }
        },
        participants: {
          include: {
            user: {
              select: { id: true, firstName: true, lastName: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(projects)
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des projets' },
      { status: 500 }
    )
  }
}

// POST - Postuler à un projet
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { projectId, message } = body

    // Vérifier si déjà participant
    const existingParticipant = await prisma.projectParticipant.findUnique({
      where: {
        projectId_userId: {
          projectId,
          userId: session.user.id
        }
      }
    })

    if (existingParticipant) {
      return NextResponse.json(
        { error: 'Vous avez déjà postulé à ce projet' },
        { status: 409 }
      )
    }

    const participant = await prisma.projectParticipant.create({
      data: {
        projectId,
        userId: session.user.id,
        role: 'PARTICIPANT',
        status: 'PENDING'
      },
      include: {
        project: true
      }
    })

    return NextResponse.json(participant, { status: 201 })
  } catch (error) {
    console.error('Error applying to project:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la candidature' },
      { status: 500 }
    )
  }
}

