"use client";

import { useState } from "react";
import { Loader2, CheckCircle, Send } from "lucide-react";
import { FadeIn } from "@/components/animations/fade-in";

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
    <section id="newsletter" className="py-20 bg-[#0a0a0a] border-t border-gray-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeIn>
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">
              Resta aggiornato{" "}
              <span className="text-[#22c55e]">sull&apos;AI</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
              Iscriviti alla nostra newsletter per ricevere aggiornamenti settimanali
              sul mondo dell&apos;AI.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <div className="flex-1">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="La tua email"
                  className="w-full px-6 py-4 rounded-full bg-black border border-gray-800 text-white placeholder-gray-500 focus:outline-none focus:border-[#22c55e] transition-colors"
                  disabled={status === "loading" || status === "success"}
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="px-8 py-4 bg-[#22c55e] text-black font-semibold rounded-full hover:bg-[#4ade80] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 active:scale-95"
              >
                {status === "loading" ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : status === "success" ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Iscritto!
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Iscriviti
                  </>
                )}
              </button>
            </form>

            {status === "success" && (
              <p className="text-[#22c55e] mt-4">
                Grazie per l&apos;iscrizione! Controlla la tua email.
              </p>
            )}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
