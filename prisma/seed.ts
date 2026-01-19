import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Créer l'administrateur
  const adminPassword = await hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@africrea.com' },
    update: {},
    create: {
      email: 'admin@africrea.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'Africréa',
      role: 'ADMIN',
      bio: 'Administrateur de la plateforme Africréa',
    },
  })
  console.log('✅ Admin créé:', admin.email)

  // Créer des formateurs
  const trainerPassword = await hash('trainer123', 12)
  
  const trainer1 = await prisma.user.upsert({
    where: { email: 'jean.marc@africrea.com' },
    update: {},
    create: {
      email: 'jean.marc@africrea.com',
      password: trainerPassword,
      firstName: 'Jean-Marc',
      lastName: 'Kouassi',
      role: 'TRAINER',
      pole: 'GRAPHISME',
      bio: 'Expert en design graphique et branding avec 15 ans d\'expérience',
    },
  })
  
  const trainer2 = await prisma.user.upsert({
    where: { email: 'aminata@africrea.com' },
    update: {},
    create: {
      email: 'aminata@africrea.com',
      password: trainerPassword,
      firstName: 'Aminata',
      lastName: 'Diallo',
      role: 'TRAINER',
      pole: 'AUDIOVISUEL',
      bio: 'Réalisatrice et directrice de la photographie',
    },
  })

  const trainer3 = await prisma.user.upsert({
    where: { email: 'paul@africrea.com' },
    update: {},
    create: {
      email: 'paul@africrea.com',
      password: trainerPassword,
      firstName: 'Paul',
      lastName: 'Tanoh',
      role: 'TRAINER',
      pole: 'ANIMATION_3D',
      bio: 'Artiste 3D et motion designer',
    },
  })

  console.log('✅ Formateurs créés')

  // Créer des étudiants
  const studentPassword = await hash('student123', 12)
  
  const students = [
    { email: 'student1@email.com', firstName: 'Marie', lastName: 'Koné', pole: 'GRAPHISME' },
    { email: 'student2@email.com', firstName: 'Kouamé', lastName: 'Assi', pole: 'ANIMATION_3D' },
    { email: 'student3@email.com', firstName: 'Sophie', lastName: 'Mensah', pole: 'AUDIOVISUEL' },
    { email: 'student4@email.com', firstName: 'David', lastName: 'Ouattara', pole: 'GRAPHISME' },
    { email: 'student5@email.com', firstName: 'Fatou', lastName: 'Traoré', pole: 'ANIMATION_3D' },
  ]

  for (const student of students) {
    await prisma.user.upsert({
      where: { email: student.email },
      update: {},
      create: {
        email: student.email,
        password: studentPassword,
        firstName: student.firstName,
        lastName: student.lastName,
        role: 'STUDENT',
        pole: student.pole,
      },
    })
  }
  console.log('✅ Étudiants créés')

  // Créer des défis (dates futures)
  const now = new Date()
  const challenges = [
    {
      title: 'Identité Visuelle Startup',
      description: 'Créez une identité visuelle complète pour une startup tech',
      brief: 'La startup "NeuraTech" recherche une identité moderne. Créez un logo, une palette et des mockups.',
      pole: 'GRAPHISME',
      difficulty: 'INTERMEDIATE',
      deadline: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000), // +14 jours
      creatorId: trainer1.id,
    },
    {
      title: 'Animation Logo 3D',
      description: 'Animez un logo en 3D avec des transitions fluides',
      brief: 'Créez une animation de 5 secondes d\'un logo avec des rotations et effets de lumière.',
      pole: 'ANIMATION_3D',
      difficulty: 'ADVANCED',
      deadline: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000), // +21 jours
      creatorId: trainer3.id,
    },
    {
      title: 'Court-métrage 3 minutes',
      description: 'Réalisez un court-métrage sur le thème de la rencontre',
      brief: 'Écrivez, tournez et montez un court-métrage de 3 minutes maximum.',
      pole: 'AUDIOVISUEL',
      difficulty: 'EXPERT',
      deadline: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000), // +30 jours
      creatorId: trainer2.id,
    },
  ]

  for (const challenge of challenges) {
    await prisma.challenge.create({
      data: challenge,
    })
  }
  console.log('✅ Défis créés')

  // Créer du matériel
  const equipmentItems = [
    { name: 'Sony A7 III', description: 'Caméra full frame 24.2MP', category: 'CAMERA' },
    { name: 'Canon EOS R5', description: 'Caméra mirrorless 45MP', category: 'CAMERA' },
    { name: 'Canon 24-70mm f/2.8', description: 'Objectif zoom professionnel', category: 'LENS' },
    { name: 'Aputure 600d Pro', description: 'Éclairage LED 600W', category: 'LIGHTING' },
    { name: 'Rode NTG5', description: 'Micro canon broadcast', category: 'AUDIO' },
    { name: 'iMac Pro 27"', description: 'Station de montage', category: 'COMPUTER' },
  ]

  for (const item of equipmentItems) {
    await prisma.equipment.create({
      data: item,
    })
  }
  console.log('✅ Matériel créé')

  // Créer des événements (dates futures - dans le mois en cours et le suivant)
  const event1Date = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000) // +3 jours
  event1Date.setHours(14, 0, 0, 0)
  const event1EndDate = new Date(event1Date)
  event1EndDate.setHours(17, 0, 0, 0)

  const event2Date = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000) // +7 jours
  event2Date.setHours(10, 0, 0, 0)
  const event2EndDate = new Date(event2Date)
  event2EndDate.setHours(13, 0, 0, 0)

  const event3Date = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000) // +10 jours
  event3Date.setHours(9, 0, 0, 0)
  const event3EndDate = new Date(event3Date)
  event3EndDate.setHours(12, 0, 0, 0)

  const event4Date = new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000) // +14 jours
  event4Date.setHours(18, 0, 0, 0)
  const event4EndDate = new Date(event4Date)
  event4EndDate.setHours(20, 0, 0, 0)

  const event5Date = new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000) // +21 jours
  event5Date.setHours(15, 0, 0, 0)
  const event5EndDate = new Date(event5Date)
  event5EndDate.setHours(18, 0, 0, 0)

  const events = [
    {
      title: 'Masterclass Design UI/UX',
      description: 'Apprenez les fondamentaux du design d\'interface avec un expert du domaine.',
      type: 'MASTERCLASS',
      date: event1Date,
      endDate: event1EndDate,
      location: 'Studio A',
      maxAttendees: 20,
      creatorId: trainer1.id,
    },
    {
      title: 'Atelier Blender - Modélisation',
      description: 'Introduction à la modélisation 3D avec Blender. Apportez votre ordinateur!',
      type: 'WORKSHOP',
      date: event2Date,
      endDate: event2EndDate,
      location: 'Salle Informatique',
      maxAttendees: 15,
      creatorId: trainer3.id,
    },
    {
      title: 'Session Studio Éclairage Portrait',
      description: 'Pratique des techniques d\'éclairage portrait en studio professionnel.',
      type: 'STUDIO_SESSION',
      date: event3Date,
      endDate: event3EndDate,
      location: 'Studio Photo',
      maxAttendees: 8,
      creatorId: trainer2.id,
    },
    {
      title: 'Conférence - Cinéma Africain',
      description: 'Discussion sur les tendances et opportunités du cinéma africain contemporain.',
      type: 'CONFERENCE',
      date: event4Date,
      endDate: event4EndDate,
      location: 'Auditorium Africréa',
      maxAttendees: 50,
      isOnline: true,
      creatorId: trainer2.id,
    },
    {
      title: 'Networking Créatifs',
      description: 'Rencontrez d\'autres créatifs et élargissez votre réseau professionnel.',
      type: 'NETWORKING',
      date: event5Date,
      endDate: event5EndDate,
      location: 'Rooftop Africréa',
      maxAttendees: 30,
      creatorId: admin.id,
    },
  ]

  for (const event of events) {
    await prisma.event.create({
      data: event,
    })
  }
  console.log('✅ Événements créés')

  // Créer des projets (dates futures)
  const projects = [
    {
      title: 'Tournage Publicité "Origine"',
      description: 'Tournage d\'une publicité pour une marque de cosmétiques locaux. Recherche de techniciens lumière et assistants caméra.',
      type: 'COMMERCIAL',
      status: 'UPCOMING',
      startDate: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000), // +15 jours
      endDate: new Date(now.getTime() + 17 * 24 * 60 * 60 * 1000), // +17 jours
      location: 'Studio Africréa',
      maxParticipants: 8,
      requirements: 'Expérience en éclairage studio souhaitée',
      creatorId: trainer2.id,
    },
    {
      title: 'Court-métrage "L\'Héritage"',
      description: 'Production d\'un court-métrage de 15 minutes sur le thème de la transmission. Équipe complète recherchée.',
      type: 'FILM_SHOOTING',
      status: 'IN_PROGRESS',
      startDate: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // -5 jours (déjà commencé)
      endDate: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000), // +25 jours
      location: 'Extérieurs Abidjan',
      maxParticipants: 12,
      requirements: 'Disponibilité les week-ends',
      creatorId: trainer2.id,
    },
    {
      title: 'Shooting Photo Collection Mode',
      description: 'Séance photo pour une collection de mode africaine contemporaine. Photographes et stylistes bienvenus.',
      type: 'PHOTO_SHOOT',
      status: 'UPCOMING',
      startDate: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000), // +20 jours
      location: 'Plateau, Abidjan',
      maxParticipants: 6,
      creatorId: trainer1.id,
    },
  ]

  for (const project of projects) {
    await prisma.project.create({
      data: project,
    })
  }
  console.log('✅ Projets créés')

  // Créer des vidéos
  const videos = [
    {
      title: 'Analyse : Parasite de Bong Joon-ho',
      description: 'Étude de la mise en scène et du symbolisme',
      url: 'https://example.com/video1',
      category: 'FILM_ANALYSIS',
      duration: 2340,
      analysisGuide: 'Observez les contrastes verticaux et l\'utilisation de la lumière.',
      uploaderId: trainer2.id,
    },
    {
      title: 'Techniques d\'éclairage 3 points',
      description: 'Maîtrisez le setup classique d\'éclairage',
      url: 'https://example.com/video2',
      category: 'TECHNIQUE',
      duration: 1820,
      uploaderId: trainer2.id,
    },
    {
      title: 'Tutoriel DaVinci Resolve',
      description: 'Bases de l\'étalonnage colorimétrique',
      url: 'https://example.com/video3',
      category: 'TUTORIAL',
      duration: 3600,
      uploaderId: trainer2.id,
    },
  ]

  for (const video of videos) {
    await prisma.video.create({
      data: video,
    })
  }
  console.log('✅ Vidéos créées')

  console.log('🎉 Seeding terminé avec succès!')
  console.log('')
  console.log('📧 Comptes de démonstration:')
  console.log('   Admin: admin@africrea.com / admin123')
  console.log('   Formateur: jean.marc@africrea.com / trainer123')
  console.log('   Étudiant: student1@email.com / student123')
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
