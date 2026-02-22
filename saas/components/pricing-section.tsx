"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 md:py-28 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4 text-balance">
            Simple pricing. Guaranteed results.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            No commitment, no hidden fees. Upgrade whenever you want.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-5 lg:gap-6 items-start">
          {/* CARD 1 - FREE */}
          <div className="rounded-xl border border-border bg-card p-6 lg:p-7">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-foreground mb-0.5">
                FREE
              </h3>
              <p className="text-[13px] text-muted-foreground">
                Découverte
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-foreground tracking-tight font-display">
                  0
                </span>
                <span className="text-lg font-bold text-foreground">
                  {""}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Free forever
              </p>
            </div>

            <Button
              variant="outline"
              className="w-full mb-6 border-border text-foreground hover:bg-secondary bg-transparent"
              asChild
            >
              <Link href="/signup">
                {"Start free"} <span aria-hidden="true">&rarr;</span>
              </Link>
            </Button>

            <ul className="flex flex-col gap-2.5">
              {[
                "3 images/mois",
                "Qualité basse (720 px max)",
                "1 seule taille: 1024×1024",
                "Watermark",
                "2 styles seulement",
              ].map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <Check className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* CARD 2 - STARTER (Popular, Orange) */}
          <div className="relative rounded-xl border-2 border-accent bg-card p-6 lg:p-7 shadow-xl shadow-accent/8 md:-mt-2 md:pb-9">
            <div className="mb-5 mt-1">
              <h3 className="text-lg font-semibold text-foreground mb-0.5">
                STARTER
              </h3>
              <p className="text-[13px] text-muted-foreground">
                9€/mois
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-0.5">
                <span className="text-4xl font-bold text-foreground tracking-tight font-display">
                  9
                </span>
                <span className="text-lg font-bold text-foreground">
                  €
                </span>
                <span className="text-sm text-muted-foreground ml-0.5">
                  /mo
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Billed monthly
              </p>
            </div>

            <Button
              className="w-full mb-6 bg-gradient-to-r from-accent to-orange-600 hover:from-orange-600 hover:to-orange-700 text-accent-foreground border-0 shadow-md shadow-accent/15"
              asChild
            >
              <Link href="/signup">
                {"Starter 9€/mo"}
              </Link>
            </Button>

            <ul className="flex flex-col gap-2.5">
              <li className="flex items-start gap-2.5 text-sm">
                <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-foreground">50 images/mois</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm">
                <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-foreground">Qualité standard (1024–2048 px)</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm">
                <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-foreground">5 tailles disponibles:</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm pl-6">
                <span className="text-foreground text-xs">• 1024×1024</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm pl-6">
                <span className="text-foreground text-xs">• 1080×1080</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm pl-6">
                <span className="text-foreground text-xs">• 1080×1920</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm pl-6">
                <span className="text-foreground text-xs">• 1600×1600</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm pl-6">
                <span className="text-foreground text-xs">• 2048×2048</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm">
                <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-foreground">NO WATERMARK</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm">
                <Check className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                <span className="text-foreground">8 styles HD complets</span>
              </li>
            </ul>
          </div>

          {/* CARD 3 - PRO (Premium thick stroke) */}
          <div className="rounded-xl border-[3px] border-foreground/30 bg-card p-6 lg:p-7">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-foreground mb-0.5">
                PRO
              </h3>
              <p className="text-[13px] text-muted-foreground">
                Power user
              </p>
            </div>

            <div className="mb-6">
              <div className="flex items-baseline gap-0.5">
                <span className="text-4xl font-bold text-foreground tracking-tight font-display">
                  29
                </span>
                <span className="text-lg font-bold text-foreground">
                  €
                </span>
                <span className="text-sm text-muted-foreground ml-0.5">
                  /mo
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Billed monthly
              </p>
            </div>

            <Button
              className="w-full mb-6 bg-foreground hover:bg-foreground/85 text-background border-0 shadow-md font-semibold text-[15px] h-11"
              asChild
            >
              <Link href="/signup">
                {"Pro 29€/mo"}
              </Link>
            </Button>

            <ul className="flex flex-col gap-2.5">
              <li className="flex items-start gap-2.5 text-sm">
                <Check className="w-4 h-4 text-foreground mt-0.5 flex-shrink-0" />
                <span className="text-foreground">300 images/mois</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm">
                <Check className="w-4 h-4 text-foreground mt-0.5 flex-shrink-0" />
                <span className="text-foreground">Qualité premium (jusqu'à 3000–4096 px)</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm">
                <Check className="w-4 h-4 text-foreground mt-0.5 flex-shrink-0" />
                <span className="text-foreground">10+ tailles/formats:</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm pl-6">
                <span className="text-foreground text-xs">• 3000×3000</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm pl-6">
                <span className="text-foreground text-xs">• 2048×682</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm pl-6">
                <span className="text-foreground text-xs">• 1000×1500</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm pl-6">
                <span className="text-foreground text-xs">• 1920×1080</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm pl-6">
                <span className="text-foreground text-xs">• PNG transparent haute rés</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm">
                <Check className="w-4 h-4 text-foreground mt-0.5 flex-shrink-0" />
                <span className="text-foreground">NO WATERMARK + export source</span>
              </li>
              <li className="flex items-start gap-2.5 text-sm">
                <Check className="w-4 h-4 text-foreground mt-0.5 flex-shrink-0" />
                <span className="text-foreground">PNG HR / PSD inclus</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
