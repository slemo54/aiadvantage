"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";

const siteLinks = [
  { label: "Home", href: "/" },
  { label: "Contattaci", href: "/contact" },
  { label: "Newsletter", href: "#newsletter" },
  { label: "Archivio", href: "/blog" },
  { label: "Site Map", href: "#" },
];

const legalLinks = [
  { label: "Termini di Servizio", href: "#" },
  { label: "Privacy Policy", href: "#" },
];

const categoryLinks = Object.entries(CATEGORIES)
  .slice(0, 4)
  .map(([key, cat]) => ({
    label: cat.label,
    href: `/category/${key}`,
  }));

const topicLinks = Object.entries(CATEGORIES)
  .slice(2)
  .map(([key, cat]) => ({
    label: cat.label,
    href: `/category/${key}`,
  }));

export function Footer() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-10">
          {/* Brand + Social */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#22c55e] rounded-xl flex items-center justify-center">
                <span className="text-black font-bold text-sm">AI</span>
              </div>
            </Link>
            {/* Social icons */}
            <div className="flex gap-3 mt-4">
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-[#171717] border border-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#22c55e] hover:text-black hover:border-[#22c55e] transition-all"
                aria-label="Twitter"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-[#171717] border border-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#22c55e] hover:text-black hover:border-[#22c55e] transition-all"
                aria-label="RSS"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M6.18 15.64a2.18 2.18 0 0 1 2.18 2.18C8.36 19.01 7.37 20 6.18 20 5 20 4 19.01 4 17.82a2.18 2.18 0 0 1 2.18-2.18M4 4.44A15.56 15.56 0 0 1 19.56 20h-2.83A12.73 12.73 0 0 0 4 7.27V4.44m0 5.66a9.9 9.9 0 0 1 9.9 9.9h-2.83A7.07 7.07 0 0 0 4 12.93V10.1z"/></svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-full bg-[#171717] border border-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#22c55e] hover:text-black hover:border-[#22c55e] transition-all"
                aria-label="GitHub"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg>
              </a>
            </div>
          </div>

          {/* Site links */}
          <div>
            <h3 className="font-semibold text-[#22c55e] text-xs uppercase tracking-wider mb-4">
              IlVantaggioAI
            </h3>
            <ul className="space-y-2.5">
              {siteLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#22c55e] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-[#22c55e] text-xs uppercase tracking-wider mb-4">
              Legale
            </h3>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#22c55e] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-[#22c55e] text-xs uppercase tracking-wider mb-4">
              Categorie
            </h3>
            <ul className="space-y-2.5">
              {categoryLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#22c55e] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Topics */}
          <div>
            <h3 className="font-semibold text-[#22c55e] text-xs uppercase tracking-wider mb-4">
              Topics
            </h3>
            <ul className="space-y-2.5">
              {topicLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-[#22c55e] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            &copy; {new Date().getFullYear()} IlVantaggioAI. Tutti i diritti riservati.
          </p>
        </div>
      </div>
    </footer>
  );
}
