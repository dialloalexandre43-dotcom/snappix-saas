import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, ArrowRight, ExternalLink, Chrome } from 'lucide-react'
import Link from 'next/link'
import { OpenChromeExtensions } from './OpenChromeExtensions'
import { InstallExtensionButton } from './InstallExtensionButton'

export default async function ExtensionPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    redirect('/login')
  }

  return (
    <>
      <main className="max-w-4xl mx-auto px-5 sm:px-8 py-8 sm:py-12">
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Chrome className="w-10 h-10 text-accent" />
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4">
            Install Chrome Extension
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Add the Snappix extension to your browser to generate product visuals directly from Amazon and AliExpress.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Installation Instructions</CardTitle>
              <CardDescription>Follow these steps to install the extension</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-accent">1</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Open Chrome Extensions</h3>
                  <p className="text-sm text-muted-foreground">
                    Go to <code className="px-1.5 py-0.5 bg-secondary rounded text-xs">chrome://extensions/</code> in your Chrome browser
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-accent">2</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Enable Developer Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Click the "Developer mode" toggle in the top right of the page
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-accent">3</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Load the Extension</h3>
                  <p className="text-sm text-muted-foreground">
                    Click "Load unpacked" and select the <code className="px-1.5 py-0.5 bg-secondary rounded text-xs">extension</code> folder
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                  <span className="text-sm font-semibold text-accent">4</span>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">You're Ready!</h3>
                  <p className="text-sm text-muted-foreground">
                    The extension is now installed. Go to an Amazon or AliExpress product page to get started.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Direct access to tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <OpenChromeExtensions />
              
              <Button 
                className="w-full justify-start" 
                variant="outline"
                asChild
              >
                <Link href="https://www.amazon.com" target="_blank">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Test on Amazon
                </Link>
              </Button>

              <Button 
                className="w-full justify-start" 
                variant="outline"
                asChild
              >
                <Link href="https://www.aliexpress.com" target="_blank">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Test on AliExpress
                </Link>
              </Button>

              <div className="pt-4 border-t border-border">
                <Button 
                  className="w-full" 
                  asChild
                >
                  <Link href="/dashboard">
                    <ArrowRight className="mr-2 h-4 w-4" />
                    Back to Dashboard
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Extension Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Automatic Detection</h3>
                  <p className="text-sm text-muted-foreground">
                    The extension automatically detects product images on Amazon and AliExpress
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Multiple Styles</h3>
                  <p className="text-sm text-muted-foreground">
                    Choose from multiple professional photoshoot styles
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Various Formats</h3>
                  <p className="text-sm text-muted-foreground">
                    Generate images in different formats based on your plan
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Direct Integration</h3>
                  <p className="text-sm text-muted-foreground">
                    Generated images appear directly in your dashboard
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Download section */}
        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Ready to get started?</h3>
                <p className="text-sm text-muted-foreground">
                  Install the extension and create your first product visual in a few clicks
                </p>
              </div>
              <InstallExtensionButton />
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  )
}
