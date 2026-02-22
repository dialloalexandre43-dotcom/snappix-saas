'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
  Eye,
  Plus,
  Image as ImageIcon,
  FileImage,
  TrendingUp,
  AlertCircle,
  Download,
  DownloadCloud,
} from 'lucide-react'

interface GeneratedImage {
  id: string
  imageUrl: string
  createdAt: Date
  jobStyle?: string
}

interface Job {
  id: string
  style: string
  ratio: string
  status: string
  sourceUrl?: string | null
  createdAt: Date
  generatedImages: GeneratedImage[]
}

interface DashboardStats {
  totalJobs: number
  totalImages: number
  completedJobs: number
  processingJobs: number
  failedJobs: number
}

interface DashboardClientProps {
  initialJobs: Job[]
  userPlan?: 'FREE' | 'STARTER' | 'PRO'
  stats: DashboardStats
  recentImages: GeneratedImage[]
}

export default function DashboardClient({ 
  initialJobs, 
  userPlan = 'FREE',
  stats,
  recentImages 
}: DashboardClientProps) {
  const [jobs, setJobs] = useState<Job[]>(initialJobs)

  // Synchronisation automatique après retour du checkout Stripe (une seule fois)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const success = urlParams.get('success')
    
    if (success === 'true') {
      console.log('🔄 Payment successful, syncing subscription...')
      
      // Nettoyer l'URL immédiatement pour éviter les re-synchronisations
      window.history.replaceState({}, '', '/dashboard')
      
      // Synchroniser l'abonnement depuis Stripe (une seule fois)
      const syncSubscription = async () => {
        try {
          // Essayer d'abord avec sync-subscription
          let response = await fetch('/api/stripe/sync-subscription', {
            method: 'POST',
          })
          
          let data = await response.json()
          
          // Si ça ne fonctionne pas, essayer force-update
          if (!response.ok || data.plan === 'FREE') {
            console.log('Trying force-update...')
            response = await fetch('/api/stripe/force-update', {
              method: 'POST',
            })
            data = await response.json()
          }
          
          if (response.ok && data.plan !== 'FREE') {
            console.log('✅ Subscription synced successfully:', data.plan)
            // Recharger la page UNE SEULE FOIS pour afficher le nouveau plan
            setTimeout(() => {
              window.location.reload()
            }, 1000)
          } else {
            console.log('⚠️ Sync completed but plan is still FREE, webhook may be delayed')
          }
        } catch (error) {
          console.error('Error syncing subscription:', error)
        }
      }
      
      syncSubscription()
    }
  }, []) // Dépendances vides = s'exécute une seule fois au montage

  // Auto-refresh si des jobs sont en cours de traitement
  useEffect(() => {
    const hasProcessingJobs = jobs.some(job => job.status === 'PROCESSING' || job.status === 'PENDING')
    
    if (hasProcessingJobs) {
      const interval = setInterval(async () => {
        try {
          const response = await fetch('/api/jobs', {
            credentials: 'include',
          })
          if (response.ok) {
            const updatedJobs = await response.json()
            setJobs(updatedJobs)
            
            const allDone = updatedJobs.every((job: Job) => 
              job.status === 'DONE' || job.status === 'ERROR'
            )
            if (allDone) {
              clearInterval(interval)
            }
          }
        } catch (error) {
          console.error('Error refreshing jobs:', error)
        }
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [jobs])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DONE':
        return <Badge className="bg-green-100 text-green-700 border-green-200">✅ Completed</Badge>
      case 'PROCESSING':
        return <Badge className="bg-amber-100 text-amber-700 border-amber-200">⏳ Processing</Badge>
      case 'PENDING':
        return <Badge className="bg-blue-100 text-blue-700 border-blue-200">⏳ Pending</Badge>
      case 'ERROR':
        return <Badge className="bg-red-100 text-red-700 border-red-200">❌ Failed</Badge>
      default:
        return <Badge>{status}</Badge>
    }
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const jobDate = new Date(date)
    const diffMs = now.getTime() - jobDate.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Just now'
    if (diffMins < 60) return `${diffMins}min ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return jobDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })
  }

  // Fonction pour télécharger une image
  const downloadImage = async (imageUrl: string, filename: string) => {
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename || `snappix-${Date.now()}.jpg`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error)
      // Fallback : ouvrir dans un nouvel onglet
      window.open(imageUrl, '_blank')
    }
  }

  // Télécharger toutes les images d'un job
  const downloadAllImages = async (job: Job) => {
    for (let i = 0; i < job.generatedImages.length; i++) {
      const image = job.generatedImages[i]
      const filename = `snappix-${job.style}-${i + 1}-${Date.now()}.jpg`
      await downloadImage(image.imageUrl, filename)
      // Petit délai entre les téléchargements pour éviter de surcharger
      if (i < job.generatedImages.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 300))
      }
    }
  }

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Overview of your activity
              </p>
            </div>
            <Link href="/extension">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                New Job
              </Button>
            </Link>
          </div>
          <Badge variant="outline" className="text-sm">
            Plan {userPlan}
          </Badge>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Total Jobs</p>
                  <p className="text-2xl font-bold">{stats.totalJobs}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileImage className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Images Generated</p>
                  <p className="text-2xl font-bold">{stats.totalImages}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <ImageIcon className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Completed Jobs</p>
                  <p className="text-2xl font-bold">{stats.completedJobs}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">In Progress</p>
                  <p className="text-2xl font-bold">{stats.processingJobs}</p>
                </div>
                <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Loader2 className="w-6 h-6 text-amber-600 animate-spin" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Images Preview - Only API-generated images */}
        {recentImages.filter(image => 
          image.imageUrl && 
          image.imageUrl.trim() !== '' &&
          (image.imageUrl.startsWith('http://') || 
           image.imageUrl.startsWith('https://') ||
           image.imageUrl.startsWith('/api/proxy-image'))
        ).length > 0 && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Recent Images (Generated by API)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {recentImages
                  .filter(image => 
                    image.imageUrl && 
                    image.imageUrl.trim() !== '' &&
                    (image.imageUrl.startsWith('http://') || 
                     image.imageUrl.startsWith('https://') ||
                     image.imageUrl.startsWith('/api/proxy-image'))
                  )
                  .map((image) => (
                  <Link
                    key={image.id}
                    href={`/job/${jobs.find(j => j.generatedImages.some(img => img.id === image.id))?.id}`}
                    className="group relative aspect-square rounded-lg overflow-hidden border border-border hover:border-primary transition-colors"
                  >
                    <img
                      src={image.imageUrl}
                      alt={image.jobStyle || 'Image générée par l\'API'}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      loading="lazy"
                      onError={(e) => {
                        console.error('Erreur de chargement de l\'image récente:', image.imageUrl)
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                    {image.jobStyle && (
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                        <p className="text-xs text-white truncate">{image.jobStyle}</p>
                      </div>
                    )}
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Jobs List */}
        <div>
          <h2 className="text-xl font-semibold mb-4">My Jobs</h2>
          
          {jobs.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <Plus className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No jobs yet</h3>
              <p className="text-muted-foreground mb-6">
                Install the Chrome extension to create your first job
              </p>
              <Link href="/extension">
                <Button>Install Extension</Button>
              </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {getStatusBadge(job.status)}
                          <span className="text-sm font-medium">{job.style}</span>
                          <span className="text-sm text-muted-foreground">•</span>
                          <span className="text-sm text-muted-foreground">{job.ratio}</span>
                        </div>
                        
                        {job.sourceUrl && (
                          <p className="text-sm text-muted-foreground mb-2 truncate max-w-md">
                            {job.sourceUrl}
                          </p>
                        )}
                        
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>{formatDate(job.createdAt)}</span>
                          {job.generatedImages.length > 0 && (
                            <>
                              <span>•</span>
                              <span>{job.generatedImages.length} image{job.generatedImages.length > 1 ? 's' : ''}</span>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        {job.status === 'DONE' && job.generatedImages.length > 0 && (
                          <>
                            {job.generatedImages.length > 1 && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadAllImages(job)}
                                className="flex items-center gap-2"
                              >
                                <DownloadCloud className="w-4 h-4" />
                                <span className="hidden sm:inline">Download All</span>
                              </Button>
                            )}
                            <Link href={`/job/${job.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                            </Link>
                          </>
                        )}
                        {job.status === 'PROCESSING' || job.status === 'PENDING' ? (
                          <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                        ) : null}
                        {job.status === 'ERROR' && (
                          <AlertCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                    </div>

                    {/* Images Preview - Only for completed jobs with API-generated images */}
                    {job.status === 'DONE' && job.generatedImages.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-border">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-muted-foreground">
                            API Generated Images ({job.generatedImages.length})
                          </h4>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                          {job.generatedImages
                            .filter(image => {
                              // Vérifier que l'image a une URL valide (générée par l'API)
                              return image.imageUrl && 
                                     image.imageUrl.trim() !== '' &&
                                     (image.imageUrl.startsWith('http://') || 
                                      image.imageUrl.startsWith('https://') ||
                                      image.imageUrl.startsWith('/api/proxy-image'))
                            })
                            .map((image, index) => (
                            <div
                              key={image.id}
                              className="group relative aspect-square rounded-lg overflow-hidden border border-border hover:border-primary transition-colors bg-secondary"
                            >
                              <img
                                src={image.imageUrl}
                                alt={`${job.style} - Image générée ${index + 1}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                loading="lazy"
                                onError={(e) => {
                                  // Si l'image ne charge pas, masquer l'élément
                                  console.error('Erreur de chargement de l\'image:', image.imageUrl)
                                  const target = e.target as HTMLImageElement
                                  target.style.display = 'none'
                                }}
                              />
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="secondary"
                                    className="h-8 w-8 p-0"
                                    onClick={() => downloadImage(image.imageUrl, `snappix-${job.style}-${index + 1}.jpg`)}
                                    title="Download generated image"
                                  >
                                    <Download className="w-4 h-4" />
                                  </Button>
                                  <Link href={`/job/${job.id}`}>
                                    <Button
                                      size="sm"
                                      variant="secondary"
                                      className="h-8 w-8 p-0"
                                      title="View full size"
                                    >
                                      <Eye className="w-4 h-4" />
                                    </Button>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                        {job.generatedImages.filter(image => 
                          image.imageUrl && 
                          image.imageUrl.trim() !== '' &&
                          (image.imageUrl.startsWith('http://') || 
                           image.imageUrl.startsWith('https://') ||
                           image.imageUrl.startsWith('/api/proxy-image'))
                        ).length === 0 && (
                          <p className="text-sm text-muted-foreground text-center py-4">
                            No generated images available
                          </p>
                        )}
                      </div>
                    )}

                    {/* Progress bar for processing jobs */}
                    {(job.status === 'PROCESSING' || job.status === 'PENDING') && (
                      <div className="mt-4">
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300"
                            style={{ width: job.status === 'PROCESSING' ? '75%' : '25%' }}
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
