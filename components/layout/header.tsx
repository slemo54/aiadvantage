"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowRight, Sparkles } from "lucide-react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "Chi siamo" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/75 backdrop-blur-2xl"
    >
      <div className="border-b border-white/5 bg-gradient-to-r from-[#22c55e]/10 via-transparent to-cyan-400/10">
        <div className="mx-auto flex max-w-7xl items-center justify-center gap-2 px-4 py-2 text-center text-[11px] font-medium text-zinc-300 sm:text-xs">
          <Sparkles className="h-3.5 w-3.5 text-[#22c55e]" />
          Strategie AI, tutorial operativi e casi reali per professionisti italiani
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-[#22c55e] to-cyan-400 shadow-[0_0_30px_rgba(34,197,94,.25)]">
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
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-medium text-zinc-300 transition hover:border-[#22c55e]/40 hover:text-white"
            >
              Esplora il blog
            </Link>
            <motion.a
              href="#newsletter"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 rounded-full bg-[#22c55e] px-5 py-2.5 text-sm font-semibold text-black transition-colors hover:bg-[#4ade80]"
            >
              Iscriviti gratis
              <ArrowRight className="h-4 w-4" />
            </motion.a>
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white"
            aria-label="Apri menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        <motion.div
          initial={false}
          animate={{
            height: isOpen ? "auto" : 0,
            opacity: isOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
          className="md:hidden overflow-hidden"
        >
          <nav className="py-4 space-y-2">
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
                className="block w-full rounded-full bg-[#22c55e] px-5 py-2.5 text-center text-sm font-semibold text-black"
              >
                Iscriviti gratis
              </a>
            </div>
          </nav>
        </motion.div>
      </div>
    </motion.header>
  );
}
