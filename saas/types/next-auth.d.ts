import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  /**
   * Extension du type Session pour inclure name et image
   * Ces propriétés sont fournies par les providers OAuth (Google, etc.)
   */
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
    }
  }

  /**
   * Extension du type User pour inclure name et image
   */
  interface User {
    id: string
    email: string
    name?: string | null
    image?: string | null
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
  }
}






















