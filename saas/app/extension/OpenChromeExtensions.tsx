'use client'

import { Button } from '@/components/ui/button'
import { Chrome, ExternalLink } from 'lucide-react'
import { useState } from 'react'

export function OpenChromeExtensions() {
  const [copied, setCopied] = useState(false)

  const handleOpenExtensions = () => {
    // Try to open chrome://extensions/
    // Note: This only works if the user manually types it or clicks a bookmark
    // We'll copy it to clipboard and show instructions
    const url = 'chrome://extensions/'
    
    // Copy to clipboard
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })

    // Try to open (may not work from web page)
    try {
      window.location.href = url
    } catch (e) {
      // If it fails, show instructions
      alert('Please copy this URL and paste it in Chrome\'s address bar:\n\nchrome://extensions/')
    }
  }

  return (
    <Button 
      className="w-full justify-start" 
      variant="outline"
      onClick={handleOpenExtensions}
    >
      <Chrome className="mr-2 h-4 w-4" />
      {copied ? 'URL copied!' : 'Open Chrome Extensions'}
      <ExternalLink className="ml-auto h-4 w-4" />
    </Button>
  )
}






