// Script de test pour vérifier la connexion à la base de données
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function testConnection() {
  try {
    console.log('Test de connexion à la base de données...')
    
    // Test simple de connexion
    await prisma.$connect()
    console.log('✅ Connexion réussie!')
    
    // Vérifier si les tables existent
    const userCount = await prisma.user.count()
    console.log(`✅ Table User existe, ${userCount} utilisateur(s)`)
    
    const jobCount = await prisma.job.count()
    console.log(`✅ Table Job existe, ${jobCount} job(s)`)
    
  } catch (error) {
    console.error('❌ Erreur:', error.message)
    console.error('Détails:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testConnection()






















