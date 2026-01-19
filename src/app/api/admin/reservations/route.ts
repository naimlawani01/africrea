import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Récupérer toutes les réservations (Admin/Trainer only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || !['ADMIN', 'TRAINER'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const reservations = await prisma.equipmentReservation.findMany({
      include: {
        equipment: true,
        user: {
          select: { firstName: true, lastName: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(reservations)
  } catch (error) {
    console.error('Error fetching reservations:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération' },
      { status: 500 }
    )
  }
}

// PATCH - Approuver/Rejeter une réservation
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || !['ADMIN', 'TRAINER'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { reservationId, status } = body

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { error: 'Statut invalide' },
        { status: 400 }
      )
    }

    const reservation = await prisma.equipmentReservation.update({
      where: { id: reservationId },
      data: { status },
      include: {
        equipment: true,
        user: {
          select: { firstName: true, lastName: true }
        }
      }
    })

    // Si approuvé, mettre à jour le statut du matériel
    if (status === 'APPROVED') {
      await prisma.equipment.update({
        where: { id: reservation.equipmentId },
        data: { status: 'RESERVED' }
      })
    }

    return NextResponse.json(reservation)
  } catch (error) {
    console.error('Error updating reservation:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la mise à jour' },
      { status: 500 }
    )
  }
}

