"use client";

import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem } from "@/components/animations/motion";
import { Brain, Code, Lightbulb, Wrench, BookOpen, MessageCircle } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI News",
    description: "Resta aggiornato sulle ultime novità dal mondo dell'intelligenza artificiale.",
  },
  {
    icon: Lightbulb,
    title: "Casi d'Uso",
    description: "Scopri come l'AI viene applicata in scenari reali e concreti.",
  },
  {
    icon: Code,
    title: "Web Development",
    description: "Tutorial e guide per sviluppatori su AI e programmazione.",
  },
  {
    icon: MessageCircle,
    title: "Opinioni",
    description: "Analisi e riflessioni sul futuro dell'AI e il suo impatto.",
  },
  {
    icon: Wrench,
    title: "Tools",
    description: "Recensioni e guide sugli strumenti AI più utili del momento.",
  },
  {
    icon: BookOpen,
    title: "Tutorials",
    description: "Guide passo-passo per imparare ad usare l'AI efficacemente.",
  },
];

export function Features() {
  return (
    <section className="py-20 bg-[#0a0a0a] border-y border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Perché scegliere i nostri contenuti?
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Offriamo risorse di qualità per aiutarti a navigare nel mondo dell&apos;AI
          </p>
        </motion.div>

        {/* Features Grid */}
        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <motion.div
                whileHover={{ y: -8 }}
                className="bg-black border border-gray-800 rounded-2xl p-6 hover:border-[#22c55e]/30 transition-all duration-300 group"
              >
                {/* Icon */}
                <div className="w-14 h-14 bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-[#22c55e]/20 transition-colors">
                  <feature.icon className="w-7 h-7 text-[#22c55e]" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
