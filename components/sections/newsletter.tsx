"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui-new/button";
import { useState } from "react";
import { Sparkles, Loader2, CheckCircle } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setStatus("success");
    setEmail("");
  };

  return (
    <section className="py-20 bg-[#1a1a4e] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        {/* Animated sun */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-8 left-1/2 -translate-x-1/2"
        >
          <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="15" fill="#FFD93D" />
            {[...Array(8)].map((_, i) => (
              <motion.line
                key={i}
                x1="40"
                y1="10"
                x2="40"
                y2="20"
                stroke="#FFD93D"
                strokeWidth="4"
                strokeLinecap="round"
                transform={`rotate(${i * 45} 40 40)`}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </svg>
        </motion.div>

        {/* Decorative text circle */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-8 left-8 w-32 h-32 opacity-20"
        >
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <defs>
              <path
                id="circlePath"
                d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
              />
            </defs>
            <text fill="white" fontSize="10" fontWeight="bold">
              <textPath href="#circlePath">
                • ISCRIVITI ORA • AI ADVANTAGE • NEWSLETTER •
              </textPath>
            </text>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-3xl">🔥</span>
          </div>
        </motion.div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4 pt-16">
            Iscriviti alla nostra newsletter
          </h2>
          <p className="text-white/70 text-lg mb-8">
            Ricevi ogni settimana i migliori contenuti sull&apos;AI direttamente nella tua inbox
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
            <div className="flex-1 relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Inserisci la tua email"
                className="w-full px-6 py-4 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#3B5BFF] transition-all"
                disabled={status === "loading" || status === "success"}
              />
            </div>
            <Button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="whitespace-nowrap"
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
                  <Sparkles className="w-5 h-5" />
                  Iscriviti
                </>
              )}
            </Button>
          </form>

          {status === "success" && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-green-400 mt-4"
            >
              Grazie per l&apos;iscrizione! Controlla la tua email.
            </motion.p>
          )}

          <p className="text-white/40 text-sm mt-6">
            Unsubscribe anytime. No spam, ever.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
