'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowLeft, ArrowRight, Eye, Zap, Link2, Brain, Gift, AlarmClock, MapPin, Check } from 'lucide-react';
import type { Habit } from '../types';

export interface AtomicHabitDraftInput {
  name: string;
  cueTime?: string;
  cueLocation?: string;
  stackAfter?: string;
  twoMinute?: string;
  reward?: string;
  identity?: string;
  targetDays?: number;
}

interface HabitBuilderProps {
  open: boolean;
  month: string;
  existingHabits: Habit[];
  onClose: () => void;
  onCreate: (data: AtomicHabitDraftInput) => void;
}

const laws = [
  { n: '1', name: 'Rendila Ovvia', icon: Eye, desc: 'Implementation intention + habit stacking. Un cue chiaro: momento, luogo, trigger.' },
  { n: '2', name: 'Rendila Attraente', icon: Brain, desc: 'Legala alla tua identità. Ogni azione è un voto per la persona che vuoi diventare.' },
  { n: '3', name: 'Rendila Facile', icon: Zap, desc: 'La regola dei 2 minuti: quando manca energia, fai SOLO la versione minima.' },
  { n: '4', name: 'Rendila Soddisfacente', icon: Gift, desc: 'Ricompensa immediata. Il tracking della streak è già una ricompensa visiva.' }
];

function suggestTwoMinute(name: string): string {
  const n = name.trim().toLowerCase();
  if (/(legg|studia|libro)/.test(n)) return 'Leggi 1 pagina';
  if (/(medit|respir)/.test(n)) return '1 minuto di respirazione profonda';
  if (/(scrivi|journal|diario)/.test(n)) return 'Scrivi 1 frase';
  if (/(palestr|allen|eserciz|workout|corr|run|yoga)/.test(n)) return '2 minuti di stretching o 10 squat';
  if (/(acqua|idrat)/.test(n)) return "Bevi un bicchiere d'acqua";
  if (/(dormi|letto)/.test(n)) return 'Vai a letto 2 minuti prima';
  return `Fai solo 2 minuti di ${name.trim().toLowerCase()}`;
}

