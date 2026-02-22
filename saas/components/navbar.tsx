'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { 
  Home, 
  LayoutDashboard, 
  CreditCard, 
  Puzzle,
  LogOut,
  User
} from 'lucide-react'
import { LogoImage } from '@/components/logo-image'

export function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const isActive = (path: string) => pathname === path

  const navItems = [
    { href: '/', label: 'Home', icon: Home },
    { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, auth: true },
    { href: '/billing', label: 'Billing', icon: CreditCard, auth: true },
    { href: '/extension', label: 'Extension', icon: Puzzle },
  ]

  return (
    <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <LogoImage size="sm" />
            <span className="font-semibold text-lg">Snappix</span>
          </Link>

          {/* Navigation Links - Always show 4 items */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              // If item requires auth and user is not logged in, redirect to login
              const href = (item.auth && !session) ? '/login' : item.href
              
              return (
                <Link key={item.href} href={href}>
                  <Button
                    variant={isActive(item.href) ? 'default' : 'ghost'}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              )
            })}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-2">
            {session ? (
              <>
                <span className="hidden sm:inline text-sm text-muted-foreground">
                  {session.user?.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="flex items-center space-x-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </>
            ) : (
              <>
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

