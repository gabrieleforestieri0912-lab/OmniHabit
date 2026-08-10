'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { ArrowLeft, LayoutGrid, Trophy, Zap, Target, CheckCircle2, Circle, Plus, Trash2, AlarmClock, Save, AlertTriangle, Sparkles } from 'lucide-react';
import { COLORS } from './constants';
import { getExpStats, getPieData, isNeverMissTwiceAtRisk, habitConsistency, daysSinceLastCheckin } from './utils';
import Chip from './Chip';
import { useToast } from './ToastContext';
import type { Habit, HabitsMap } from '../types';

interface MonthDashboardProps {
  selectedMonth: string | null;
  habits: HabitsMap;
  onBack: () => void;
  newHabit?: string;
  setNewHabit?: (value: string) => void;
  addHabit?: (e: React.FormEvent) => void;
  toggleHabit?: (month: string, id: string) => void;
  deleteHabit?: (month: string, id: string) => void;
  onUpdate?: (month: string, id: string, updates: Partial<Habit>) => void;
  onOpenBuilder: (month: string) => void;
}

interface HabitEditorProps {
  habit: Habit;
  month: string;
  onUpdate: (month: string, id: string, updates: Partial<Habit>) => void;
}

function HabitEditor({ habit, month, onUpdate }: HabitEditorProps) {
  const { showToast } = useToast();
  const [reminderTime, setReminderTime] = useState(habit.reminderTime || '');
  const [targetDays, setTargetDays] = useState(habit.targetDays || 1);
  const [cueTime, setCueTime] = useState(habit.cueTime || '');
  const [cueLocation, setCueLocation] = useState(habit.cueLocation || '');
  const [twoMinute, setTwoMinute] = useState(habit.twoMinute || '');

  const save = () => {
    onUpdate(month, habit._id, {
      reminderTime: reminderTime || null,
      targetDays,
      cueTime: cueTime || null,
      cueLocation: cueLocation || null,
      twoMinute: twoMinute || null
    });
    showToast('Dettagli atomic aggiornati', 'success');
  };

  const miniInput = 'bg-white/10 border border-white/15 rounded-lg px-2 py-1 text-xs font-medium text-white outline-none focus:border-white/50 placeholder:text-white/25';

  return (
    <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
      <div className="flex flex-wrap items-center gap-2">
        <AlarmClock size={12} className="text-white/40" />
        <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-white/40">Promemoria</span>
        <input
          type="time"
          value={reminderTime}
          onChange={(e) => setReminderTime(e.target.value)}
          className={miniInput}
          aria-label="Orario promemoria"
        />
        <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-white/40">Cue</span>
        <input
          type="time"
          value={cueTime}
          onChange={(e) => setCueTime(e.target.value)}
          className={miniInput}
          aria-label="Orario cue"
        />
        <select
          value={targetDays}
          onChange={(e) => setTargetDays(Number(e.target.value))}
          className="bg-white/10 border border-white/15 rounded-lg px-2 py-1 text-xs font-medium text-white outline-none focus:border-white/50 cursor-pointer"
          aria-label="Frequenza settimanale"
        >
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <option key={n} value={n} className="text-black">
              {n} {n === 1 ? 'volta' : 'volte'}/sett
            </option>
          ))}
        </select>
        <button
          onClick={save}
          className="flex items-center gap-1 px-2 py-1 rounded-full bg-white/10 text-white text-[10px] font-medium hover:bg-white/20 transition-colors cursor-pointer"
        >
          <Save size={11} /> Salva
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-white/40">Cue</span>
        <input
          value={cueLocation}
          onChange={(e) => setCueLocation(e.target.value)}
          placeholder="Luogo (es. in palestra)"
          className={miniInput}
          aria-label="Luogo cue"
        />
        <span className="text-[9px] font-mono uppercase tracking-[0.15em] text-white/40">2 min</span>
        <input
          value={twoMinute}
          onChange={(e) => setTwoMinute(e.target.value)}
          placeholder="Versione 2 minuti"
          className={`${miniInput} min-w-[160px] flex-1`}
          aria-label="Versione 2 minuti"
        />
      </div>
    </div>
  );
}

