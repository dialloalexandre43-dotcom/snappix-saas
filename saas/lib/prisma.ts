import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Fix for "prepared statement already exists" error in development
// This happens when Next.js hot reloads and creates new Prisma instances
// Solution: Ensure we always use the same Prisma instance (singleton pattern)
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Helper function to retry Prisma operations that fail with "prepared statement already exists"
// This error occurs in Next.js development due to hot reload creating multiple Prisma instances
export async function retryPrismaOperation<T>(
  operation: () => Promise<T>,
  maxRetries = 5
): Promise<T> {
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error: any) {
      const errorMessage = error?.message || ''
      const isPreparedStatementError =
        errorMessage.includes('prepared statement') ||
        errorMessage.includes('42P05') ||
        error?.code === '42P05'

      if (isPreparedStatementError && attempt < maxRetries) {
        const waitTime = 300 * (attempt + 1) // Progressive backoff: 300ms, 600ms, 900ms, etc.
        console.warn(`⚠️ Prisma prepared statement error (${errorMessage.substring(0, 50)}...), waiting ${waitTime}ms and retrying (attempt ${attempt + 1}/${maxRetries + 1})...`)
        
        // Wait with progressive backoff before retrying
        await new Promise((resolve) => setTimeout(resolve, waitTime))
        
        // Try to reconnect if we're not on the first retry
        if (attempt > 0) {
          try {
            // Force a new connection by disconnecting and reconnecting
            await prisma.$disconnect().catch(() => {}) // Ignore errors if already disconnected
            await new Promise((resolve) => setTimeout(resolve, 100))
            await prisma.$connect().catch(() => {}) // Ignore errors if already connected
          } catch (reconnectError) {
            // Ignore reconnect errors
          }
        }
        
        continue
      }
      throw error
    }
  }
  throw new Error('Max retries exceeded')
}



