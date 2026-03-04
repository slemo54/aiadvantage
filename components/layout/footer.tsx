import Link from "next/link";
import { Mail } from "lucide-react";
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

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-zinc-800 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="col-span-1 lg:col-span-1">
            <Link href="/" className="mb-3 flex items-center gap-2 text-lg font-bold">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600">
                <Mail className="h-3.5 w-3.5 text-white" />
              </div>
              <span className="text-white">{SITE_NAME}</span>
              <span className="text-indigo-400">.it</span>
            </Link>
            <p className="text-sm leading-relaxed text-zinc-500">
              Bridging the gap between cutting-edge AI research and practical 
              implementation for modern developers and tech leaders.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Explore
            </h4>
            <ul className="space-y-2.5">
              {EXPLORE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 transition-colors hover:text-zinc-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Connect
            </h4>
            <ul className="space-y-2.5">
              {CONNECT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-zinc-500 transition-colors hover:text-zinc-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Admin / Hidden */}
          <div>
            <h4 className="mb-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Admin
            </h4>
            <ul className="space-y-2.5">
              <li>
                <Link
                  href="/admin"
                  className="text-xs text-zinc-700 transition-colors hover:text-zinc-500"
                >
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-zinc-800/60 pt-6 sm:flex-row">
          <p className="text-xs text-zinc-600">
            &copy; {currentYear} {SITE_NAME}. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {LEGAL_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-zinc-600 transition-colors hover:text-zinc-400"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
