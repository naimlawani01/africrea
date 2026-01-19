import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET - Récupérer tous les défis
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const pole = searchParams.get('pole')

    const challenges = await prisma.challenge.findMany({
      where: pole ? { pole } : undefined,
      include: {
        creator: {
          select: { firstName: true, lastName: true }
        },
        _count: {
          select: { submissions: true }
        }
      },
      orderBy: { deadline: 'asc' }
    })

    return NextResponse.json(challenges)
  } catch (error) {
    console.error('Error fetching challenges:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des défis' },
      { status: 500 }
    )
  }
}
