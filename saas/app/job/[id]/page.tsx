import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import JobClient from './JobClient'

export default async function JobPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  const { id } = await params

  const job = await prisma.job.findFirst({
    where: {
      id,
      userId: session.user.id,
    },
    include: {
      generatedImages: {
        orderBy: { createdAt: 'asc' },
      },
    },
  })

  if (!job) {
    redirect('/dashboard')
  }

  return (
    <main className="container mx-auto px-4 py-8 max-w-7xl">
      <JobClient initialJob={job} jobId={id} />
    </main>
  )
}