export default function MonthDashboard({
  selectedMonth,
  habits,
  onBack,
  newHabit,
  setNewHabit,
  addHabit,
  toggleHabit,
  deleteHabit,
  onUpdate,
  onOpenBuilder
}: MonthDashboardProps) {
  const monthHabits = selectedMonth ? (habits[selectedMonth] || []) : [];
  const expStats = getExpStats(monthHabits);

  // Recharts radii are px-only: fixed 80/120 would clip the pie on phones where
  // the card is narrower than 240px. Measure the container and scale down only
  // when needed (desktop keeps the original 80/120 look).
  const chartRef = useRef<HTMLDivElement>(null);
  const [pieRadius, setPieRadius] = useState({ inner: 80, outer: 120 });
  useEffect(() => {
    const el = chartRef.current;
    if (!el) return;
    const update = () => {
      const outer = Math.min(120, Math.floor((el.clientWidth - 24) / 2));
      setPieRadius({ inner: Math.min(80, Math.floor(outer * 0.66)), outer });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <motion.div
      key="dashboard-page"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      className="pt-32 pb-20 px-4 md:px-10 min-h-screen max-w-7xl mx-auto"
    >
      {/* Header Dashboard */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
        <div>
          <motion.button
            onClick={onBack}
            className="flex items-center gap-2 text-white/40 hover:text-white font-medium text-[10px] font-mono uppercase tracking-[0.15em] mb-5 transition-colors cursor-pointer"
            aria-label="Torna alla visione quadrimestri"
          >
            <ArrowLeft size={14} /> Torna ai Quadrimestri
          </motion.button>
          <div className="inline-flex border-l-2 border-white bg-white/15 px-3 py-1.5 backdrop-blur-md mb-5">
            <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white">
              Dashboard Mensile
            </span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium leading-[0.9] tracking-tighter text-white drop-shadow-lg">
            {selectedMonth} <span className="text-white/40">2026</span>
          </h2>
          <p className="text-white/40 font-mono uppercase tracking-[0.2em] text-[10px] mt-4">Analisi Biometrica & Evolutiva</p>
        </div>

        {/* EXP & Level System */}
        <div className="w-full md:w-auto bg-white/10 border border-white/15 backdrop-blur-md rounded-3xl p-8 md:p-10 flex flex-col items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-white/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${expStats.progress}%` }}
              className="h-full bg-white"
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-white/15 rounded-2xl flex items-center justify-center">
              <Trophy size={32} className="text-white" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-white/50 uppercase tracking-[0.15em] mb-1">Livello Attuale</div>
              <div className="text-4xl md:text-5xl font-normal tracking-tight">LVL {expStats.level}</div>
            </div>
          </div>
          <div className="w-full mt-4 flex justify-between text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">
            <span>EXP: {expStats.expInLevel}/10</span>
            <span>Prossimo Livello</span>
          </div>
        </div>
      </div>

      {/* Dashboard Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">

        {/* Pie Chart Analysis */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 relative overflow-hidden">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
              <Target size={20} className="text-white" />
            </div>
            <h3 className="font-display text-xl md:text-3xl font-medium tracking-tighter">Completamento Oggi</h3>
          </div>
          <div ref={chartRef} className="h-[300px] md:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getPieData(monthHabits)}
                  cx="50%"
                  cy="50%"
                  innerRadius={pieRadius.inner}
                  outerRadius={pieRadius.outer}
                  paddingAngle={10}
                  dataKey="value"
                  stroke="none"
                >
                  <Cell fill="#ffffff" />
                  <Cell fill="rgba(255,255,255,0.08)" />
                </Pie>
                <RechartsTooltip
                  contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '15px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'medium' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 sm:gap-x-10 gap-y-3 mt-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-white" />
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/50">Completati oggi</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-white/15" />
              <span className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/50">Da completare</span>
            </div>
          </div>
        </div>

        {/* Daily Strike & Quick Stats */}
        <div className="flex flex-col gap-8">
          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 flex-1 flex flex-col justify-center items-center text-center">
            <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6">
              <Zap size={40} className="text-white/80 animate-pulse" />
            </div>
            <div className="text-[10px] font-mono text-white/50 uppercase tracking-[0.15em] mb-2">Strike Totale Mensile</div>
            <div className="text-6xl md:text-8xl font-normal tracking-tight">
              {expStats.totalStreak}
            </div>
            <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.15em] mt-4">Azioni Persistenti</div>
          </div>

          <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-3xl p-8 md:p-12 flex-1">
            <h4 className="text-xs font-mono uppercase tracking-[0.15em] text-white/50 mb-6">Neuro-Feedback</h4>
            <p className="text-white/60 text-sm leading-relaxed">
              {expStats.totalStreak > 20
                ? "I tuoi percorsi neurali si stanno mielinizzando rapidamente. Continua a forzare il sistema."
                : "La resistenza cognitiva è normale in questa fase. La costanza atomica batterà lo sforzo iniziale."}
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Habit List in Dashboard */}
      <div className="mt-16">
        <h3 className="font-display text-2xl font-medium tracking-tighter mb-10 flex items-center gap-4">
          <LayoutGrid size={24} className="text-white/60" />
          Dettaglio Abitudini
        </h3>

        {addHabit && setNewHabit && selectedMonth && (
          <div className="mb-6 flex flex-col sm:flex-row gap-3 max-w-2xl">
            <form onSubmit={addHabit} className="flex flex-1 flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={newHabit || ''}
                onChange={(e) => setNewHabit(e.target.value)}
                placeholder="Nuovo obiettivo..."
                className="flex-1 rounded-xl border border-white/20 bg-white/10 px-4 py-3 outline-none focus:border-white/50 transition-all font-medium text-sm placeholder:text-white/30"
                aria-label="Testo nuovo obiettivo"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-medium text-black hover:bg-white/85 transition-colors duration-300 cursor-pointer"
                aria-label="Aggiungi obiettivo"
              >
                <Plus size={16} strokeWidth={3} />
              </button>
            </form>
            <button
              onClick={() => selectedMonth && onOpenBuilder(selectedMonth)}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 bg-white/15 px-6 py-3 text-xs font-medium text-white backdrop-blur-md hover:bg-white/20 transition-colors duration-300 cursor-pointer"
            >
              <Sparkles size={14} /> Crea con le 4 Leggi
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {monthHabits.map((habit) => {
            const consistency = habitConsistency(habit.completedDates);
            const daysMissed = daysSinceLastCheckin(habit.completedDates);
            return (
            <div key={habit._id} className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-6 min-w-0">
                  <button
                    onClick={() => toggleHabit && toggleHabit(selectedMonth || '', habit._id)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all cursor-pointer ${habit.completed ? 'bg-white text-black' : 'bg-white/5 hover:bg-white/15'}`}
                    aria-label={habit.completed ? 'Annulla check-in di oggi' : 'Segna come completato oggi'}
                  >
                    {habit.completed ? <CheckCircle2 size={24} strokeWidth={3} /> : <Circle size={24} className="text-white/20" />}
                  </button>
                  <div className="min-w-0">
                    <div className={`text-lg font-medium tracking-tight break-words ${habit.completed ? 'line-through text-white/40' : ''}`}>{habit.name}</div>
                    <div className="text-[10px] font-mono text-white/50 uppercase tracking-[0.15em]">Strike: {habit.streak} giorni</div>
                    {(habit.cueTime || habit.reminderTime) && (
                      <div className="mt-0.5 flex items-center gap-1 text-[9px] font-mono uppercase tracking-[0.15em] text-white/40">
                        <AlarmClock size={10} aria-hidden="true" />
                        {habit.cueTime || habit.reminderTime}
                      </div>
                    )}
                    {habit.completed && (
                      <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.15em]">Fatto oggi ✓</div>
                    )}
                  </div>
                </div>
                {deleteHabit && (
                  <button
                    onClick={() => deleteHabit(selectedMonth || '', habit._id)}
                    className="p-2.5 shrink-0 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors cursor-pointer"
                    aria-label="Elimina obiettivo"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              {/* Atomic Habits — never miss twice (Legge 4) */}
              {isNeverMissTwiceAtRisk(habit.completedDates) && (
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-500/10 px-3 py-2.5">
                  <div className="flex items-start gap-2 flex-1 min-w-0">
                    <AlertTriangle size={12} className="text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
                    <p className="text-[10px] leading-snug text-amber-200/90">
                      <span className="font-semibold text-amber-300">Mai mancare due volte.</span>{' '}
                      {daysMissed !== Infinity
                        ? `Ultimo check-in ${daysMissed} ${daysMissed === 1 ? 'giorno' : 'giorni'} fa. `
                        : ''}
                      La prima mancanza è un incidente, la seconda l'inizio di una nuova abitudine.
                      {habit.twoMinute && (
                        <>
                          {' '}Fai la versione 2 minuti: <em className="text-white/80">{habit.twoMinute}</em>
                        </>
                      )}
                    </p>
                  </div>
                  {toggleHabit && (
                    <button
                      onClick={() => toggleHabit(selectedMonth || '', habit._id)}
                      className="shrink-0 rounded-full border border-amber-400/40 bg-amber-400/20 px-3 py-1.5 text-[10px] font-medium text-amber-200 hover:bg-amber-400/30 transition-colors cursor-pointer"
                    >
                      Salva la streak ora
                    </button>
                  )}
                </div>
              )}

              {/* Atomic Habits — four laws chips */}
              {(habit.cueTime || habit.cueLocation || habit.stackAfter || habit.twoMinute || habit.reward || habit.identity) && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {(habit.cueTime || habit.cueLocation) && (
                    <Chip label={`🕐 ${[habit.cueTime, habit.cueLocation].filter(Boolean).join(' · ')}`} />
                  )}
                  {habit.stackAfter && <Chip label={`🔗 dopo ${habit.stackAfter}`} />}
                  {habit.twoMinute && <Chip label={`⚡ 2 min: ${habit.twoMinute}`} />}
                  {habit.reward && <Chip label={`🎁 ${habit.reward}`} />}
                  {habit.identity && <Chip label={`🧠 ${habit.identity}`} />}
                </div>
              )}

              {/* Atomic Habits — consistency (1% better) */}
              <div className="mt-3">
                <div className="mb-1 flex justify-between font-mono text-[9px] uppercase tracking-[0.15em] text-white/40">
                  <span>Coerenza · 1% better</span>
                  <span>{consistency}%</span>
                </div>
                <div className="h-1 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-amber-400"
                    style={{ width: `${consistency}%` }}
                  />
                </div>
              </div>

              {onUpdate && (
                <HabitEditor habit={habit} month={selectedMonth || ''} onUpdate={onUpdate} />
              )}
            </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
