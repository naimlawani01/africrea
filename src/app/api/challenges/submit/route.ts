import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// POST - Soumettre un travail pour un défi (Étudiants seulement)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    // Seuls les étudiants peuvent soumettre des travaux
    if (session.user.role !== 'STUDENT') {
      return NextResponse.json(
        { error: 'Seuls les étudiants peuvent soumettre des travaux' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { challengeId, fileUrl, description } = body

    // Vérifier si le défi existe
    const challenge = await prisma.challenge.findUnique({
      where: { id: challengeId }
    })

    if (!challenge) {
      return NextResponse.json(
        { error: 'Défi non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier la deadline
    if (challenge.deadline && new Date(challenge.deadline) < new Date()) {
      return NextResponse.json(
        { error: 'La deadline est passée' },
        { status: 400 }
      )
    }

    // Créer la soumission
    const submission = await prisma.submission.create({
      data: {
        challengeId,
        studentId: session.user.id,
        files: fileUrl || '/uploads/placeholder.zip',
        description: description || '',
        status: 'PENDING'
      },
      include: {
        challenge: true
      }
    })

    return NextResponse.json(submission, { status: 201 })
  } catch (error) {
    console.error('Error submitting work:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la soumission' },
      { status: 500 }
    )
  }
}

// GET - Récupérer mes soumissions
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const submissions = await prisma.submission.findMany({
      where: { studentId: session.user.id },
      include: {
        challenge: true,
        feedbacks: {
          include: {
            author: {
              select: { firstName: true, lastName: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(submissions)
  } catch (error) {
    console.error('Error fetching submissions:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération' },
      { status: 500 }
    )
  }
}
