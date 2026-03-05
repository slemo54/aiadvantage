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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Cosa dicono i nostri lettori
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Scopri i feedback della nostra community
          </p>
        </motion.div>

        {/* Testimonials Grid */}
        <StaggerContainer className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <StaggerItem key={index}>
              <motion.div
                whileHover={{ y: -8 }}
                className="bg-gray-50 rounded-2xl p-6 relative group hover:bg-white hover:shadow-xl transition-all duration-300 border border-transparent hover:border-gray-100"
              >
                {/* Quote icon */}
                <div className="absolute -top-4 -left-2 w-10 h-10 bg-[#3B5BFF] rounded-full flex items-center justify-center shadow-lg">
                  <Quote className="w-5 h-5 text-white" />
                </div>

                {/* Content */}
                <p className="text-gray-700 mb-6 pt-2 italic">
                  &ldquo;{testimonial.quote}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#3B5BFF] to-[#A855F7] flex items-center justify-center text-white font-bold">
                      {testimonial.author[0]}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">
                        {testimonial.author}
                      </div>
                      <div className="text-xs text-gray-500">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right">
                    <div className="text-2xl font-bold text-[#3B5BFF]">
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
