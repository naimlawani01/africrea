import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// POST - Ajouter une vidéo (Admin/Trainer only)
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
    const { title, description, videoUrl, thumbnail, duration, category, analysisGuide, poleId } = body

    if (!title || !description || !videoUrl || !category) {
      return NextResponse.json(
        { error: 'Champs requis manquants' },
        { status: 400 }
      )
    }

    const video = await prisma.video.create({
      data: {
        title,
        description,
        videoUrl,
        thumbnail,
        duration: duration ? parseInt(duration) : null,
        category,
        analysisGuide,
        uploadedById: session.user.id,
        ...(poleId && { poleId })
      }
    })

    return NextResponse.json(video, { status: 201 })
  } catch (error) {
    console.error('Error creating video:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création' },
      { status: 500 }
    )
  }
}

