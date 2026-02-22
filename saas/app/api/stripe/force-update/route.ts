import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getStripe, getPlanFromPriceId } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

// Endpoint pour forcer la mise à jour du plan
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
        { error: 'Aucun client Stripe trouvé' },
        { status: 404 }
      )
    }

    const stripe = getStripe()

    // Récupérer le premier abonnement actif
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: 'active',
      limit: 1,
    })

    if (subscriptions.data.length === 0) {
      return NextResponse.json({
        message: 'Aucun abonnement actif trouvé',
        plan: 'FREE',
      })
    }

    const subscription = subscriptions.data[0]
    const priceId = subscription.items.data[0]?.price?.id

    if (!priceId) {
      return NextResponse.json(
        { error: 'Impossible de récupérer le Price ID' },
        { status: 500 }
      )
    }

    console.log('Price ID from Stripe:', priceId)
    console.log('STRIPE_PRICE_ID_STARTER:', process.env.STRIPE_PRICE_ID_STARTER)
    console.log('STRIPE_PRICE_ID_PRO:', process.env.STRIPE_PRICE_ID_PRO)

    const plan = getPlanFromPriceId(priceId)
    console.log('Plan determined:', plan)

    // @ts-ignore - Stripe subscription current_period_end property
    const currentPeriodEnd = (subscription as any).current_period_end

    // Mettre à jour l'utilisateur
    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        plan,
        stripeSubscriptionId: subscription.id,
        stripePriceId: priceId,
        stripeCurrentPeriodEnd: new Date(currentPeriodEnd * 1000),
      },
    })

    return NextResponse.json({
      message: 'Plan mis à jour avec succès',
      plan: updated.plan,
      subscriptionId: subscription.id,
      priceId,
      periodEnd: new Date(currentPeriodEnd * 1000).toISOString(),
      debug: {
        priceIdFromStripe: priceId,
        priceIdStarter: process.env.STRIPE_PRICE_ID_STARTER,
        priceIdPro: process.env.STRIPE_PRICE_ID_PRO,
        planDetermined: plan,
      },
    })
  } catch (error: any) {
    console.error('Error forcing update:', error)
    return NextResponse.json(
      {
        error: error.message || 'Une erreur est survenue',
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}








