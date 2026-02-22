'use client'

import { useState } from 'react'

interface LogoImageProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LogoImage({ size = 'md', className = '' }: LogoImageProps) {
  const [hasError, setHasError] = useState(false)

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return { container: 'w-6 h-6', text: 'text-xs' }
      case 'lg':
        return { container: 'w-10 h-10', text: 'text-xl' }
      default: // md
        return { container: 'w-7 h-7', text: 'text-sm' }
    }
  }

  const { container, text } = getSizeClasses()

  if (hasError) {
    return (
      <div className={`${container} bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center ${className}`}>
        <span className={`text-white font-bold ${text}`}>S</span>
      </div>
    )
  }

  return (
    <div className={`${container} flex items-center justify-center ${className}`}>
      <img
        src="/logo.png"
        alt="Snappix"
        className={`${container} object-contain`}
        onError={() => setHasError(true)}
      />
    </div>
  )
}



















