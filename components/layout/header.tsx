"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";

const navLinks = [
  { href: "/", label: "Inizio" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "Chi siamo" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={[
        "fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/65 backdrop-blur-xl transition-all duration-300",
        isScrolled ? "header-scrolled" : "",
      ].join(" ")}
    >
      <div className="border-b border-white/5 bg-gradient-to-r from-[#10b981]/10 via-transparent to-cyan-400/10">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-[11px] font-medium text-zinc-300 sm:text-xs">
          <Sparkles className="h-3.5 w-3.5 text-[#10b981]" />
          Strategie AI, tutorial operativi e casi reali per professionisti italiani
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#10b981] to-[#34d399] shadow-[0_0_30px_rgba(16,185,129,.25)]">
              <span className="text-black font-black text-sm">AI</span>
            </div>
            <div>
              <span className="block text-lg font-black leading-none text-white sm:text-xl">IlVantaggioAI</span>
              <span className="hidden text-[10px] uppercase tracking-[0.28em] text-zinc-500 sm:block">
                AI media per professionisti italiani
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-[#10b981]/40 hover:text-white"
            >
              Esplora il blog
            </Link>
            <a
              href="#newsletter"
              className="cta-cursor relative inline-flex items-center gap-2 rounded-full bg-[#10b981] px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#34d399]"
            >
              Iscriviti gratis
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-gray-400 hover:text-white md:hidden"
            aria-label="Apri menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <div
          className={[
            "overflow-hidden transition-all duration-300 md:hidden",
            isOpen ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0",
          ].join(" ")}
        >
          <nav className="space-y-2 pt-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block rounded-lg px-4 py-2 text-gray-400 transition-colors hover:bg-white/5 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <div className="grid gap-2 px-4 pt-2">
              <Link
                href="/blog"
                onClick={() => setIsOpen(false)}
                className="block w-full rounded-full border border-white/10 px-5 py-2.5 text-center text-sm font-semibold text-white"
              >
                Esplora il blog
              </Link>
              <a
                href="#newsletter"
                onClick={() => setIsOpen(false)}
                className="block w-full rounded-full bg-[#10b981] px-5 py-2.5 text-center text-sm font-semibold text-black"
              >
                Iscriviti gratis
              </a>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
