"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Zap, Target, Rocket } from "lucide-react";
import { FeaturedArticles } from "@/components/sections/featured-articles";
import { Newsletter } from "@/components/sections/newsletter";
import type { Article } from "@/lib/types";
import { SEED_ARTICLES } from "@/lib/seed-articles";
import type { CategoryKey } from "@/lib/constants";

// Seed articles first, then fallback placeholders
const PLACEHOLDER_ARTICLES: Article[] = [
  ...SEED_ARTICLES.map((s) => ({
    id: s.id,
    title: s.title,
    slug: s.slug,
    content_html: null,
    status: "published" as const,
    category: s.category as CategoryKey,
    freshness_score: 92,
    hero_image_url: null,
    meta_description: s.meta_description,
    keywords: s.keywords,
    published_at: s.published_at,
    created_at: s.published_at,
    updated_at: s.published_at,
  })),
  {
    id: "3",
    title: "AI Act Europeo: Guida Pratica per Startup Italiane",
    slug: "ai-act-europeo-guida-startup",
    content_html: null,
    status: "published",
    category: "opinioni" as CategoryKey,
    freshness_score: 88,
    hero_image_url: null,
    meta_description:
      "Cosa cambia per le startup AI con il nuovo regolamento europeo. Tutto quello che devi sapere.",
    keywords: ["AI Act", "startup", "Europa"],
    published_at: "2026-03-04T10:00:00Z",
    created_at: "2026-03-04T08:00:00Z",
    updated_at: "2026-03-04T10:00:00Z",
  },
  {
    id: "4",
    title: "Agenti AI Autonomi: Dalla Teoria alla Produzione",
    slug: "agenti-ai-autonomi-produzione",
    content_html: null,
    status: "published",
    category: "casi_duso" as CategoryKey,
    freshness_score: 91,
    hero_image_url: null,
    meta_description:
      "Come deployare agenti AI in produzione senza perdere il controllo. Architetture, guardrail e best practice.",
    keywords: ["agenti", "AI", "produzione"],
    published_at: "2026-03-03T10:00:00Z",
    created_at: "2026-03-03T08:00:00Z",
    updated_at: "2026-03-03T10:00:00Z",
  },
  {
    id: "5",
    title: "Mistral vs Llama 3.3: Quale Modello Open Source Scegliere?",
    slug: "mistral-vs-llama-3-open-source",
    content_html: null,
    status: "published",
    category: "ai_news" as CategoryKey,
    freshness_score: 85,
    hero_image_url: null,
    meta_description:
      "Confronto completo tra i migliori modelli open source del 2026: performance, costi e casi d'uso.",
    keywords: ["Mistral", "Llama", "open source"],
    published_at: "2026-03-02T10:00:00Z",
    created_at: "2026-03-02T08:00:00Z",
    updated_at: "2026-03-02T10:00:00Z",
  },
  {
    id: "6",
    title: "Mastering JetBrains Mono for Modern Dev",
    slug: "mastering-jetbrains-mono-modern-dev",
    content_html: null,
    status: "published",
    category: "tutorial" as CategoryKey,
    freshness_score: 82,
    hero_image_url: null,
    meta_description:
      "A deep dive into why typography matters for coding speed and legibility.",
    keywords: ["typography", "devtools", "fonts"],
    published_at: "2026-03-01T10:00:00Z",
    created_at: "2026-03-01T08:00:00Z",
    updated_at: "2026-03-01T10:00:00Z",
  },
  {
    id: "7",
    title: "ChatGPT Enterprise: Guida per Aziende Italiane",
    slug: "chatgpt-enterprise-guida-italia",
    content_html: null,
    status: "published",
    category: "tools" as CategoryKey,
    freshness_score: 89,
    hero_image_url: null,
    meta_description:
      "Come implementare ChatGPT Enterprise nella tua azienda: sicurezza, privacy e best practice GDPR.",
    keywords: ["ChatGPT", "Enterprise", "GDPR"],
    published_at: "2026-02-28T10:00:00Z",
    created_at: "2026-02-28T08:00:00Z",
    updated_at: "2026-02-28T10:00:00Z",
  },
  {
    id: "8",
    title: "Next.js 15 con AI: La Nuova Frontier del Web Dev",
    slug: "nextjs-15-ai-web-development",
    content_html: null,
    status: "published",
    category: "web_dev" as CategoryKey,
    freshness_score: 93,
    hero_image_url: null,
    meta_description:
      "Come integrare l'AI nelle app Next.js 15: streaming, RSC e pattern avanzati.",
    keywords: ["Next.js", "AI", "streaming", "RSC"],
    published_at: "2026-02-27T10:00:00Z",
    created_at: "2026-02-27T08:00:00Z",
    updated_at: "2026-02-27T10:00:00Z",
  },
];

