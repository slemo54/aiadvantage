"use client";

import { Mail, Twitter, Linkedin, Github, MapPin, Calendar, Sparkles, Zap, Brain } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const SKILLS = [
  "Artificial Intelligence",
  "Machine Learning",
  "Natural Language Processing",
  "Full-Stack Development",
  "System Architecture",
  "AI Strategy Consulting",
];

const EXPERIENCE = [
  {
    role: "AI Policy Expert & Founder",
    company: "IlVantaggioAI",
    period: "2024 - Presente",
    description: "Fondatore del blog italiano sull'Intelligenza Artificiale. Editorial calendar automation con pipeline AI multi-provider.",
  },
  {
    role: "Senior Software Engineer",
    company: "Tech Company",
    period: "2020 - 2024",
    description: "Sviluppo di sistemi AI-powered per enterprise. Architettura di pipeline di dati e modelli ML in produzione.",
  },
  {
    role: "AI Researcher",
    company: "Università",
    period: "2018 - 2020",
    description: "Ricerca su Large Language Models e tecniche di ottimizzazione per lingue minoritarie.",
  },
];

const STATS = [
  { label: "Articoli Pubblicati", value: "150+" },
  { label: "Lettori Mensili", value: "50K+" },
  { label: "Progetti AI", value: "25+" },
  { label: "Anni di Esperienza", value: "8+" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-zinc-800">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-zinc-950 to-zinc-950" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-8 items-center">
            {/* Left - Content */}
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-900/30 px-4 py-1.5 text-xs font-medium text-indigo-300">
                <Sparkles className="h-3.5 w-3.5" />
                AI Policy Expert & Tech Founder
              </div>
              
              <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl">
                Ciao, sono <span className="text-indigo-400">Anselmo</span>
              </h1>
              
              <p className="mb-8 text-lg leading-relaxed text-zinc-400">
                Sono un ingegnere del software specializzato in Intelligenza Artificiale 
                e fondatore di IlVantaggioAI. Aiuto aziende e professionisti a navigare 
                il complesso mondo dell&apos;AI, traducendo ricerche all&apos;avanguardia in 
                applicazioni pratiche per il mercato italiano.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button className="bg-indigo-600 text-white hover:bg-indigo-500">
                  <Mail className="mr-2 h-4 w-4" />
                  Contattami
                </Button>
                <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
                  <Twitter className="mr-2 h-4 w-4" />
                  Seguimi su X
                </Button>
              </div>

              {/* Social Links */}
              <div className="mt-8 flex items-center gap-4">
                <a href="#" className="text-zinc-500 transition-colors hover:text-white">
                  <Twitter className="h-5 w-5" />
                </a>
                <a href="#" className="text-zinc-500 transition-colors hover:text-white">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href="#" className="text-zinc-500 transition-colors hover:text-white">
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>

            {/* Right - Visual */}
            <div className="relative">
              <div className="aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-900 to-purple-900">
                {/* Abstract avatar placeholder */}
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <div className="mx-auto mb-4 flex h-32 w-32 items-center justify-center rounded-full bg-white/10 backdrop-blur">
                      <span className="text-5xl font-bold text-white">A</span>
                    </div>
                    <p className="text-white/60">Anselmo Acquah</p>
                  </div>
                </div>
              </div>
              
              {/* Floating badges */}
              <div className="absolute -bottom-4 -left-4 rounded-lg border border-zinc-800 bg-zinc-900 p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-indigo-400" />
                  <span className="text-sm text-zinc-300">Milano, Italia</span>
                </div>
              </div>
              
              <div className="absolute -right-4 top-1/4 rounded-lg border border-zinc-800 bg-zinc-900 p-3 shadow-lg">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-indigo-400" />
                  <span className="text-sm text-zinc-300">8+ anni esperienza</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-b border-zinc-800 bg-zinc-900/30">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            {STATS.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-white">{stat.value}</p>
                <p className="mt-1 text-sm text-zinc-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <Zap className="h-5 w-5 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Competenze</h2>
        </div>
        
        <div className="flex flex-wrap gap-3">
          {SKILLS.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 transition-colors hover:border-indigo-500/50 hover:text-white"
            >
              {skill}
            </span>
          ))}
        </div>
      </section>

      <Separator className="bg-zinc-800" />

      {/* Experience Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <Brain className="h-5 w-5 text-indigo-400" />
          <h2 className="text-2xl font-bold text-white">Esperienza</h2>
        </div>

        <div className="space-y-8">
          {EXPERIENCE.map((exp, index) => (
            <div
              key={index}
              className="relative rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 transition-colors hover:border-zinc-700"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{exp.role}</h3>
                  <p className="text-indigo-400">{exp.company}</p>
                  <p className="mt-2 text-zinc-400">{exp.description}</p>
                </div>
                <span className="text-sm text-zinc-500">{exp.period}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission Section */}
      <section className="border-t border-zinc-800 bg-zinc-900/30">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="mb-4 text-2xl font-bold text-white">La Mia Missione</h2>
            <p className="text-lg leading-relaxed text-zinc-400">
              Voglio rendere l&apos;Intelligenza Artificiale accessibile a tutti. 
              Attraverso IlVantaggioAI, condivido conoscenze pratiche, analisi approfondite 
              e strumenti concreti per aiutare sviluppatori, imprenditori e professionisti 
              a sfruttare il potenziale trasformativo dell&apos;AI nel loro lavoro quotidiano.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 p-8 text-center sm:p-12">
          <h2 className="mb-4 text-2xl font-bold text-white sm:text-3xl">
            Lavoriamo insieme
          </h2>
          <p className="mb-8 text-zinc-300">
            Hai un progetto AI o vuoi collaborare? Sono sempre aperto a nuove opportunità.
          </p>
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Button className="bg-indigo-600 text-white hover:bg-indigo-500">
              <Mail className="mr-2 h-4 w-4" />
              Scrivimi una email
            </Button>
            <Button variant="outline" className="border-zinc-600 text-white hover:bg-zinc-800">
              <Calendar className="mr-2 h-4 w-4" />
              Prenota una call
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
