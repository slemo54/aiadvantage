"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Zap, Target, Rocket, BookOpen } from "lucide-react";
import { FeaturedArticles } from "@/components/sections/featured-articles";
import { Newsletter } from "@/components/sections/newsletter";
import type { Article } from "@/lib/types";

const whyReadUs = [
  {
    title: "Sempre Aggiornati",
    description: "Le notizie AI che contano, in italiano, prima degli altri. Zero hype, solo segnale.",
    icon: Zap,
  },
  {
    title: "Contenuti Pratici",
    description: "Guide applicabili subito, casi d'uso reali, strumenti testati. Niente clickbait.",
    icon: Target,
  },
  {
    title: "Vantaggio Reale",
    description: "Chi legge IlVantaggioAI prende decisioni migliori e si muove più veloce del mercato.",
    icon: Rocket,
  },
];

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
            Il punto di riferimento italiano sull&apos;AI
          </div>

          <h1 className="reveal-on-scroll mt-8 text-balance text-[clamp(2.5rem,5vw,4.5rem)] font-black leading-[0.95] text-white">
            <span className="gradient-text">Il Vantaggio AI Inizia Qui.</span>
          </h1>

          <p className="reveal-on-scroll mt-6 max-w-3xl text-lg font-light leading-8 text-zinc-300 sm:text-xl">
            Analisi, guide pratiche e casi d&apos;uso per professionisti che vogliono usare l&apos;intelligenza artificiale come vantaggio competitivo reale.
          </p>

          <form
            className="reveal-on-scroll mt-10 w-full max-w-2xl rounded-[1.6rem] border border-white/10 bg-white/[0.04] p-3 shadow-[0_10px_80px_rgba(0,0,0,.25)] backdrop-blur-xl"
            onSubmit={(e) => e.preventDefault()}
          >
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
                Iscriviti Gratis
              </button>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm text-zinc-300">
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#10b981]" />Aggiornamenti settimanali</span>
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#10b981]" />Zero spam</span>
              <span className="inline-flex items-center gap-2"><Check className="h-4 w-4 text-[#10b981]" />Cancella quando vuoi</span>
            </div>
          </form>

          <div className="reveal-on-scroll mt-8 flex flex-col items-center gap-4 sm:flex-row">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white transition hover:border-[#10b981]/50 hover:text-[#34d399]"
            >
              <BookOpen className="h-4 w-4" />
              Leggi gli articoli
            </Link>
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
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#34d399]">Perché leggerci</p>
          <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
            Una pubblicazione editoriale seria sull&apos;AI
          </h2>
          <p className="mt-4 text-base leading-8 text-zinc-400">
            IlVantaggioAI è dedicata a chi vuole capire e usare l&apos;intelligenza artificiale in modo concreto. Non hype, non paura: solo contenuti utili, approfonditi e sempre aggiornati.
          </p>
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
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#34d399]">Newsletter settimanale</p>
              <h2 className="mt-4 text-3xl font-black text-white sm:text-4xl">
                Resta un passo avanti sull&apos;AI
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-300">
                Ogni settimana: gli aggiornamenti AI che contano, analisi approfondite e strumenti pratici. In 5 minuti di lettura.
              </p>
            </div>

            <div className="rounded-[1.6rem] border border-white/10 bg-black/35 p-5 backdrop-blur-xl">
              <form className="flex flex-col gap-3" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="La tua email professionale"
                  className="min-h-[56px] rounded-[1rem] border border-white/10 bg-white/[0.05] px-5 text-white placeholder:text-zinc-500 focus:border-[#10b981] focus:outline-none"
                />
                <button type="submit" className="cta-cursor relative min-h-[56px] rounded-[1rem] bg-[#10b981] px-5 font-black text-black transition hover:bg-[#34d399]">
                  Iscriviti Ora — È Gratis
                </button>
              </form>
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

function EmptyArticlesState() {
  return (
    <section className="bg-black py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center rounded-[2rem] border border-white/10 bg-white/[0.02] py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#10b981]/20 bg-[#10b981]/10">
            <BookOpen className="h-8 w-8 text-[#10b981]" />
          </div>
          <h2 className="mt-6 text-2xl font-black text-white">I nostri articoli stanno arrivando</h2>
          <p className="mt-3 max-w-md text-base leading-7 text-zinc-400">
            Stiamo preparando i primi contenuti. Iscriviti alla newsletter per essere il primo a saperlo.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [articleCount, setArticleCount] = useState(0);

  useEffect(() => {
    async function loadArticles() {
      try {
        const res = await fetch("/api/articles?status=published&limit=20");
        if (!res.ok) throw new Error("fetch failed");
        const data = (await res.json()) as { articles?: Article[] };
        if (Array.isArray(data.articles)) {
          setArticles(data.articles);
          setArticleCount(data.articles.length);
        }
      } catch {
        // keep empty state
      } finally {
        setIsLoading(false);
      }
    }
    void loadArticles();
  }, []);

  const hasArticles = isLoading || articles.length > 0;

  return (
    <main className="min-h-screen bg-black">
      <HeroRevolution />
      {hasArticles ? (
        <FeaturedArticles articles={articles} isLoading={isLoading} />
      ) : (
        <EmptyArticlesState />
      )}
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
                  Approfondimenti, strumenti e casi d&apos;uso per restare davanti al mercato
                </h2>
                <p className="mt-4 max-w-2xl text-base leading-8 text-zinc-300">
                  Una pubblicazione costruita per trasformare trend complessi in decisioni concrete: cosa leggere, cosa testare e dove investire la tua attenzione.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-3xl font-black text-white">{articleCount > 0 ? `${articleCount}+` : "In crescita"}</p>
                  <p className="mt-2 text-sm text-zinc-400">Contenuti pronti da leggere, salvare e condividere.</p>
                </div>
                <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.04] p-5">
                  <p className="text-3xl font-black text-white">5 min</p>
                  <p className="mt-2 text-sm text-zinc-400">Il tempo medio per ottenere un insight utile ogni articolo.</p>
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
