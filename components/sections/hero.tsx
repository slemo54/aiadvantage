"use client";

import { motion } from "framer-motion";
import { ArrowRight, Play } from "lucide-react";

const services = [
  { name: "Search Engine TPO", active: false },
  { name: "Games", active: false },
  { name: "Marketing", active: true },
  { name: "Mobile App Design", active: false },
  { name: "Software Development For Business", active: false },
];

const stats = [
  { value: "75K", label: "Contributions in the last Year" },
  { value: "8000+", label: "Total Clients" },
];

export function Hero() {
  return (
    <section className="relative min-h-screen pt-32 pb-20 lg:pt-40 lg:pb-32 overflow-hidden bg-black">
      {/* Background gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#22c55e]/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
              Smart{" "}
              <span className="relative inline-block">
                <span className="text-[#22c55e]">AI</span>
                <motion.span
                  className="absolute -bottom-1 left-0 w-full h-1 bg-[#22c55e] rounded-full"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                />
              </span>{" "}
              Digital Agency For Your Business To Succeed
            </h1>

            <p className="text-lg text-gray-400 mb-8 max-w-xl">
              Scopri come l&apos;intelligenza artificiale può trasformare il tuo business. 
              Soluzioni innovative per startup e aziende.
            </p>

            {/* Service Tags */}
            <div className="flex flex-wrap gap-3 mb-8">
              {services.map((service, index) => (
                <motion.span
                  key={service.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition-all cursor-pointer ${
                    service.active
                      ? "bg-white text-black border-white"
                      : "bg-transparent text-gray-400 border-gray-700 hover:border-[#22c55e] hover:text-[#22c55e]"
                  }`}
                >
                  {service.name}
                </motion.span>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <motion.a
                href="#services"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#22c55e] text-black font-semibold rounded-full hover:bg-[#4ade80] transition-colors"
              >
                Start Project
                <ArrowRight className="w-4 h-4" />
              </motion.a>
              <motion.a
                href="#video"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-gray-700 text-white font-semibold rounded-full hover:border-[#22c55e] hover:text-[#22c55e] transition-colors"
              >
                <Play className="w-4 h-4" />
                Watch Video
              </motion.a>
            </div>
          </motion.div>

          {/* Right Content */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
            className="relative"
          >
            {/* Central Graphic Element */}
            <div className="relative flex items-center justify-center">
              {/* Rotating circles */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute w-64 h-64 lg:w-80 lg:h-80"
              >
                <svg viewBox="0 0 320 320" className="w-full h-full">
                  <circle
                    cx="160"
                    cy="160"
                    r="150"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="1"
                    strokeDasharray="10 10"
                    opacity="0.3"
                  />
                </svg>
              </motion.div>

              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute w-48 h-48 lg:w-64 lg:h-64"
              >
                <svg viewBox="0 0 256 256" className="w-full h-full">
                  <circle
                    cx="128"
                    cy="128"
                    r="120"
                    fill="none"
                    stroke="#22c55e"
                    strokeWidth="1"
                    strokeDasharray="5 15"
                    opacity="0.5"
                  />
                </svg>
              </motion.div>

              {/* Center content */}
              <div className="relative z-10 w-32 h-32 lg:w-40 lg:h-40 bg-gradient-to-br from-[#22c55e] to-[#16a34a] rounded-full flex items-center justify-center">
                <span className="text-4xl lg:text-5xl">🚀</span>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-4 right-0 lg:right-10 bg-[#171717] border border-gray-800 rounded-2xl p-4 shadow-xl"
              >
                <div className="text-2xl font-bold text-white">{stats[0].value}</div>
                <div className="text-xs text-gray-400">{stats[0].label}</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute -bottom-4 left-0 lg:left-10 bg-[#171717] border border-gray-800 rounded-2xl p-4 shadow-xl"
              >
                <div className="text-2xl font-bold text-[#22c55e]">{stats[1].value}</div>
                <div className="text-xs text-gray-400">{stats[1].label}</div>
                <div className="flex -space-x-2 mt-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-6 h-6 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 border-2 border-[#171717]"
                    />
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {[
            { label: "Social partners", desc: "To make payments across all bank accounts easily" },
            { label: "Secure Payment", desc: "Enterprise-grade security for all transactions" },
            { label: "24/7 Support", desc: "Round the clock assistance for your business" },
            { label: "Global Reach", desc: "Serving clients in over 50 countries worldwide" },
          ].map((item, index) => (
            <motion.div
              key={item.label}
              whileHover={{ y: -5 }}
              className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6 hover:border-[#22c55e]/30 transition-colors"
            >
              <div className="w-10 h-10 bg-[#22c55e]/10 rounded-xl flex items-center justify-center mb-4">
                <span className="text-[#22c55e] text-lg">{["🤝", "🔒", "🎧", "🌍"][index]}</span>
              </div>
              <h3 className="text-white font-semibold mb-1">{item.label}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
