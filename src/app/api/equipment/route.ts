import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

// GET - Récupérer tout le matériel
export async function GET() {
  try {
    const equipment = await prisma.equipment.findMany({
      include: {
        reservations: {
          where: {
            status: { in: ['APPROVED', 'ACTIVE'] },
            endDate: { gte: new Date() }
          },
          include: {
            user: {
              select: { firstName: true, lastName: true }
            }
          },
          orderBy: { startDate: 'asc' },
          take: 1
        }
      },
      orderBy: { name: 'asc' }
    })

    return NextResponse.json(equipment)
  } catch (error) {
    console.error('Error fetching equipment:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du matériel' },
      { status: 500 }
    )
  }
}

