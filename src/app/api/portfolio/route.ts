import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Récupérer le portfolio de l'étudiant connecté
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    // Récupérer les soumissions validées (APPROVED) de l'étudiant
    const submissions = await prisma.submission.findMany({
      where: {
        userId: session.user.id,
        status: 'APPROVED'
      },
      include: {
        challenge: true,
        feedback: {
          include: {
            trainer: {
              select: { firstName: true, lastName: true }
            }
          }
        }
      },
      orderBy: { submittedAt: 'desc' }
    })

    // Transformer en format portfolio
    const portfolioItems = submissions.map(sub => ({
      id: sub.id,
      title: sub.challenge.title,
      description: sub.description || sub.challenge.description,
      category: sub.challenge.pole,
      thumbnail: sub.challenge.thumbnail,
      grade: sub.grade,
      createdAt: sub.submittedAt,
      challengeId: sub.challengeId,
      fileUrl: sub.fileUrl,
      feedback: sub.feedback.length > 0 ? sub.feedback[0].content : null
    }))

    // Stats
    const stats = {
      totalProjects: portfolioItems.length,
      averageGrade: portfolioItems.length > 0 
        ? Math.round(portfolioItems.reduce((acc, item) => acc + (item.grade || 0), 0) / portfolioItems.length)
        : 0
    }

    return NextResponse.json({ items: portfolioItems, stats })
  } catch (error) {
    console.error('Error fetching portfolio:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération' },
      { status: 500 }
    )
  }
}

