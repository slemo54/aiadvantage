"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Github, Twitter, Linkedin, Instagram } from "lucide-react";

const footerLinks = {
  explore: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  categories: [
    { label: "AI News", href: "/blog?category=ai_news" },
    { label: "Casi d'uso", href: "/blog?category=casi_duso" },
    { label: "Tools", href: "/blog?category=tools" },
    { label: "Tutorials", href: "/blog?category=tutorial" },
  ],
  social: [
    { label: "Twitter", href: "#", icon: Twitter },
    { label: "LinkedIn", href: "#", icon: Linkedin },
    { label: "Instagram", href: "#", icon: Instagram },
    { label: "GitHub", href: "#", icon: Github },
  ],
};

export function Footer() {
  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#22c55e] rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">AI</span>
              </div>
              <span className="text-xl font-bold text-white">IlVantaggioAI</span>
            </Link>
            <p className="text-gray-500 text-sm mb-6">
              Il tuo punto di riferimento per l&apos;intelligenza artificiale in italiano.
            </p>
            {/* Social Links */}
            <div className="flex gap-3">
              {footerLinks.social.map((item) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-9 h-9 rounded-full bg-[#171717] border border-gray-800 flex items-center justify-center text-gray-400 hover:bg-[#22c55e] hover:text-black hover:border-[#22c55e] transition-all"
                >
                  <item.icon className="w-4 h-4" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold text-white mb-4">Esplora</h3>
            <ul className="space-y-3">
              {footerLinks.explore.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-[#22c55e] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-semibold text-white mb-4">Categorie</h3>
            <ul className="space-y-3">
              {footerLinks.categories.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-gray-500 hover:text-[#22c55e] transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Mini */}
          <div>
            <h3 className="font-semibold text-white mb-4">Resta aggiornato</h3>
            <p className="text-gray-500 text-sm mb-4">
              Iscriviti per ricevere le ultime novità sull&apos;AI.
            </p>
            <Link
              href="/#contact"
              className="inline-flex items-center text-[#22c55e] font-medium text-sm hover:underline"
            >
              Iscriviti ora →
            </Link>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} IlVantaggioAI • By Anselmo
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="text-gray-600 hover:text-gray-400">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-400">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