const whyReadUs = [
  {
    title: "Sempre Primi",
    description: "Le notizie AI che contano, prima degli altri. In italiano.",
    icon: Zap,
  },
  {
    title: "Zero Fuffa",
    description: "Solo contenuti pratici e applicabili. Niente clickbait.",
    icon: Target,
  },
  {
    title: "Vantaggio Competitivo",
    description: "Chi legge IlVantaggioAI prende decisioni migliori.",
    icon: Rocket,
  },
];

const mediaBoxes = ["Media 01", "Media 02", "Media 03", "Media 04", "Media 05"];
const avatars = ["#10b981", "#3b82f6", "#f59e0b", "#8b5cf6", "#ef4444"];

function useCounter(target: number, start = 2500, duration = 1200) {
  const [count, setCount] = useState(start);

  useEffect(() => {
    let frame = 0;
    const totalFrames = Math.max(1, Math.round(duration / 16));

    const tick = () => {
      frame += 1;
      const progress = Math.min(frame / totalFrames, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(start + (target - start) * eased);
      setCount(value);
      if (progress < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  }, [duration, start, target]);

  return count;
}

function HeroRevolution() {
  const [email, setEmail] = useState("");
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = sectionRef.current;
    if (!element) return;

    const onMove = (event: MouseEvent) => {
      const rect = element.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      element.style.setProperty("--hero-mouse-x", `${x}%`);
      element.style.setProperty("--hero-mouse-y", `${y}%`);
    };

    element.addEventListener("mousemove", onMove);
    return () => element.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section ref={sectionRef} className="hero-wow relative min-h-screen pt-28">
      <div className="mx-auto flex max-w-7xl flex-col px-4 pb-14 pt-8 sm:px-6 lg:px-8 lg:pb-20 lg:pt-14">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <div className="reveal-on-scroll inline-flex items-center gap-3 rounded-full border border-[#10b981]/20 bg-[#10b981]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.24em] text-[#a7f3d0]">
            <span className="pulse-badge inline-flex h-2.5 w-2.5 rounded-full bg-[#10b981]" />
            Il blog AI più letto d&apos;Italia
          </div>

          <h1 className="reveal-on-scroll mt-8 text-balance text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-[0.95] text-white">
            <span className="gradient-text">L&apos;AI Non Aspetta. Tu?</span>
          </h1>

          <p className="reveal-on-scroll mt-6 max-w-3xl text-lg font-light leading-8 text-zinc-300 sm:text-xl">
            Ogni settimana, migliaia di professionisti italiani leggono IlVantaggioAI per restare un passo avanti. Unisciti a loro.
          </p>

          <form className="reveal-on-scroll mt-10 w-full max-w-2xl rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-3 shadow-[0_10px_80px_rgba(0,0,0,.25)] backdrop-blur-xl">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="La tua email professionale"
                className="min-h-[58px] flex-1 rounded-[1.2rem] border border-white/10 bg-black/40 px-5 text-base text-white placeholder:text-zinc-500 focus:border-[#10b981] focus:outline-none"
              />
              <button
                type="submit"
                className="cta-cursor relative min-h-[58px] rounded-[1.2rem] bg-[#10b981] px-7 text-base font-black text-black transition hover:bg-[#34d399]"
              >
                Unisciti Gratis
              </button>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-zinc-300">
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#10b981]" />Unisciti a 2,500+ professionisti</span>
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#10b981]" />Zero spam</span>
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#10b981]" />Cancella quando vuoi</span>
            </div>
          </form>

          <div className="reveal-on-scroll mt-8 flex flex-col items-center gap-4 sm:flex-row">
            <div className="flex -space-x-3">
              {avatars.map((color, index) => (
                <span
                  key={color}
                  className="h-11 w-11 rounded-full border-2 border-black"
                  style={{ background: color, zIndex: avatars.length - index }}
                />
              ))}
            </div>
            <p className="text-sm font-medium text-zinc-300">2,547 iscritti questa settimana</p>
          </div>
        </div>
      </div>

      <div className="reveal-on-scroll mx-auto mb-10 mt-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[1.4rem] border border-white/10 bg-black/45 px-5 py-5 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">Come visto su:</p>
            <div className="grid flex-1 gap-3 sm:grid-cols-5">
              {mediaBoxes.map((box) => (
                <div key={box} className="logo-placeholder flex h-14 items-center justify-center rounded-2xl text-xs font-semibold uppercase tracking-[0.18em] text-zinc-500">
                  {box}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function WhyReadUsSection() {
  return (
    <section className="reveal-on-scroll bg-black py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="reveal-on-scroll mx-auto max-w-3xl text-center">
          <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
            Perché 2,500+ professionisti ci leggono ogni settimana
          </h2>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {whyReadUs.map((item) => (
            <article
              key={item.title}
              className="reveal-on-scroll rounded-[1.6rem] border border-white/10 bg-white/[0.03] p-7 transition hover:border-[#10b981]/40 hover:bg-white/[0.05]"
            >
              <div className="icon-glow flex h-14 w-14 items-center justify-center rounded-2xl border border-[#10b981]/20 bg-[#10b981]/10 text-[#10b981]">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 text-xl font-black text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">{item.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function MidPageNewsletter() {
  const counter = useCounter(2547);

  return (
    <section className="reveal-on-scroll bg-black py-14">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="reveal-on-scroll dots-pattern relative overflow-hidden rounded-[2rem] border border-[#10b981]/15 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.2),transparent_30%),linear-gradient(135deg,#07110d,#0a0f14)] p-8 sm:p-10 lg:p-12">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#34d399]">Newsletter premium</p>
              <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
                Non perderti il prossimo vantaggio
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-300">
                Ricevi ogni martedì il meglio dell&apos;AI in 5 minuti di lettura.
              </p>
            </div>

            <div className="rounded-[1.6rem] border border-white/10 bg-black/35 p-5 backdrop-blur-xl">
              <div className="flex flex-col gap-3">
                <input
                  type="email"
                  placeholder="La tua email professionale"
                  className="min-h-[56px] rounded-[1rem] border border-white/10 bg-white/[0.05] px-5 text-white placeholder:text-zinc-500 focus:border-[#10b981] focus:outline-none"
                />
                <button className="cta-cursor relative min-h-[56px] rounded-[1rem] bg-[#10b981] px-5 font-black text-black transition hover:bg-[#34d399]">
                  Iscriviti Ora
                </button>
              </div>
              <p className="counter-pop mt-4 text-sm font-medium text-zinc-300">
                {counter.toLocaleString("it-IT")} professionisti già iscritti
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>(PLACEHOLDER_ARTICLES);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadArticles() {
      try {
        const res = await fetch("/api/articles?status=published&limit=20");
        if (!res.ok) throw new Error("fetch failed");
        const data = (await res.json()) as { articles?: Article[] };
        if (Array.isArray(data.articles) && data.articles.length > 0) {
          setArticles(data.articles);
        }
      } catch {
        // Fall back to placeholders silently
      } finally {
        setIsLoading(false);
      }
    }
    void loadArticles();
  }, []);

  return (
    <main className="min-h-screen bg-black">
      <HeroRevolution />
      <FeaturedArticles articles={articles} isLoading={isLoading} />
      <WhyReadUsSection />
      <MidPageNewsletter />
      <Newsletter />

      <section className="reveal-on-scroll bg-black pb-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="reveal-on-scroll overflow-hidden rounded-[2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(16,185,129,0.12),rgba(255,255,255,0.03),rgba(13,17,23,0.9))] p-8 sm:p-10 lg:p-12">
            <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#34d399]">Archivio editoriale</p>
                <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
                  Approfondimenti, tool e casi d&apos;uso per restare davanti al mercato
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-300">
                  Un magazine costruito per trasformare trend complessi in decisioni semplici: cosa leggere, cosa testare e dove investire attenzione.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-3xl font-black text-white">{articles.length}+</p>
                  <p className="mt-2 text-sm text-zinc-400">Contenuti pronti da leggere, salvare e condividere.</p>
                </div>
                <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-3xl font-black text-white">5 min</p>
                  <p className="mt-2 text-sm text-zinc-400">Il tempo medio per ottenere un insight utile ogni settimana.</p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/blog"
                className="cta-cursor relative inline-flex items-center gap-2 rounded-full bg-[#10b981] px-6 py-3 text-sm font-black text-black transition hover:bg-[#34d399]"
              >
                Esplora tutti gli articoli
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#newsletter"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-[#10b981]/40 hover:text-[#34d399]"
              >
                Iscriviti alla newsletter
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
