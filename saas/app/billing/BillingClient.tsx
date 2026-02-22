'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Loader2, CreditCard, Calendar, RefreshCw, Settings, LogOut } from 'lucide-react'
import Link from 'next/link'

interface BillingClientProps {
  currentPlan: 'FREE' | 'STARTER' | 'PRO'
  subscriptionEnd: Date | null
  hasSubscription: boolean
}

export default function BillingClient({
  currentPlan,
  subscriptionEnd,
  hasSubscription,
}: BillingClientProps) {
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [syncing, setSyncing] = useState(false)
  const [syncMessage, setSyncMessage] = useState<string | null>(null)

  // Synchronisation automatique au chargement de la page (une seule fois)
  useEffect(() => {
    let hasSynced = false
    
    const autoSync = async () => {
      if (hasSynced) return // Ne synchroniser qu'une seule fois
      hasSynced = true
      
      try {
        console.log('🔄 Auto-syncing subscription on billing page...')
        
        // Toujours essayer de synchroniser pour s'assurer que le plan est à jour
        let response = await fetch('/api/stripe/sync-subscription', {
          method: 'POST',
        })
        
        let data = await response.json()
        
        // Si ça ne fonctionne pas ou si le plan est toujours FREE, essayer force-update
        if (!response.ok || data.plan === 'FREE') {
          console.log('Trying force-update...')
          response = await fetch('/api/stripe/force-update', {
            method: 'POST',
          })
          data = await response.json()
        }
        
        // Ne recharger QUE si le plan a changé (passé de FREE à autre chose)
        if (response.ok && data.plan !== 'FREE' && currentPlan === 'FREE') {
          console.log('✅ Subscription synced successfully, plan changed to:', data.plan)
          // Recharger la page pour afficher le nouveau plan
          setTimeout(() => {
            window.location.reload()
          }, 500)
        } else {
          console.log('ℹ️ Current plan:', data.plan || 'FREE', '- No reload needed (plan unchanged)')
        }
      } catch (error) {
        console.log('Auto-sync skipped:', error)
      }
    }

    // Attendre un peu avant de synchroniser pour laisser le temps au webhook de s'exécuter
    // Mais seulement si on vient du checkout (vérifier l'URL)
    const urlParams = new URLSearchParams(window.location.search)
    const fromCheckout = urlParams.get('success') === 'true'
    
    if (fromCheckout) {
      // Si on vient du checkout, synchroniser immédiatement
      autoSync()
      // Nettoyer l'URL
      window.history.replaceState({}, '', '/billing')
    } else {
      // Sinon, ne pas synchroniser automatiquement pour éviter les rechargements inutiles
      console.log('ℹ️ Not from checkout, skipping auto-sync to prevent reload loop')
    }
  }, [currentPlan])

  const handleSyncSubscription = async () => {
    setSyncing(true)
    setSyncMessage(null)
    setError(null)
    try {
      // Essayer d'abord avec sync-subscription, puis force-update si nécessaire
      let response = await fetch('/api/stripe/sync-subscription', {
        method: 'POST',
      })

      let data = await response.json()

      // Si ça ne fonctionne pas, essayer force-update
      if (!response.ok || data.plan === 'FREE') {
        console.log('Trying force-update...')
        response = await fetch('/api/stripe/force-update', {
          method: 'POST',
        })
        data = await response.json()
      }

      if (!response.ok) {
        throw new Error(data.error || 'Error during synchronization')
      }

      console.log('Sync result:', data)
      setSyncMessage(data.message || 'Subscription synchronized successfully')
      // Recharger la page après 2 secondes pour voir les changements
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error: any) {
      console.error('Error syncing subscription:', error)
      setError(error.message || 'Error during synchronization')
      setSyncing(false)
    }
  }

  const handleUpgrade = async (plan: 'STARTER' | 'PRO') => {
    setLoading(plan)
    setError(null)
    try {
      console.log('Creating checkout session for plan:', plan)
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })

      console.log('Response status:', response.status)
      const data = await response.json()
      console.log('Response data:', data)

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred')
      }

      if (data.url) {
        console.log('Redirecting to checkout URL:', data.url)
        window.location.href = data.url
      } else {
        throw new Error('No checkout URL returned from server')
      }
    } catch (error: any) {
      console.error('Error creating checkout session:', error)
      setError(error.message || 'Error creating payment session. Please check the console for details.')
      setLoading(null)
    }
  }

  const handleManageSubscription = () => {
    // Rediriger vers la page de gestion personnalisée
    window.location.href = '/manage-subscription'
  }

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const plans = [
    {
      id: 'FREE' as const,
      name: 'FREE',
      price: '0',
      period: 'Free forever',
      description: 'Discovery',
      features: [
        '3 images/month',
        'Low quality (720px max)',
        '1 size only: 1024×1024',
        'Watermark',
        '2 styles only',
      ],
      buttonText: 'Current Plan',
      disabled: true,
    },
    {
      id: 'STARTER' as const,
      name: 'STARTER',
      price: '9',
      period: '/month',
      description: 'Essential',
      features: [
        '50 images/month',
        'Standard quality (1024–2048px)',
        '5 sizes available',
        'NO WATERMARK',
        '8 HD styles',
      ],
      buttonText: currentPlan === 'STARTER' ? 'Current Plan' : 'Upgrade',
      disabled: currentPlan === 'STARTER',
    },
    {
      id: 'PRO' as const,
      name: 'PRO',
      price: '29',
      period: '/month',
      description: 'Power user',
      features: [
        '300 images/month',
        'Premium quality (up to 3000–4096px)',
        '10+ sizes/formats',
        'NO WATERMARK',
        '15+ PRO styles',
        'Source export (HD PNG / PSD)',
      ],
      buttonText: currentPlan === 'PRO' ? 'Current Plan' : 'Upgrade',
      disabled: currentPlan === 'PRO',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Billing</h1>
        <p className="text-muted-foreground">
          Manage your subscription and payment information
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
          <p className="font-semibold">Error</p>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {/* Success message */}
      {syncMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          <p className="font-semibold">Success</p>
          <p className="text-sm">{syncMessage}</p>
        </div>
      )}


      {/* Current Plan Info */}
      {hasSubscription && subscriptionEnd && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Active Subscription
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Current Plan</p>
                <p className="text-lg font-semibold">{currentPlan}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Renewal
                </p>
                <p className="text-lg font-semibold">{formatDate(subscriptionEnd)}</p>
              </div>
            </div>
            
            {/* Manage Subscription Button */}
            <div className="pt-4 border-t border-border">
              <Button
                onClick={handleManageSubscription}
                disabled={loading !== null}
                className="w-full"
                variant="outline"
              >
                {loading === 'manage' ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Ouverture...
                  </>
                ) : (
                  <>
                    <Settings className="mr-2 h-4 w-4" />
                    Manage Subscription
                  </>
                )}
              </Button>
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Change plan, update credit card, or cancel subscription
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card
            key={plan.id}
            className={currentPlan === plan.id ? 'border-accent border-2' : ''}
          >
            <CardHeader>
              <div className="flex items-center justify-between mb-2">
                <CardTitle>{plan.name}</CardTitle>
                {currentPlan === plan.id && (
                  <Badge variant="default">Current</Badge>
                )}
              </div>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full"
                variant={currentPlan === plan.id ? 'outline' : 'default'}
                disabled={plan.disabled || loading !== null}
                onClick={() => {
                  if (plan.id !== 'FREE' && plan.id !== currentPlan) {
                    handleUpgrade(plan.id)
                  }
                }}
              >
                {loading === plan.id ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  plan.buttonText
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Back to Dashboard */}
      <div className="flex justify-center">
          <Button variant="outline" asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  )
}


