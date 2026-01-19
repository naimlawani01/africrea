import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// POST - Créer une réservation
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
    const { equipmentId, startDate, endDate, purpose } = body

    // Vérifier si l'équipement existe
    const equipment = await prisma.equipment.findUnique({
      where: { id: equipmentId }
    })

    if (!equipment) {
      return NextResponse.json(
        { error: 'Matériel non trouvé' },
        { status: 404 }
      )
    }

    // Vérifier les conflits de réservation
    const conflictingReservation = await prisma.equipmentReservation.findFirst({
      where: {
        equipmentId,
        status: { in: ['PENDING', 'APPROVED', 'ACTIVE'] },
        OR: [
          {
            startDate: { lte: new Date(endDate) },
            endDate: { gte: new Date(startDate) }
          }
        ]
      }
    })

    if (conflictingReservation) {
      return NextResponse.json(
        { error: 'Ce matériel est déjà réservé pour cette période' },
        { status: 409 }
      )
    }

    // Créer la réservation
    const reservation = await prisma.equipmentReservation.create({
      data: {
        equipmentId,
        userId: session.user.id,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        purpose,
        status: 'PENDING'
      },
      include: {
        equipment: true
      }
    })

    return NextResponse.json(reservation, { status: 201 })
  } catch (error) {
    console.error('Error creating reservation:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la réservation' },
      { status: 500 }
    )
  }
}

// GET - Récupérer mes réservations
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 401 }
      )
    }

    const reservations = await prisma.equipmentReservation.findMany({
      where: { userId: session.user.id },
      include: {
        equipment: true
      },
      orderBy: { startDate: 'desc' }
    })

    return NextResponse.json(reservations)
  } catch (error) {
    console.error('Error fetching reservations:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des réservations' },
      { status: 500 }
    )
  }
}

