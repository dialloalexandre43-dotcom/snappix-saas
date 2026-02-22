import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { addWatermarkToImage } from '@/lib/watermark'

/**
 * GET /api/proxy-image?url=IMAGE_URL
 * Proxy image with watermark for FREE plan users
 */
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non authentifié' },
        { status: 401 }
      )
    }

    // Get user plan
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true },
    })

    const userPlan = user?.plan || 'FREE'

    // Get image URL from query params
    const searchParams = request.nextUrl.searchParams
    const imageUrl = searchParams.get('url')

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'URL de l\'image manquante' },
        { status: 400 }
      )
    }

    // Only add watermark for FREE plan
    if (userPlan === 'FREE') {
      try {
        const watermarkedBuffer = await addWatermarkToImage(imageUrl)
        
        return new NextResponse(watermarkedBuffer, {
          headers: {
            'Content-Type': 'image/jpeg',
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        })
      } catch (error) {
        console.error('Error adding watermark:', error)
        // Fallback: return original image if watermark fails
        const response = await fetch(imageUrl)
        if (response.ok) {
          const buffer = Buffer.from(await response.arrayBuffer())
          return new NextResponse(buffer, {
            headers: {
              'Content-Type': response.headers.get('content-type') || 'image/jpeg',
              'Cache-Control': 'public, max-age=31536000, immutable',
            },
          })
        }
        return NextResponse.json(
          { error: 'Erreur lors du traitement de l\'image' },
          { status: 500 }
        )
      }
    } else {
      // For STARTER and PRO plans, just proxy the image without watermark
      const response = await fetch(imageUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      })

      if (!response.ok) {
        return NextResponse.json(
          { error: 'Erreur lors du téléchargement de l\'image' },
          { status: response.status }
        )
      }

      const buffer = Buffer.from(await response.arrayBuffer())
      return new NextResponse(buffer, {
        headers: {
          'Content-Type': response.headers.get('content-type') || 'image/jpeg',
          'Cache-Control': 'public, max-age=31536000, immutable',
        },
      })
    }
  } catch (error) {
    console.error('Error in proxy-image:', error)
    return NextResponse.json(
      { error: 'Une erreur est survenue' },
      { status: 500 }
    )
  }
}









