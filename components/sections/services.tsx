"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const services = [
  {
    number: "01",
    title: "AI/UX Design",
    description: "Design di interfacce potenziate dall'intelligenza artificiale per esperienze utente intuitive.",
  },
  {
    number: "02",
    title: "Graphic Design",
    description: "Creazione di contenuti visivi accattivanti con l'aiuto di strumenti AI avanzati.",
  },
  {
    number: "03",
    title: "Illustration",
    description: "Illustrazioni personalizzate generate e perfezionate con tecnologie AI.",
  },
  {
    number: "04",
    title: "Logo & Branding",
    description: "Sviluppo di identità di marca uniche con supporto AI per la creatività.",
  },
  {
    number: "05",
    title: "Development",
    description: "Sviluppo web e mobile accelerato da strumenti di coding intelligente.",
  },
];

export function Services() {
  return (
    <section id="services" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-16"
        >
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Services
            </h2>
            <p className="text-gray-400 max-w-xl">
              Offriamo una gamma completa di servizi digitali potenziati dall&apos;intelligenza artificiale 
              per aiutare la tua azienda a crescere.
            </p>
          </div>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-16 h-16 bg-[#22c55e] rounded-full flex items-center justify-center"
          >
            <span className="text-2xl">⚡</span>
          </motion.div>
        </motion.div>

        {/* Services List */}
        <div className="space-y-0">
          {services.map((service, index) => (
            <motion.div
              key={service.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ x: 10 }}
              className="group border-t border-gray-800 py-6 cursor-pointer"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6 lg:gap-12">
                  <span className="text-gray-600 font-mono text-sm">{service.number}</span>
                  <h3 className="text-xl lg:text-2xl font-semibold text-white group-hover:text-[#22c55e] transition-colors">
                    {service.title}
                  </h3>
                </div>
                <div className="flex items-center gap-4">
                  <p className="hidden lg:block text-gray-500 text-sm max-w-xs text-right">
                    {service.description}
                  </p>
                  <div className="w-10 h-10 rounded-full border border-gray-700 flex items-center justify-center group-hover:border-[#22c55e] group-hover:bg-[#22c55e] transition-all">
                    <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
          {/* Bottom border */}
          <div className="border-t border-gray-800" />
        </div>

        {/* Preview Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="mt-12 bg-[#0a0a0a] border border-gray-800 rounded-3xl p-6 lg:p-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <span className="text-gray-500 text-sm">AI Dashboard Preview</span>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="h-48 lg:h-64 bg-[#171717] rounded-2xl overflow-hidden p-4">
                <p className="text-gray-500 text-xs mb-3 font-mono">AI Analytics — live</p>
                <svg viewBox="0 0 320 160" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  {/* Grid lines */}
                  {[0,1,2,3].map(i => (
                    <line key={i} x1="0" y1={i*40+20} x2="320" y2={i*40+20} stroke="#222" strokeWidth="1"/>
                  ))}
                  {/* Bar chart */}
                  {[
                    {x:20, h:60, v:"42K"},
                    {x:60, h:90, v:"68K"},
                    {x:100, h:75, v:"55K"},
                    {x:140, h:120, v:"91K"},
                    {x:180, h:100, v:"76K"},
                    {x:220, h:140, v:"108K"},
                    {x:260, h:130, v:"99K"},
                  ].map((b, i) => (
                    <g key={i}>
                      <rect x={b.x} y={160-b.h} width="28" height={b.h} rx="4" fill={i === 5 ? "#22c55e" : "#1a1a1a"} stroke={i === 5 ? "#22c55e" : "#333"} strokeWidth="1"/>
                      {i === 5 && <rect x={b.x} y={160-b.h} width="28" height="4" rx="2" fill="#4ade80"/>}
                    </g>
                  ))}
                  {/* Trend line */}
                  <polyline points="34,100 74,70 114,85 154,40 194,60 234,20 274,30" fill="none" stroke="#22c55e" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.5"/>
                  {/* Y-axis labels */}
                  {["0","25K","50K","75K"].map((l, i) => (
                    <text key={i} x="305" y={160-i*40+5} fill="#444" fontSize="9" textAnchor="end" fontFamily="monospace">{l}</text>
                  ))}
                </svg>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-[#171717] rounded-2xl p-4">
                <div className="text-gray-400 text-sm mb-1">Performance</div>
                <div className="text-2xl font-bold text-[#22c55e]">+127%</div>
              </div>
              <div className="bg-[#171717] rounded-2xl p-4">
                <div className="text-gray-400 text-sm mb-1">Active Users</div>
                <div className="text-2xl font-bold text-white">8.5K</div>
              </div>
              <div className="bg-[#171717] rounded-2xl p-4">
                <div className="text-gray-400 text-sm mb-1">Revenue</div>
                <div className="text-2xl font-bold text-white">$45K</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
