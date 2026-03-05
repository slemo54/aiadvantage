"use client";

import { motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";

// Dynamic import to avoid SSR issues with Three.js
const CrystalShape3D = dynamic(
  () => import("./crystal-shape").then((mod) => ({ default: mod.CrystalShape3D })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[500px] lg:h-[600px] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#22c55e]/30 border-t-[#22c55e] rounded-full animate-spin" />
      </div>
    ),
  }
);

export function Hero3D() {
  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      {/* Subtle grid background */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(34, 197, 94, 0.2) 1px, transparent 1px),
            linear-gradient(90deg, rgba(34, 197, 94, 0.2) 1px, transparent 1px)
          `,
          backgroundSize: "64px 64px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center min-h-screen pt-24 pb-16">
          
          {/* Left Side Panel */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2 hidden lg:flex flex-col items-center"
          >
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-6 text-center hover:border-[#22c55e]/30 transition-colors group cursor-pointer">
              <span className="text-gray-400 text-sm block mb-2 group-hover:text-[#22c55e] transition-colors">
                Esplora i
              </span>
              <span className="text-white font-semibold block mb-4">
                nostri articoli
              </span>
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mx-auto group-hover:bg-[#22c55e]/20 transition-colors">
                <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-[#22c55e]" />
              </div>
            </div>

            {/* Vertical line */}
            <div className="w-px h-24 bg-gradient-to-b from-gray-800 to-transparent my-6" />

            <div className="text-xs text-gray-500 uppercase tracking-widest">
              Scroll
            </div>
          </motion.div>

          {/* Center 3D Visualization */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-8 relative"
          >
            {/* Header text overlay */}
            <div className="absolute top-0 left-0 right-0 z-10 text-center pointer-events-none">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <span className="inline-block px-4 py-1.5 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/20 text-[#22c55e] text-sm font-medium mb-4">
                  Il Vantaggio AI
                </span>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4"
              >
                L&apos;AI che evolve
                <br />
                <span className="text-[#22c55e]">il tuo business</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="text-gray-400 text-lg max-w-xl mx-auto mb-8"
              >
                Scopri come l&apos;intelligenza artificiale può trasformare 
                il tuo modo di lavorare. Articoli, guide e news sull&apos;AI.
              </motion.p>
            </div>

            {/* 3D Crystal */}
            <div className="pt-40">
              <CrystalShape3D />
            </div>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
            >
              <a
                href="#articles"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#22c55e] text-black font-semibold rounded-full hover:bg-[#4ade80] transition-all hover:scale-105"
              >
                Esplora gli articoli
                <ArrowRight className="w-4 h-4" />
              </a>
              <a
                href="#newsletter"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-700 text-white font-semibold rounded-full hover:border-[#22c55e] hover:text-[#22c55e] transition-all"
              >
                Iscriviti alla newsletter
              </a>
            </motion.div>
          </motion.div>

          {/* Right Side Panel */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="lg:col-span-2 hidden lg:flex flex-col items-center"
          >
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-3xl p-6 text-center hover:border-[#22c55e]/30 transition-colors group cursor-pointer">
              <span className="text-gray-400 text-sm block mb-2 group-hover:text-[#22c55e] transition-colors">
                Ultime
              </span>
              <span className="text-white font-semibold block mb-4">
                novità AI
              </span>
              <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center mx-auto group-hover:bg-[#22c55e]/20 transition-colors">
                <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#22c55e]" />
              </div>
            </div>

            {/* Vertical line */}
            <div className="w-px h-24 bg-gradient-to-b from-gray-800 to-transparent my-6" />

            {/* Stats */}
            <div className="text-center">
              <div className="text-2xl font-bold text-[#22c55e]">50+</div>
              <div className="text-xs text-gray-500">Articoli</div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom decorative gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
}
