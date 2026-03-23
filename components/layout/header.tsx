"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, Search, Moon } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";

const categoryLinks = Object.entries(CATEGORIES).map(([key, cat]) => ({
  href: `/category/${key}`,
  label: cat.label,
}));

const navLinks = [
  { href: "/blog", label: "Ultimi" },
  ...categoryLinks,
  { href: "#newsletter", label: "Newsletter" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-white/5 animate-slide-down">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-[#22c55e] transition-colors whitespace-nowrap"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Mobile: Logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2">
            <div className="w-7 h-7 bg-[#22c55e] rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-xs">AI</span>
            </div>
            <span className="text-lg font-bold text-white">IlVantaggioAI</span>
          </Link>

          {/* Right icons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              aria-label="Cerca"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              className="hidden sm:flex p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"
              aria-label="Tema"
            >
              <Moon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-white"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div className="pb-3">
            <input
              type="text"
              placeholder="Cerca articoli..."
              className="w-full px-4 py-2.5 rounded-lg bg-[#111] border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-[#22c55e] transition-colors text-sm"
              autoFocus
            />
          </div>
        )}

        {/* Mobile Menu */}
        {isOpen && (
          <nav className="lg:hidden py-4 space-y-1 border-t border-gray-800">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-gray-400 hover:text-[#22c55e] hover:bg-white/5 rounded-lg transition-colors text-sm"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
