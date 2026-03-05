"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui-new/button";
import { ArrowRight, Play } from "lucide-react";

export function Hero() {
  return (
    <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-blue-100/50 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-purple-100/50 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-[#3B5BFF] text-sm font-medium mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-[#3B5BFF] animate-pulse" />
              Esplora il mondo dell&apos;AI
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Explore and{" "}
              <span className="text-[#3B5BFF]">Learn</span>{" "}
              <span className="relative">
                enjoyable
                <svg
                  className="absolute -bottom-2 left-0 w-full"
                  viewBox="0 0 200 12"
                  fill="none"
                >
                  <path
                    d="M2 10C50 2 150 2 198 10"
                    stroke="#FFD93D"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              .
            </h1>

            <p className="text-lg text-gray-600 mb-8 max-w-xl mx-auto lg:mx-0">
              Scopri le ultime novità sull&apos;intelligenza artificiale, casi d&apos;uso pratici 
              e strumenti per migliorare il tuo lavoro e la tua creatività.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" icon={<ArrowRight className="w-5 h-5" />}>
                Inizia ora
              </Button>
              <Button variant="outline" size="lg" icon={<Play className="w-5 h-5" />}>
                Guarda video
              </Button>
            </div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex gap-8 mt-12 justify-center lg:justify-start"
            >
              {[
                { value: "200+", label: "Articoli" },
                { value: "50K", label: "Lettori" },
                { value: "100%", label: "Gratuito" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <div className="text-sm text-gray-500">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Images Grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              {/* Main large image */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="col-span-2 relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#3B5BFF] to-[#A855F7]" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white p-8">
                    <div className="text-6xl mb-4">🚀</div>
                    <h3 className="text-2xl font-bold mb-2">AI Innovation</h3>
                    <p className="text-white/80">Scopri il futuro della tecnologia</p>
                  </div>
                </div>
                {/* Floating badge */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute bottom-4 left-4 bg-white rounded-full px-4 py-2 shadow-lg"
                >
                  <span className="text-sm font-bold text-gray-900">🔥 Trending</span>
                </motion.div>
              </motion.div>

              {/* Bottom images */}
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative h-40 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-[#4ADE80] to-[#22c55e]"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white p-4">
                    <div className="text-4xl mb-2">💡</div>
                    <p className="text-sm font-bold">Tips & Tricks</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative h-40 rounded-2xl overflow-hidden shadow-lg bg-gradient-to-br from-[#FFD93D] to-[#f59e0b]"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white p-4">
                    <div className="text-4xl mb-2">⚡</div>
                    <p className="text-sm font-bold">Quick Guides</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Decorative elements */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-8 -right-8 w-16 h-16 text-[#3B5BFF]/20"
            >
              <svg viewBox="0 0 64 64" fill="currentColor">
                <path d="M32 0L38 26L64 32L38 38L32 64L26 38L0 32L26 26Z" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
