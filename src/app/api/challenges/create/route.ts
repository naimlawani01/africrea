import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// POST - Créer un nouveau défi (Admin/Trainer only)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || !['ADMIN', 'TRAINER'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { title, description, brief, pole, difficulty, deadline, thumbnail } = body

    if (!title || !description || !pole || !difficulty) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      )
    }

    const challenge = await prisma.challenge.create({
      data: {
        title,
        description,
        brief: brief || description,
        pole,
        difficulty,
        deadline: deadline ? new Date(deadline) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Par défaut 1 semaine
        ...(thumbnail && { thumbnail }),
        creatorId: session.user.id
      }
    })

    return NextResponse.json(challenge, { status: 201 })
  } catch (error) {
    console.error('Error creating challenge:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création' },
      { status: 500 }
    )
  }
}
