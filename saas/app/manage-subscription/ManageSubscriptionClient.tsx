'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AlertCircle, Calendar, CreditCard, Loader2, ArrowLeft, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

interface ManageSubscriptionClientProps {
  currentPlan: 'FREE' | 'STARTER' | 'PRO'
  subscriptionEnd: Date | null
  subscriptionId: string
}

export default function ManageSubscriptionClient({
  currentPlan,
  subscriptionEnd,
  subscriptionId,
}: ManageSubscriptionClientProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)

  const formatDate = (date: Date | null) => {
    if (!date) return 'N/A'
    return new Date(date).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const handleCancelSubscription = async () => {
    if (!showConfirm) {
      setShowConfirm(true)
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const response = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred')
      }

      setSuccess('Your subscription has been cancelled successfully. You will retain access until the end of your billing period.')
      setShowConfirm(false)
      
      // Redirect to billing page after 3 seconds
      setTimeout(() => {
        window.location.href = '/billing'
      }, 3000)
    } catch (error: any) {
      console.error('Error cancelling subscription:', error)
      setError(error.message || 'Error cancelling subscription')
      setLoading(false)
      setShowConfirm(false)
    }
  }

  const planNames = {
    FREE: 'Free',
    STARTER: 'Starter',
    PRO: 'Pro',
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link href="/billing">
          <Button variant="ghost" className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Billing
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground mb-2">Manage Subscription</h1>
        <p className="text-muted-foreground">
          Manage your subscription settings and cancel if needed
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
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
          <p className="font-semibold">Success</p>
          <p className="text-sm">{success}</p>
        </div>
      )}

      {/* Current Subscription Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Current Subscription
          </CardTitle>
          <CardDescription>Your active subscription details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Plan</p>
              <div className="flex items-center gap-2">
                <p className="text-lg font-semibold">{planNames[currentPlan]}</p>
                <Badge variant="default">Active</Badge>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1 flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Access Until
              </p>
              <p className="text-lg font-semibold">{formatDate(subscriptionEnd)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cancel Subscription */}
      <Card className="border-amber-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-amber-700">
            <AlertTriangle className="h-5 w-5" />
            Cancel Subscription
          </CardTitle>
          <CardDescription>
            Cancel your subscription. You will retain access until the end of your billing period.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!showConfirm ? (
            <>
              <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-lg">
                <p className="text-sm">
                  <strong>Note:</strong> After cancellation, you will be downgraded to the Free plan at the end of your current billing period ({formatDate(subscriptionEnd)}).
                </p>
              </div>
              <Button
                variant="destructive"
                onClick={handleCancelSubscription}
                disabled={loading}
                className="w-full"
              >
                Cancel Subscription
              </Button>
            </>
          ) : (
            <>
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg">
                <p className="font-semibold mb-2">Are you sure you want to cancel?</p>
                <p className="text-sm">
                  Your subscription will be cancelled immediately, but you will keep access to all features until {formatDate(subscriptionEnd)}.
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="destructive"
                  onClick={handleCancelSubscription}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    'Yes, Cancel Subscription'
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowConfirm(false)
                    setError(null)
                  }}
                  disabled={loading}
                  className="flex-1"
                >
                  No, Keep Subscription
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

