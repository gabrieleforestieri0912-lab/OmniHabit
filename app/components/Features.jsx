'use client';

import Reveal from './Reveal';
import { Target, TrendingUp, Zap, Brain, Award, Shield, ArrowRight } from 'lucide-react';

const features = [
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

const steps = [
  { number: '01', title: 'Registrati', description: 'Crea il tuo account in pochi secondi usando email o Google.' },
  { number: '02', title: 'Definisci i Tuoi Obiettivi', description: 'Scrivi le abitudini che vuoi sviluppare per ogni mese.' },
  { number: '03', title: 'Traccia Ogni Giorno', description: 'Segna i tuoi progressi quotidiani e costruisci la tua streak.' },
  { number: '04', title: 'Evola Costantemente', description: 'Usa l\u2019AI per suggerimenti e guarda le tue statistiche crescere.' }
];

export default function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative bg-[#0a0a0a] px-5 sm:px-8 md:px-12 py-24 md:py-32"
    >
      <div className="mx-auto max-w-[1600px]">
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
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.05] tracking-tight text-white">
              Tutto ciò che serve
            </h2>
          </Reveal>
          <Reveal delay={320}>
            <p className="mt-4 text-white/60 max-w-md">
              Gli strumenti per trasformare le tue abitudini in risultati concreti.
            </p>
          </Reveal>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 80}>
              <div className="h-full rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md p-6 transition-colors duration-300 hover:bg-white/15">
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
            <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">
              Come funziona
            </h3>
          </Reveal>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {steps.map((step, i) => (
            <Reveal key={step.number} delay={150 + i * 110}>
              <div className="h-full rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md px-5 py-6">
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
            className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3 text-sm font-medium text-black hover:bg-white/85 transition-colors duration-300"
          >
            Inizia Ora
            <ArrowRight size={16} aria-hidden="true" />
          </a>
          <p className="mt-4 text-xs text-white/40 font-mono uppercase tracking-[0.15em]">
            Gratuito · Senza carta di credito · 30 secondi
          </p>
        </Reveal>
      </div>
    </section>
  );
}
