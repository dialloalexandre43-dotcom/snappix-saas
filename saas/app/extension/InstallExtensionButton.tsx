'use client'

import { Button } from '@/components/ui/button'
import { Download } from 'lucide-react'
import { useState } from 'react'

export function InstallExtensionButton() {
  const [copied, setCopied] = useState(false)

  const handleInstall = () => {
    const url = 'chrome://extensions/'
    
    // Copy to clipboard
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })

    // Try to open
    try {
      window.location.href = url
    } catch (e) {
      alert('Please copy this URL and paste it in Chrome\'s address bar:\n\nchrome://extensions/\n\nThen follow the on-screen instructions.')
    }
  }

  return (
    <Button 
      size="lg"
      onClick={handleInstall}
    >
      <Download className="mr-2 h-5 w-5" />
      {copied ? 'URL copied! Paste it in Chrome' : 'Install Extension'}
    </Button>
  )
}






