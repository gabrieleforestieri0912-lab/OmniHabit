'use client';

import Reveal from './Reveal';
import { ChevronRight } from 'lucide-react';
import type { AuthMode } from '../types';

const capabilities = [
  {
    index: '01',
    title: 'Persistence',
    body: 'Legge la costanza mentre accade e mette in evidenza ciò che conta prima che tu lo chieda.'
  },
  {
    index: '02',
    title: 'Insight a strati',
    body: 'Passa da un\u2019idea grezza a un piano di crescita nitido senza perdere il filo.'
  },
  {
    index: '03',
    title: 'Velocità adattiva',
    body: 'Impara il tuo ritmo e stringe ogni passaggio mentre lavori.'
  }
];

interface SectionTwoProps {
  onAuthClick?: (mode: AuthMode) => void;
  onStart: () => void;
}

export default function SectionTwo({ onAuthClick, onStart }: SectionTwoProps) {
  return (
    <Reveal scale>
      <section
        id="capability"
        className="min-h-screen supports-[height:100svh]:min-h-[100svh] flex flex-col justify-between px-5 sm:px-8 md:px-12 pt-24 sm:pt-28 pb-12 md:pb-16 mx-3 sm:mx-6 lg:mx-10 my-4 md:my-6 rounded-3xl border border-white/10 bg-background/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_60px_-20px_rgba(0,0,0,0.7)]">
      {/* Top row */}
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <Reveal delay={120}>
          <div className="inline-flex border-l-2 border-white bg-white/15 px-3 py-1.5 backdrop-blur-md">              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white">
              Insight Su Richiesta
            </span>
          </div>
        </Reveal>

        <Reveal delay={220} className="max-w-sm sm:text-right">
          <p className="text-lg sm:text-xl leading-relaxed text-white drop-shadow-md">
            Il nostro sistema non si limita a rispondere — interpreta, affina e consegna il segnale
            che ti serve per restare costante.
          </p>
        </Reveal>
      </div>

      {/* Bottom area */}
      <div className="flex flex-1 flex-col justify-end gap-12 md:flex-row md:items-end md:justify-between md:gap-16">
        <div className="max-w-xl">
          <Reveal delay={180}>
            <h2 className="font-display text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.05] tracking-tight text-white drop-shadow-lg">
              Impara a vedere
              <br />
              brillantemente.
            </h2>
          </Reveal>

          <Reveal delay={320}>
            <p className="mt-6 max-w-md text-sm sm:text-base text-white/80 drop-shadow-md">
              Dal primo sketch alla streak più lunga, OmniHabit trasforma le tue intenzioni in
              decisioni che puoi mantenere — in silenzio, con precisione, alla velocità giusta.
            </p>
          </Reveal>

          <Reveal delay={420}>
            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={onStart}
                className="group inline-flex items-center gap-1 rounded-full bg-white px-5 py-2.5 text-xs sm:text-sm font-medium text-black hover:bg-white/85 transition-colors duration-300 cursor-pointer"
              >
                Inizia Gratis
                <ChevronRight size={14} className="transition-transform duration-300 group-hover:translate-x-0.5" aria-hidden="true" />
              </button>
              <button
                onClick={() => onAuthClick?.('login')}
                className="rounded-full border border-white/25 bg-white/5 backdrop-blur-sm px-5 py-2.5 text-xs sm:text-sm text-white hover:bg-white/10 transition-colors duration-300 cursor-pointer"
              >
                Consulenza gratuita
              </button>
            </div>
          </Reveal>
        </div>

        {/* Frosted capability panel */}
        <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/5 px-5 sm:px-6 backdrop-blur-sm">
          {capabilities.map((cap, i) => (
            <Reveal key={cap.index} delay={300 + i * 110}>
              <div
                className={`flex gap-5 py-5 ${i < capabilities.length - 1 ? 'border-b border-white/15' : ''}`}
              >
                <span className="font-mono text-[11px] tracking-[0.15em] text-white/55 pt-1">
                  {cap.index}
                </span>
                <div>
                  <button className="group inline-flex items-center gap-2 py-1 text-base sm:text-lg font-medium text-white cursor-pointer">
                    {cap.title}
                    <ChevronRight
                      size={16}
                      className="text-white/40 transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white"
                      aria-hidden="true"
                    />
                  </button>
                  <p className="mt-1.5 text-sm leading-relaxed text-white/70">{cap.body}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
      </section>
    </Reveal>
  );
}
