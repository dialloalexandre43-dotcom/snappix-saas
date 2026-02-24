/**
 * Fal.ai Image Generation Service
 * Handles image-to-image generation using Fal.ai API
 */

export interface FalAIGenerateOptions {
  imageUrl: string
  style: string
  ratio: string
  numImages?: number
}

export interface FalAIResponse {
  images: string[]
  error?: string
}

/**
 * Normalize image URLs, especially for AliExpress
 * AliExpress URLs often have .avif extensions or complex query parameters
 * that need to be cleaned before sending to Fal.ai
 */
function normalizeImageUrl(url: string): string {
  if (!url || typeof url !== 'string') {
    return url
  }

  let normalized = url.trim()

  // Remove query parameters and fragments
  normalized = normalized.split('?')[0]
  normalized = normalized.split('#')[0]

  // Force HTTPS
  normalized = normalized.replace(/^http:/, 'https:')

  // AliExpress specific: Handle complex URL patterns
  // Example: https://ae-pic-a1.aliexpress-media.com/kf/S27011068fe6240bbbd540c03bc798270K.jpg_960x960q75.jpg_.avif
  // Goal: Extract base URL like https://ae-pic-a1.aliexpress-media.com/kf/S27011068fe6240bbbd540c03bc798270K.jpg
  
  if (normalized.includes('ae-pic') || normalized.includes('alicdn.com')) {
    // Pattern: Find the base filename before size parameters
    // The base filename usually ends with a letter/number before the first size parameter
    
    // Try to extract the base filename
    // Match pattern: .../filename.jpg_960x960q75.jpg_.avif
    // We want: .../filename.jpg
    
    // First, try to find the base filename by looking for the pattern before size params
    const baseMatch = normalized.match(/^(.+?\/[^\/]+?)(_\d+x\d+[a-z0-9]*|\.avif|_\.(jpg|jpeg|png|webp))+/i)
    if (baseMatch && baseMatch[1]) {
      normalized = baseMatch[1]
    } else {
      // Fallback: Remove .avif and size parameters manually
      normalized = normalized.replace(/\.avif$/i, '')
      normalized = normalized.replace(/_\d+x\d+[a-z0-9]*/gi, '')
      // Remove trailing underscores and dots
      normalized = normalized.replace(/[_.]+$/g, '')
    }
    
    // Ensure it ends with a valid image extension
    if (!normalized.match(/\.(jpg|jpeg|png|webp)$/i)) {
      // Find the last dot before any size parameters
      const lastDot = normalized.lastIndexOf('.')
      if (lastDot > 0) {
        // Check if there's a valid extension before the dot
        const beforeDot = normalized.substring(0, lastDot)
        const afterDot = normalized.substring(lastDot + 1)
        
        // If afterDot looks like an extension, keep it, otherwise add .jpg
        if (afterDot.match(/^(jpg|jpeg|png|webp)$/i)) {
          // Already has valid extension
        } else {
          // Remove everything after last dot and add .jpg
          normalized = beforeDot + '.jpg'
        }
      } else {
        normalized += '.jpg'
      }
    }
    
    // Final cleanup: remove any duplicate extensions
    normalized = normalized.replace(/\.(jpg|jpeg|png|webp)\.(jpg|jpeg|png|webp)$/i, '.$1')
  } else {
    // For non-AliExpress URLs, just ensure valid extension
    if (!normalized.match(/\.(jpg|jpeg|png|webp)$/i)) {
      normalized += '.jpg'
    }
  }

  return normalized
}

/**
 * Map style string to style ID
 */
