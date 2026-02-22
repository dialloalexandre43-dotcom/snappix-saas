/**
 * Image formats configuration by subscription plan
 */

export type UserPlan = 'FREE' | 'STARTER' | 'PRO'

export interface ImageFormat {
  id: string
  label: string
  ratio: string
  width: number
  height: number
  formats: ('JPG' | 'PNG' | 'WEBP')[]
  category?: string
  description?: string
}

/**
 * Get available formats for a subscription plan
 */
export function getFormatsByPlan(plan: UserPlan): ImageFormat[] {
  const allFormats: Record<string, ImageFormat> = {
    // FREE - 3 formats de base
    'jpg-1024': {
      id: 'jpg-1024',
      label: 'JPG 1024x1024',
      ratio: '1:1',
      width: 1024,
      height: 1024,
      formats: ['JPG'],
      description: 'Standard e-commerce',
    },
    'png-1024': {
      id: 'png-1024',
      label: 'PNG 1024x1024',
      ratio: '1:1',
      width: 1024,
      height: 1024,
      formats: ['PNG'],
      description: 'Transparence basique',
    },
    'webp-1024': {
      id: 'webp-1024',
      label: 'WEBP 1024x1024',
      ratio: '1:1',
      width: 1024,
      height: 1024,
      formats: ['WEBP'],
      description: 'Web optimisé',
    },
    // STARTER formats - 5 tailles
    '1080x1080': {
      id: '1080x1080',
      label: '1080×1080',
      ratio: '1:1',
      width: 1080,
      height: 1080,
      formats: ['JPG', 'PNG', 'WEBP'],
      description: 'Instagram carré',
    },
    '1080x1920': {
      id: '1080x1920',
      label: '1080×1920',
      ratio: '9:16',
      width: 1080,
      height: 1920,
      formats: ['JPG', 'PNG', 'WEBP'],
      description: 'Stories/TikTok',
    },
    '1600x1600': {
      id: '1600x1600',
      label: '1600×1600',
      ratio: '1:1',
      width: 1600,
      height: 1600,
      formats: ['JPG', 'PNG', 'WEBP'],
      description: 'eBay standard',
    },
    // STARTER - Formats supplémentaires
    'jpg-2048': {
      id: 'jpg-2048',
      label: 'JPG 2048x2048',
      ratio: '1:1',
      width: 2048,
      height: 2048,
      formats: ['JPG'],
      description: 'Amazon zoom',
    },
    'png-2048': {
      id: 'png-2048',
      label: 'PNG 2048x2048',
      ratio: '1:1',
      width: 2048,
      height: 2048,
      formats: ['PNG'],
      description: 'Haute résolution',
    },
    'webp-2048': {
      id: 'webp-2048',
      label: 'WEBP 2048x2048',
      ratio: '1:1',
      width: 2048,
      height: 2048,
      formats: ['WEBP'],
      description: 'Rapide HD',
    },
    // PRO - Formats avancés
    'instagram-1080': {
      id: 'instagram-1080',
      label: 'Instagram 1080x1080',
      ratio: '1:1',
      width: 1080,
      height: 1080,
      formats: ['JPG', 'PNG', 'WEBP'],
      category: 'MOBILE / SOCIAL',
    },
    'tiktok-1080x1920': {
      id: 'tiktok-1080x1920',
      label: 'TikTok 1080x1920',
      ratio: '9:16',
      width: 1080,
      height: 1920,
      formats: ['JPG', 'PNG', 'WEBP'],
      category: 'MOBILE / SOCIAL',
    },
    'stories-1080x1920': {
      id: 'stories-1080x1920',
      label: 'Stories 1080x1920',
      ratio: '9:16',
      width: 1080,
      height: 1920,
      formats: ['JPG', 'PNG', 'WEBP'],
      category: 'MOBILE / SOCIAL',
    },
    'pinterest-1000x1500': {
      id: 'pinterest-1000x1500',
      label: 'Pinterest 1000x1500',
      ratio: '2:3',
      width: 1000,
      height: 1500,
      formats: ['JPG', 'PNG', 'WEBP'],
      category: 'MOBILE / SOCIAL',
    },
    'amazon-3000': {
      id: 'amazon-3000',
      label: 'Amazon 3000x3000',
      ratio: '1:1',
      width: 3000,
      height: 3000,
      formats: ['JPG', 'PNG'],
      category: 'E-COMMERCE',
    },
    'shopify-hero-2048x682': {
      id: 'shopify-hero-2048x682',
      label: 'Shopify Hero 2048x682',
      ratio: '3:1',
      width: 2048,
      height: 682,
      formats: ['JPG', 'PNG', 'WEBP'],
      category: 'E-COMMERCE',
    },
    'etsy-2000': {
      id: 'etsy-2000',
      label: 'Etsy 2000x2000',
      ratio: '1:1',
      width: 2000,
      height: 2000,
      formats: ['JPG', 'PNG', 'WEBP'],
      category: 'E-COMMERCE',
    },
    'ebay-1600': {
      id: 'ebay-1600',
      label: 'eBay 1600x1600',
      ratio: '1:1',
      width: 1600,
      height: 1600,
      formats: ['JPG', 'PNG', 'WEBP'],
      category: 'E-COMMERCE',
    },
    'square-4096': {
      id: 'square-4096',
      label: 'Square 4096x4096',
      ratio: '1:1',
      width: 4096,
      height: 4096,
      formats: ['JPG', 'PNG', 'WEBP'],
      category: 'WEB / BANNERS',
      description: 'Futur-proof',
    },
    'rectangle-1920x1080': {
      id: 'rectangle-1920x1080',
      label: 'Rectangle 1920x1080',
      ratio: '16:9',
      width: 1920,
      height: 1080,
      formats: ['JPG', 'PNG', 'WEBP'],
      category: 'WEB / BANNERS',
    },
    'png-transparent-2048': {
      id: 'png-transparent-2048',
      label: 'PNG Transparent 2048x2048',
      ratio: '1:1',
      width: 2048,
      height: 2048,
      formats: ['PNG'],
      category: 'WEB / BANNERS',
    },
  }

  // Define formats by plan according to new pricing
  const planFormats: Record<UserPlan, string[]> = {
    // FREE - 1 seule taille: 1024×1024
    FREE: ['jpg-1024'],
    // STARTER - 5 tailles disponibles
    STARTER: [
      'jpg-1024',      // 1024×1024
      '1080x1080',     // 1080×1080
      '1080x1920',     // 1080×1920
      '1600x1600',     // 1600×1600
      'jpg-2048',      // 2048×2048
    ],
    // PRO - 10+ tailles/formats
    PRO: [
      'jpg-1024',           // 1024×1024
      '1080x1080',          // 1080×1080
      '1080x1920',          // 1080×1920
      '1600x1600',          // 1600×1600
      'jpg-2048',           // 2048×2048
      'amazon-3000',        // 3000×3000
      'shopify-hero-2048x682', // 2048×682
      'pinterest-1000x1500',   // 1000×1500
      'rectangle-1920x1080',    // 1920×1080
      'png-transparent-2048',   // PNG transparent haute rés
      'square-4096',            // 4096×4096 (premium)
      'etsy-2000',             // 2000×2000
      'stories-1080x1920',      // Stories 1080×1920
    ],
  }

  const formatIds = planFormats[plan] || planFormats.FREE
  return formatIds
    .map((id) => allFormats[id])
    .filter(Boolean) as ImageFormat[]
}

