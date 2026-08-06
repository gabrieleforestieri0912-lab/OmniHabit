'use client';

import Reveal from './Reveal';
import { ChevronRight } from 'lucide-react';

const PORTRAIT_URL =
  'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260728_050334_5b076e26-0ce7-4898-b432-d764190e448f.png&w=1280&q=85';

const services = ['Tracciamento abitudini', 'AI Coach personale', 'Piani di evoluzione'];

export default function SectionOne({ user, totalStreak, onAuthClick }) {
  return (
    <section className="min-h-screen supports-[height:100svh]:min-h-[100svh] flex flex-col justify-between px-5 sm:px-8 md:px-12 pt-24 sm:pt-28 pb-12 md:pb-16">
      {/* Top row */}
      <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-2">
          {services.map((service, i) => (
            <Reveal key={service} delay={150 + i * 120}>
              <span className="font-mono text-xs uppercase tracking-[0.15em] text-white/90 drop-shadow-md">
                / {service}
              </span>
            </Reveal>
          ))}
        </div>

        <Reveal delay={300} className="max-w-xs sm:text-right">
          <p className="text-lg sm:text-xl leading-relaxed text-white drop-shadow-md">
            Progettiamo sistemi di abitudini che portano chiarezza, precisione ed efficienza nel modo
            in cui la tua giornata diventa evoluzione.
          </p>
        </Reveal>
      </div>

      {/* Bottom row */}
      <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <Reveal delay={150}>
            <div className="mb-5 inline-flex border-l-2 border-white bg-white/15 px-3 py-1.5 backdrop-blur-md">
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white">
                {user ? `Persistence globale: ${totalStreak} giorni` : 'Tracciamo 100+ abitudini al mese'}
              </span>
            </div>
          </Reveal>

          <Reveal delay={280}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.05] tracking-tight text-white drop-shadow-lg">
              Chiaro.
              <br />
              Preciso.
              <br />
              Automatico.
            </h1>
          </Reveal>
        </div>

        <Reveal delay={420}>
          <div className="flex items-center gap-4 rounded-xl bg-white/15 p-3 backdrop-blur-md">
            <img
              src={PORTRAIT_URL}
              alt="Il tuo AI Coach personale"
              className="h-24 w-20 rounded-lg object-cover"
            />
            <div className="flex flex-col gap-1.5 pr-2">
              <span className="text-sm font-medium text-white">Parla con il Coach</span>
              <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/60">
                Il tuo AI Coach
              </span>
              <button
                onClick={() => onAuthClick?.('login')}
                className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-xs font-medium text-black hover:bg-white/85 transition-colors duration-300 cursor-pointer"
              >
                Prova la chat AI
                <ChevronRight size={14} aria-hidden="true" />
              </button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
