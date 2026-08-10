'use client';

import { motion } from 'framer-motion';
import { Trophy, Target, CheckCircle2, Flame, Calendar, Award, Sparkles, Activity, Clock, LineChart, BookOpen, Bot, Circle, ChevronRight, type LucideIcon } from 'lucide-react';
import ScrollVideo from './ScrollVideo';
import { getGlobalStats, getWeeklyProgress, getMonthlyTrend, getUserLevel, isHabitDoneToday, useOrderedMonths } from './utils';
import type { HabitsMap, User } from '../types';

interface UserDashboardProps {
  habits: HabitsMap;
  user: User | null;
  onPlanModalOpen: (open: boolean) => void;
  onChatOpen: () => void;
  onPlansOpen: () => void;
  onCheckin: (month: string, id: string) => void;
  onOpenMonth: (month: string) => void;
}

interface Achievement {
  icon: LucideIcon;
  label: string;
  earned: boolean;
  desc: string;
}

// Palette brand OmniHabit: indigo → viola → ambra (+ accenti emerald/rose)
const achievementGradients = [
  'from-indigo-500 to-purple-600',
  'from-purple-500 to-fuchsia-600',
  'from-amber-400 to-orange-500',
  'from-emerald-500 to-teal-600',
  'from-rose-500 to-pink-600',
  'from-cyan-400 to-sky-600',
  'from-violet-500 to-indigo-600',
  'from-amber-500 to-rose-600'
];

