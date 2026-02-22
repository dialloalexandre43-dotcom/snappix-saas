import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const hasDbUrl = !!process.env.DATABASE_URL
    const dbUrlPreview = process.env.DATABASE_URL 
      ? `${process.env.DATABASE_URL.substring(0, 30)}...` 
      : 'Non défini'
    
    // Test de connexion
    await prisma.$connect()
    
    // Test de lecture
    const userCount = await prisma.user.count()
    
    return NextResponse.json({
      success: true,
      message: 'Connexion réussie',
      userCount,
      databaseUrl: hasDbUrl ? '✅ Variable trouvée' : '❌ Variable manquante',
      dbUrlPreview,
    })
  } catch (error: any) {
    console.error('Test DB Error:', error)
    
    return NextResponse.json({
      success: false,
      error: error?.message || 'Erreur inconnue',
      errorCode: error?.code,
      details: error?.toString(),
      databaseUrl: process.env.DATABASE_URL ? '✅ Variable trouvée' : '❌ Variable manquante',
      dbUrlPreview: process.env.DATABASE_URL 
        ? `${process.env.DATABASE_URL.substring(0, 30)}...` 
        : 'Non défini',
    }, { status: 500 })
  }
}

