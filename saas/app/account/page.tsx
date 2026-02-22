'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ArrowRight,
  CheckCircle2,
  CreditCard,
  User,
  Mail,
  Shield,
  LogOut,
  Pencil,
  Eye,
  EyeOff,
} from 'lucide-react'

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  if (status === 'loading' || !session?.user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Chargement...</div>
      </div>
    )
  }

  const userEmail = session.user.email || 'N/A'
  const userName = (session.user as { name?: string | null }).name || userEmail.split('@')[0]
  const memberSince = new Date().toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <>
      <main className="max-w-4xl mx-auto px-5 sm:px-8 py-8 sm:py-12 space-y-8">
        {/* Page title */}
        <div>
          <h1 className="font-display font-semibold text-foreground text-xl tracking-tight">
            Compte
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Gérez votre profil, votre plan et vos informations de paiement.
          </p>
        </div>

        {/* ── Section 1: Profile ── */}
        <section>
          <h2 className="font-display font-semibold text-foreground text-lg tracking-tight mb-4">
            Profil
          </h2>

          <div className="bg-card rounded-xl border border-border p-5 sm:p-6 space-y-5">
            {/* Avatar + Name */}
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-full bg-secondary border border-border flex items-center justify-center shrink-0">
                {(session.user as { image?: string | null }).image ? (
                  <img
                    src={(session.user as { image?: string | null }).image!}
                    alt={userName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <User className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-medium text-foreground">
                  {userName}
                </p>
                <p className="text-sm text-muted-foreground">
                  Membre depuis {memberSince}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs border-border hover:bg-secondary h-8 px-4 bg-transparent shrink-0 hidden sm:flex"
              >
                <Pencil className="mr-1.5 h-3 w-3" />
                Modifier
              </Button>
            </div>

            {/* Info grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-border/60">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Mail className="h-3 w-3" />
                  Email
                </p>
                <p className="text-sm font-medium text-foreground">
                  {userEmail}
                </p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Shield className="h-3 w-3" />
                  Mot de passe
                </p>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-foreground tabular-nums">
                    {showPassword ? '••••••••••••' : '••••••••••••'}
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="h-3.5 w-3.5" />
                    ) : (
                      <Eye className="h-3.5 w-3.5" />
                    )}
                    <span className="sr-only">Afficher/masquer le mot de passe</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile edit button */}
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-xs border-border hover:bg-secondary h-8 px-4 bg-transparent w-full sm:hidden"
            >
              <Pencil className="mr-1.5 h-3 w-3" />
              Modifier le profil
            </Button>
          </div>
        </section>

        {/* ── Section 2: Current Plan ── */}
        <section>
          <h2 className="font-display font-semibold text-foreground text-lg tracking-tight mb-4">
            Plan & Crédits
          </h2>

          <div className="bg-card rounded-xl border border-border p-5 sm:p-6 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="font-display font-semibold text-foreground">
                    Starter
                  </span>
                  <Badge
                    variant="outline"
                    className="text-xs font-normal bg-emerald-50 text-emerald-700 border-emerald-200"
                  >
                    Actif
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    19&#8239;EUR / mois
                  </span>
                </div>

                <p className="text-sm text-muted-foreground">
                  47 / 500 crédits restants ce mois
                </p>

                {/* Credits bar */}
                <div className="max-w-xs">
                  <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-500"
                      style={{ width: `${(47 / 500) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1.5">
                    9.4% utilisé &middot; Renouvellement le 15 mars
                  </p>
                </div>
              </div>

              <Button
                className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-6 h-9 text-sm font-medium sm:self-start shrink-0"
                asChild
              >
                <Link href="/billing">
                  Passer Pro
                  <ArrowRight className="ml-2 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* ── Section 3: Payment Method ── */}
        <section>
          <h2 className="font-display font-semibold text-foreground text-lg tracking-tight mb-4">
            Moyen de paiement
          </h2>

          <div className="bg-card rounded-xl border border-border p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-secondary rounded-md flex items-center justify-center border border-border">
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {'**** **** **** 1234'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Expire le 12/28
                  </p>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs border-border hover:bg-secondary h-8 px-4 bg-transparent sm:self-center"
              >
                Modifier la carte
              </Button>
            </div>
          </div>
        </section>

        {/* ── Section 4: Danger Zone ── */}
        <section className="pb-4">
          <h2 className="font-display font-semibold text-foreground text-lg tracking-tight mb-4">
            Compte
          </h2>

          <div className="space-y-3">
            {/* Sign out */}
            <div className="bg-card rounded-xl border border-border p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">Déconnexion</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Déconnectez-vous de cet appareil.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs border-border hover:bg-secondary h-8 px-4 bg-transparent sm:self-center shrink-0"
                onClick={handleSignOut}
              >
                <LogOut className="mr-1.5 h-3 w-3" />
                Déconnexion
              </Button>
            </div>

            {/* Delete account */}
            <div className="bg-card rounded-xl border border-destructive/20 p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm font-medium text-foreground">
                  Supprimer le compte
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Supprimez définitivement votre compte et toutes les données. Cette action ne peut pas être annulée.
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full text-xs border-destructive/30 text-destructive hover:bg-destructive/5 hover:text-destructive h-8 px-4 bg-transparent sm:self-center shrink-0"
              >
                Supprimer le compte
              </Button>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

