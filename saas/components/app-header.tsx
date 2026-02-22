"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LayoutDashboard, CreditCard, Home, User } from "lucide-react";
import { useSession } from "next-auth/react";
import { LogoImage } from "@/components/logo-image";
import { signOut } from "next-auth/react";

const navLinks = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Billing", href: "/billing", icon: CreditCard },
  { label: "Account", href: "/account", icon: User },
];

export function AppHeader() {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <header className="border-b border-border bg-card/60 backdrop-blur-sm sticky top-0 z-40">
      <div className="max-w-4xl mx-auto flex items-center justify-between px-5 sm:px-8 h-14">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <LogoImage size="sm" />
          <span className="font-display font-semibold text-foreground tracking-tight">
            Snappix
          </span>
        </Link>

        {/* Nav */}
        <div className="flex items-center gap-1 sm:gap-1.5">
          {/* Back to site */}
          <Button
            variant="ghost"
            size="sm"
            className="hidden sm:inline-flex h-8 px-3 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full"
            asChild
          >
            <Link href="/">
              <Home className="mr-1.5 h-3.5 w-3.5" />
              Site
            </Link>
          </Button>

          {/* Mobile back */}
          <Button
            variant="ghost"
            size="sm"
            className="sm:hidden h-8 w-8 p-0 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full"
            asChild
          >
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back to site</span>
            </Link>
          </Button>

          {/* Separator */}
          <div className="w-px h-5 bg-border mx-1 sm:mx-2" />

          {/* Page links */}
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Button
                key={link.href}
                variant="ghost"
                size="sm"
                className={`h-8 px-3 text-xs rounded-full transition-colors ${
                  isActive
                    ? "bg-foreground text-background hover:bg-foreground/90"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                }`}
                asChild
              >
                <Link href={link.href}>
                  <Icon className="mr-1.5 h-3.5 w-3.5" />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              </Button>
            );
          })}

          {/* Credits counter - placeholder */}
          <div className="w-px h-5 bg-border mx-1 sm:mx-2" />
          <span className="text-xs text-muted-foreground tabular-nums hidden sm:block">
            47/500
          </span>
          <span className="text-xs text-muted-foreground tabular-nums sm:hidden">
            47
          </span>

          {/* User info */}
          {session?.user && (
            <>
              <div className="w-px h-5 bg-border mx-1 sm:mx-2" />
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs font-medium text-foreground">
                    {session.user.name || session.user.email?.split('@')[0] || 'Utilisateur'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {session.user.email}
                  </span>
                </div>
                <div className="sm:hidden">
                  <span className="text-xs font-medium text-foreground">
                    {session.user.email?.split('@')[0] || 'User'}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => signOut({ callbackUrl: '/' })}
                  className="h-8 px-3 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary rounded-full"
                >
                  Déconnexion
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

