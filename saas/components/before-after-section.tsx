"use client";

import Image from "next/image";
import { useState } from "react";

export function BeforeAfterSection() {
  const [imageError, setImageError] = useState(false);

  return (
    <section className="py-20 md:py-28 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header - slightly off-center */}
        <div className="max-w-xl mb-14">
          <p className="text-sm font-medium text-accent mb-3 uppercase tracking-wider">
            Before / After
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4 text-balance">
            One product URL. Premium visuals in seconds.
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Paste an AliExpress or Amazon link -- get studio-quality shots ready
            for your Shopify store and paid ads.
          </p>
        </div>

        {/* Before/After Image */}
        <div className="relative rounded-2xl overflow-hidden border border-border bg-card shadow-lg shadow-foreground/5">
          <div className="w-full aspect-video relative">
            {!imageError ? (
              <Image
                src="/before-after.jpg"
                alt="Before and After product comparison - Perfume bottle transformation"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                unoptimized
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <p className="text-muted-foreground">Image not found</p>
              </div>
            )}
          </div>
        </div>

        {/* Caption row */}
        <div className="flex items-center justify-between mt-6 px-2">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/40" />
            <span className="text-sm text-muted-foreground">
              Raw supplier photo from AliExpress
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-foreground font-medium">
              Result in 4 seconds
            </span>
            <div className="w-2.5 h-2.5 rounded-full bg-accent" />
          </div>
        </div>

        {/* Mini stats */}
        <div className="grid grid-cols-3 gap-4 mt-12">
          {[
            { value: "4s", label: "Average processing time" },
            { value: "+47%", label: "Higher conversion rate" },
            { value: "2M+", label: "Images processed this month" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="text-center p-5 rounded-xl bg-card border border-border"
            >
              <div className="text-2xl font-bold text-foreground mb-1">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
