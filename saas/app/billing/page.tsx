import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import BillingClient from './BillingClient'

export default async function BillingPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      plan: true,
      stripeCustomerId: true,
      stripeSubscriptionId: true,
      stripeCurrentPeriodEnd: true,
    },
  })

  const userPlan = (user?.plan as 'FREE' | 'STARTER' | 'PRO') || 'FREE'

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <BillingClient
        currentPlan={userPlan}
        subscriptionEnd={user?.stripeCurrentPeriodEnd}
        hasSubscription={!!user?.stripeSubscriptionId}
      />
    </main>
  )
}
