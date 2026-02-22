import Image from "next/image";
import {
  Sparkles,
  Layers,
  Zap,
  Palette,
  Download,
  RefreshCw,
} from "lucide-react";

const features = [
  {
    icon: Sparkles,
    title: "1-click background removal",
    description:
      "Our AI detects your product and removes the background instantly. Clean edges, even on complex objects like jewelry or fabric.",
  },
  {
    icon: Layers,
    title: "Custom backgrounds",
    description:
      "Pure white, gradient, lifestyle scene... Add the perfect backdrop for your marketplace or brand identity.",
  },
  {
    icon: Zap,
    title: "Batch processing",
    description:
      "Upload up to 500 images at once. Processing runs in the background while you keep working on your store.",
  },
  {
    icon: Palette,
    title: "Auto retouching",
    description:
      "White balance, contrast, sharpness... Everything is automatically optimized for e-commerce standards.",
  },
  {
    icon: Download,
    title: "Multi-format export",
    description:
      "Shopify, Amazon, Etsy, Instagram... One click to generate every size your platform requires.",
  },
  {
    icon: RefreshCw,
    title: "Unlimited history",
    description:
      "Access all your processed images anytime. Re-download or edit them whenever you need.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-20 md:py-28 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="max-w-2xl mb-16">
          <p className="text-sm font-medium text-accent mb-3 uppercase tracking-wider">
            Features
          </p>
          <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground tracking-tight mb-4 text-balance">
            Everything you need to turn supplier photos into ads-ready visuals
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            From AliExpress screenshots to premium product shots -- our service
            automates all the tedious work so you can focus on selling.
          </p>
        </div>

        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className={`group p-6 rounded-xl border border-border bg-card hover:border-accent/30 hover:bg-card/80 transition-all duration-300 ${
                  index === 0 ? "lg:col-span-2" : ""
                }`}
              >
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                  <Icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Feature Showcase */}
        <div className="relative rounded-2xl overflow-hidden border border-border bg-card">
          <div className="grid lg:grid-cols-2 gap-8 p-8 lg:p-12">
            <div className="flex flex-col justify-center">
              <p className="text-sm font-medium text-accent mb-3">
                Live results
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-4 tracking-tight">
                Product photos that actually convert
              </h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Our users see +47% more conversions after upgrading their
                visuals. Clean photos = more trust = more sales.
              </p>
              <ul className="flex flex-col gap-3">
                {[
                  "Perfect white backgrounds for Amazon",
                  "Lifestyle images for social media ads",
                  "Platform-optimized sizes in one click",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm">
                    <div className="w-5 h-5 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-accent" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="relative w-full h-[300px] md:h-[400px] rounded-xl border border-border bg-[#eae8e6] overflow-hidden flex items-center justify-center">
                <Image
                  src="/live-results.jpg.jpg"
                  alt="Live results - Product photos showcase"
                  fill
                  className="object-contain object-center"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
