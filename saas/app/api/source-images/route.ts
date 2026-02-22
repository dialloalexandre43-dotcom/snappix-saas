import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma, retryPrismaOperation } from '@/lib/prisma'
import { z } from 'zod'

const createSourceImageSchema = z.object({
  imageUrls: z.array(z.string().url()),
  sourceUrl: z.string().url(), // URL de la page produit
  productTitle: z.string().optional(), // Titre du produit (optionnel)
})

export async function POST(request: Request) {
  try {
    console.log('📥 POST /api/source-images - Headers:', {
      origin: request.headers.get('origin'),
      referer: request.headers.get('referer'),
      cookie: request.headers.get('cookie') ? 'present' : 'missing',
    })

    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      console.log('❌ Non authentifié - Session:', session)
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    console.log('✅ Utilisateur authentifié:', session.user.email)

    const body = await request.json()
    console.log('📦 Body reçu:', {
      hasImageUrls: !!body.imageUrls,
      imageUrlsCount: body.imageUrls?.length || 0,
      hasSourceUrl: !!body.sourceUrl,
    })

    const parsed = createSourceImageSchema.parse(body)

    // Créer une entrée pour chaque image source
    // On pourrait créer une table SourceImage, mais pour l'instant on va créer des jobs avec statut "SOURCE"
    // ou créer une table dédiée
    
    // Option 1: Créer des jobs avec un statut spécial "SOURCE_SAVED"
    // Option 2: Créer une nouvelle table SourceImage
    
    // Pour l'instant, on va créer un job avec toutes les images comme "images sources"
    // Le statut sera "DONE" pour indiquer que ce sont des images sources sauvegardées
    
    console.log('💾 Création du job pour images sources...')
    // Use retryPrismaOperation to handle "prepared statement already exists" errors
    const job = await retryPrismaOperation(() =>
      prisma.job.create({
        data: {
          userId: session.user.id,
          sourceImageUrl: parsed.imageUrls[0], // Image principale
          sourceUrl: parsed.sourceUrl,
          style: 'source-images', // Style spécial pour les images sources
          ratio: 'auto', // Ratio auto pour les images sources
          status: 'DONE', // Statut DONE car ce sont juste des images sauvegardées
        },
      })
    )

    console.log(`✅ Job ${job.id} créé, sauvegarde de ${parsed.imageUrls.length} images...`)

    // Créer une entrée GeneratedImage pour chaque image source
    // Cela permettra de les afficher dans le dashboard
    if (parsed.imageUrls.length > 0) {
      await retryPrismaOperation(() =>
        prisma.generatedImage.createMany({
          data: parsed.imageUrls.map((url) => ({
            jobId: job.id,
            imageUrl: url,
          })),
        })
      )
      console.log(`✅ ${parsed.imageUrls.length} images sauvegardées pour job ${job.id}`)
    }

    return NextResponse.json(
      { 
        jobId: job.id, 
        message: 'Images sources sauvegardées avec succès',
        imagesCount: parsed.imageUrls.length
      },
      { status: 201 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('❌ Erreur de validation Zod:', error.errors)
      return NextResponse.json(
        { 
          error: 'Données invalides', 
          details: error.errors,
          message: 'Les données envoyées ne sont pas valides. Vérifiez que imageUrls et sourceUrl sont fournis.'
        },
        { status: 400 }
      )
    }

    console.error('❌ Error saving source images:', error)
    console.error('Error type:', error?.constructor?.name)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    })

    // Si c'est une erreur Prisma (base de données)
    if (error && typeof error === 'object' && 'code' in error) {
      console.error('❌ Erreur Prisma:', error)
      return NextResponse.json(
        { 
          error: 'Erreur de base de données',
          message: 'Impossible de sauvegarder les images sources. Vérifiez la connexion.',
          details: process.env.NODE_ENV === 'development' ? String(error) : undefined
        },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { 
        error: 'Une erreur est survenue',
        message: error instanceof Error ? error.message : 'Erreur inconnue',
        details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.stack : undefined) : undefined
      },
      { status: 500 }
    )
  }
}








