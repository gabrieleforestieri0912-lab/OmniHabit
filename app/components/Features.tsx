'use client';

import Reveal from './Reveal';
import { Target, TrendingUp, Zap, Brain, Award, Shield, ArrowRight, Eye, Gift, type LucideIcon } from 'lucide-react';
import { steps } from './content';

const laws: { icon: LucideIcon; law: string; title: string; desc: string }[] = [
  { icon: Eye, law: 'Legge 1', title: 'Rendila Ovvia', desc: 'Cue precisi: orario, luogo, habit stacking. Zero decisioni da prendere.' },
  { icon: Brain, law: 'Legge 2', title: 'Rendila Attraente', desc: "Identità: ogni azione è un voto per la persona che vuoi diventare." },
  { icon: Zap, law: 'Legge 3', title: 'Rendila Facile', desc: 'La regola dei 2 minuti: se manca energia, fai solo la versione minima.' },
  { icon: Gift, law: 'Legge 4', title: 'Rendila Soddisfacente', desc: 'Streak e ricompensa immediata. Mai mancare due volte.' }
];

const features: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Target,
    title: 'Tracciamento Preciso',
    description: 'Monitora le tue abitudini giornaliere con un sistema di persistence che premia la costanza.'
  },
  {
    icon: TrendingUp,
    title: 'Progresso Visivo',
    description: 'Grafici e statistiche in tempo reale per vedere la tua evoluzione nel tempo.'
  },
  {
    icon: Zap,
    title: 'AI Assistant',
    description: 'Chatta con Llama 3 per ricevere consigli personalizzati sulle tue abitudini.'
  },
  {
    icon: Brain,
    title: 'Neuroscienza',
    description: 'Basato su principi scientifici di neuroplasticità e costruzione dell\u2019abitudine.'
  },
  {
    icon: Award,
    title: 'Achievements',
    description: 'Sblocca achievement mentre progredisci. Ogni traguardo è una vittoria.'
  },
  {
    icon: Shield,
    title: 'Google Auth',
    description: 'Accesso sicuro e veloce con il tuo account Google. I tuoi dati sono al sicuro.'
  }
];

export default function FeaturesSection() {
  return (
    <Reveal scale>
      <section
        id="features"
        className="relative px-5 sm:px-8 md:px-12 py-16 md:py-20 mx-3 sm:mx-6 lg:mx-10 my-4 md:my-6 rounded-3xl border border-white/10 bg-background/60 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_60px_-20px_rgba(0,0,0,0.7)]"
      >
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-16 md:mb-24 max-w-2xl">
          <Reveal delay={120}>
            <div className="inline-flex border-l-2 border-white bg-white/15 px-3 py-1.5 backdrop-blur-md mb-6">
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white">
                Il Metodo
              </span>
            </div>
          </Reveal>
          <Reveal delay={220}>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium leading-[0.9] tracking-tighter text-white drop-shadow-lg">
              Il Metodo Atomic Habits
            </h2>
          </Reveal>
          <Reveal delay={320}>
            <p className="mt-4 text-white/80 max-w-md drop-shadow-md">
              Le 4 Leggi del Cambiamento di James Clear, applicate a ogni abitudine: dalla creazione al check-in.
            </p>
          </Reveal>
        </div>

        {/* The four laws */}
        <div className="mb-16 md:mb-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {laws.map((law, i) => (
            <Reveal key={law.title} delay={i * 100}>
              <div className="h-full rounded-2xl border border-white/15 bg-white/15 backdrop-blur-md p-6 transition-colors duration-300 hover:bg-white/20">
                <div className="mb-5 flex items-center justify-between">
                  <div className="inline-flex rounded-lg bg-white/15 p-2.5">
                    <law.icon size={20} className="text-white" aria-hidden="true" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/50">{law.law}</span>
                </div>
                <h3 className="text-lg font-medium text-white">{law.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/70">{law.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 80}>
              <div className="h-full rounded-2xl border border-white/15 bg-white/15 backdrop-blur-md p-6 transition-colors duration-300 hover:bg-white/20">
                <div className="mb-5 inline-flex rounded-lg bg-white/15 p-2.5">
                  <feature.icon size={20} className="text-white" aria-hidden="true" />
                </div>
                <h3 className="text-lg font-medium text-white">{feature.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-white/70">{feature.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* How it works */}
        <div className="mt-20 md:mt-28 mb-14">
          <Reveal delay={120}>
            <h3 className="font-display text-2xl sm:text-3xl font-medium tracking-tighter text-white drop-shadow-md">
              Il Sistema in 4 Passi
            </h3>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={150 + i * 110}>
              <div className="h-full rounded-2xl border border-white/15 bg-white/15 backdrop-blur-md px-5 py-6">
                <div className="font-mono text-[11px] tracking-[0.15em] text-white/55">{step.number}</div>
                <h4 className="mt-2 text-base font-medium text-white">{step.title}</h4>
                <p className="mt-1.5 text-sm leading-relaxed text-white/70">{step.description}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* CTA */}
        <Reveal delay={200} className="mt-16 md:mt-20 text-center">
          <a
            href="#months"
            className="group inline-flex items-center gap-2 rounded-full border border-white/20 bg-black px-7 py-3 text-sm font-medium text-white hover:bg-gray-900 transition-colors duration-300"
          >
            Inizia Ora
            <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
          </a>
          <p className="mt-4 text-xs text-white/40 font-mono uppercase tracking-[0.15em]">
            Gratuito · Senza carta di credito · 30 secondi
          </p>
        </Reveal>
      </div>
      </section>
    </Reveal>
  );
}