export default function HabitBuilder({ open, month, existingHabits, onClose, onCreate }: HabitBuilderProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState('');
  const [cueTime, setCueTime] = useState('');
  const [cueLocation, setCueLocation] = useState('');
  const [stackAfter, setStackAfter] = useState('');
  const [targetDays, setTargetDays] = useState(1);
  const [identity, setIdentity] = useState('');
  const [twoMinute, setTwoMinute] = useState('');
  const [reward, setReward] = useState('');
  const [twoMinuteTouched, setTwoMinuteTouched] = useState(false);

  const reset = () => {
    setStep(0);
    setName('');
    setCueTime('');
    setCueLocation('');
    setStackAfter('');
    setTargetDays(1);
    setIdentity('');
    setTwoMinute('');
    setTwoMinuteTouched(false);
    setReward('');
  };

  const close = () => {
    reset();
    onClose();
  };

  const goNext = () => {
    if (step === 2 && !twoMinuteTouched) {
      setTwoMinute(suggestTwoMinute(name));
      setTwoMinuteTouched(true);
    }
    setStep((s) => Math.min(3, s + 1));
  };

  const submit = () => {
    onCreate({
      name: name.trim(),
      cueTime: cueTime || undefined,
      cueLocation: cueLocation.trim() || undefined,
      stackAfter: stackAfter || undefined,
      twoMinute: twoMinute.trim() || undefined,
      reward: reward.trim() || undefined,
      identity: identity.trim() || undefined,
      targetDays
    });
    reset();
  };

  const canNext = step !== 0 ? true : name.trim().length > 0;

  const intention = [
    cueTime && `alle ${cueTime}`,
    cueLocation && `in ${cueLocation}`,
    stackAfter && `dopo ${stackAfter}`
  ]
    .filter(Boolean)
    .join(' ');

  const inputCls =
    'w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3 outline-none focus:border-white/50 transition-all font-medium text-sm placeholder:text-white/30';

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 bg-black/80 backdrop-blur-md flex items-center justify-center p-3"
        >
          <motion.div
            initial={{ scale: 0.94, y: 16 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.94, y: 16 }}
            className="w-full max-w-xl max-h-[88vh] overflow-y-auto rounded-[28px] border border-white/15 bg-background/80 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_30px_80px_-20px_rgba(0,0,0,0.8)]"
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-white/15 bg-background/60 px-6 py-5 backdrop-blur-xl">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/15">
                <Zap size={18} className="text-white" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <h2 className="font-display text-lg font-medium tracking-tighter text-white">Habit Builder · Le 4 Leggi</h2>
                <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/50">
                  Atomic Habits · James Clear · {month}
                </p>
              </div>
              <button onClick={close} className="-mr-1 p-2 text-white/30 hover:text-white transition-colors cursor-pointer" aria-label="Chiudi">
                <X size={18} />
              </button>
            </div>

            {/* Progress steps */}
            <div className="flex gap-2 px-6 pt-5">
              {laws.map((law, i) => (
                <div key={law.n} className="flex-1">
                  <div
                    className={`h-1 rounded-full transition-colors duration-300 ${
                      i <= step ? 'bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400' : 'bg-white/10'
                    }`}
                  />
                  <div
                    className={`mt-2 font-mono text-[9px] uppercase tracking-[0.15em] ${
                      i === step ? 'text-white' : 'text-white/35'
                    }`}
                  >
                    Legge {law.n}
                  </div>
                </div>
              ))}
            </div>

            <div className="px-6 py-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.25 }}
                >
                  {/* Step 0 — intro / cue */}
                  {step === 0 && (
                    <div className="space-y-5">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Eye size={18} className="text-white" aria-hidden="true" />
                          <h3 className="font-display text-xl font-medium tracking-tighter text-white">Rendila Ovvia</h3>
                        </div>
                        <p className="text-sm text-white/60 leading-relaxed">
                          Definisci con precisione <em>quando</em> e <em>dove</em> accadrà, e agganciala a un'abitudine
                          che già fai. Cue ovvii = nessuna decisione da prendere.
                        </p>
                      </div>
                      <div>
                        <label htmlFor="hb-name" className="mb-2 block text-xs font-medium text-white/60">Cosa farai?</label>
                        <input
                          id="hb-name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Es. Leggere 30 minuti"
                          className={inputCls}
                          autoFocus
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="hb-cueTime" className="mb-2 flex items-center gap-1.5 text-xs font-medium text-white/60">
                            <AlarmClock size={12} /> Alle
                          </label>
                          <input id="hb-cueTime" type="time" value={cueTime} onChange={(e) => setCueTime(e.target.value)} className={inputCls} />
                        </div>
                        <div>
                          <label htmlFor="hb-cueLocation" className="mb-2 flex items-center gap-1.5 text-xs font-medium text-white/60">
                            <MapPin size={12} /> In
                          </label>
                          <input
                            id="hb-cueLocation"
                            value={cueLocation}
                            onChange={(e) => setCueLocation(e.target.value)}
                            placeholder="Es. sul divano, in palestra..."
                            className={inputCls}
                          />
                        </div>
                      </div>
                      <div>
                        <label htmlFor="hb-stackAfter" className="mb-2 flex items-center gap-1.5 text-xs font-medium text-white/60">
                          <Link2 size={12} /> Habit stacking — Dopo
                        </label>
                        <select
                          id="hb-stackAfter"
                          value={stackAfter}
                          onChange={(e) => setStackAfter(e.target.value)}
                          className={`${inputCls} cursor-pointer`}
                        >
                          <option value="" className="text-black">Nessun trigger (autonoma)</option>
                          {existingHabits.map((h) => (
                            <option key={h._id} value={h.name} className="text-black">
                              {h.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="hb-targetDays" className="mb-2 block text-xs font-medium text-white/60">Frequenza settimanale</label>
                        <select
                          id="hb-targetDays"
                          value={targetDays}
                          onChange={(e) => setTargetDays(Number(e.target.value))}
                          className={`${inputCls} cursor-pointer`}
                        >
                          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
                            <option key={n} value={n} className="text-black">
                              {n} {n === 1 ? 'volta' : 'volte'} a settimana
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Step 1 — attractive / identity */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Brain size={18} className="text-white" aria-hidden="true" />
                          <h3 className="font-display text-xl font-medium tracking-tighter text-white">Rendila Attraente</h3>
                        </div>
                        <p className="text-sm text-white/60 leading-relaxed">
                          Ogni azione è un voto per la persona che vuoi diventare. Focalizzati sull'identità, non
                          sull'obiettivo.
                        </p>
                      </div>
                      <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                        <label
                          htmlFor="hb-identity"
                          className="block text-[10px] font-mono uppercase tracking-[0.15em] text-white/50 mb-2"
                        >
                          Sono il tipo di persona che...
                        </label>
                        <input
                          id="hb-identity"
                          value={identity}
                          onChange={(e) => setIdentity(e.target.value)}
                          placeholder='Es. legge ogni giorno'
                          className={inputCls}
                          autoFocus
                        />
                      </div>
                      <p className="text-xs text-white/40 italic">
                        Esempi: "sono uno scrittore" → scrivi ogni giorno · "sono uno sportivo" → ti alleni anche 10
                        minuti.
                      </p>
                    </div>
                  )}

                  {/* Step 2 — easy / two-minute */}
                  {step === 2 && (
                    <div className="space-y-5">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Zap size={18} className="text-white" aria-hidden="true" />
                          <h3 className="font-display text-xl font-medium tracking-tighter text-white">Rendila Facile</h3>
                        </div>
                        <p className="text-sm text-white/60 leading-relaxed">
                          La regola dei 2 minuti: quando non hai energia, fai <em>solo</em> la versione minima. La
                          costanza batte l'intensità.
                        </p>
                      </div>
                      <div>
                        <label htmlFor="hb-twoMinute" className="mb-2 block text-xs font-medium text-white/60">Versione 2 minuti</label>
                        <input
                          id="hb-twoMinute"
                          value={twoMinute}
                          onChange={(e) => {
                            setTwoMinute(e.target.value);
                            setTwoMinuteTouched(true);
                          }}
                          placeholder={suggestTwoMinute(name)}
                          className={inputCls}
                          autoFocus
                        />
                        <p className="mt-2 text-xs text-white/40 italic">
                          Suggerimento: {suggestTwoMinute(name)}
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Step 3 — satisfying / reward + preview */}
                  {step === 3 && (
                    <div className="space-y-5">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <Gift size={18} className="text-white" aria-hidden="true" />
                          <h3 className="font-display text-xl font-medium tracking-tighter text-white">Rendila Soddisfacente</h3>
                        </div>
                        <p className="text-sm text-white/60 leading-relaxed">
                          Una ricompensa immediata rende l'azione piacevole da ripetere. Il check-in sulla streak è già
                          una vittoria visiva.
                        </p>
                      </div>
                      <div>
                        <label htmlFor="hb-reward" className="mb-2 block text-xs font-medium text-white/60">Ricompensa immediata</label>
                        <input
                          id="hb-reward"
                          value={reward}
                          onChange={(e) => setReward(e.target.value)}
                          placeholder='Es. Un caffè speciale, 5 min di scroll, la soddisfazione della streak'
                          className={inputCls}
                          autoFocus
                        />
                      </div>

                      {/* Preview */}
                      <div className="rounded-2xl border border-white/15 bg-white/5 p-4">
                        <div className="mb-2 flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.15em] text-white/50">
                          <Eye size={11} /> Anteprima intenzione
                        </div>
                        <p className="text-sm text-white/80 leading-relaxed">
                          {name ? <span className="text-white font-medium">Farò {name}</span> : <span className="text-white/40">Farò [abitudine]</span>}
                          {intention && <span> {intention}</span>}
                          {identity && <span>, perché sono il tipo di persona che {identity}</span>}.
                          {twoMinute && <span className="text-white/50"> Se manca energia: {twoMinute}.</span>}
                          {reward && <span className="text-white/50"> Poi: {reward}.</span>}
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer nav */}
            <div className="sticky bottom-0 flex items-center justify-between gap-3 border-t border-white/15 bg-background/60 px-6 py-4 backdrop-blur-xl">
              {step > 0 ? (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-5 py-2.5 text-xs font-medium text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <ArrowLeft size={14} /> Indietro
                </button>
              ) : (
                <span />
              )}
              {step < 3 ? (
                <button
                  onClick={goNext}
                  disabled={!canNext}
                  className="flex items-center gap-1.5 rounded-full bg-white px-6 py-2.5 text-xs font-medium text-black hover:bg-white/85 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  Avanti <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  onClick={submit}
                  className="flex items-center gap-1.5 rounded-full bg-white px-6 py-2.5 text-xs font-medium text-black hover:bg-white/85 transition-colors cursor-pointer"
                >
                  <Check size={14} /> Crea Abitudine
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
