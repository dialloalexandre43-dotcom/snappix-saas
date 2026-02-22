'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Download,
  Share2,
  Copy,
  Trash2,
  RefreshCw,
  CheckCircle2,
  Clock,
  Loader2,
  XCircle,
  ArrowLeft,
  ExternalLink,
  Image as ImageIcon,
  X,
} from 'lucide-react'

interface GeneratedImage {
  id: string
  imageUrl: string
  createdAt: Date
}

interface Job {
  id: string
  status: string
  style: string
  ratio: string
  sourceImageUrl: string
  sourceUrl?: string | null
  createdAt: Date
  generatedImages: GeneratedImage[]
}

interface JobClientProps {
  initialJob: Job
  jobId: string
}

export default function JobClient({ initialJob, jobId }: JobClientProps) {
  const [job, setJob] = useState<Job>(initialJob)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const router = useRouter()

  // Auto-refresh si le job est en cours de traitement
  useEffect(() => {
    if (job.status === 'PROCESSING' || job.status === 'PENDING') {
      const interval = setInterval(async () => {
        setIsRefreshing(true)
        try {
          const response = await fetch(`/api/jobs/${jobId}`)
          if (response.ok) {
            const updatedJob = await response.json()
            setJob(updatedJob)
            
            if (updatedJob.status === 'DONE' || updatedJob.status === 'ERROR') {
              clearInterval(interval)
            }
          }
        } catch (error) {
          console.error('Error refreshing job:', error)
        } finally {
          setIsRefreshing(false)
        }
      }, 3000)

      return () => clearInterval(interval)
    }
  }, [job.status, jobId])

  const statusConfig = {
    DONE: {
      label: 'Terminé',
      icon: CheckCircle2,
      className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    },
    PROCESSING: {
      label: 'En cours',
      icon: Loader2,
      className: 'bg-amber-100 text-amber-700 border-amber-200',
    },
    PENDING: {
      label: 'En attente',
      icon: Clock,
      className: 'bg-blue-100 text-blue-700 border-blue-200',
    },
    ERROR: {
      label: 'Échoué',
      icon: XCircle,
      className: 'bg-red-100 text-red-700 border-red-200',
    },
  }

  const formatDate = (date: Date) => {
    const now = new Date()
    const jobDate = new Date(date)
    const diffMs = now.getTime() - jobDate.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'À l\'instant'
    if (diffMins < 60) return `Il y a ${diffMins}min`
    if (diffHours < 24) return `Il y a ${diffHours}h`
    if (diffDays < 7) return `Il y a ${diffDays}j`
    return jobDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }

  const getPlatform = (url?: string | null) => {
    if (!url) return 'Unknown'
    if (url.includes('amazon')) return 'Amazon'
    if (url.includes('aliexpress')) return 'AliExpress'
    if (url.includes('shopify')) return 'Shopify'
    return 'Other'
  }

  const copyImageUrl = async (url: string) => {
    await navigator.clipboard.writeText(url)
    // TODO: Show toast
  }

  const downloadImage = async (url: string, filename: string) => {
    try {
      const response = await fetch(url)
      const blob = await response.blob()
      const downloadUrl = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = downloadUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      console.error('Error downloading image:', error)
    }
  }

  const config = statusConfig[job.status as keyof typeof statusConfig] || statusConfig.PENDING
  const Icon = config.icon

  return (
    <div className="w-full max-w-[1920px] mx-auto">
      {/* Header avec retour */}
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Retour au dashboard
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* COLONNE GAUCHE - Infos du job + Actions (sticky) */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="sticky top-24">
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle className="text-xl">Détails du job</CardTitle>
                <Badge variant="outline" className={`gap-1.5 ${config.className}`}>
                  <Icon className={`h-3.5 w-3.5 ${job.status === 'PROCESSING' ? 'animate-spin' : ''}`} />
                  {config.label}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Informations */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Style</p>
                  <p className="text-sm font-semibold">{job.style}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Format</p>
                  <p className="text-sm font-semibold">{job.ratio}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Plateforme</p>
                  <Badge variant="outline" className="text-xs">
                    {getPlatform(job.sourceUrl)}
                  </Badge>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Date de création</p>
                  <p className="text-sm font-medium">{formatDate(job.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Images générées</p>
                  <p className="text-sm font-semibold">{job.generatedImages.length} image{job.generatedImages.length > 1 ? 's' : ''}</p>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-border space-y-2">
                <Button className="w-full justify-start" size="default" variant="default">
                  <Download className="mr-2 h-4 w-4" />
                  Télécharger tout
                </Button>
                <Button variant="outline" className="w-full justify-start" size="default">
                  <Share2 className="mr-2 h-4 w-4" />
                  Partager
                </Button>
                <Button variant="outline" className="w-full justify-start" size="default">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Dupliquer
                </Button>
                {job.status === 'DONE' && (
                  <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50" size="default">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Supprimer
                  </Button>
                )}
              </div>

              {/* Image source (petite) */}
              {job.sourceImageUrl && (
                <div className="pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2">Image source</p>
                  <div className="aspect-square rounded-lg overflow-hidden bg-secondary border border-border">
                    <img
                      src={job.sourceImageUrl}
                      alt="Source"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* COLONNE DROITE - Images générées */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">Images générées</CardTitle>
                <Badge variant="outline" className="text-sm">
                  {job.generatedImages.length} image{job.generatedImages.length > 1 ? 's' : ''}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              {job.generatedImages.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                    {(job.status === 'PROCESSING' || job.status === 'PENDING') ? (
                      <Loader2 className="w-8 h-8 text-accent animate-spin" />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <p className="text-muted-foreground">
                    {(job.status === 'PROCESSING' || job.status === 'PENDING') 
                      ? 'Génération en cours... Les images apparaîtront automatiquement.' 
                      : 'Aucune image générée pour le moment.'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {job.generatedImages.map((image, index) => (
                    <div
                      key={image.id}
                      className="group relative aspect-square rounded-lg overflow-hidden bg-secondary border border-border hover:border-accent transition-all"
                    >
                      <img
                        src={image.imageUrl}
                        alt={`Generated ${index + 1}`}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 bg-white/20 hover:bg-white/30"
                          onClick={() => copyImageUrl(image.imageUrl)}
                          title="Copier l'URL"
                        >
                          <Copy className="h-4 w-4 text-white" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 bg-white/20 hover:bg-white/30"
                          onClick={() => downloadImage(image.imageUrl, `snappix-${job.id}-${index + 1}.jpg`)}
                          title="Télécharger"
                        >
                          <Download className="h-4 w-4 text-white" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-9 w-9 p-0 bg-white/20 hover:bg-white/30"
                          onClick={() => setSelectedImage(image.imageUrl)}
                          title="Voir en grand"
                        >
                          <ExternalLink className="h-4 w-4 text-white" />
                        </Button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                        <p className="text-[10px] text-white/90 font-medium">Image {index + 1}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal pour image sélectionnée */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <img
              src={selectedImage}
              alt="Selected"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
