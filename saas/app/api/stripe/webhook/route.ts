import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'
import { getPlanFromPriceId } from '@/lib/stripe'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

  if (!process.env.STRIPE_SECRET_KEY) {
    return NextResponse.json(
      { error: 'Stripe n\'est pas configuré' },
      { status: 500 }
    )
  }

  const stripe = getStripe()

  if (!webhookSecret) {
    console.error('STRIPE_WEBHOOK_SECRET is not set')
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    )
  }

  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 }
    )
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message)
    return NextResponse.json(
      { error: 'Invalid signature', message: error.message },
      { status: 400 }
    )
  }

  try {
    console.log(`📥 Webhook received: ${event.type}`)
    
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const subscriptionId = session.subscription as string

        console.log('Checkout session completed:', {
          userId,
          subscriptionId,
          customerId: session.customer,
        })

        if (subscriptionId) {
          // Récupérer l'abonnement complet depuis Stripe pour obtenir le Price ID
          const subscription = await stripe.subscriptions.retrieve(subscriptionId)
          const priceId = subscription.items.data[0]?.price?.id
          const customerId = subscription.customer as string

          console.log('Subscription retrieved:', {
            subscriptionId,
            priceId,
            customerId,
            status: subscription.status,
          })

          if (priceId) {
            const plan = getPlanFromPriceId(priceId)
            console.log('Plan determined:', plan)

            // Trouver l'utilisateur par userId (metadata) ou par customerId
            let userToUpdate
            if (userId) {
              userToUpdate = await prisma.user.findUnique({
                where: { id: userId },
              })
            }
            
            if (!userToUpdate && customerId) {
              userToUpdate = await prisma.user.findFirst({
                where: { stripeCustomerId: customerId },
              })
            }

            if (userToUpdate) {
              // @ts-ignore - Stripe subscription current_period_end property
              const currentPeriodEnd = (subscription as any).current_period_end
              await prisma.user.update({
                where: { id: userToUpdate.id },
                data: {
                  plan,
                  stripeSubscriptionId: subscriptionId,
                  stripePriceId: priceId,
                  stripeCurrentPeriodEnd: new Date(currentPeriodEnd * 1000),
                },
              })
              console.log(`✅ User ${userToUpdate.id} updated to plan ${plan} via checkout.session.completed`)
            } else {
              console.error('❌ User not found for userId:', userId, 'or customerId:', customerId)
            }
          } else {
            console.error('❌ No price ID found in subscription:', subscriptionId)
          }
        } else {
          console.error('❌ No subscription ID in checkout session')
        }
        break
      }

      case 'customer.subscription.updated':
      case 'customer.subscription.created': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // @ts-ignore - Stripe subscription cancel_at_period_end property
        const cancelAtPeriodEnd = (subscription as any).cancel_at_period_end
        console.log('Subscription updated/created:', {
          subscriptionId: subscription.id,
          customerId,
          status: subscription.status,
          cancelAtPeriodEnd,
        })

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        })

        if (!user) {
          console.error('❌ User not found for customerId:', customerId)
          break
        }

        // Si l'abonnement est annulé ou expiré, remettre à FREE
        if (subscription.status === 'canceled' || subscription.status === 'unpaid' || subscription.status === 'past_due') {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan: 'FREE',
              stripeSubscriptionId: null,
              stripePriceId: null,
              stripeCurrentPeriodEnd: null,
            },
          })
          console.log(`✅ User ${user.id} downgraded to FREE (subscription ${subscription.status})`)
          break
        }

        const priceId = subscription.items.data[0]?.price?.id
        if (!priceId) {
          console.error('❌ No price ID in subscription:', subscription.id)
          break
        }

        const plan = getPlanFromPriceId(priceId)
        // @ts-ignore - Stripe subscription properties with underscores
        const cancelAtPeriodEnd = (subscription as any).cancel_at_period_end
        // @ts-ignore - Stripe subscription current_period_end property
        const currentPeriodEnd = (subscription as any).current_period_end
        console.log('Updating user plan:', {
          userId: user.id,
          plan,
          priceId,
          cancelAtPeriodEnd,
        })

        await prisma.user.update({
          where: { id: user.id },
          data: {
            plan,
            stripeSubscriptionId: subscription.id,
            stripePriceId: priceId,
            stripeCurrentPeriodEnd: new Date(currentPeriodEnd * 1000),
          },
        })

        console.log(`✅ User ${user.id} updated to plan ${plan} via ${event.type}`)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        })

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan: 'FREE',
              stripeSubscriptionId: null,
              stripePriceId: null,
              stripeCurrentPeriodEnd: null,
            },
          })
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        })

        if (user && invoice.subscription) {
          const subscription = await getStripe().subscriptions.retrieve(
            invoice.subscription as string
          )

          if (subscription.items.data[0]?.price?.id) {
            const priceId = subscription.items.data[0].price.id
            const plan = getPlanFromPriceId(priceId)
            // @ts-ignore - Stripe subscription current_period_end property
            const currentPeriodEnd = (subscription as any).current_period_end

            await prisma.user.update({
              where: { id: user.id },
              data: {
                plan,
                stripeCurrentPeriodEnd: new Date(currentPeriodEnd * 1000),
              },
            })
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        // Optionnel : gérer les échecs de paiement
        console.log('Payment failed for subscription:', event.data.object)
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error: any) {
    console.error('Error processing webhook:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}


