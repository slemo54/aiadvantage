"use client";

import { motion } from "framer-motion";
import { StaggerContainer, StaggerItem } from "@/components/animations/motion";
import { Brain, Code, Lightbulb, Wrench, BookOpen, MessageCircle } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "AI News",
    description: "Resta aggiornato sulle ultime novità dal mondo dell'intelligenza artificiale.",
    color: "bg-blue-500",
    lightColor: "bg-blue-100",
  },
  {
    icon: Lightbulb,
    title: "Casi d'Uso",
    description: "Scopri come l'AI viene applicata in scenari reali e concreti.",
    color: "bg-purple-500",
    lightColor: "bg-purple-100",
  },
  {
    icon: Code,
    title: "Web Development",
    description: "Tutorial e guide per sviluppatori su AI e programmazione.",
    color: "bg-orange-500",
    lightColor: "bg-orange-100",
  },
  {
    icon: MessageCircle,
    title: "Opinioni",
    description: "Analisi e riflessioni sul futuro dell'AI e il suo impatto.",
    color: "bg-green-500",
    lightColor: "bg-green-100",
  },
  {
    icon: Wrench,
    title: "Tools",
    description: "Recensioni e guide sugli strumenti AI più utili del momento.",
    color: "bg-yellow-500",
    lightColor: "bg-yellow-100",
  },
  {
    icon: BookOpen,
    title: "Tutorials",
    description: "Guide passo-passo per imparare ad usare l'AI efficacemente.",
    color: "bg-rose-500",
    lightColor: "bg-rose-100",
  },
];

export function Features() {
  return (
    <section className="py-20 bg-[#3B5BFF] relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
          className="absolute top-10 right-10 w-20 h-20 text-white/10"
        >
          <svg viewBox="0 0 80 80" fill="currentColor">
            <path d="M40 0L48 32L80 40L48 48L40 80L32 48L0 40L32 32Z" />
          </svg>
        </motion.div>
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute bottom-10 left-10 text-white/10"
        >
          <svg width="60" height="60" viewBox="0 0 60 60" fill="currentColor">
            <circle cx="30" cy="30" r="30" />
          </svg>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
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
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Offriamo risorse di qualità per aiutarti a navigare nel mondo dell&apos;AI
          </p>
        </motion.div>

        {/* Features Grid */}
        <StaggerContainer className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature) => (
            <StaggerItem key={feature.title}>
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                {/* Icon */}
                <div
                  className={`w-14 h-14 ${feature.lightColor} rounded-2xl flex items-center justify-center mb-4`}
                >
                  <feature.icon className={`w-7 h-7 ${feature.color.replace("bg-", "text-")}`} />
                </div>

                {/* Content */}
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>

                {/* Decorative sparkles */}
                <div className="flex gap-1 mt-4">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: i * 0.3,
                      }}
                      className={`w-1.5 h-1.5 rounded-full ${feature.color}`}
                    />
                  ))}
                </div>
              </motion.div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
