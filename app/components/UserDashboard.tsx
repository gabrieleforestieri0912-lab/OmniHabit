'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Target, CheckCircle2, Flame, Calendar, Award, Sparkles, Activity, Clock, LineChart, BookOpen, Bot, Circle, type LucideIcon } from 'lucide-react';
import { getGlobalStats, getWeeklyProgress, getMonthlyTrend, getUserLevel, isHabitDoneToday, useOrderedMonths } from './utils';
import type { HabitsMap, User } from '../types';

interface UserDashboardProps {
  habits: HabitsMap;
  user: User | null;
  onBack: () => void;
  onPlanModalOpen: (open: boolean) => void;
  onChatOpen: () => void;
  onPlansOpen: () => void;
  onCheckin: (month: string, id: string) => void;
}

interface Achievement {
  icon: LucideIcon;
  label: string;
  earned: boolean;
  desc: string;
}

export default function UserDashboard({
  habits,
  user,
  onBack,
  onPlanModalOpen,
  onChatOpen,
  onPlansOpen,
  onCheckin
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

  return (
    <motion.div
      key="user-dashboard-page"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="pt-24 pb-16 px-4 md:px-8 min-h-screen max-w-7xl mx-auto"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
        <div>
          <motion.button 
            onClick={onBack}
            className="flex items-center gap-2 text-white/40 hover:text-white font-mono uppercase tracking-[0.15em] text-[10px] mb-5 transition-colors cursor-pointer"
            aria-label="Torna alla Home"
          >
            <ArrowLeft size={12} /> Torna alla Home
          </motion.button>
          <h2 className="text-4xl md:text-6xl font-normal leading-[1.05] tracking-tight">
            La Tua <span className="text-white/40">Dashboard</span>
          </h2>
          <p className="text-white/40 font-mono uppercase tracking-[0.2em] text-[10px] mt-3">Panoramica Completa</p>
          {user?.isPremium && (
            <span className="inline-flex items-center gap-1 mt-3 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white/80 text-[10px] font-mono uppercase tracking-[0.15em]">
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
              className="h-full bg-white"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-white/15 rounded-xl flex items-center justify-center">
              <Trophy size={24} className="text-white" />
            </div>
            <div>
              <div className="text-[10px] font-mono text-white/50 uppercase tracking-[0.15em] mb-0.5">Livello Attuale</div>
              <div className="text-3xl md:text-5xl font-normal tracking-tight">LVL {userLevel}</div>
            </div>
          </div>
          <div className="w-full mt-3 flex justify-between text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">
            <span>EXP: {stats.totalStreak % 10}/10</span>
            <span>Prossimo Livello</span>
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col items-center text-center backdrop-blur-md"
        >
          <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center mb-3">
            <Target size={18} className="text-white" />
          </div>
          <div className="text-2xl md:text-3xl font-medium tracking-tight">{stats.totalHabits}</div>
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.15em] mt-1">Obiettivi Totali</div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col items-center text-center backdrop-blur-md"
        >
          <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center mb-3">
            <CheckCircle2 size={18} className="text-white" />
          </div>
          <div className="text-2xl md:text-3xl font-medium tracking-tight">{stats.completedToday}</div>
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.15em] mt-1">Completati Oggi</div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col items-center text-center backdrop-blur-md"
        >
          <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center mb-3">
            <Flame size={18} className="text-white" />
          </div>
          <div className="text-2xl md:text-3xl font-medium tracking-tight">{stats.totalStreak}</div>
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.15em] mt-1">Giorni di Strike</div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-5 flex flex-col items-center text-center backdrop-blur-md"
        >
          <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center mb-3">
            <Activity size={18} className="text-white" />
          </div>
          <div className="text-2xl md:text-3xl font-medium tracking-tight">{stats.completionRate}%</div>
          <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.15em] mt-1">Tasso Completamento</div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Weekly Progress */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
              <Clock size={18} className="text-white" />
            </div>
            <h4 className="text-base font-medium tracking-tight">Progresso Settimanale</h4>
          </div>
          <div className="h-[150px] flex items-end justify-between gap-1">
            {weeklyProgress.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max((day.completions / (day.max || 1)) * 100, 5)}px` }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="w-full bg-gradient-to-t from-white/60 to-white rounded-t-lg"
                />
                <span className="text-[10px] font-mono text-white/40 uppercase">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
              <LineChart size={18} className="text-white" />
            </div>
            <h4 className="text-base font-medium tracking-tight">Tendenza Mensile</h4>
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
                    className="w-6 md:w-10 bg-gradient-to-t from-white/60 to-white rounded-t-lg relative"
                  >
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-mono text-white/50">{month.rate}%</span>
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
          <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
            <Calendar size={18} className="text-white" />
          </div>
          <h4 className="text-base font-medium tracking-tight">Riepilogo Mensile</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {orderedMonths.map((month) => {
            const isCurrent = currentMonthName != null && month === currentMonthName;
            const monthHabits = habits[month] || [];
            const completed = monthHabits.filter(h => h.completed).length;
            const total = monthHabits.length;
            const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
            return (
              <motion.div 
                key={month}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`relative bg-white/5 border rounded-2xl p-5 ${
                  isCurrent ? 'border-white/50 bg-white/10' : 'border-white/10'
                }`}
              >
                {isCurrent && (
                  <span className="absolute top-2.5 right-2.5 font-mono text-[9px] uppercase tracking-[0.15em] text-black bg-white rounded-full px-2 py-0.5 animate-pulse">
                    Ora
                  </span>
                )}
                <div className="text-sm font-medium tracking-tight mb-2">{month}</div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xl font-medium">{total}</div>
                    <div className="text-[10px] font-mono text-white/40 uppercase tracking-[0.15em]">obiettivi</div>
                  </div>
                  <div className={`text-lg font-medium ${rate >= 50 ? 'text-white' : 'text-white/40'}`}>
                    {rate}%
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-10 backdrop-blur-md">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
            <Award size={18} className="text-white" />
          </div>
          <h4 className="text-base font-medium tracking-tight">Achievements Sbloccati</h4>
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
                  ? 'bg-white/15 border border-white/30' 
                  : 'bg-white/5 border border-white/10 opacity-30'
              }`}
            >
              <achievement.icon 
                size={24} 
                className={achievement.earned ? 'text-white mb-2' : 'text-white/40 mb-2'} 
              />
              <span className="text-xs font-medium tracking-wide mb-1">{achievement.label}</span>
              <span className="text-[10px] font-mono text-white/40 uppercase tracking-[0.15em]">{achievement.desc}</span>
            </motion.div>
          ))}
        </div>
      </div>

       {/* Il tuo Oggi */}
       <div className="bg-white/5 border border-white/10 rounded-3xl p-6 mb-10 backdrop-blur-md">
         <div className="flex items-center gap-3 mb-6">
           <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
             <Calendar size={18} className="text-white" />
           </div>
           <h4 className="text-base font-medium tracking-tight">Il tuo Oggi</h4>
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
                 className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/15 transition-colors cursor-pointer text-left"
               >
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
                     <Circle size={14} className="text-white/40" />
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
           className="bg-white p-6 rounded-3xl flex items-center gap-4 cursor-pointer hover:bg-white/90 transition-colors"
         >
           <div className="w-12 h-12 bg-black/10 rounded-xl flex items-center justify-center">
             <Sparkles size={24} className="text-black" />
           </div>
           <div className="text-left">
             <div className="text-base font-medium tracking-tight text-black mb-1">Genera Nuovo Piano</div>
             <div className="text-xs text-black/60">Lascia che l'AI crei un piano personalizzato per te</div>
           </div>
         </motion.button>

         <motion.button
           whileHover={{ scale: 1.02 }}
           whileTap={{ scale: 0.98 }}
           onClick={onPlansOpen}
           className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center gap-4 cursor-pointer hover:bg-white/10 transition-colors"
         >
           <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center">
             <BookOpen size={24} className="text-white" />
           </div>
           <div className="text-left">
             <div className="text-base font-medium tracking-tight mb-1">Piani Attivi</div>
             <div className="text-xs text-white/40">Visualizza e gestisci i tuoi piani di abitudini</div>
           </div>
         </motion.button>

         <motion.button
           whileHover={{ scale: 1.02 }}
           whileTap={{ scale: 0.98 }}
           onClick={onChatOpen}
           className="bg-white/5 border border-white/10 p-6 rounded-3xl flex items-center gap-4 cursor-pointer hover:bg-white/10 transition-colors"
         >
           <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center">
             <Bot size={24} className="text-white" />
           </div>
           <div className="text-left">
             <div className="text-base font-medium tracking-tight mb-1">Chat con AI</div>
             <div className="text-xs text-white/40">Chiedi consigli all'assistente virtuale</div>
           </div>
         </motion.button>
       </div>
    </motion.div>
  );
}