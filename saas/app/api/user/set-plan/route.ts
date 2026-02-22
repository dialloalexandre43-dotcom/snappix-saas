import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { type UserPlan } from '@/lib/formats'

/**
 * POST /api/user/set-plan
 * Set user's plan manually (for testing purposes)
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const { plan } = body

    if (!plan || !['FREE', 'STARTER', 'PRO'].includes(plan)) {
      return NextResponse.json(
        { error: 'Plan invalide. Doit être FREE, STARTER ou PRO' },
        { status: 400 }
      )
    }

    // Mettre à jour l'utilisateur
    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        plan: plan as UserPlan,
        // Réinitialiser les champs Stripe si on passe à FREE
        ...(plan === 'FREE' && {
          stripeSubscriptionId: null,
          stripePriceId: null,
          stripeCurrentPeriodEnd: null,
        }),
      },
    })

    return NextResponse.json({
      message: 'Plan mis à jour avec succès',
      plan: updated.plan,
    })
  } catch (error: any) {
    console.error('Error setting plan:', error)
    return NextResponse.json(
      {
        error: error.message || 'Une erreur est survenue',
      },
      { status: 500 }
    )
  }
}




