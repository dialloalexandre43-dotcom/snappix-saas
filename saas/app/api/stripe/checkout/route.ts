import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getStripe, getPriceIdFromPlan } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    console.log('🔵 Checkout API called')
    
    // Vérifier que Stripe est configuré
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('❌ STRIPE_SECRET_KEY is missing')
      return NextResponse.json(
        { error: 'Stripe is not configured. STRIPE_SECRET_KEY is missing.' },
        { status: 500 }
      )
    }

    console.log('✅ Stripe secret key found')
    const stripe = getStripe()
    
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      console.error('❌ User not authenticated')
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    console.log('✅ User authenticated:', session.user.id)

    const { plan } = await request.json()
    console.log('📦 Plan requested:', plan)

    if (!plan || (plan !== 'STARTER' && plan !== 'PRO')) {
      console.error('❌ Invalid plan:', plan)
      return NextResponse.json(
        { error: 'Invalid plan. Choose STARTER or PRO.' },
        { status: 400 }
      )
    }

    // Récupérer l'utilisateur
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      console.error('❌ User not found:', session.user.id)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    console.log('✅ User found:', user.email)

    const priceId = getPriceIdFromPlan(plan)
    console.log('💰 Price ID for plan', plan, ':', priceId)
    
    if (!priceId) {
      console.error('❌ No price ID found for plan:', plan)
      return NextResponse.json({ error: 'Invalid plan - no price ID found' }, { status: 400 })
    }

    // Créer ou récupérer le client Stripe
    let customerId = user.stripeCustomerId

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          userId: user.id,
        },
      })
      customerId = customer.id

      // Mettre à jour l'utilisateur avec le customer ID
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      })
    }

    // Créer la session de checkout
    console.log('🛒 Creating Stripe checkout session...')
    console.log('   Customer ID:', customerId)
    console.log('   Price ID:', priceId)
    console.log('   Success URL:', `${process.env.NEXTAUTH_URL}/dashboard?success=true`)
    
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard?canceled=true`,
      metadata: {
        userId: user.id,
        plan,
      },
    })

    console.log('✅ Checkout session created:', checkoutSession.id)
    console.log('   Checkout URL:', checkoutSession.url)

    return NextResponse.json({ url: checkoutSession.url })
  } catch (error: any) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: error.message || 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}


