"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LogoImage } from "@/components/logo-image";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { Menu, User, Download } from "lucide-react";

const navItems = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Extension", href: "/extension" },
  { label: "FAQ", href: "#faq" },
  { label: "Dashboard", href: "/dashboard" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-4">
      <div
        className={`max-w-4xl mx-auto flex items-center justify-between rounded-full px-5 py-2.5 transition-all duration-300 ${
          scrolled
            ? "bg-card/80 backdrop-blur-xl border border-border/80 shadow-lg shadow-foreground/5"
            : "bg-card/50 backdrop-blur-md border border-border/40"
        }`}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <LogoImage size="md" />
          <span className="font-display font-semibold text-foreground tracking-tight">
            Snappix
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="px-3.5 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Desktop CTA -- Extension + Account buttons */}
        <div className="hidden md:flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            className="rounded-full border-border hover:bg-secondary px-4 text-sm font-medium"
            asChild
          >
            <a
              href="https://chrome.google.com/webstore"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Extension
            </a>
          </Button>
          <Button
            size="sm"
            className="rounded-full bg-foreground text-background hover:bg-foreground/90 px-5 text-sm font-medium"
            asChild
          >
            <Link href="/dashboard">
              <User className="mr-1.5 h-3.5 w-3.5" />
              Account
            </Link>
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-foreground hover:bg-secondary">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-72 bg-card border-border">
            <SheetTitle className="sr-only">Navigation menu</SheetTitle>
            <div className="flex flex-col gap-6 mt-8">
              <nav className="flex flex-col gap-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="px-3 py-2.5 text-foreground hover:bg-secondary rounded-lg transition-colors"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <div className="pt-4 border-t border-border space-y-2">
                <Button
                  variant="outline"
                  className="w-full rounded-full border-border hover:bg-secondary"
                  asChild
                >
                  <a
                    href="https://chrome.google.com/webstore"
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                  >
                    <Download className="mr-1.5 h-3.5 w-3.5" />
                    Add extension
                  </a>
                </Button>
                <Button
                  className="w-full rounded-full bg-foreground text-background hover:bg-foreground/90"
                  asChild
                >
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <User className="mr-1.5 h-3.5 w-3.5" />
                    Account
                  </Link>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
