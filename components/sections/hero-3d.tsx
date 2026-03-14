"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Sparkles, TrendingUp, ShieldCheck } from "lucide-react";
import dynamic from "next/dynamic";

const CrystalShape3D = dynamic(
  () => import("./crystal-shape").then((mod) => ({ default: mod.CrystalShape3D })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[500px] w-full items-center justify-center lg:h-[600px]">
        <div className="h-12 w-12 rounded-full border-4 border-[#22c55e]/30 border-t-[#22c55e] animate-spin" />
      </div>
    ),
  }
);

const proofItems = [
  "Analisi pratiche, non hype",
  "Tutorial immediatamente applicabili",
  "Focus su business, web e automazione",
];

export function Hero3D() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.18),transparent_28%),radial-gradient(circle_at_top_right,rgba(34,211,238,0.12),transparent_26%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_40%)]" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.22) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.22) 1px, transparent 1px)
          `,
          backgroundSize: "72px 72px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid min-h-screen items-center gap-10 pt-28 pb-16 lg:grid-cols-12 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-[#22c55e]/20 bg-[#22c55e]/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#86efac]">
              <Sparkles className="h-3.5 w-3.5" />
              AI insights per chi deve decidere e costruire
            </div>

            <h1 className="mt-6 max-w-4xl text-4xl font-black leading-[0.98] text-white sm:text-5xl lg:text-7xl">
              Il blog AI più
              <span className="block bg-gradient-to-r from-[#22c55e] via-[#7dd3fc] to-[#4ade80] bg-clip-text text-transparent">
                utile d’Italia
              </span>
              per professionisti, founder e developer
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
              Strategie AI, tutorial operativi, tool selezionati e casi d’uso reali per trasformare l’intelligenza artificiale in vantaggio competitivo.
            </p>

            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href="#articles"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#22c55e] px-7 py-3.5 text-sm font-bold text-black transition-all hover:scale-[1.02] hover:bg-[#4ade80]"
              >
                Scopri gli articoli migliori
                <ArrowRight className="h-4 w-4" />
              </a>
              <a
                href="#newsletter"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-7 py-3.5 text-sm font-semibold text-white transition-all hover:border-[#22c55e]/40 hover:text-[#86efac]"
              >
                Ricevi il vantaggio AI ogni settimana
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-[#22c55e]">
                  <TrendingUp className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.18em]">Posizionamento</span>
                </div>
                <p className="mt-2 text-sm text-zinc-300">Contenuti pensati per diventare riferimento autorevole nel mercato AI italiano.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-cyan-300">
                  <ShieldCheck className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.18em]">Credibilità</span>
                </div>
                <p className="mt-2 text-sm text-zinc-300">Taglio editoriale premium, utile e concreto: zero hype, solo segnali utili.</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-emerald-300">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-xs font-semibold uppercase tracking-[0.18em]">Conversione</span>
                </div>
                <p className="mt-2 text-sm text-zinc-300">CTA, lead magnet editoriale e layout disegnati per aumentare fiducia e iscrizioni.</p>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              {proofItems.map((item) => (
                <span
                  key={item}
                  className="rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs font-medium text-zinc-300"
                >
                  {item}
                </span>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative lg:col-span-6"
          >
            <div className="pointer-events-none absolute -inset-8 rounded-[2rem] bg-[radial-gradient(circle,rgba(34,197,94,0.18),transparent_60%)] blur-2xl" />
            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-4 shadow-[0_0_80px_rgba(34,197,94,.08)] backdrop-blur-xl">
              <div className="mb-4 flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-zinc-500">Editorial intelligence</p>
                  <p className="mt-1 text-sm font-semibold text-white">Trend AI, tools e use case ad alto impatto</p>
                </div>
                <div className="rounded-full bg-[#22c55e]/15 px-3 py-1 text-xs font-semibold text-[#86efac]">
                  Updated daily
                </div>
              </div>

              <CrystalShape3D />

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">AI News</p>
                  <p className="mt-2 text-sm font-semibold text-white">Novità filtrate e contestualizzate</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Tutorial</p>
                  <p className="mt-2 text-sm font-semibold text-white">Guide operative per mettere in pratica</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/40 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-zinc-500">Casi reali</p>
                  <p className="mt-2 text-sm font-semibold text-white">Applicazioni concrete per business e team</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs text-zinc-400 backdrop-blur-md md:flex">
        <ChevronDown className="h-4 w-4 animate-bounce text-[#22c55e]" />
        Scorri per entrare nel feed AI più utile d’Italia
      </div>
    </section>
  );
}
