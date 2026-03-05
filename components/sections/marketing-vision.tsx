"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export function MarketingVision() {
  return (
    <section className="py-20 bg-[#22c55e] relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black leading-tight mb-6">
              Sharing Your{" "}
              <span className="relative">
                Marketing
                <motion.span
                  className="absolute -bottom-2 left-0 w-full h-1 bg-black rounded-full"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                />
              </span>{" "}
              Vision
            </h2>

            <p className="text-black/70 text-lg mb-8 max-w-lg">
              Condividi la tua visione di marketing con noi. Ti aiuteremo a trasformarla 
              in realtà con strategie AI-powered e soluzioni innovative.
            </p>

            <motion.a
              href="#contact"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-semibold rounded-full hover:bg-gray-900 transition-colors"
            >
              Start Project
              <ArrowRight className="w-4 h-4" />
            </motion.a>
          </motion.div>

          {/* Right Content - Image placeholder */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-black/10">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-8xl mb-4">📢</div>
                  <p className="text-black/50 font-medium">Marketing Excellence</p>
                </div>
              </div>
              
              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute top-4 right-4 bg-white rounded-full px-4 py-2 shadow-lg"
              >
                <span className="text-black font-bold text-sm">🚀 AI Powered</span>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
