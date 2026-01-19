import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

// GET - Statistiques globales (Admin/Trainer)
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user || !['ADMIN', 'TRAINER'].includes(session.user.role)) {
      return NextResponse.json(
        { error: 'Non autorisé' },
        { status: 403 }
      )
    }

    const [
      totalUsers,
      totalStudents,
      totalTrainers,
      totalChallenges,
      totalSubmissions,
      pendingReservations,
      upcomingEvents,
      usersByPole
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'STUDENT' } }),
      prisma.user.count({ where: { role: 'TRAINER' } }),
      prisma.challenge.count(),
      prisma.submission.count(),
      prisma.equipmentReservation.count({ where: { status: 'PENDING' } }),
      prisma.event.count({ where: { date: { gte: new Date() } } }),
      prisma.user.groupBy({
        by: ['pole'],
        where: { role: 'STUDENT', pole: { not: null } },
        _count: true
      })
    ])

    return NextResponse.json({
      totalUsers,
      totalStudents,
      totalTrainers,
      totalChallenges,
      totalSubmissions,
      pendingReservations,
      upcomingEvents,
      usersByPole: usersByPole.map(p => ({
        pole: p.pole,
        count: p._count
      }))
    })
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération' },
      { status: 500 }
    )
  }
}

