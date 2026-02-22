import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import ManageSubscriptionClient from './ManageSubscriptionClient'

export default async function ManageSubscriptionPage() {
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

  if (!user?.stripeSubscriptionId) {
    redirect('/billing')
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-4xl">
      <ManageSubscriptionClient
        currentPlan={user.plan as 'FREE' | 'STARTER' | 'PRO'}
        subscriptionEnd={user.stripeCurrentPeriodEnd}
        subscriptionId={user.stripeSubscriptionId}
      />
    </main>
  )
}

