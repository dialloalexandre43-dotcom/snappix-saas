import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getStripe, getPlanFromPriceId } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

// Endpoint pour synchroniser manuellement l'abonnement depuis Stripe
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
        stripeSubscriptionId: true,
      },
    })

    if (!user?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'Aucun client Stripe trouvé' },
        { status: 404 }
      )
    }

    const stripe = getStripe()

    // Récupérer tous les abonnements actifs du client
    const subscriptions = await stripe.subscriptions.list({
      customer: user.stripeCustomerId,
      status: 'active',
      limit: 1,
    })

    if (subscriptions.data.length === 0) {
      // Pas d'abonnement actif, remettre à FREE
      await prisma.user.update({
        where: { id: session.user.id },
        data: {
          plan: 'FREE',
          stripeSubscriptionId: null,
          stripePriceId: null,
          stripeCurrentPeriodEnd: null,
        },
      })
      return NextResponse.json({ 
        message: 'Aucun abonnement actif, plan remis à FREE',
        plan: 'FREE'
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

    const plan = getPlanFromPriceId(priceId)

    // @ts-ignore - Stripe subscription current_period_end property
    const currentPeriodEnd = (subscription as any).current_period_end

    // Mettre à jour l'utilisateur
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        plan,
        stripeSubscriptionId: subscription.id,
        stripePriceId: priceId,
        stripeCurrentPeriodEnd: new Date(currentPeriodEnd * 1000),
      },
    })

    return NextResponse.json({
      message: 'Abonnement synchronisé avec succès',
      plan,
      subscriptionId: subscription.id,
      priceId,
      periodEnd: new Date(currentPeriodEnd * 1000).toISOString(),
    })
  } catch (error: any) {
    console.error('Error syncing subscription:', error)
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}








