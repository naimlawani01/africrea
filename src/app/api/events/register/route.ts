import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// POST - S'inscrire à un événement
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
    const { eventId } = body

    // Vérifier si l'événement existe
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        registrations: true
      }
    })

    if (!event) {
      return NextResponse.json(
        { error: 'Événement non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier si déjà inscrit
    const existingRegistration = await prisma.eventRegistration.findUnique({
      where: {
        eventId_userId: {
          eventId,
          userId: session.user.id
        }
      }
    })

    if (existingRegistration) {
      return NextResponse.json(
        { error: 'Vous êtes déjà inscrit à cet événement' },
        { status: 409 }
      )
    }

    // Vérifier le nombre de places
    const confirmedCount = event.registrations.filter(
      r => r.status === 'CONFIRMED'
    ).length

    let status = 'CONFIRMED'
    if (event.maxAttendees && confirmedCount >= event.maxAttendees) {
      status = 'WAITLIST'
    }

    // Créer l'inscription
    const registration = await prisma.eventRegistration.create({
      data: {
        eventId,
        userId: session.user.id,
        status
      },
      include: {
        event: true
      }
    })

    return NextResponse.json(registration, { status: 201 })
  } catch (error) {
    console.error('Error registering for event:', error)
    return NextResponse.json(
      { error: "Erreur lors de l'inscription" },
      { status: 500 }
    )
  }
}

// DELETE - Se désinscrire d'un événement
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const { searchParams } = new URL(req.url)
    const eventId = searchParams.get('eventId')

    if (!eventId) {
      return NextResponse.json(
        { error: 'Event ID requis' },
        { status: 400 }
      )
    }

    await prisma.eventRegistration.delete({
      where: {
        eventId_userId: {
          eventId,
          userId: session.user.id
        }
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error unregistering from event:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la désinscription' },
      { status: 500 }
    )
  }
}

