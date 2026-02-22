'use client'

import Image from 'next/image'
import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
  href?: string
  className?: string
}

export function Logo({ size = 'md', showText = true, href = '/', className = '' }: LogoProps) {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return { icon: 'w-6 h-6', text: 'text-base', iconSize: 24 }
      case 'lg':
        return { icon: 'w-10 h-10', text: 'text-2xl', iconSize: 40 }
      default: // md
        return { icon: 'w-7 h-7', text: 'text-lg', iconSize: 28 }
    }
  }

  const { icon, text, iconSize } = getSizeClasses()

  const logoContent = (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className={`${icon} flex items-center justify-center`}>
        <Image
          src="/logo.png"
          alt="Snappix"
          width={iconSize}
          height={iconSize}
          className="object-contain"
          priority
          onError={(e) => {
            // Fallback si l'image n'existe pas
            const target = e.target as HTMLImageElement
            target.style.display = 'none'
            if (target.parentElement) {
              const fallbackSize = size === 'sm' ? 'w-6 h-6' : size === 'lg' ? 'w-10 h-10' : 'w-7 h-7'
              const fallbackText = size === 'sm' ? 'text-xs' : size === 'lg' ? 'text-xl' : 'text-sm'
              target.parentElement.innerHTML = `<div class="${fallbackSize} bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center"><span class="text-white font-bold ${fallbackText}">S</span></div>`
            }
          }}
        />
      </div>
      {showText && (
        <span className={`font-display font-semibold text-foreground tracking-tight ${text}`}>
          Snappix
        </span>
      )}
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {logoContent}
      </Link>
    )
  }

  return logoContent
}

