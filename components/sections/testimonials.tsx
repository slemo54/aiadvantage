"use client";

import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem } from "@/components/animations/motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "AI Advantage mi ha aiutato a capire come usare l'AI nel mio lavoro quotidiano. Contenuti chiari e pratici!",
    author: "Marco Rossi",
    role: "Marketing Manager",
    stats: { value: "95%", label: "Soddisfatto" },
  },
  {
    quote:
      "Finalmente un blog italiano che parla di AI in modo accessibile. Lo consiglio a tutti i miei colleghi.",
    author: "Giulia Bianchi",
    role: "Product Designer",
    stats: { value: "100+", label: "Articoli letti" },
  },
  {
    quote:
      "I tutorial sono fantastici, passo dopo passo riesco a imparare nuovi strumenti senza difficoltà.",
    author: "Luca Verdi",
    role: "Sviluppatore",
    stats: { value: "80%", label: "Skills migliorate" },
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Happy Client
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Scopri i feedback della nostra community
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <StaggerContainer className="grid md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <StaggerItem key={index}>
              <motion.div
                whileHover={{ y: -8 }}
                className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6 group hover:border-[#22c55e]/30 transition-all duration-300"
              >
                {/* Quote icon */}
                <div className="w-10 h-10 bg-[#22c55e]/10 rounded-full flex items-center justify-center mb-4">
                  <Quote className="w-5 h-5 text-[#22c55e]" />
                </div>

                {/* Content */}
                <p className="text-gray-300 mb-6 text-sm leading-relaxed">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#22c55e] flex items-center justify-center text-black font-bold">
                      {testimonial.author[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-white text-sm">
                        {testimonial.author}
                      </div>
                      <div className="text-xs text-gray-500">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <div className="text-xl font-bold text-[#22c55e]">
                      {testimonial.stats.value}
                    </div>
                    <div className="text-xs text-gray-500">
                      {testimonial.stats.label}
                    </div>
                  </div>
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