/**
 * Check if a format is available for a plan
 */
export function isFormatAvailableForPlan(formatId: string, plan: UserPlan): boolean {
  const formats = getFormatsByPlan(plan)
  return formats.some((f) => f.id === formatId)
}

/**
 * Get format details by ID
 */
export function getFormatById(formatId: string, plan: UserPlan): ImageFormat | null {
  const formats = getFormatsByPlan(plan)
  return formats.find((f) => f.id === formatId) || null
}

/**
 * Convert format ID to ratio for Fal.ai API
 */
export function formatIdToRatio(formatId: string): string {
  // Extract ratio from format ID or use mapping
  const format = formatId.split('-')[1] // e.g., "jpg-1024" -> "1024"
  
  // Special cases
  if (formatId.includes('tiktok') || formatId.includes('stories')) {
    return '9:16'
  }
  if (formatId.includes('pinterest')) {
    return '2:3'
  }
  if (formatId.includes('shopify-hero')) {
    return '3:1'
  }
  if (formatId.includes('rectangle') || formatId.includes('1920x1080')) {
    return '16:9'
  }
  
  // Default to 1:1 for square formats
  return '1:1'
}

/**
 * Style configuration
 */
export interface Style {
  id: string
  label: string
  description?: string
}

/**
 * Get available styles for a subscription plan
 * FREE: 2 styles seulement
 * STARTER: 8 styles HD complets
 * PRO: Tous les styles
 */
export function getStylesByPlan(plan: UserPlan): Style[] {
  const allStyles: Style[] = [
    { id: 'studio-blanc', label: 'Studio Blanc', description: 'Amazon pro' },
    { id: 'lifestyle-maison', label: 'Lifestyle Maison', description: 'Instagram ready' },
    { id: 'minimal-gradient', label: 'Minimal Gradient', description: 'Clean moderne' },
    { id: 'social-ads', label: 'Social Ads', description: 'Meta + TikTok' },
    { id: 'luxury-black', label: 'Luxury Black', description: 'High-ticket' },
    { id: 'packshot-3d', label: 'Packshot 3D', description: 'Premium 3D' },
    { id: 'color-block', label: 'Color Block', description: 'Fun Gen Z' },
    { id: 'mockup-scene', label: 'Mockup Scene', description: 'Storytelling' },
  ]

  const planStyles: Record<UserPlan, number> = {
    FREE: 2,      // 2 styles seulement
    STARTER: 8,   // 8 styles HD complets
    PRO: allStyles.length, // Tous les styles
  }

  const count = planStyles[plan] || planStyles.FREE
  return allStyles.slice(0, count)
}

/**
 * Check if a style is available for a plan
 */
export function isStyleAvailableForPlan(styleId: string, plan: UserPlan): boolean {
  const styles = getStylesByPlan(plan)
  return styles.some((s) => s.id === styleId)
}

