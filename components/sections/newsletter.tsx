"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Loader2, CheckCircle, Send, Sparkles, TrendingUp, ShieldCheck } from "lucide-react";

const benefits = [
  {
    title: "Trend AI filtrati",
    description: "Solo novità davvero rilevanti per chi lavora con business, marketing, prodotto e sviluppo.",
    icon: TrendingUp,
  },
  {
    title: "Approccio operativo",
    description: "Guide, tool e casi pratici che puoi testare subito senza perdere tempo nel rumore.",
    icon: Sparkles,
  },
  {
    title: "Vantaggio competitivo",
    description: "Insight premium per prendere decisioni più rapide e costruire un brand autorevole sull’AI.",
    icon: ShieldCheck,
  },
];

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus("success");
    setEmail("");
  };

  return (
    <section id="newsletter" className="border-t border-white/5 bg-[#050505] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-[2rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.16),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.14),transparent_22%),linear-gradient(135deg,#0a0a0a,#050505)] p-8 sm:p-10 lg:p-12"
        >
          <div className="grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-[#22c55e]/20 bg-[#22c55e]/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#86efac]">
                <Sparkles className="h-3.5 w-3.5" />
                Newsletter ad alta utilità
              </span>
              <h2 className="mt-5 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                Ricevi il meglio dell’AI italiana prima degli altri
              </h2>
              <p className="mt-5 max-w-2xl text-base leading-8 text-zinc-300">
                Ogni settimana: analisi selezionate, tool realmente utili, tutorial applicabili e segnali di mercato per trasformare l’AI in crescita concreta.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {benefits.map((benefit) => (
                  <div key={benefit.title} className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
                    <benefit.icon className="h-4 w-4 text-[#22c55e]" />
                    <h3 className="mt-3 text-sm font-bold text-white">{benefit.title}</h3>
                    <p className="mt-2 text-xs leading-6 text-zinc-400">{benefit.description}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-white/10 bg-black/40 p-6 backdrop-blur-xl sm:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500">Entra nella lista premium</p>
              <h3 className="mt-3 text-2xl font-black text-white">Iscriviti gratis</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">
                Contenuti zero-spam, altissima densità di valore e un solo obiettivo: darti un vantaggio reale sul mercato AI.
              </p>

              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Inserisci la tua email professionale"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-5 py-4 text-white placeholder:text-zinc-500 focus:outline-none focus:border-[#22c55e] transition-colors"
                    disabled={status === "loading" || status === "success"}
                  />
                </div>
                <motion.button
                  type="submit"
                  disabled={status === "loading" || status === "success"}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="flex items-center justify-center gap-2 rounded-2xl bg-[#22c55e] px-8 py-4 font-bold text-black transition-colors hover:bg-[#4ade80] disabled:opacity-50"
                >
                  {status === "loading" ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : status === "success" ? (
                    <>
                      <CheckCircle className="h-5 w-5" />
                      Iscrizione completata
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Voglio il vantaggio AI
                    </>
                  )}
                </motion.button>
              </form>

              <p className="mt-4 text-xs leading-6 text-zinc-500">
                Niente spam. Solo insight, strumenti e strategie per professionisti, founder e team innovativi.
              </p>

              {status === "success" && (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-4 text-sm font-medium text-[#86efac]"
                >
                  Perfetto. Sei dentro: controlla la tua email.
                </motion.p>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