function mapStyleToId(style: string): number {
  const styleLower = style.toLowerCase()

  // Map common style names to IDs
  if (styleLower.includes('amazon') || styleLower.includes('pro') || styleLower.includes('clean') || styleLower.includes('studio') || styleLower.includes('blanc') || styleLower.includes('white')) {
    return 1 // Amazon Pro Clean
  }
  if (styleLower.includes('lifestyle') || styleLower.includes('modern') || styleLower.includes('maison') || styleLower.includes('home')) {
    return 2 // Lifestyle Modern
  }
  if (styleLower.includes('shopify') || styleLower.includes('hero') || styleLower.includes('banner') || styleLower.includes('gradient')) {
    return 3 // Shopify Hero Banner
  }
  if (styleLower.includes('tiktok') || styleLower.includes('viral') || styleLower.includes('social') || styleLower.includes('ads') || styleLower.includes('meta')) {
    return 4 // TikTok Viral
  }
  if (styleLower.includes('etsy') || styleLower.includes('handmade') || styleLower.includes('rustic')) {
    return 5 // Etsy Handmade
  }
  if (styleLower.includes('luxury') || styleLower.includes('black')) {
    return 6 // Luxury Black
  }
  if (styleLower.includes('white') && styleLower.includes('gradient') || styleLower.includes('drop')) {
    return 7 // White Gradient Drop
  }
  if (styleLower.includes('mockup') || styleLower.includes('packshot') || styleLower.includes('3d')) {
    return 8 // Mockup Packshot
  }

  // Default to style 1 (Amazon Pro Clean)
  return 1
}

/**
 * Get prompt for a specific style
 * All prompts include the common rule to keep the exact same product
 */
function getPromptForStyle(styleId: number, imageUrl: string): string {
  const commonRule = 'Keep the exact same product, shape, pose, quantity, proportions, logo and main colors as in the original photo. Do not change the product design, only change the background, lighting and environment.'
  
  const prompts: Record<number, string> = {
    1: `Transform this product image into professional Amazon product photography on a pure white seamless studio background, with the product perfectly centered and softly lit from above and both sides, with a realistic soft 45° drop shadow and ultra sharp e-commerce details. ${commonRule}`,
    2: `Place this product image in a modern lifestyle interior scene, on a light marble table in a bright living room, with natural daylight coming from a window on the left, minimal decor and soft depth of field in the background. ${commonRule}`,
    3: `Create a Shopify hero banner using this product image, with the product large and clearly visible on the left, on a clean light gradient background from white to soft pastel color, with empty space on the right for text and a subtle glow around the product. ${commonRule}`,
    4: `Turn this product image into a TikTok-style viral product shot with a vibrant neon gradient background, dynamic lighting and subtle glow effects around the product, while the product stays clearly readable and realistic. ${commonRule}`,
    5: `Render this product image in an Etsy handmade aesthetic: product placed on a rustic wooden table, with a soft beige fabric and small natural props, warm golden hour lighting and a gentle vignette. ${commonRule}`,
    6: `Render this product image as a luxury black studio shot, with a matte black seamless background, dramatic top spotlight and soft rim light that highlights the edges of the product, with high contrast and premium look. ${commonRule}`,
    7: `Place this product image on a professional white to light gray gradient background with a realistic soft drop shadow under the product, like a high-end catalog or Amazon listing photo. ${commonRule}`,
    8: `Create a clean packshot of this product image with the product floating slightly above a light background or standing on a simple surface, with lots of white space around it and a very clean, catalog-ready look. ${commonRule}`,
  }

  return prompts[styleId] || prompts[1]
}

/**
 * Map aspect ratio to Fal.ai format
 * Maps user ratios to Fal.ai supported ratios based on style requirements
 */
function mapAspectRatio(ratio: string, styleId?: number): string {
  const validRatios = ['21:9', '16:9', '4:3', '3:2', '1:1', '2:3', '3:4', '9:16', '9:21', '3:1']

  if (validRatios.includes(ratio)) {
    return ratio
  }

  // Style-specific ratio mappings
  if (styleId === 3) {
    // Shopify Hero Banner uses 3:1
    return '3:1'
  }
  if (styleId === 4) {
    // TikTok Viral uses 9:16
    return '9:16'
  }

  // General ratio mappings
  const ratioMap: Record<string, string> = {
    '4:5': '3:4', // Portrait vertical -> 3:4
    '5:4': '4:3', // Portrait horizontal -> 4:3
  }

  if (ratioMap[ratio]) {
    return ratioMap[ratio]
  }

  return '1:1' // Default
}

