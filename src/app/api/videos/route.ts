import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET - Récupérer toutes les vidéos
export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      include: {
        pole: true,
        uploadedBy: {
          select: { firstName: true, lastName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(videos)
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des vidéos' },
      { status: 500 }
    )
  }
}

