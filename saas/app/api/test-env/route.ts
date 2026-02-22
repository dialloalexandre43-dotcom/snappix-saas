import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    hasDatabaseUrl: !!process.env.DATABASE_URL,
    databaseUrlPreview: process.env.DATABASE_URL 
      ? `${process.env.DATABASE_URL.substring(0, 50)}...` 
      : 'Non défini',
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
  })
}






















