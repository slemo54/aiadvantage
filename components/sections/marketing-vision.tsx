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

          {/* Right Content - AI Marketing Illustration */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-3xl overflow-hidden bg-black/20">
              <svg viewBox="0 0 480 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                {/* Background grid */}
                <defs>
                  <pattern id="grid-mv" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(0,0,0,0.15)" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="480" height="360" fill="url(#grid-mv)" />

                {/* Central AI brain node */}
                <circle cx="240" cy="180" r="52" fill="black" fillOpacity="0.6" stroke="black" strokeWidth="2"/>
                <circle cx="240" cy="180" r="38" fill="black" fillOpacity="0.8"/>
                {/* Brain circuit lines */}
                <path d="M220 168 Q240 155 260 168 Q270 178 260 192 Q240 205 220 192 Q210 182 220 168Z" stroke="black" strokeWidth="1.5" fill="none" opacity="0.8"/>
                <circle cx="240" cy="180" r="6" fill="black"/>
                <circle cx="228" cy="173" r="3" fill="black" opacity="0.7"/>
                <circle cx="252" cy="173" r="3" fill="black" opacity="0.7"/>
                <circle cx="234" cy="190" r="2.5" fill="black" opacity="0.6"/>
                <circle cx="248" cy="188" r="2.5" fill="black" opacity="0.6"/>

                {/* Connecting nodes */}
                {[
                  [120, 90], [360, 90], [80, 220], [400, 220],
                  [180, 300], [300, 300], [240, 60]
                ].map(([cx, cy], i) => (
                  <g key={i}>
                    <line x1="240" y1="180" x2={cx} y2={cy} stroke="black" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 4"/>
                    <circle cx={cx} cy={cy} r="14" fill="black" fillOpacity="0.5" stroke="black" strokeWidth="1.5"/>
                    <circle cx={cx} cy={cy} r="5" fill="black" fillOpacity="0.8"/>
                  </g>
                ))}

                {/* Floating data cards */}
                <g transform="translate(30, 40)">
                  <rect width="100" height="52" rx="10" fill="black" fillOpacity="0.7" stroke="black" strokeWidth="1"/>
                  <text x="12" y="22" fill="black" fontSize="9" opacity="0.7" fontFamily="monospace">REACH</text>
                  <text x="12" y="38" fill="black" fontSize="16" fontWeight="bold" fontFamily="monospace">+340%</text>
                </g>
                <g transform="translate(350, 250)">
                  <rect width="100" height="52" rx="10" fill="black" fillOpacity="0.7" stroke="black" strokeWidth="1"/>
                  <text x="12" y="22" fill="black" fontSize="9" opacity="0.7" fontFamily="monospace">CONV.</text>
                  <text x="12" y="38" fill="black" fontSize="16" fontWeight="bold" fontFamily="monospace">+218%</text>
                </g>

                {/* Pulse rings */}
                <circle cx="240" cy="180" r="68" fill="none" stroke="black" strokeWidth="1" strokeOpacity="0.2"/>
                <circle cx="240" cy="180" r="90" fill="none" stroke="black" strokeWidth="0.5" strokeOpacity="0.1"/>
              </svg>

              {/* Floating badge */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
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
