import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

/**
 * POST /api/stripe/portal
 * Create a Stripe Customer Portal session for managing subscription
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        stripeCustomerId: true,
      },
    })

    if (!user?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'Aucun client Stripe trouvé. Veuillez d\'abord créer un abonnement.' },
        { status: 404 }
      )
    }

    const stripe = getStripe()

    // Get base URL for return URL
    const getBaseUrl = () => {
      if (process.env.NEXTAUTH_URL) {
        return process.env.NEXTAUTH_URL
      }
      return 'http://localhost:3001'
    }

    const baseUrl = getBaseUrl()

    // Create portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${baseUrl}/billing`,
    })

    return NextResponse.json({
      url: portalSession.url,
    })
  } catch (error: any) {
    console.error('Error creating portal session:', error)
    return NextResponse.json(
      {
        error: error.message || 'Une erreur est survenue lors de la création de la session',
      },
      { status: 500 }
    )
  }
}




