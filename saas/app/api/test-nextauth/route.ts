import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const providers = authOptions.providers || []
  
  return NextResponse.json({
    providersCount: providers.length,
    providers: providers.map(p => ({
      id: p.id,
      name: p.name,
      type: p.type,
    })),
    hasGoogleProvider: providers.some(p => p.id === 'google'),
    googleProviderConfig: providers
      .find(p => p.id === 'google')
      ? {
          hasClientId: !!process.env.GOOGLE_CLIENT_ID,
          hasClientSecret: !!process.env.GOOGLE_CLIENT_SECRET,
          clientIdPrefix: process.env.GOOGLE_CLIENT_ID?.substring(0, 20) + '...' || 'MISSING',
        }
      : null,
    nextAuthUrl: process.env.NEXTAUTH_URL || 'MISSING',
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
  })
}



















