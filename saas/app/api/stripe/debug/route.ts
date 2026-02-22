import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        plan: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        stripePriceId: true,
        stripeCurrentPeriodEnd: true,
      },
    })

    if (!user) {
      return NextResponse.json({ error: 'Utilisateur non trouvé' }, { status: 404 })
    }

    let stripeData = null
    if (user.stripeCustomerId) {
      try {
        const stripe = getStripe()
        const subscriptions = await stripe.subscriptions.list({
          customer: user.stripeCustomerId,
          limit: 5,
        })

        stripeData = {
          customerId: user.stripeCustomerId,
          subscriptions: subscriptions.data.map(sub => ({
            id: sub.id,
            status: sub.status,
            priceId: sub.items.data[0]?.price?.id,
            currentPeriodEnd: new Date(sub.current_period_end * 1000).toISOString(),
          })),
        }
      } catch (error: any) {
        stripeData = {
          error: error.message,
        }
      }
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        plan: user.plan,
        stripeCustomerId: user.stripeCustomerId,
        stripeSubscriptionId: user.stripeSubscriptionId,
        stripePriceId: user.stripePriceId,
        stripeCurrentPeriodEnd: user.stripeCurrentPeriodEnd,
      },
      stripe: stripeData,
      message: 'Debug information',
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}








