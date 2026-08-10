'use client';

import { Fragment } from 'react';
import { ArrowRight } from 'lucide-react';
import Reveal from './Reveal';
import CountUp from './CountUp';
import type { User } from '../types';
import type { GlobalStats } from './utils';

interface SectionOneProps {
  user: User | null;
  stats: GlobalStats;
  onStart: () => void;
}

export default function SectionOne({ user, stats, onStart }: SectionOneProps) {
  // Short labels on mobile so the strip fits one line at ~320px; full labels from sm: up.
  const labels = [
    { short: 'Streak', long: 'Giorni di streak' },
    { short: 'Attivi', long: 'Obiettivi attivi' },
    { short: 'Oggi', long: 'Completati oggi' }
  ];
  const statsValues: number[] | null = user
    ? [stats.totalStreak, stats.totalHabits, stats.completedToday]
    : null;

  const renderStats = () => (
    <span className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-14 gap-y-6">
      {labels.map((label, i) => (
        <Fragment key={label.long}>
          {i > 0 && <span className="hidden h-12 w-px bg-white/10 md:block" aria-hidden="true" />}
          <span className="flex flex-col items-center gap-1.5">
            <span
              className={`font-display text-3xl sm:text-4xl font-medium tracking-tight ${
                user ? 'text-foreground' : 'text-foreground/40'
              }`}
            >
              {statsValues ? <CountUp value={statsValues[i]} delay={i * 150} /> : '—'}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-foreground/50">
              <span className="sm:hidden">{label.short}</span>
              <span className="hidden sm:inline">{label.long}</span>
            </span>
          </span>
        </Fragment>
      ))}
    </span>
  );

  return (
    <section className="relative flex min-h-screen supports-[height:100svh]:min-h-[100svh] flex-col overflow-visible">
      {/* Soft dark halo behind the centered content.
          NOTE: previously a blur-[82px] filter on a 984x527 element — a huge filter
          region over the fixed video that froze the FIRST scroll frame (~2s stall
          while the browser rasterized it). A radial gradient reproduces the same
          dark halo look at zero per-frame cost. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 left-1/2 h-[440px] w-[120vw] max-w-[984px] sm:h-[527px] sm:w-[984px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            'radial-gradient(ellipse 50% 50% at center, rgba(2,2,8,0.92) 0%, rgba(2,2,8,0.6) 50%, rgba(2,2,8,0.25) 72%, transparent 100%)'
        }}
      />

      {/* Centered hero content */}
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-5 sm:px-8 text-center">
        <Reveal delay={100}>
          <h1 className="font-display text-[clamp(44px,12vw,190px)] font-normal leading-[1.02] tracking-[-0.024em] text-foreground">
            Omni
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(to left, #6366f1, #a855f7, #fcd34d)' }}
            >
              Habit
            </span>
          </h1>
        </Reveal>

        <Reveal delay={250}>
          <p className="mt-[9px] max-w-md text-hero-sub text-lg leading-8 opacity-80">
            {user
              ? `La tua costanza parla per te: ${stats.totalStreak} giorni di streak. Il sistema più potente per continuare a costruire.`
              : 'Il sistema più potente mai costruito per trasformare le tue abitudini in risultati concreti.'}
          </p>
        </Reveal>

        <Reveal delay={400}>
          <div className="mt-[25px] flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onStart}
              className="liquid-glass cursor-pointer rounded-full px-[29px] py-[24px] text-sm text-foreground transition-opacity duration-300 hover:opacity-90"
            >
              {user ? 'Continua il tuo percorso' : 'Inizia Gratis'}
            </button>
            <button
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
              className="cursor-pointer rounded-full border border-white/25 bg-white/5 px-[29px] py-[24px] text-sm text-foreground backdrop-blur-sm transition-colors duration-300 hover:bg-white/10"
            >
              Scopri il Metodo
            </button>
          </div>
        </Reveal>
      </div>

      {/* Stats strip — real user data, or an invitation for visitors */}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-5 sm:px-8 pb-10">
        <Reveal scale delay={550}>
          {user ? (
            renderStats()
          ) : (
            <button onClick={onStart} className="group mx-auto flex cursor-pointer flex-col items-center gap-4">
              {renderStats()}
              <span className="text-sm text-foreground/50 transition-colors duration-300 group-hover:text-foreground">
                Inizia e costruisci la tua prima streak
                <ArrowRight
                  size={14}
                  className="ml-1.5 inline transition-transform duration-300 group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </button>
          )}
        </Reveal>
      </div>
    </section>
  );
}
