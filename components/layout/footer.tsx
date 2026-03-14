import Link from "next/link";
import { Github, Twitter, Linkedin, Instagram, ArrowRight } from "lucide-react";

const footerLinks = {
  explore: [
    { label: "Home", href: "/" },
    { label: "Blog", href: "/blog" },
    { label: "Chi siamo", href: "/about" },
  ],
  categories: [
    { label: "AI News", href: "/blog?category=ai_news" },
    { label: "Casi d'uso", href: "/blog?category=casi_duso" },
    { label: "Strumenti", href: "/blog?category=tools" },
    { label: "Tutorial", href: "/blog?category=tutorial" },
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
                <a
                  key={item.label}
                  href={item.href}
                  className="cta-cursor relative flex h-9 w-9 items-center justify-center rounded-full border border-gray-800 bg-[#171717] text-gray-400 transition-all hover:border-[#22c55e] hover:bg-[#22c55e] hover:text-black"
                >
                  <item.icon className="w-4 h-4" />
                </a>
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

          <div className="col-span-2 rounded-[1.75rem] border border-white/10 bg-[linear-gradient(135deg,rgba(16,185,129,0.12),rgba(255,255,255,0.03),rgba(0,0,0,0.92))] p-6 md:col-span-1">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#86efac]">Newsletter</p>
            <h3 className="mt-3 text-2xl font-black text-white">Hai un progetto? Parliamone.</h3>
            <p className="mt-3 text-sm leading-7 text-zinc-400">
              Iscriviti alla newsletter per ricevere aggiornamenti settimanali sul mondo dell&apos;AI.
            </p>
            <form className="mt-5 flex flex-col gap-3">
              <input
                type="email"
                placeholder="Inserisci la tua email"
                className="min-h-[48px] rounded-2xl border border-white/10 bg-black/40 px-4 text-sm text-white placeholder:text-zinc-500 focus:border-[#10b981] focus:outline-none"
              />
              <button className="cta-cursor relative inline-flex items-center justify-center gap-2 rounded-2xl bg-[#10b981] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#34d399]">
                Iscriviti
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-600 text-sm">
            © {new Date().getFullYear()} IlVantaggioAI • By Anselmo
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="#" className="text-gray-600 hover:text-gray-400">
              Privacy
            </Link>
            <Link href="#" className="text-gray-600 hover:text-gray-400">
              Termini
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
