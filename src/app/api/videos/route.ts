import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET - Récupérer toutes les vidéos
export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      include: {
        uploader: {
          select: { firstName: true, lastName: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    // Transformer pour le frontend (url -> videoUrl pour compatibilité)
    const transformedVideos = videos.map(video => ({
      ...video,
      videoUrl: video.url,
      uploadedBy: video.uploader
    }))

    return NextResponse.json(transformedVideos)
  } catch (error) {
    console.error('Error fetching videos:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des vidéos' },
      { status: 500 }
    )
  }
}
