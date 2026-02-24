import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { getFormatsByPlan, getStylesByPlan, type UserPlan } from '@/lib/formats'

// Force dynamic rendering (uses headers, session, etc.)
export const dynamic = 'force-dynamic'

/**
 * GET /api/user/plan
 * Get user's subscription plan, available formats, and available styles
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Get user from database
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true },
    })

    const plan: UserPlan = (user?.plan as UserPlan) || 'FREE'
    const formats = getFormatsByPlan(plan)
    const styles = getStylesByPlan(plan)

    return NextResponse.json({
      plan,
      formats,
      styles,
    })
  } catch (error) {
    console.error('Error fetching user plan:', error)
    return NextResponse.json(
      { 
        error: 'Une erreur est survenue', 
        plan: 'FREE', 
        formats: getFormatsByPlan('FREE'),
        styles: getStylesByPlan('FREE'),
      },
      { status: 500 }
    )
  }
}