/**
 * Download image from URL and convert to base64
 * This is needed for AliExpress URLs that Fal.ai cannot access directly
 * Converts AVIF to JPEG as Fal.ai doesn't support AVIF via data URI
 */
async function downloadImageAsBase64(url: string): Promise<{ base64: string; mimeType: string } | null> {
  try {
    console.log('📥 Downloading image for base64 conversion:', url.substring(0, 100) + '...')
    
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 second timeout

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
          'Accept': 'image/*',
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        console.error(`❌ Failed to download image: HTTP ${response.status}`)
        return null
      }

      const arrayBuffer = await response.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)
      
      // Determine MIME type from response or URL
      const contentType = response.headers.get('content-type') || 'image/jpeg'
      const mimeType = contentType.split(';')[0].trim()

      // Convert AVIF to JPEG using sharp (Fal.ai doesn't support AVIF via data URI)
      let finalBuffer = buffer
      let finalMimeType = mimeType
      
      if (mimeType === 'image/avif' || url.includes('.avif')) {
        console.log('🔄 Converting AVIF to JPEG (Fal.ai compatibility)...')
        try {
          const sharp = (await import('sharp')).default
          // @ts-ignore - Buffer type compatibility with sharp
          finalBuffer = await sharp(buffer as any)
            .jpeg({ quality: 90 })
            .toBuffer()
          finalMimeType = 'image/jpeg'
          console.log(`✅ AVIF converted to JPEG (${(finalBuffer.length / 1024).toFixed(2)} KB)`)
        } catch (sharpError) {
          console.error('❌ Error converting AVIF to JPEG:', sharpError)
          // Fallback: try to use the original buffer, but it will likely fail
          console.warn('⚠️ Using original AVIF buffer (may fail with Fal.ai)')
        }
      }
      
      const base64 = finalBuffer.toString('base64')
      console.log(`✅ Image downloaded and converted to base64 (${(finalBuffer.length / 1024).toFixed(2)} KB, ${finalMimeType})`)
      
      return { base64, mimeType: finalMimeType }
    } catch (fetchError) {
      clearTimeout(timeoutId)
      throw fetchError
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      console.error('❌ Image download timeout (30s)')
      return null
    }
    console.error('❌ Error downloading image:', error)
    return null
  }
}

/**
 * Check if an image URL is accessible
 * This helps identify if Fal.ai can access the image
 */
