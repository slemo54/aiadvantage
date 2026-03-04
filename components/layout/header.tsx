"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { SITE_NAME } from "@/lib/constants";
import type { CategoryKey } from "@/lib/constants";

const CATEGORY_LINKS: { key: CategoryKey; label: string; href: string }[] = [
  { key: "ai_news", label: "AI NEWS", href: "/blog?category=ai_news" },
  { key: "casi_duso", label: "USE CASES", href: "/blog?category=casi_duso" },
  { key: "web_dev", label: "WEB DEV", href: "/blog?category=web_dev" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top row - Logo, Search, Subscribe */}
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
              <Mail className="h-4 w-4 text-white" />
            </div>
            <span className="text-white">{SITE_NAME}</span>
            <span className="text-zinc-500">.it</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden flex-1 max-w-md md:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                type="search"
                placeholder="Search insights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 border-zinc-700 bg-zinc-900/50 pl-10 text-sm text-zinc-300 placeholder:text-zinc-500 focus:border-indigo-500 focus:ring-indigo-500/20"
              />
            </div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-3 md:flex">
            <Link href="/about" className="text-sm text-zinc-400 hover:text-white transition-colors">
              ABOUT ANSELMO
            </Link>
            <Button
              size="sm"
              className="bg-indigo-600 text-white hover:bg-indigo-500"
            >
              Subscribe
            </Button>
          </div>

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-zinc-400 hover:bg-zinc-800 hover:text-white"
              >
                {mobileOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="border-zinc-800 bg-zinc-950 text-white w-80"
            >
              <div className="mb-8 flex items-center gap-2 text-xl font-bold">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <span className="text-white">{SITE_NAME}</span>
                <span className="text-zinc-500">.it</span>
              </div>

              {/* Mobile Search */}
              <div className="mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <Input
                    type="search"
                    placeholder="Search insights..."
                    className="h-10 border-zinc-700 bg-zinc-900 pl-10 text-sm text-zinc-300 placeholder:text-zinc-500"
                  />
                </div>
              </div>

              <nav className="flex flex-col gap-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Categorie</p>
                {CATEGORY_LINKS.map((link) => (
                  <Link
                    key={link.key}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium text-zinc-300 transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                ))}
                <div className="my-2 border-t border-zinc-800" />
                <Link
                  href="/about"
                  onClick={() => setMobileOpen(false)}
                  className="text-sm font-medium text-zinc-300 transition-colors hover:text-white"
                >
                  ABOUT ANSELMO
                </Link>
                <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-500 mt-4">
                  Subscribe
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Bottom row - Category Navigation (Desktop only) */}
        <nav className="hidden border-t border-zinc-800/60 md:flex md:items-center md:gap-8">
          {CATEGORY_LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="py-3 text-xs font-semibold tracking-wider text-zinc-400 transition-colors hover:text-white"
              style={{ 
                color: link.key === 'ai_news' ? '#3b82f6' : 
                       link.key === 'casi_duso' ? '#22c55e' : 
                       link.key === 'web_dev' ? '#f97316' : undefined 
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}

export { SITE_NAME };
