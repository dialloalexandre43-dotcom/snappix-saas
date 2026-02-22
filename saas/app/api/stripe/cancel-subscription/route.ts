import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        stripeSubscriptionId: true,
      },
    })

    if (!user?.stripeSubscriptionId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      )
    }

    const stripe = getStripe()

    // Cancel the subscription at the end of the billing period
    const subscription = await stripe.subscriptions.update(user.stripeSubscriptionId, {
      cancel_at_period_end: true,
    })

    console.log(`✅ Subscription ${user.stripeSubscriptionId} set to cancel at period end`)

    // Use type assertion to access Stripe subscription properties
    // Convert via 'unknown' first to avoid type overlap issues
    const stripeSub = subscription as unknown as {
      cancel_at: number | null
      current_period_end: number
    }

    return NextResponse.json({
      message: 'Subscription will be cancelled at the end of the billing period',
      cancelAt: stripeSub.cancel_at ? new Date(stripeSub.cancel_at * 1000).toISOString() : null,
      currentPeriodEnd: new Date(stripeSub.current_period_end * 1000).toISOString(),
    })
  } catch (error: any) {
    console.error('Error cancelling subscription:', error)
    return NextResponse.json(
      { error: error.message || 'An error occurred while cancelling the subscription' },
      { status: 500 }
    )
  }
}

