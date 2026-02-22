import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Download } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20 md:py-28 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="relative bg-card rounded-2xl p-8 md:p-12 lg:p-16 overflow-hidden border border-border">
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/6 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-accent/4 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

          <div className="relative text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4 text-balance">
              Ready to turn any product link into premium visuals?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Join thousands of dropshippers who use Snappix to go from
              AliExpress page to Shopify-ready images in one click.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 h-12 text-base rounded-full font-medium"
                asChild
              >
                <Link href="/signup">
                  Start for free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="px-6 h-12 text-base rounded-full border-border text-foreground bg-transparent hover:bg-secondary"
                asChild
              >
                <a
                  href="https://chrome.google.com/webstore"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Add extension
                </a>
              </Button>
            </div>
            <p className="text-muted-foreground text-sm mt-4">
              3 images free -- No credit card required
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

