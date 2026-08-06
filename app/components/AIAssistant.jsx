'use client';

import { Bot, MessageCircle } from 'lucide-react';
import Reveal from './Reveal';

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

export default function AIAssistantSection({ onNavigate }) {
  return (
    <section id="ai-assistant" className="relative bg-[#0a0a0a] px-5 sm:px-8 md:px-12 py-24 md:py-32">
      <div className="mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center max-w-[1600px]">
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
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.05] tracking-tight text-white">
              Il tuo AI Coach
            </h2>
          </Reveal>

          <Reveal delay={320}>
            <p className="mt-5 max-w-md text-white/60 leading-relaxed">
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
              className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-black hover:bg-white/85 transition-colors duration-300 cursor-pointer"
            >
              <MessageCircle size={16} aria-hidden="true" />
              Prova AI Chat
            </button>
          </Reveal>
        </div>

        {/* Right: chat preview */}
        <Reveal delay={300}>
          <div className="rounded-2xl border border-white/15 bg-white/10 backdrop-blur-md overflow-hidden">
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
  );
}
