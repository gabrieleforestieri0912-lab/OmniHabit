'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, LayoutGrid, Zap, X, Plus, Trash2, CheckCircle2, Circle, TrendingUp, Sparkles } from 'lucide-react';
import { months, quarters } from './constants';
import Reveal from './Reveal';
import type { HabitsMap } from '../types';

interface MonthSelectionProps {
  habits: HabitsMap;
  selectedMonth: string | null;
  setSelectedMonth: (month: string | null) => void;
  isQuartersView: boolean;
  setIsQuartersView: (value: boolean) => void;
  openDashboard: (month: string) => void;
  newHabit: string;
  setNewHabit: (value: string) => void;
  addHabit: (e: React.FormEvent) => void;
  toggleHabit: (month: string, id: string) => void;
  deleteHabit: (month: string, id: string) => void;
  onOpenBuilder: (month: string) => void;
}

export default function MonthSelection({
  habits,
  selectedMonth,
  setSelectedMonth,
  isQuartersView,
  setIsQuartersView,
  openDashboard,
  newHabit,
  setNewHabit,
  addHabit,
  toggleHabit,
  deleteHabit,
  onOpenBuilder
}: MonthSelectionProps) {
  return (
    <Reveal scale>
      <section id="months" className={`relative px-5 sm:px-8 md:px-12 py-16 md:py-20 min-h-screen mx-3 sm:mx-6 lg:mx-10 my-4 md:my-6 rounded-3xl border border-white/10 bg-background/25 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_60px_-20px_rgba(0,0,0,0.7)] ${isQuartersView ? 'pt-20 md:pt-24' : ''}`}>
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 md:mb-20 flex flex-col items-start gap-6">
          <Reveal delay={120}>
            <div className="inline-flex border-l-2 border-white bg-white/15 px-3 py-1.5 backdrop-blur-md">
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white">
                {isQuartersView ? 'Visione Annuale' : 'Timeline'}
              </span>
            </div>
          </Reveal>

          <div className="flex flex-wrap items-center justify-between gap-6 w-full">
            <Reveal delay={220}>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium leading-[0.9] tracking-tighter text-white drop-shadow-lg">
                {isQuartersView ? 'La tua evoluzione, anno per anno.' : 'Scegli il tuo mese.'}
              </h2>
            </Reveal>

            <Reveal delay={320}>
              <button
                onClick={() => setIsQuartersView(!isQuartersView)}
                className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/5 backdrop-blur-sm px-4 py-2 text-[10px] font-mono uppercase tracking-[0.15em] text-white hover:bg-white/15 transition-colors duration-300 cursor-pointer"
                aria-label={isQuartersView ? 'Visualizza griglia mesi' : 'Visualizza per quadrimestri'}
              >
                {isQuartersView ? 'Torna alla griglia' : 'Visualizza per quadrimestri'}
                <LayoutGrid size={12} aria-hidden="true" />
              </button>
            </Reveal>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!isQuartersView ? (
            <motion.div
              key="grid"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-5 mb-14"
            >
              {months.map((m, i) => (
                <motion.button
                  key={m}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => {
                    setSelectedMonth(m);
                    window.scrollTo({ top: (document.getElementById('selected-month-details')?.offsetTop ?? 0) - 100 || 800, behavior: 'smooth' });
                  }}
                  className={`group p-5 rounded-xl border transition-all duration-300 cursor-pointer text-left relative overflow-hidden ${
                    selectedMonth === m
                      ? 'bg-white/10 border-white/40'
                      : 'bg-white/5 border-white/20 hover:bg-white/10'
                  }`}
                  aria-label={`Dettagli per ${m}`}
                >
                  <div className={`mb-4 w-9 h-9 rounded-lg flex items-center justify-center ${selectedMonth === m ? 'bg-white text-black' : 'bg-white/15 text-white/70'}`}>
                    <Calendar size={15} strokeWidth={2} aria-hidden="true" />
                  </div>
                  <span className="text-lg font-medium text-white block tracking-tight">{m}</span>
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="font-mono text-[10px] text-white/50 uppercase tracking-[0.15em] flex items-center gap-2">
                      <div className={`w-1 h-1 rounded-full ${selectedMonth === m ? 'bg-white animate-pulse' : 'bg-white/20'}`} />
                      {(habits[m] || []).length} Goals
                    </div>
                    <div className="font-mono text-[10px] text-white/70 uppercase tracking-[0.15em] flex items-center gap-2">
                      <Zap size={9} fill="currentColor" aria-hidden="true" />
                      {(habits[m] || []).reduce((acc, h) => acc + (h.streak || 0), 0)} persistence
                    </div>
                  </div>
                </motion.button>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="quarters"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-14"
            >
              {quarters.map((qMonths, qIdx) => (
                <div key={qIdx} className="space-y-4">
                  <div className="flex items-center gap-3 mb-5">
                    <div className="w-8 h-8 rounded-md bg-white/15 flex items-center justify-center">
                      <span className="font-mono text-[10px] tracking-[0.15em] text-white">Q{qIdx + 1}</span>
                    </div>
                    <h4 className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/50">
                      {qIdx + 1}° Quadrimestre
                    </h4>
                  </div>
                  <div className="flex flex-col gap-3">
                    {qMonths.map((m, i) => (
                      <motion.button
                        key={m}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 + qIdx * 0.2 }}
                        whileHover={{ x: 5 }}
                        onClick={() => openDashboard(m)}
                        className={`group p-5 rounded-xl border transition-all duration-300 cursor-pointer text-left bg-white/5 border-white/20 hover:bg-white/10`}
                        aria-label={`Dashboard per ${m}`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-base md:text-lg font-medium text-white">{m}</span>
                            <div className="font-mono text-[10px] text-white/50 mt-0.5 uppercase tracking-[0.15em]">Apri dashboard →</div>
                          </div>
                          <div className="font-mono text-[10px] text-white/60">{(habits[m] || []).length} Goals</div>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <div id="selected-month-details">
          <AnimatePresence mode="wait">
            {selectedMonth && !isQuartersView && (
              <motion.div
                key={selectedMonth}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="mx-auto max-w-3xl"
              >
                <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-6 md:p-10 backdrop-blur-sm shadow-xl">
                  <button
                    onClick={() => setSelectedMonth(null)}
                    className="absolute top-5 right-5 p-2 bg-white/10 hover:bg-white/25 rounded-full transition-all duration-300 cursor-pointer group z-20"
                    aria-label="Chiudi dettagli mese"
                  >
                    <X size={16} className="group-hover:rotate-90 transition-transform duration-300" aria-hidden="true" />
                  </button>

                  <div className="flex items-center gap-4 mb-8 relative z-10">
                    <div className="w-11 h-11 bg-white/15 rounded-lg flex items-center justify-center">
                      <LayoutGrid size={18} className="text-white" aria-hidden="true" />
                    </div>
                    <div>
                      <h3 className="text-2xl sm:text-3xl font-medium tracking-tight text-white">{selectedMonth}</h3>
                      <p className="font-mono text-[10px] text-white/50 uppercase tracking-[0.15em] mt-0.5">
                        Personal Evolution Hub
                      </p>
                    </div>
                  </div>

                  <div className="mb-8 relative z-10 flex flex-col gap-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <form onSubmit={addHabit} className="flex flex-1 flex-col sm:flex-row gap-3">
                        <input
                          type="text"
                          value={newHabit}
                          onChange={(e) => setNewHabit(e.target.value)}
                          placeholder="Nuovo obiettivo..."
                          className="flex-1 rounded-lg border border-white/20 bg-white/5 px-4 py-3 outline-none focus:border-white/50 transition-all font-medium text-sm placeholder:text-white/30"
                          aria-label="Testo nuovo obiettivo"
                        />
                        <button
                          type="submit"
                          className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-medium text-black hover:bg-white/85 transition-colors duration-300 cursor-pointer"
                          aria-label="Aggiungi obiettivo"
                        >
                          <Plus size={16} strokeWidth={3} aria-hidden="true" />
                          <span className="sm:hidden">Aggiungi</span>
                        </button>
                      </form>
                      <button
                        onClick={() => onOpenBuilder(selectedMonth || '')}
                        className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/5 px-6 py-3 text-xs font-medium text-white backdrop-blur-sm hover:bg-white/10 transition-colors duration-300 cursor-pointer"
                      >
                        <Sparkles size={14} aria-hidden="true" />
                        Crea con le 4 Leggi
                      </button>
                    </div>
                    <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
                      Metodo Atomic Habits: cue ovvio, 2 minuti, ricompensa, identità
                    </p>
                  </div>

                  <div className="space-y-3 relative z-10">
                    <AnimatePresence>
                      {(habits[selectedMonth] || []).map((habit) => (
                        <motion.div
                          key={habit._id}
                          initial={{ opacity: 0, x: -30 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                            habit.completed
                              ? 'bg-green-500/10 border-green-500/30'
                              : 'bg-white/5 border-white/20 hover:bg-white/10'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <button
                              onClick={() => toggleHabit(selectedMonth, habit._id)}
                              className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                                habit.completed ? 'bg-green-500 text-black' : 'bg-white/10 border border-white/20 group-hover:border-white/50'
                              }`}
                              aria-label={habit.completed ? 'Segna come non completato' : 'Segna come completato'}
                            >
                              {habit.completed ? (
                                <CheckCircle2 size={16} strokeWidth={2.5} aria-hidden="true" />
                              ) : (
                                <Circle size={16} className="text-white/40" strokeWidth={1} aria-hidden="true" />
                              )}
                            </button>
                            <div>
                              <span className={`text-sm font-medium block leading-tight ${habit.completed ? 'line-through text-white/40' : 'text-white'}`}>
                                {habit.name}
                              </span>
                              <div className="flex items-center gap-2 mt-1">
                                <TrendingUp size={10} className="text-white/60" aria-hidden="true" />
                                <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/50">
                                  {habit.streak} {habit.streak === 1 ? 'day' : 'days'} {habit.completed ? '· Oggi ✓' : ''}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button
                            onClick={() => deleteHabit(selectedMonth, habit._id)}
                            className="opacity-40 group-hover:opacity-100 text-white/30 hover:text-red-500 transition-all p-2 cursor-pointer"
                            aria-label="Elimina obiettivo"
                          >
                            <Trash2 size={16} aria-hidden="true" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      </section>
    </Reveal>
  );
}