export default function UserDashboard({
  habits,
  user,
  onPlanModalOpen,
  onChatOpen,
  onPlansOpen,
  onCheckin,
  onOpenMonth
}: UserDashboardProps) {
  const stats = getGlobalStats(habits);
  const weeklyProgress = getWeeklyProgress(habits);
  const userLevel = getUserLevel(habits);
  const { orderedMonths, currentMonthName, currentMonthIndex } = useOrderedMonths();
  const monthlyTrend = getMonthlyTrend(habits, currentMonthIndex);

  const todayPending = Object.values(habits).flat().filter((h) => !isHabitDoneToday(h));

  const achievements: Achievement[] = [
    { icon: Trophy, label: 'Primo Step', earned: stats.totalHabits >= 1, desc: 'Crea il tuo primo obiettivo' },
    { icon: Flame, label: 'On Fire', earned: stats.maxStreak >= 7, desc: '7 giorni di strike consecutivi' },
    { icon: Target, label: 'Precision', earned: stats.completionRate >= 50, desc: '50% di completamento' },
    { icon: Award, label: 'Master', earned: stats.totalStreak >= 50, desc: '50 giorni totali di strike' },
    { icon: Sparkles, label: 'Speed', earned: stats.completedToday >= 10, desc: '10 obiettivi completati' },
    { icon: Trophy, label: 'Growth', earned: stats.totalStreak >= 30, desc: '30 giorni totali di strike' },
    { icon: Trophy, label: 'Expert', earned: stats.completionRate >= 80, desc: '80% di completamento' },
    { icon: Trophy, label: 'Legend', earned: stats.totalStreak >= 100, desc: '100 giorni totali di strike' }
  ];

  const statCards = [
    {
      icon: Target,
      label: 'Obiettivi Totali',
      value: stats.totalHabits,
      grad: 'from-indigo-500 to-indigo-700',
      hairline: 'bg-gradient-to-r from-indigo-500 to-purple-500'
    },
    {
      icon: CheckCircle2,
      label: 'Completati Oggi',
      value: stats.completedToday,
      grad: 'from-emerald-500 to-teal-600',
      hairline: 'bg-gradient-to-r from-emerald-500 to-teal-500'
    },
    {
      icon: Flame,
      label: 'Giorni di Strike',
      value: stats.totalStreak,
      grad: 'from-rose-500 to-amber-500',
      hairline: 'bg-gradient-to-r from-rose-500 to-amber-400'
    },
    {
      icon: Activity,
      label: 'Tasso Completamento',
      value: `${stats.completionRate}%`,
      grad: 'from-purple-500 to-fuchsia-600',
      hairline: 'bg-gradient-to-r from-purple-500 to-fuchsia-500'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="relative min-h-screen overflow-hidden bg-background"
    >
      {/* Stesso video della landing come sfondo */}
      <ScrollVideo />

      <div className="relative z-10 px-3 sm:px-6 lg:px-10 pt-28 pb-16">
        <div className="mx-auto max-w-7xl rounded-3xl border border-white/10 bg-background/40 p-5 sm:p-8 md:p-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_60px_-20px_rgba(0,0,0,0.8)] backdrop-blur-xl">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
            <div>
              <div className="inline-flex border-l-2 border-white bg-white/15 px-3 py-1.5 backdrop-blur-md mb-5">
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white">
                  Panoramica Completa
                </span>
              </div>
              <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium leading-[0.9] tracking-tighter text-white drop-shadow-lg">
                La Tua{' '}
                <span
                  className="bg-clip-text text-transparent"
                  style={{ backgroundImage: 'linear-gradient(to left, #6366f1, #a855f7, #fcd34d)' }}
                >
                  Dashboard
                </span>
              </h2>
              <p className="text-white/40 font-mono uppercase tracking-[0.2em] text-[10px] mt-4">Il tuo sistema di evoluzione personale</p>
              {user?.isPremium && (
                <span className="inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400/20 to-orange-500/20 border border-amber-400/40 text-amber-200 text-[10px] font-mono uppercase tracking-[0.15em]">
                  <Award size={12} /> Premium Attivo
                </span>
              )}
            </div>

            {/* User Level Card */}
            <div className="w-full md:w-auto bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 flex flex-col items-center gap-4 relative overflow-hidden backdrop-blur-md">
              <div className="absolute top-0 left-0 w-full h-0.5 bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.completionRate}%` }}
                  className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400"
                />
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30">
                  <Trophy size={24} className="text-white" />
                </div>
                <div>
                  <div className="text-[10px] font-mono text-white/50 uppercase tracking-[0.15em] mb-0.5">Livello Attuale</div>
                  <div className="text-3xl md:text-5xl font-normal tracking-tight">
                    <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(to right, #a5b4fc, #fcd34d)' }}>
                      LVL {userLevel}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-full mt-3 flex justify-between text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">
                <span className="text-amber-200/80">EXP: {stats.totalStreak % 10}/10</span>
                <span>Prossimo Livello</span>
              </div>
            </div>
          </div>

          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-10">
            {statCards.map((card, i) => (
              <motion.div
                key={card.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col items-center text-center overflow-hidden backdrop-blur-md"
              >
                <div className={`absolute top-0 left-0 h-0.5 w-full ${card.hairline}`} aria-hidden="true" />
                <div className={`w-10 h-10 bg-gradient-to-br ${card.grad} rounded-xl flex items-center justify-center mb-3 shadow-lg`}>
                  <card.icon size={18} className="text-white" />
                </div>
                <div className="text-2xl md:text-3xl font-medium tracking-tight">{card.value}</div>
                <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.15em] mt-1">{card.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
            {/* Weekly Progress */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/25">
                  <Clock size={18} className="text-white" />
                </div>
                <h4 className="font-display text-base font-medium tracking-tighter">Progresso Settimanale</h4>
              </div>
              <div className="h-[150px] flex items-end justify-between gap-1">
                {weeklyProgress.map((day, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${Math.max((day.completions / (day.max || 1)) * 100, 5)}px` }}
                      transition={{ delay: i * 0.1, duration: 0.5 }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-indigo-500 via-purple-500 to-amber-400 shadow-lg shadow-purple-500/20"
                    />
                    <span className="text-[10px] font-mono text-white/40 uppercase">{day.day}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Trend */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/25">
                  <LineChart size={18} className="text-white" />
                </div>
                <h4 className="font-display text-base font-medium tracking-tighter">Tendenza Mensile</h4>
              </div>
              <div className="h-[150px] flex items-end justify-between gap-2 px-2">
                {monthlyTrend.map((month, i) => (
                  <div key={i} className="group relative flex-1 flex flex-col items-center gap-1.5">
                    {/* Zona hover estesa sopra la barra: evita che il tooltip scompaia quando il mouse sale su di esso */}
                    <div className="hidden sm:block absolute -top-18 left-0 right-0 h-18" aria-hidden="true" />

                    {/* Tooltip glass */}
                    <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden -translate-x-1/2 translate-y-1 whitespace-nowrap rounded-lg border border-white/15 bg-background/90 px-3 py-2 text-center opacity-0 shadow-xl backdrop-blur-md transition-all duration-200 sm:block group-hover:translate-y-0 group-hover:opacity-100 group-first:left-0 group-first:translate-x-0 group-last:left-auto group-last:right-0 group-last:translate-x-0">
                      <div className="text-xs font-medium text-white">{month.fullMonth}</div>
                      <div className="mt-1 flex flex-col gap-0.5 font-mono text-[9px] uppercase tracking-[0.15em] text-white/60">
                        <span>{month.checkins} check-in</span>
                        <span>{month.days} giorni</span>
                      </div>
                    </div>

                    <div className="relative w-full flex justify-center">
                      <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: `${(month.rate / 100) * 130}px` }}
                        transition={{ delay: i * 0.1, duration: 0.5 }}
                        className="w-6 md:w-10 rounded-t-lg bg-gradient-to-t from-indigo-500 via-purple-500 to-amber-400 shadow-lg shadow-purple-500/20 relative"
                      >
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-amber-200/90">{month.rate}%</span>
                      </motion.div>
                    </div>
                    <span className="text-[10px] font-mono text-white/40 uppercase">{month.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Monthly Breakdown */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                <Calendar size={18} className="text-white" />
              </div>
              <h4 className="font-display text-base font-medium tracking-tighter">Riepilogo Mensile</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {orderedMonths.map((month) => {
                const isCurrent = currentMonthName != null && month === currentMonthName;
                const monthHabits = habits[month] || [];
                const completed = monthHabits.filter(h => h.completed).length;
                const total = monthHabits.length;
                const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
                return (
                  <motion.button
                    key={month}
                    type="button"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onOpenMonth(month)}
                    className={`group relative border rounded-2xl p-5 text-left cursor-pointer transition-all duration-300 ${
                      isCurrent
                        ? 'border-amber-400/40 bg-gradient-to-br from-indigo-500/20 via-purple-500/10 to-amber-400/15 hover:border-amber-400/60'
                        : 'bg-white/5 border-white/10 hover:border-white/30 hover:bg-white/10'
                    }`}
                    aria-label={`Apri dashboard per ${month}`}
                  >
                    {isCurrent && (
                      <span className="absolute top-2.5 right-2.5 font-mono text-[9px] uppercase tracking-[0.15em] text-black bg-gradient-to-r from-amber-400 to-orange-400 rounded-full px-2 py-0.5 animate-pulse">
                        Ora
                      </span>
                    )}
                    <div className={`text-sm font-medium tracking-tight mb-2 ${isCurrent ? 'text-white' : 'text-white/80'}`}>{month}</div>
                    <div className="flex justify-between items-end">
                      <div>
                        <div className="text-xl font-medium">{total}</div>
                        <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.15em]">obiettivi</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className={`text-lg font-medium ${rate >= 50 ? 'text-amber-200' : 'text-white/40'}`}>
                          {rate}%
                        </div>
                        <ChevronRight size={16} className="text-white/30 shrink-0 transition-all duration-300 group-hover:text-amber-200 group-hover:translate-x-0.5" aria-hidden="true" />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Achievements */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
                <Award size={18} className="text-white" />
              </div>
              <h4 className="font-display text-base font-medium tracking-tighter">Achievements Sbloccati</h4>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {achievements.map((achievement, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`p-5 rounded-2xl flex flex-col items-center text-center transition-all ${
                    achievement.earned
                      ? `border bg-gradient-to-br ${achievementGradients[i % achievementGradients.length]} shadow-lg`
                      : 'bg-white/5 border border-white/10 opacity-30'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2 ${
                    achievement.earned ? 'bg-white/20' : 'bg-white/5'
                  }`}>
                    <achievement.icon size={22} className={achievement.earned ? 'text-white' : 'text-white/40'} />
                  </div>
                  <span className={`text-xs font-medium tracking-wide mb-1 ${achievement.earned ? 'text-white' : 'text-white/60'}`}>
                    {achievement.label}
                  </span>
                  <span className="text-[10px] font-mono text-white/70 uppercase tracking-[0.15em]">{achievement.desc}</span>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Il tuo Oggi */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-rose-500/25">
                <Calendar size={18} className="text-white" />
              </div>
              <h4 className="font-display text-base font-medium tracking-tighter">Il tuo Oggi</h4>
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.15em]">Da completare: {todayPending.length}</span>
            </div>
            {todayPending.length === 0 ? (
              <p className="text-white/60 text-sm">Tutte le abitudini completate oggi. Perfetto!</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {todayPending.slice(0, 12).map((habit) => (
                  <motion.button
                    key={habit._id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => onCheckin(habit.month, habit._id)}
                    className="group flex items-center justify-between gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-amber-400/40 transition-colors cursor-pointer text-left"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center transition-colors duration-300 group-hover:border-amber-400/60">
                        <Circle size={14} className="text-white/40 transition-colors duration-300 group-hover:text-amber-300" />
                      </div>
                      <div>
                        <div className="text-sm font-medium tracking-tight">{habit.name}</div>
                        <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.15em]">{habit.month}</div>
                      </div>
                    </div>
                    {habit.reminderTime && (
                      <span className="text-[10px] font-mono text-white/50 uppercase tracking-[0.15em]">{habit.reminderTime}</span>
                    )}
                  </motion.button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPlanModalOpen(true)}
              className="group bg-white p-6 rounded-3xl flex items-center gap-4 cursor-pointer hover:bg-white/90 transition-colors text-left"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/30">
                <Sparkles size={24} className="text-white" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className="font-display text-base font-medium tracking-tighter text-black mb-1">Genera Nuovo Piano</div>
                <div className="text-xs text-black/60">Lascia che l'AI crei un piano personalizzato per te</div>
              </div>
              <ChevronRight size={20} className="text-black/30 shrink-0 transition-all duration-300 group-hover:text-black group-hover:translate-x-0.5" aria-hidden="true" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onPlansOpen}
              className="group bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center gap-4 cursor-pointer hover:bg-white/10 transition-colors text-left"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-indigo-500/25">
                <BookOpen size={24} className="text-white" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className="font-display text-base font-medium tracking-tighter mb-1">Piani Attivi</div>
                <div className="text-xs text-white/40">Visualizza e gestisci i tuoi piani di abitudini</div>
              </div>
              <ChevronRight size={20} className="text-white/30 shrink-0 transition-all duration-300 group-hover:text-white group-hover:translate-x-0.5" aria-hidden="true" />
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onChatOpen}
              className="group bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center gap-4 cursor-pointer hover:bg-white/10 transition-colors text-left"
            >
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-fuchsia-600 rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/25">
                <Bot size={24} className="text-white" />
              </div>
              <div className="text-left flex-1 min-w-0">
                <div className="font-display text-base font-medium tracking-tighter mb-1">Chat con AI</div>
                <div className="text-xs text-white/40">Chiedi consigli all'assistente virtuale</div>
              </div>
              <ChevronRight size={20} className="text-white/30 shrink-0 transition-all duration-300 group-hover:text-white group-hover:translate-x-0.5" aria-hidden="true" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
