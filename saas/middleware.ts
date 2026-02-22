import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Handle CORS for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    const origin = request.headers.get('origin')
    
    // Allow requests from Chrome extensions and localhost
    const allowedOrigins = [
      'http://localhost:3001',
      'http://localhost:3000',
      'chrome-extension://',
    ]

    const isAllowedOrigin = 
      !origin || // Same-origin requests (no origin header)
      allowedOrigins.some(allowed => origin.includes(allowed)) ||
      origin.startsWith('chrome-extension://')

    if (isAllowedOrigin) {
      const response = NextResponse.next()
      
      // Set CORS headers
      if (origin) {
        response.headers.set('Access-Control-Allow-Origin', origin)
      } else {
        response.headers.set('Access-Control-Allow-Origin', '*')
      }
      
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie')
      response.headers.set('Access-Control-Allow-Credentials', 'true')
      response.headers.set('Access-Control-Max-Age', '86400')

      // Handle preflight requests
      if (request.method === 'OPTIONS') {
        return new NextResponse(null, { status: 200, headers: response.headers })
      }

      return response
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/api/:path*',
}













