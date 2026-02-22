import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * Endpoint de test pour diagnostiquer les problèmes avec /api/jobs
 */
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      authenticated: !!session?.user?.id,
      userId: session?.user?.id || null,
      userEmail: session?.user?.email || null,
      headers: {
        origin: request.headers.get('origin'),
        referer: request.headers.get('referer'),
        cookie: request.headers.get('cookie') ? 'present' : 'missing',
        userAgent: request.headers.get('user-agent'),
      },
      env: {
        hasFalApiKey: !!process.env.FAL_AI_API_KEY,
        falModelId: process.env.FAL_AI_MODEL_ID || 'not set',
        nodeEnv: process.env.NODE_ENV,
      },
      message: session?.user?.id 
        ? '✅ Vous êtes authentifié. Vous pouvez tester /api/jobs'
        : '❌ Vous n\'êtes pas authentifié. Connectez-vous sur /login',
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Erreur lors du test',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    const body = await request.json()
    
    return NextResponse.json({
      timestamp: new Date().toISOString(),
      authenticated: !!session?.user?.id,
      userId: session?.user?.id || null,
      receivedBody: body,
      validation: {
        hasImageUrl: !!body.imageUrl,
        hasImageUrls: !!body.imageUrls,
        hasStyle: !!body.style,
        hasRatio: !!body.ratio,
        styleValue: body.style,
        ratioValue: body.ratio,
      },
      message: session?.user?.id 
        ? '✅ Données reçues et utilisateur authentifié. Vous pouvez utiliser /api/jobs'
        : '❌ Données reçues mais utilisateur non authentifié',
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Erreur lors du test POST',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}













