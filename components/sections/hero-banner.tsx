"use client";

import { motion } from "framer-motion";

export function HeroBanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#0a1a0a] via-[#0d2a0d] to-[#0a1a0a]">
      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.3) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#22c55e]/5 via-transparent to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4"
        >
          {/* Logo icon */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#22c55e] rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-[#22c55e]/20">
            <span className="text-black font-black text-lg sm:text-2xl">AI</span>
          </div>
          {/* Site name */}
          <h1
            className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            <span className="text-[#22c55e]">Il</span>Vantaggio
            <span className="text-[#22c55e]">AI</span>
          </h1>
        </motion.div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-black to-transparent" />
    </section>
  );
}
