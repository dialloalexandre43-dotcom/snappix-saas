import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const config = {
      hasStripeSecretKey: !!process.env.STRIPE_SECRET_KEY,
      stripeSecretKeyPreview: process.env.STRIPE_SECRET_KEY 
        ? `${process.env.STRIPE_SECRET_KEY.substring(0, 20)}...` 
        : 'NOT SET',
      hasStripePriceStarter: !!process.env.STRIPE_PRICE_ID_STARTER,
      stripePriceStarter: process.env.STRIPE_PRICE_ID_STARTER || 'NOT SET',
      hasStripePricePro: !!process.env.STRIPE_PRICE_ID_PRO,
      stripePricePro: process.env.STRIPE_PRICE_ID_PRO || 'NOT SET',
      hasWebhookSecret: !!process.env.STRIPE_WEBHOOK_SECRET,
      webhookSecretPreview: process.env.STRIPE_WEBHOOK_SECRET 
        ? `${process.env.STRIPE_WEBHOOK_SECRET.substring(0, 20)}...` 
        : 'NOT SET',
    }

    return NextResponse.json({
      success: true,
      config,
      message: 'Stripe configuration check',
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      { status: 500 }
    )
  }
}