async function checkImageAccessibility(url: string): Promise<{ accessible: boolean; error?: string }> {
  try {
    // Use AbortController for compatibility with older Node.js versions
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout

    try {
      const response = await fetch(url, {
        method: 'HEAD',
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (response.ok) {
        return { accessible: true }
      } else {
        return {
          accessible: false,
          error: `HTTP ${response.status}: ${response.statusText}`,
        }
      }
    } catch (fetchError) {
      clearTimeout(timeoutId)
      throw fetchError
    }
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      return {
        accessible: false,
        error: 'Request timeout (5s)',
      }
    }
    return {
      accessible: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

/**
 * Generate images using Fal.ai API
 * Handles both Amazon and AliExpress URLs with proper normalization
 */
export async function generateImagesWithFalAI(
  options: FalAIGenerateOptions
): Promise<FalAIResponse> {
  const apiKey = process.env.FAL_AI_API_KEY
  const modelId = process.env.FAL_AI_MODEL_ID || 'fal-ai/flux-pro/kontext'

  if (!apiKey) {
    console.error('❌ FAL_AI_API_KEY is not set')
    return {
      images: [],
      error: 'FAL_AI_API_KEY is not configured',
    }
  }

  const numImages = options.numImages || 3
  const styleId = mapStyleToId(options.style || '1')
  const prompt = getPromptForStyle(styleId, options.imageUrl)
  const mappedRatio = mapAspectRatio(options.ratio || '1:1', styleId)

  // Normalize the image URL (especially important for AliExpress)
  const normalizedImageUrl = normalizeImageUrl(options.imageUrl)

  console.log('🎨 Fal.ai - Starting image generation:', {
    originalUrl: options.imageUrl.substring(0, 100) + '...',
    normalizedUrl: normalizedImageUrl.substring(0, 100) + '...',
    style: options.style,
    styleId,
    ratio: options.ratio,
    mappedRatio,
    numImages,
    modelId,
  })

  // Check if the image URL is accessible (especially for AliExpress)
  const isAliExpressUrl = normalizedImageUrl.includes('alicdn.com') || normalizedImageUrl.includes('ae-pic')
  if (isAliExpressUrl) {
    console.log('🔍 AliExpress URL detected, checking accessibility...')
    const accessibility = await checkImageAccessibility(normalizedImageUrl)
    if (!accessibility.accessible) {
      console.warn('⚠️ AliExpress image may not be accessible:', accessibility.error)
      // Continue anyway - Fal.ai might be able to access it with different headers
    } else {
      console.log('✅ AliExpress image is accessible')
    }
  }

  // For AliExpress URLs, we need to download and convert to base64
  // because Fal.ai cannot access AliExpress URLs directly
  // Try multiple URL variants if the first one fails
  
  let imageData: { base64: string; mimeType: string } | null = null
  
  if (isAliExpressUrl) {
    console.log('📥 AliExpress URL detected - Downloading image to convert to base64...')
    
    // Try multiple URL variants - start with original as it's most likely to work
    const urlVariants = [
      options.imageUrl,    // Try original first (most likely to work)
      normalizedImageUrl,  // Try normalized if original fails
      options.imageUrl.replace(/\.avif$/i, '.jpg'), // Try removing .avif and adding .jpg
      options.imageUrl.replace(/\.avif$/i, ''),     // Try removing .avif without replacement
    ]
    
    // Remove duplicates
    const uniqueUrls = [...new Set(urlVariants)]
    
    for (const urlToTry of uniqueUrls) {
      console.log(`📥 Downloading image for base64 conversion: ${urlToTry.substring(0, 80)}...`)
      imageData = await downloadImageAsBase64(urlToTry)
      if (imageData) {
        console.log(`✅ Image downloaded successfully from: ${urlToTry.substring(0, 80)}...`)
        break
      } else {
        console.warn(`⚠️ Failed to download from: ${urlToTry.substring(0, 80)}..., trying next variant...`)
      }
    }
    
    if (!imageData) {
      console.error('❌ Failed to download AliExpress image from all URL variants')
      // Return error early - we cannot proceed without the image
      return {
        images: [],
        error: 'Failed to download AliExpress image. The URL may be inaccessible or expired.',
      }
    } else {
      console.log('✅ Image downloaded successfully, will send as base64 to Fal.ai')
    }
  }

  // Generate multiple images
  const imagePromises = Array.from({ length: numImages }, async (_, index) => {
    try {
      // Use base64 for AliExpress, URL for others
      const requestBody: any = {
        prompt: prompt,
        aspect_ratio: mappedRatio,
        // Parameters for better control of image generation
        strength: 0.35,
        guidance_scale: 5,
        num_inference_steps: 28,
      }

      if (imageData) {
        // For AliExpress: Send base64 as data URI in image_url parameter
        // Some Fal.ai models require image_url even for base64 data
        requestBody.image_url = `data:${imageData.mimeType};base64,${imageData.base64}`
        console.log(`📤 Fal.ai - Request ${index + 1}/${numImages} (base64 as image_url):`, {
          model: modelId,
          prompt: prompt.substring(0, 50) + '...',
          image_url: `data:${imageData.mimeType};base64,[${imageData.base64.length} chars]`,
          imageSize: `${(imageData.base64.length / 1024).toFixed(2)} KB`,
          aspect_ratio: mappedRatio,
        })
      } else {
        // Use URL for Amazon and other accessible URLs
        requestBody.image_url = normalizedImageUrl
        console.log(`📤 Fal.ai - Request ${index + 1}/${numImages} (URL):`, {
          model: modelId,
          prompt: prompt.substring(0, 50) + '...',
          image_url: normalizedImageUrl.substring(0, 80) + '...',
          aspect_ratio: mappedRatio,
        })
      }

      const response = await fetch(`https://fal.run/${modelId}`, {
        method: 'POST',
        headers: {
          Authorization: `Key ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error(`❌ Fal.ai API error (${response.status}) for image ${index + 1}:`, errorText)
        console.error(`❌ Full error details:`, {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          body: errorText.substring(0, 500),
        })
        throw new Error(`Fal.ai API error (${response.status}): ${errorText.substring(0, 200)}`)
      }

      const data = await response.json()
      console.log(`✅ Fal.ai - Response ${index + 1}/${numImages}:`, {
        hasImages: !!data.images,
        imagesCount: data.images?.length || 0,
        hasImage: !!data.image,
        responseKeys: Object.keys(data),
        fullResponse: JSON.stringify(data, null, 2).substring(0, 1000), // Log first 1000 chars of response
      })

      // Extract image URL from response
      // Fal.ai can return images in different formats:
      // - { images: [{ url: "..." }] }
      // - { images: ["url1", "url2"] }
      // - { image: { url: "..." } }
      // - { image: "url" }
      let imageUrl: string | null = null

      if (data.images && Array.isArray(data.images)) {
        if (data.images.length > 0) {
          const firstImage = data.images[0]
          if (typeof firstImage === 'string') {
            imageUrl = firstImage
          } else if (firstImage && typeof firstImage === 'object' && firstImage.url) {
            imageUrl = firstImage.url
          }
        }
      } else if (data.image) {
        if (typeof data.image === 'string') {
          imageUrl = data.image
        } else if (typeof data.image === 'object' && data.image.url) {
          imageUrl = data.image.url
        }
      } else if (data.generated_image) {
        // Some Fal.ai models return generated_image
        imageUrl = data.generated_image
      }

      if (!imageUrl) {
        console.error(`❌ No image URL found in Fal.ai response ${index + 1}:`, JSON.stringify(data, null, 2))
        throw new Error('No image URL in Fal.ai response')
      }

      console.log(`✅ Image ${index + 1} generated successfully:`, imageUrl.substring(0, 100) + '...')
      return imageUrl
    } catch (error) {
      console.error(`❌ Error generating image ${index + 1}:`, error)
      throw error
    }
  })

  // Wait for all images to be generated (using Promise.allSettled to handle partial failures)
  const results = await Promise.allSettled(imagePromises)

  // Extract successful results
  const images = results
    .filter((r) => r.status === 'fulfilled' && r.value !== null)
    .map((r) => (r as PromiseFulfilledResult<string>).value)

  // Log results
  console.log('📊 Fal.ai - Generation complete:', {
    total: numImages,
    successful: images.length,
    failed: numImages - images.length,
    images: images.map((url) => url.substring(0, 80) + '...'),
  })

  if (images.length === 0) {
    const errors = results
      .filter((r) => r.status === 'rejected')
      .map((r) => {
        const reason = (r as PromiseRejectedResult).reason
        if (reason instanceof Error) {
          return `${reason.message}${reason.stack ? `\nStack: ${reason.stack.substring(0, 500)}` : ''}`
        }
        return String(reason) || 'Unknown error'
      })

    console.error('❌ All image generation attempts failed:')
    errors.forEach((error, index) => {
      console.error(`  Error ${index + 1}:`, error)
    })
    
    return {
      images: [],
      error: `All ${numImages} image generation attempts failed. Errors: ${errors.join('; ')}`,
    }
  }

  return { images }
}
