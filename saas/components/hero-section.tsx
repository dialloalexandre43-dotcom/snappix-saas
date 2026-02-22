"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Download } from "lucide-react";
import Image from "next/image";

const logos = [
  { name: "Shopify", text: "shopify" },
  { name: "Amazon", text: "amazon" },
  { name: "Etsy", text: "etsy" },
  { name: "WooCommerce", text: "woo" },
  { name: "PrestaShop", text: "presta" },
];

export function HeroSection() {
  return (
    <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 px-4 sm:px-6 overflow-hidden min-h-[90vh] flex items-center">
      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none select-none">
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/20" />
      </div>

      {/* Hero background image - transparent overlay, positioned to the right of title */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
        <div className="absolute right-5 top-0 bottom-0 w-full md:w-[65%] lg:w-[55%] xl:w-[50%] flex items-center justify-end">
          <div className="relative w-full h-[70vh] md:h-[80vh] opacity-30 md:opacity-40" style={{ perspective: '1000px' }}>
            <div className="relative w-full h-full scale-[0.75] md:scale-90 lg:scale-[1.05] origin-right" style={{ transform: 'rotateX(8deg)' }}>
              <Image
                src="/hero-background.png.png"
                alt="Laptop showing product visual generation"
                fill
                className="object-contain object-right-center"
                priority
                unoptimized
              />
            </div>
          </div>
        </div>
      </div>

      <div className="relative max-w-6xl mx-auto w-full z-10">
        {/* Headline -- left aligned, product promise front and center */}
        <div className="max-w-2xl mb-12">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-bold text-foreground tracking-tight leading-[1.1] mb-6 text-balance">
            From AliExpress page to{" "}
            <span className="text-accent">premium product visuals</span> in one
            click
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-xl leading-relaxed">
            Paste any product URL. Get studio-quality images ready for Shopify
            stores and ad campaigns -- no Photoshop, no photographer, no
            waiting.
          </p>
        </div>

        {/* CTA Buttons -- left aligned */}
        <div className="flex flex-col sm:flex-row items-start gap-4 mb-16">
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
          <Button
            size="lg"
            variant="outline"
            className="px-6 h-12 text-base rounded-full border-border text-foreground bg-transparent hover:bg-secondary"
            asChild
          >
            <Link href="#demo">
              <Play className="mr-2 h-4 w-4" />
              Watch demo
            </Link>
          </Button>
        </div>

        {/* Social Proof */}
        <div className="mb-0">
          <p className="text-sm text-muted-foreground mb-5">
            <span className="font-medium text-foreground">+12,847</span>{" "}
            dropshippers use our service for their product visuals
          </p>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-3 opacity-35">
            {logos.map((logo) => (
              <div
                key={logo.name}
                className="text-foreground font-semibold text-base tracking-tight"
              >
                {logo.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
