const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function addSourceUrlColumn() {
  try {
    console.log('🔄 Ajout de la colonne sourceUrl à la table Job...')
    
    // Exécuter la commande SQL directement
    await prisma.$executeRaw`
      ALTER TABLE "Job" 
      ADD COLUMN IF NOT EXISTS "sourceUrl" TEXT;
    `
    
    console.log('✅ Colonne sourceUrl ajoutée avec succès!')
  } catch (error) {
    console.error('❌ Erreur:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

addSourceUrlColumn()













