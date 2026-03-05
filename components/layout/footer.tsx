"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Mail, ArrowUpRight, Heart } from "lucide-react";
import { SITE_NAME } from "@/lib/constants";

const EXPLORE_LINKS = [
  { href: "/blog?category=ai_news", label: "AI News" },
  { href: "/blog?category=casi_duso", label: "Case Studies" },
  { href: "/blog?category=web_dev", label: "Dev Resource" },
  { href: "/blog?category=tools", label: "Benchmarks" },
];

const CONNECT_LINKS = [
  { href: "/about", label: "About Anselmo" },
  { href: "https://twitter.com", label: "Twitter (X)" },
  { href: "https://linkedin.com", label: "LinkedIn" },
  { href: "/contact", label: "Contact" },
];

const LEGAL_LINKS = [
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Service" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4"
        >
          {/* Brand */}
          <motion.div variants={itemVariants} className="col-span-1 lg:col-span-1">
            <motion.div whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
              <Link href="/" className="mb-4 flex items-center gap-2 text-lg font-bold">
                <motion.div
                  className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600"
                  whileHover={{ rotate: 5, scale: 1.1 }}
                  transition={{ duration: 0.2 }}
                >
                  <Mail className="h-4 w-4 text-white" />
                </motion.div>
                <span className="text-white">{SITE_NAME}</span>
                <span className="text-indigo-400">.it</span>
              </Link>
            </motion.div>
            <p className="mb-6 text-sm leading-relaxed text-zinc-500">
              Bridging the gap between cutting-edge AI research and practical
              implementation for modern developers and tech leaders.
            </p>
            {/* Newsletter mini signup */}
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="h-9 flex-1 rounded-lg border border-zinc-800 bg-zinc-900 px-3 text-sm text-zinc-300 placeholder:text-zinc-600 focus:border-indigo-500 focus:outline-none"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="h-9 rounded-lg bg-indigo-600 px-4 text-sm font-medium text-white hover:bg-indigo-500"
              >
                Join
              </motion.button>
            </div>
          </motion.div>

          {/* Explore */}
          <motion.div variants={itemVariants}>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Explore
            </h4>
            <ul className="space-y-3">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-200"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Connect */}
          <motion.div variants={itemVariants}>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Connect
            </h4>
            <ul className="space-y-3">
              {CONNECT_LINKS.map((link) => (
                <li key={link.href}>
                  <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-1 text-sm text-zinc-500 transition-colors hover:text-zinc-200"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </motion.div>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Admin / Hidden */}
          <motion.div variants={itemVariants}>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Admin
            </h4>
            <ul className="space-y-3">
              <li>
                <motion.div whileHover={{ x: 3 }} transition={{ duration: 0.2 }}>
                  <Link
                    href="/admin"
                    className="text-xs text-zinc-700 transition-colors hover:text-zinc-500"
                  >
                    Dashboard
                  </Link>
                </motion.div>
              </li>
            </ul>
          </motion.div>
        </motion.div>

        {/* Bottom bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-800/60 pt-8 sm:flex-row"
        >
          <p className="text-xs text-zinc-600">
            &copy; {currentYear} {SITE_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {LEGAL_LINKS.map((link) => (
              <motion.div key={link.href} whileHover={{ y: -1 }}>
                <Link
                  href={link.href}
                  className="text-xs text-zinc-600 transition-colors hover:text-zinc-400"
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>
          <p className="flex items-center gap-1 text-xs text-zinc-600">
            Made with <Heart className="h-3 w-3 text-red-500" /> in Italy
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
