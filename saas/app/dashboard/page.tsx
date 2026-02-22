import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import DashboardClient from './DashboardClient'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  // Récupérer l'utilisateur avec son plan
  let user = null
  let jobs: Array<{
    id: string
    style: string
    ratio: string
    status: string
    sourceUrl: string | null
    createdAt: Date
    generatedImages: Array<{
      id: string
      imageUrl: string
      createdAt: Date
    }>
  }> = []
  try {
    user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true },
    })

    jobs = await prisma.job.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        generatedImages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error)
    jobs = []
  }

  const userPlan = (user?.plan as 'FREE' | 'STARTER' | 'PRO') || 'FREE'

  // Calculer les statistiques
  const totalImages = jobs.reduce((sum, job) => sum + job.generatedImages.length, 0)
  const completedJobs = jobs.filter(job => job.status === 'DONE').length
  const processingJobs = jobs.filter(job => job.status === 'PROCESSING' || job.status === 'PENDING').length
  const failedJobs = jobs.filter(job => job.status === 'ERROR').length

  // Images récentes (dernières 6)
  const recentImages = jobs
    .filter(job => job.status === 'DONE' && job.generatedImages.length > 0)
    .flatMap(job => job.generatedImages.map(img => ({ ...img, jobStyle: job.style })))
    .slice(0, 6)

  return (
    <DashboardClient 
      initialJobs={jobs} 
      userPlan={userPlan}
      stats={{
        totalJobs: jobs.length,
        totalImages,
        completedJobs,
        processingJobs,
        failedJobs,
      }}
      recentImages={recentImages}
    />
  )
}
