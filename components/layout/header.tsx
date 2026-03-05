"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Search, Mail, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { SITE_NAME } from "@/lib/constants";
import type { CategoryKey } from "@/lib/constants";

const CATEGORY_LINKS: { key: CategoryKey; label: string; href: string; color: string }[] = [
  { key: "ai_news", label: "AI NEWS", href: "/blog?category=ai_news", color: "#3b82f6" },
  { key: "casi_duso", label: "USE CASES", href: "/blog?category=casi_duso", color: "#22c55e" },
  { key: "web_dev", label: "WEB DEV", href: "/blog?category=web_dev", color: "#f97316" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="sticky top-0 z-50 border-b border-zinc-800/60 bg-zinc-950/95 backdrop-blur-md"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Top row - Logo, Search, Subscribe */}
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
              <motion.div
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600"
                whileHover={{ rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <Mail className="h-4 w-4 text-white" />
              </motion.div>
              <span className="text-white">{SITE_NAME}</span>
              <span className="text-zinc-500">.it</span>
            </Link>
          </motion.div>

          {/* Desktop Search */}
          <div className="hidden flex-1 max-w-md md:block">
            <motion.div
              className="relative"
              animate={{ scale: isSearchFocused ? 1.02 : 1 }}
              transition={{ duration: 0.2 }}
            >
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <Input
                type="search"
                placeholder="Search insights..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="h-9 border-zinc-700 bg-zinc-900/50 pl-10 text-sm text-zinc-300 placeholder:text-zinc-500 focus:border-indigo-500 focus:ring-indigo-500/20 transition-all"
              />
            </motion.div>
          </div>

          {/* Desktop CTA */}
          <div className="hidden items-center gap-4 md:flex">
            <motion.div whileHover={{ y: -1 }}>
              <Link
                href="/about"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                ABOUT ANSELMO
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                size="sm"
                className="bg-indigo-600 text-white hover:bg-indigo-500"
              >
                Subscribe
              </Button>
            </motion.div>
          </div>

          {/* Mobile hamburger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild className="md:hidden">
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-zinc-400 hover:bg-zinc-800 hover:text-white"
                >
                  <AnimatePresence mode="wait">
                    {mobileOpen ? (
                      <motion.div
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <X className="h-5 w-5" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Menu className="h-5 w-5" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <span className="sr-only">Menu</span>
                </Button>
              </motion.div>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="border-zinc-800 bg-zinc-950 text-white w-80"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8 flex items-center gap-2 text-xl font-bold"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <span className="text-white">{SITE_NAME}</span>
                <span className="text-zinc-500">.it</span>
              </motion.div>

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
                {CATEGORY_LINKS.map((link, index) => (
                  <motion.div
                    key={link.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between text-sm font-medium text-zinc-300 transition-colors hover:text-white group"
                    >
                      <span style={{ color: link.color }}>{link.label}</span>
                      <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </motion.div>
                ))}
                <div className="my-2 border-t border-zinc-800" />
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <Link
                    href="/about"
                    onClick={() => setMobileOpen(false)}
                    className="text-sm font-medium text-zinc-300 transition-colors hover:text-white"
                  >
                    ABOUT ANSELMO
                  </Link>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-500 mt-4">
                    Subscribe
                  </Button>
                </motion.div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        {/* Bottom row - Category Navigation (Desktop only) */}
        <nav className="hidden border-t border-zinc-800/60 md:flex md:items-center md:gap-8">
          {CATEGORY_LINKS.map((link, index) => (
            <motion.div
              key={link.key}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Link
                href={link.href}
                className="group relative py-3 text-xs font-semibold tracking-wider transition-colors"
                style={{ color: link.color }}
              >
                {link.label}
                <motion.span
                  className="absolute bottom-2 left-0 h-0.5 w-0 bg-current group-hover:w-full transition-all duration-300"
                />
              </Link>
            </motion.div>
          ))}
        </nav>
      </div>
    </motion.header>
  );
}

export { SITE_NAME };
