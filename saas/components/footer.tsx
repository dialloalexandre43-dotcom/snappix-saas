"use client";

import Link from "next/link";
import { LogoImage } from "@/components/logo-image";

const footerLinks = {
  Product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "API", href: "#api" },
    { label: "Integrations", href: "#integrations" },
  ],
  Resources: [
    { label: "Documentation", href: "#docs" },
    { label: "Blog", href: "#blog" },
    { label: "Tutorials", href: "#tutorials" },
    { label: "Changelog", href: "#changelog" },
  ],
  Company: [
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
    { label: "Careers", href: "#careers" },
    { label: "Partners", href: "#partners" },
  ],
  Legal: [
    { label: "Privacy", href: "#privacy" },
    { label: "Terms", href: "#terms" },
    { label: "Legal notice", href: "#legal" },
    { label: "GDPR", href: "#gdpr" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <LogoImage size="md" />
              <span className="font-display font-semibold text-foreground">
                Snappix
              </span>
            </Link>
            <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
              From any product page to premium visuals -- in one click.
            </p>
            <div className="flex gap-3">
              {["Twitter", "LinkedIn", "YouTube"].map((social) => (
                <a
                  key={social}
                  href={`#${social.toLowerCase()}`}
                  className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors text-xs font-medium"
                  aria-label={social}
                >
                  {social.charAt(0)}
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-medium text-foreground mb-3 text-sm">
                {category}
              </h4>
              <ul className="flex flex-col gap-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            2026 Snappix. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>Made in Paris</span>
            <span className="hidden sm:inline text-border">|</span>
            <span>EU hosted</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

