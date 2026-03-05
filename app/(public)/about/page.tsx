"use client";

import { motion } from "framer-motion";
import { Mail, Twitter, Linkedin, Github, MapPin, Calendar, Sparkles, Zap, Brain, ArrowUpRight, Code2, Cpu, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const SKILLS = [
  { name: "Artificial Intelligence", icon: Brain },
  { name: "Machine Learning", icon: Cpu },
  { name: "Natural Language Processing", icon: Code2 },
  { name: "Full-Stack Development", icon: Code2 },
  { name: "System Architecture", icon: Cpu },
  { name: "AI Strategy Consulting", icon: Globe },
];

const EXPERIENCE = [
  {
    role: "AI Policy Expert & Founder",
    company: "IlVantaggioAI",
    period: "2024 - Presente",
    description: "Fondatore del blog italiano sull'Intelligenza Artificiale. Editorial calendar automation con pipeline AI multi-provider.",
    highlights: ["150+ articoli pubblicati", "50K+ lettori mensili", "Pipeline AI automatizzata"],
  },
  {
    role: "Senior Software Engineer",
    company: "Tech Company",
    period: "2020 - 2024",
    description: "Sviluppo di sistemi AI-powered per enterprise. Architettura di pipeline di dati e modelli ML in produzione.",
    highlights: ["Enterprise AI Systems", "ML Pipeline Architecture", "Team Leadership"],
  },
  {
    role: "AI Researcher",
    company: "Università",
    period: "2018 - 2020",
    description: "Ricerca su Large Language Models e tecniche di ottimizzazione per lingue minoritarie.",
    highlights: ["LLM Research", "NLP Optimization", "Academic Publications"],
  },
];

const STATS = [
  { label: "Articoli Pubblicati", value: "150+", suffix: "" },
  { label: "Lettori Mensili", value: "50", suffix: "K+" },
  { label: "Progetti AI", value: "25+", suffix: "" },
  { label: "Anni di Esperienza", value: "8+", suffix: "" },
];



const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-800">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-zinc-950 to-zinc-950" />
        <motion.div
          className="absolute left-1/4 top-1/4 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 30, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -20, 0],
            y: [0, -30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />

        <div className="relative mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
            {/* Left - Content */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div
                variants={itemVariants}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-900/30 px-4 py-1.5 text-xs font-medium text-indigo-300"
              >
                <Sparkles className="h-3.5 w-3.5" />
                AI Policy Expert & Tech Founder
              </motion.div>

              <motion.h1
                variants={itemVariants}
                className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
              >
                Ciao, sono{" "}
                <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Anselmo
                </span>
              </motion.h1>

              <motion.p
                variants={itemVariants}
                className="mb-8 text-lg leading-relaxed text-zinc-400"
              >
                Sono un ingegnere del software specializzato in Intelligenza Artificiale
                e fondatore di IlVantaggioAI. Aiuto aziende e professionisti a navigare
                il complesso mondo dell&apos;AI, traducendo ricerche all&apos;avanguardia in
                applicazioni pratiche per il mercato italiano.
              </motion.p>

              <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button className="bg-indigo-600 text-white hover:bg-indigo-500">
                    <Mail className="mr-2 h-4 w-4" />
                    Contattami
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                    <Twitter className="mr-2 h-4 w-4" />
                    Seguimi su X
                  </Button>
                </motion.div>
              </motion.div>

              {/* Social Links */}
              <motion.div variants={itemVariants} className="mt-8 flex items-center gap-4">
                {[Twitter, Linkedin, Github].map((Icon, i) => (
                  <motion.a
                    key={i}
                    href="#"
                    whileHover={{ scale: 1.2, y: -2 }}
                    whileTap={{ scale: 0.9 }}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-zinc-800 text-zinc-500 transition-colors hover:border-indigo-500/50 hover:text-indigo-400"
                  >
                    <Icon className="h-4 w-4" />
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            {/* Right - Visual */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative"
            >
              <motion.div
                className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-zinc-800"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <motion.div
                      className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 text-white"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <span className="text-5xl font-bold">A</span>
                    </motion.div>
                    <p className="text-white/80 font-medium">Anselmo Acquah</p>
                    <p className="text-white/50 text-sm">Founder & AI Expert</p>
                  </div>
                </div>
              </motion.div>

              {/* Floating badges */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="absolute -bottom-4 -left-4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-900/50">
                    <MapPin className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-200">Milano, Italia</p>
                    <p className="text-xs text-zinc-500">Base operativa</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="absolute -right-4 top-1/4 rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-900/50">
                    <Calendar className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-200">8+ anni</p>
                    <p className="text-xs text-zinc-500">Esperienza AI</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-zinc-800 bg-zinc-900/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-8 md:grid-cols-4"
          >
            {STATS.map((stat) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center"
              >
                <motion.p
                  className="text-4xl font-bold text-white"
                  whileHover={{ scale: 1.1 }}
                >
                  {stat.value}
                  <span className="text-indigo-400">{stat.suffix}</span>
                </motion.p>
                <p className="mt-1 text-sm text-zinc-500">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-900/50">
            <Zap className="h-5 w-5 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Competenze</h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="flex flex-wrap gap-3"
        >
          {SKILLS.map((skill) => (
            <motion.div
              key={skill.name}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 transition-all hover:border-indigo-500/50 hover:bg-zinc-800">
                <skill.icon className="h-4 w-4 text-indigo-400" />
                {skill.name}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <Separator className="bg-zinc-800" />

      {/* Experience Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-900/50">
            <Brain className="h-5 w-5 text-purple-400" />
          </div>
          <h2 className="text-2xl font-bold text-white">Esperienza</h2>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-6"
        >
          {EXPERIENCE.map((exp) => (
            <motion.div
              key={exp.role}
              variants={itemVariants}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-all hover:border-indigo-500/30 hover:bg-zinc-900 hover:shadow-lg hover:shadow-indigo-500/5"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
                      {exp.role}
                    </h3>
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileHover={{ opacity: 1, x: 0 }}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <ArrowUpRight className="h-4 w-4 text-indigo-400" />
                    </motion.div>
                  </div>
                  <p className="text-indigo-400 mb-2">{exp.company}</p>
                  <p className="text-zinc-400 mb-4">{exp.description}</p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-2">
                    {exp.highlights.map((highlight, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-zinc-800 px-3 py-1 text-xs text-zinc-400"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
                <span className="text-sm text-zinc-500 whitespace-nowrap">{exp.period}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Mission Section */}
      <section className="border-t border-zinc-800 bg-zinc-900/30">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mx-auto max-w-3xl text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, type: "spring" }}
              className="mx-auto mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-900/50"
            >
              <Globe className="h-6 w-6 text-indigo-400" />
            </motion.div>

            <h2 className="mb-4 text-3xl font-bold text-white">La Mia Missione</h2>
            <p className="text-lg leading-relaxed text-zinc-400">
              Voglio rendere l&apos;Intelligenza Artificiale accessibile a tutti.
              Attraverso IlVantaggioAI, condivido conoscenze pratiche, analisi approfondite
              e strumenti concreti per aiutare sviluppatori, imprenditori e professionisti
              a sfruttare il potenziale trasformativo dell&apos;AI nel loro lavoro quotidiano.
            </p>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 p-8 text-center sm:p-12"
        >
          {/* Decorative elements */}
          <motion.div
            className="absolute left-10 top-10 h-20 w-20 rounded-full border border-white/10"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
          <motion.div
            className="absolute bottom-10 right-10 h-16 w-16 rounded-lg border border-white/10"
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          />

          <h2 className="relative mb-4 text-2xl font-bold text-white sm:text-3xl">
            Lavoriamo insieme
          </h2>
          <p className="relative mb-8 text-zinc-300">
            Hai un progetto AI o vuoi collaborare? Sono sempre aperto a nuove opportunità.
          </p>
          <div className="relative flex flex-col justify-center gap-4 sm:flex-row">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button className="bg-indigo-600 text-white hover:bg-indigo-500">
                <Mail className="mr-2 h-4 w-4" />
                Scrivimi una email
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="outline" className="border-zinc-600 text-white hover:bg-zinc-800">
                <Calendar className="mr-2 h-4 w-4" />
                Prenota una call
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
