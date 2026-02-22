import Stripe from 'stripe'

let stripeInstance: Stripe | null = null

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error('STRIPE_SECRET_KEY is not set in environment variables')
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-11-20.acacia',
      typescript: true,
    })
  }
  return stripeInstance
}

// Prix Stripe pour chaque plan (à créer dans le dashboard Stripe)
export const STRIPE_PRICES = {
  STARTER: process.env.STRIPE_PRICE_ID_STARTER || 'price_starter', // 9€/mois
  PRO: process.env.STRIPE_PRICE_ID_PRO || 'price_pro', // 29€/mois
} as const

// Mapping des prix Stripe vers les plans
export function getPlanFromPriceId(priceId: string): 'FREE' | 'STARTER' | 'PRO' {
  console.log('🔍 Mapping Price ID to plan:', {
    priceId,
    starterPriceId: STRIPE_PRICES.STARTER,
    proPriceId: STRIPE_PRICES.PRO,
  })
  
  if (priceId === STRIPE_PRICES.STARTER) {
    console.log('✅ Mapped to STARTER')
    return 'STARTER'
  }
  if (priceId === STRIPE_PRICES.PRO) {
    console.log('✅ Mapped to PRO')
    return 'PRO'
  }
  
  console.log('⚠️ Price ID not found, defaulting to FREE')
  return 'FREE'
}

// Mapping des plans vers les prix Stripe
export function getPriceIdFromPlan(plan: 'FREE' | 'STARTER' | 'PRO'): string | null {
  if (plan === 'STARTER') return STRIPE_PRICES.STARTER
  if (plan === 'PRO') return STRIPE_PRICES.PRO
  return null
}

