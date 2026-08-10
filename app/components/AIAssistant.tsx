'use client';

import { Bot, MessageCircle } from 'lucide-react';
import Reveal from './Reveal';
import type { View } from '../types';

const features = [
  {
    title: 'Consigli Personalizzati',
    description: 'Ricevi suggerimenti adattati alle tue abitudini e ai tuoi obiettivi.'
  },
  {
    title: 'Strategie Avanzate',
    description: 'Tecniche di produttività e neuroscienza per massimizzare i risultati.'
  },
  {
    title: 'Progresso Costante',
    description: 'Mantieni la motivazione con obiettivi smart e traguardi chiari.'
  }
];

interface AIAssistantProps {
  onNavigate: (view: View) => void;
}

export default function AIAssistantSection({ onNavigate }: AIAssistantProps) {
  return (
    <Reveal scale>
      <section id="ai-assistant" className="relative px-5 sm:px-8 md:px-12 py-16 md:py-20 mx-3 sm:mx-6 lg:mx-10 my-4 md:my-6 rounded-3xl border border-white/10 bg-background/60 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_60px_-20px_rgba(0,0,0,0.7)]">
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center max-w-7xl">
        {/* Left: content */}
        <div>
          <Reveal delay={120}>
            <div className="inline-flex border-l-2 border-white bg-white/15 px-3 py-1.5 backdrop-blur-md mb-6">
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white">
                AI Assistant
              </span>
            </div>
          </Reveal>

          <Reveal delay={220}>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium leading-[0.9] tracking-tighter text-white drop-shadow-lg">
              Il tuo AI Coach
            </h2>
          </Reveal>

          <Reveal delay={320}>
            <p className="mt-5 max-w-md text-white/80 leading-relaxed drop-shadow-md">
              Chatta con Llama 3 per ricevere consigli personalizzati, strategie avanzate e supporto
              costante nel tuo percorso di crescita personale.
            </p>
          </Reveal>

          <div className="mt-10 space-y-5">
            {features.map((feature, i) => (
              <Reveal key={feature.title} delay={400 + i * 110}>
                <div className="flex items-start gap-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/15">
                    <Bot size={16} className="text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <h4 className="text-base font-medium text-white">{feature.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-white/70">{feature.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={650}>
            <button
              onClick={() => onNavigate('chat')}
              className="group mt-10 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-900 transition-colors duration-300 cursor-pointer"
            >
              <MessageCircle size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
              Prova AI Chat
            </button>
          </Reveal>
        </div>

        {/* Right: chat preview */}
        <Reveal delay={300}>
          <div className="rounded-2xl border border-white/15 bg-white/15 backdrop-blur-md overflow-hidden">
            <div className="flex items-center gap-3 border-b border-white/15 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
                <Bot size={18} className="text-white" aria-hidden="true" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">AI Assistant</div>
                <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/50">
                  Online · Llama 3
                </div>
              </div>
            </div>

            <div className="space-y-4 p-6">
              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <Bot size={14} className="text-white" aria-hidden="true" />
                </div>
                <div className="rounded-xl bg-white/10 px-4 py-3">
                  <p className="text-sm text-white/80">Ciao! Sono il tuo AI Coach. Come posso aiutarti oggi?</p>
                </div>
              </div>

              <div className="flex gap-3 flex-row-reverse">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white">
                  <span className="font-mono text-[10px] text-black">Tu</span>
                </div>
                <div className="rounded-xl border border-white/20 bg-white/10 px-4 py-3">
                  <p className="text-sm text-white/80">Come posso migliorare la mia streak?</p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15">
                  <Bot size={14} className="text-white" aria-hidden="true" />
                </div>
                <div className="rounded-xl bg-white/10 px-4 py-3">
                  <p className="text-sm text-white/80">
                    Inizia con abitudini piccole e specifiche. 5 minuti al giorno sono più efficaci di
                    2 ore una volta a settimana. Focus sulla consistenza, non sulla durata.
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-white/15 p-4">
              <div className="flex items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-4 py-3">
                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
                  Prova anche tu...
                </span>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
      </section>
    </Reveal>
  );
}
