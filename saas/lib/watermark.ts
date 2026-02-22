/**
 * Watermark utility for FREE plan images
 * Adds "Snappix" watermark to images generated for FREE plan users
 */

import sharp from 'sharp'

/**
 * Add watermark to an image
 * Downloads the image, adds "Snappix" text watermark, and returns the watermarked image as buffer
 */
export async function addWatermarkToImage(imageUrl: string): Promise<Buffer> {
  try {
    console.log('💧 Adding watermark to image:', imageUrl.substring(0, 100) + '...')

    // Download the image
    const response = await fetch(imageUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      },
    })

    if (!response.ok) {
      throw new Error(`Failed to download image: HTTP ${response.status}`)
    }

    const imageBuffer = Buffer.from(await response.arrayBuffer())

    // Get image metadata to determine dimensions
    const metadata = await sharp(imageBuffer).metadata()
    const width = metadata.width || 1024
    const height = metadata.height || 1024

    // Calculate watermark size based on image dimensions
    // Watermark should be about 6-8% of the image width (subtle)
    const watermarkFontSize = Math.max(32, Math.floor(width * 0.06))
    
    // Very light grey, almost white - matching the provided watermark design
    // Using a very light grey (#F5F5F5 or #FAFAFA) with very low opacity
    const watermarkOpacity = 0.12 // Very subtle (12% opacity)
    const watermarkColor = '#F5F5F5' // Very light grey, almost white

    // Create SVG watermark text
    // Centered, sans-serif, very light grey
    const svgWatermark = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <text
          x="50%"
          y="50%"
          font-family="Arial, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif"
          font-size="${watermarkFontSize}"
          font-weight="400"
          fill="${watermarkColor}"
          opacity="${watermarkOpacity}"
          text-anchor="middle"
          dominant-baseline="middle"
          letter-spacing="0.05em"
        >Snappix</text>
      </svg>
    `

    const svgBuffer = Buffer.from(svgWatermark)

    // Composite the watermark onto the image
    const watermarkedImage = await sharp(imageBuffer)
      .composite([
        {
          input: svgBuffer,
          blend: 'over',
        },
      ])
      .toBuffer()

    console.log('✅ Watermark added successfully')
    return watermarkedImage
  } catch (error) {
    console.error('❌ Error adding watermark:', error)
    throw error
  }
}

/**
 * Convert image buffer to base64 data URL
 */
export function bufferToDataUrl(buffer: Buffer, mimeType: string = 'image/jpeg'): string {
  const base64 = buffer.toString('base64')
  return `data:${mimeType};base64,${base64}`
}

/**
 * Upload watermarked image to a storage service or return as data URL
 * For now, we'll return the buffer and let the caller decide how to handle it
 */
export async function processImageWithWatermark(imageUrl: string): Promise<{
  buffer: Buffer
  dataUrl: string
}> {
  const watermarkedBuffer = await addWatermarkToImage(imageUrl)
  const dataUrl = bufferToDataUrl(watermarkedBuffer, 'image/jpeg')

  return {
    buffer: watermarkedBuffer,
    dataUrl,
  }
}

