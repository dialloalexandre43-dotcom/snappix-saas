import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma, retryPrismaOperation } from '@/lib/prisma'
import { z } from 'zod'
import { generateImagesWithFalAI } from '@/lib/falai'
import { getFormatsByPlan, formatIdToRatio, isFormatAvailableForPlan, isStyleAvailableForPlan, type UserPlan } from '@/lib/formats'

const createJobSchema = z.object({
  imageUrl: z.string().url().optional(),
  imageUrls: z.array(z.string().url()).optional(),
  sourceUrl: z.string().url().optional(), // URL de la page produit
  style: z.string(),
  ratio: z.string(),
}).refine((data) => data.imageUrl || (data.imageUrls && data.imageUrls.length > 0), {
  message: "imageUrl ou imageUrls doit être fourni",
})

// GET - Récupérer tous les jobs de l'utilisateur
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    const jobs = await prisma.job.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: 'desc' },
      include: {
        generatedImages: {
          orderBy: { createdAt: 'asc' },
        },
      },
    })

    return NextResponse.json(jobs)
  } catch (error) {
    console.error('Error fetching jobs:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}

// POST - Créer un nouveau job
export async function POST(request: Request) {
  try {
    // Log pour debug - TOUJOURS afficher ce log en premier
    console.log('═══════════════════════════════════════════════════════')
    console.log('📥 POST /api/jobs - REQUEST RECEIVED')
    console.log('═══════════════════════════════════════════════════════')
    console.log('📥 POST /api/jobs - Headers:', {
      origin: request.headers.get('origin'),
      referer: request.headers.get('referer'),
      cookie: request.headers.get('cookie') ? 'present' : 'missing',
    })

    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      console.log('❌ Non authentifié - Session:', session)
      return NextResponse.json(
        { 
          error: 'Non authentifié',
          message: 'Vous devez être connecté pour créer un job. Veuillez vous connecter sur http://localhost:3001/login'
        },
        { status: 401 }
      )
    }

    console.log('✅ Utilisateur authentifié:', session.user.email)

    // Get user plan
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true },
    })
    const userPlan: UserPlan = (user?.plan as UserPlan) || 'FREE'
    console.log('📋 Plan utilisateur:', userPlan)

    const body = await request.json()
    console.log('📦 Body reçu:', {
      hasImageUrl: !!body.imageUrl,
      hasImageUrls: !!body.imageUrls,
      imageUrlsCount: body.imageUrls?.length || 0,
      style: body.style,
      ratio: body.ratio,
      sourceUrl: body.sourceUrl,
    })
    
    const parsed = createJobSchema.parse(body)
    
    // Validate style based on user plan
    const requestedStyle = parsed.style
    // Convert style label to style ID if needed (e.g., "Studio Blanc" -> "studio-blanc")
    // Also handle if it's already an ID (e.g., "studio-blanc")
    let styleId = requestedStyle.toLowerCase().replace(/\s+/g, '-')
    
    // If it's already in the format "studio-blanc", use it as is
    // Otherwise, try to match it with available styles
    const availableStyles = getStylesByPlan(userPlan)
    const matchedStyle = availableStyles.find(s => 
      s.id === styleId || 
      s.label.toLowerCase().replace(/\s+/g, '-') === styleId ||
      s.label.toLowerCase() === requestedStyle.toLowerCase()
    )
    
    if (!matchedStyle) {
      return NextResponse.json(
        { 
          error: 'Style non disponible',
          message: `Le style "${requestedStyle}" n'est pas disponible pour votre plan ${userPlan}.`,
          availableStyles: availableStyles.map(s => s.label),
        },
        { status: 403 }
      )
    }
    
    // Validate format/ratio based on user plan
    const availableFormats = getFormatsByPlan(userPlan)
    const requestedRatio = parsed.ratio
    
    // Check if the ratio is available for this plan
    // Get all available ratios from formats
    const availableRatios = [...new Set(availableFormats.map(f => f.ratio))]
    
    // Also check if formatId is provided and validate it
    if (body.formatId && !isFormatAvailableForPlan(body.formatId, userPlan)) {
      return NextResponse.json(
        { 
          error: 'Format non disponible',
          message: `Le format ${body.formatId} n'est pas disponible pour votre plan ${userPlan}.`,
          availableFormats: availableFormats.map(f => ({ id: f.id, label: f.label, ratio: f.ratio })),
        },
        { status: 403 }
      )
    }
    
    // Validate ratio
    if (!availableRatios.includes(requestedRatio)) {
      return NextResponse.json(
        { 
          error: 'Ratio non disponible',
          message: `Le ratio ${requestedRatio} n'est pas disponible pour votre plan ${userPlan}. Ratios disponibles: ${availableRatios.join(', ')}`,
          availableRatios,
        },
        { status: 403 }
      )
    }
    
    // Déterminer l'image principale et toutes les images
    const imageUrls = parsed.imageUrls || (parsed.imageUrl ? [parsed.imageUrl] : [])
    const primaryImageUrl = imageUrls[0] || parsed.imageUrl
    
    if (!primaryImageUrl) {
      return NextResponse.json(
        { error: 'Aucune image fournie' },
        { status: 400 }
      )
    }
    
    // CRITICAL: Verify the selected image URL
    console.log('✅ Validation réussie:', {
      primaryImageUrl: primaryImageUrl,
      primaryImageUrlPreview: primaryImageUrl.substring(0, 100) + '...',
      imageUrlLength: primaryImageUrl.length,
      isHttps: primaryImageUrl.startsWith('https://'),
      containsImage: primaryImageUrl.match(/\.(jpg|jpeg|png|webp|avif)/i) ? 'yes' : 'no',
      allImageUrls: imageUrls.map(url => url.substring(0, 80) + '...'),
      style: parsed.style,
      ratio: parsed.ratio,
    })
    
    // Additional validation: ensure it's not a logo or small image
    if (primaryImageUrl.includes('logo') || primaryImageUrl.includes('icon')) {
      console.warn('⚠️ L\'URL semble pointer vers un logo ou une icône:', primaryImageUrl);
    }

    // Créer le job avec statut PROCESSING
    // Stocker toutes les images dans sourceImageUrl (séparées par des virgules pour l'instant)
    // TODO: Créer une table séparée pour les images sources si nécessaire
    // Use retryPrismaOperation to handle "prepared statement already exists" errors
    const job = await retryPrismaOperation(() =>
      prisma.job.create({
        data: {
          userId: session.user.id,
          sourceImageUrl: primaryImageUrl, // Image principale
          sourceUrl: parsed.sourceUrl || null, // URL de la page produit
          style: parsed.style,
          ratio: parsed.ratio,
          status: 'PROCESSING',
          // Stocker toutes les images dans un champ JSON si disponible, sinon dans sourceImageUrl
          // Pour l'instant, on stocke juste l'image principale
        },
      })
    )
    
    // Log toutes les images pour référence future
    if (imageUrls.length > 1) {
      console.log(`Job ${job.id}: ${imageUrls.length} images détectées`, imageUrls)
    }

    // Detect if this is an AliExpress URL for better logging
    const isAliExpressUrl = primaryImageUrl.includes('alicdn.com') || primaryImageUrl.includes('ae-pic')
    const isAmazonUrl = primaryImageUrl.includes('amazon.com') || primaryImageUrl.includes('media-amazon.com')

    console.log('🚀 Démarrage de la génération Fal.ai:', {
      imageUrl: primaryImageUrl.substring(0, 100) + '...',
      isAliExpress: isAliExpressUrl,
      isAmazon: isAmazonUrl,
      style: parsed.style,
      ratio: parsed.ratio,
      jobId: job.id,
    })

    if (isAliExpressUrl) {
      console.log('📦 AliExpress URL détectée - Normalisation et vérification d\'accessibilité en cours...')
    }

    // Générer les images avec Fal.ai de manière asynchrone
    // On retourne immédiatement le job et on traite en arrière-plan
    // IMPORTANT: Ne pas await ici pour retourner immédiatement la réponse
    // Utiliser Promise.resolve().then() pour s'assurer que la réponse est envoyée avant le traitement
    Promise.resolve().then(() => {
      generateImagesWithFalAI({
        imageUrl: primaryImageUrl,
        style: parsed.style,
        ratio: parsed.ratio,
        numImages: 3, // Générer 3 images par défaut
      })
      .then(async (result) => {
        console.log(`📊 Fal.ai - Résultat pour job ${job.id}:`, {
          hasError: !!result.error,
          error: result.error,
          imagesCount: result.images.length,
        });

        if (result.error || result.images.length === 0) {
          // En cas d'erreur, mettre le statut à ERROR
          await retryPrismaOperation(() =>
            prisma.job.update({
              where: { id: job.id },
              data: { 
                status: 'ERROR',
              },
            })
          )
          console.error(`❌ Job ${job.id} failed:`, {
            error: result.error,
            imagesCount: result.images.length,
            isAliExpress: isAliExpressUrl,
            originalImageUrl: primaryImageUrl.substring(0, 100) + '...',
          })
          
          if (isAliExpressUrl) {
            console.error(`⚠️ AliExpress-specific error - Possible causes:
              - Image URL not accessible by Fal.ai (CORS/authentication)
              - URL format issues (.avif extension)
              - Network timeout
              - Fal.ai API cannot access AliExpress CDN`)
          }
          return
        }

        console.log(`💾 Job ${job.id} - Sauvegarde de ${result.images.length} images...`);
        console.log(`📸 URLs des images à sauvegarder:`, result.images);

        // For FREE plan, use proxy endpoint to add watermark
        // For other plans, use original URLs
        // Get base URL for proxy endpoint
        const getBaseUrl = () => {
          // Try to get from environment first
          if (process.env.NEXTAUTH_URL) {
            return process.env.NEXTAUTH_URL
          }
          // Fallback to localhost for development
          return 'http://localhost:3001'
        }
        
        const baseUrl = getBaseUrl()
        const imageUrlsToStore = userPlan === 'FREE' 
          ? result.images.map(url => {
              // Use proxy endpoint for FREE plan images
              return `${baseUrl}/api/proxy-image?url=${encodeURIComponent(url)}`
            })
          : result.images

        // Créer les GeneratedImage en BDD
        try {
          const createdImages = await retryPrismaOperation(() =>
            prisma.generatedImage.createMany({
              data: imageUrlsToStore.map((url) => ({
                jobId: job.id,
                imageUrl: url,
              })),
            })
          )
          console.log(`✅ Job ${job.id} - ${createdImages.count} images sauvegardées en BDD`);
          if (userPlan === 'FREE') {
            console.log(`💧 Watermark appliqué pour le plan FREE`);
          }
        } catch (dbError) {
          console.error(`❌ Job ${job.id} - Erreur lors de la sauvegarde des images:`, dbError);
          throw dbError;
        }

        // Mettre à jour le statut du job à DONE
        await retryPrismaOperation(() =>
          prisma.job.update({
            where: { id: job.id },
            data: { status: 'DONE' },
          })
        )

        console.log(`✅ Job ${job.id} completed: ${result.images.length} images generated and saved`)
      })
      .catch(async (error) => {
        // En cas d'erreur, mettre le statut à ERROR
        const errorMessage = error instanceof Error ? error.message : String(error)
        await retryPrismaOperation(() =>
          prisma.job.update({
            where: { id: job.id },
            data: { 
              status: 'ERROR',
            },
          })
        )
        console.error(`❌ Job ${job.id} error (catch):`, {
          error: errorMessage,
          stack: error instanceof Error ? error.stack : undefined,
          isAliExpress: isAliExpressUrl,
          originalImageUrl: primaryImageUrl.substring(0, 100) + '...',
        })
        
        if (isAliExpressUrl) {
          console.error(`⚠️ AliExpress error caught - Check:
            - Image URL accessibility
            - Fal.ai API response
            - Network connectivity
            - URL normalization`)
        }
      })
    })

    // Retourner immédiatement le job créé
    // La génération Fal.ai se fera en arrière-plan
    return NextResponse.json(
      { 
        jobId: job.id, 
        message: 'Job créé avec succès',
        status: 'PROCESSING',
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
          message: 'Les données envoyées ne sont pas valides. Vérifiez que imageUrl/imageUrls, style et ratio sont fournis.'
        },
        { status: 400 }
      )
    }

    // Check if it's an import/module error
    if (error instanceof Error && (error.message.includes('Cannot find module') || error.message.includes('generateImagesWithFalAI'))) {
      console.error('❌ Module import error:', error.message)
      return NextResponse.json(
        { 
          error: 'Erreur de configuration serveur',
          message: 'Le module de génération d\'images n\'est pas disponible. Vérifiez la configuration du serveur.',
          details: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 500 }
      )
    }

    console.error('❌ Error creating job:', error)
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
          message: 'Impossible de créer le job dans la base de données. Vérifiez la connexion.',
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
