'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Trophy, Target, CheckCircle2, Flame, Calendar, Award, Sparkles, Activity, Clock, LineChart, BookOpen, Bot } from 'lucide-react';
import { months } from './constants';
import { getGlobalStats, getWeeklyProgress, getMonthlyTrend, getUserLevel } from './utils';

export default function UserDashboard({ 
  habits, 
  onBack, 
  onPlanModalOpen,
  onChatOpen,
  onPlansOpen
}) {
  const stats = getGlobalStats(habits);
  const weeklyProgress = getWeeklyProgress(habits);
  const monthlyTrend = getMonthlyTrend(habits);
  const userLevel = getUserLevel(habits);

  const achievements = [
    { icon: Trophy, label: 'Primo Step', earned: stats.totalHabits >= 1, desc: 'Crea il tuo primo obiettivo' },
    { icon: Flame, label: 'On Fire', earned: stats.maxStreak >= 7, desc: '7 giorni di strike consecutivi' },
    { icon: Target, label: 'Precision', earned: stats.completionRate >= 50, desc: '50% di completamento' },
    { icon: Award, label: 'Master', earned: stats.totalStreak >= 50, desc: '50 giorni totali di strike' },
    { icon: Sparkles, label: 'Speed', earned: stats.completedHabits >= 10, desc: '10 obiettivi completati' },
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
            className="flex items-center gap-2 text-white/40 hover:text-purple-400 font-black uppercase italic tracking-widest text-[9px] mb-5 transition-colors cursor-pointer"
            aria-label="Torna alla Home"
          >
            <ArrowLeft size={12} /> Torna alla Home
          </motion.button>
          <h2 className="text-4xl md:text-6xl font-black uppercase italic tracking-tight leading-none">
            La Tua <span className="text-purple-500">Dashboard</span>
          </h2>
          <p className="text-white/20 font-black uppercase tracking-[0.3em] text-[8px] mt-3">Panoramica Completa</p>
        </div>

        {/* User Level Card */}
        <div className="w-full md:w-auto bg-white/3 border border-white/10 rounded-[32px] p-6 md:p-8 flex flex-col items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${stats.completionRate}%` }}
              className="h-full bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)]"
            />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 md:w-16 md:h-16 bg-linear-to-tr from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <Trophy size={24} className="text-white" />
            </div>
            <div>
              <div className="text-[8px] font-black text-purple-400 uppercase tracking-widest mb-0.5">Livello Attuale</div>
              <div className="text-3xl md:text-5xl font-black italic tracking-tight">LVL {userLevel}</div>
            </div>
          </div>
          <div className="w-full mt-3 flex justify-between text-[7px] font-black uppercase tracking-[0.2em] text-white/30">
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
          className="bg-white/3 border border-white/10 rounded-2xl p-5 flex flex-col items-center text-center"
        >
          <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center mb-3">
            <Target size={18} className="text-purple-400" />
          </div>
          <div className="text-2xl md:text-3xl font-black italic">{stats.totalHabits}</div>
          <div className="text-[7px] font-black text-white/30 uppercase tracking-widest mt-1">Obiettivi Totali</div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/3 border border-white/10 rounded-2xl p-5 flex flex-col items-center text-center"
        >
          <div className="w-10 h-10 bg-green-600/20 rounded-xl flex items-center justify-center mb-3">
            <CheckCircle2 size={18} className="text-green-400" />
          </div>
          <div className="text-2xl md:text-3xl font-black italic">{stats.completedHabits}</div>
          <div className="text-[7px] font-black text-white/30 uppercase tracking-widest mt-1">Completati</div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/3 border border-white/10 rounded-2xl p-5 flex flex-col items-center text-center"
        >
          <div className="w-10 h-10 bg-orange-600/20 rounded-xl flex items-center justify-center mb-3">
            <Flame size={18} className="text-orange-400" />
          </div>
          <div className="text-2xl md:text-3xl font-black italic">{stats.totalStreak}</div>
          <div className="text-[7px] font-black text-white/30 uppercase tracking-widest mt-1">Giorni di Strike</div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/3 border border-white/10 rounded-2xl p-5 flex flex-col items-center text-center"
        >
          <div className="w-10 h-10 bg-blue-600/20 rounded-xl flex items-center justify-center mb-3">
            <Activity size={18} className="text-blue-400" />
          </div>
          <div className="text-2xl md:text-3xl font-black italic">{stats.completionRate}%</div>
          <div className="text-[7px] font-black text-white/30 uppercase tracking-widest mt-1">Tasso Completamento</div>
        </motion.div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
        {/* Weekly Progress */}
        <div className="bg-white/2 border border-white/5 rounded-[32px] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center">
              <Clock size={18} className="text-purple-400" />
            </div>
            <h4 className="text-base font-black uppercase italic tracking-wider">Progresso Settimanale</h4>
          </div>
          <div className="h-[150px] flex items-end justify-between gap-1">
            {weeklyProgress.map((day, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max((day.completions / (day.max || 1)) * 100, 5)}px` }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-t-lg"
                />
                <span className="text-[7px] font-black text-white/30 uppercase">{day.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Trend */}
        <div className="bg-white/2 border border-white/5 rounded-[32px] p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-indigo-600/20 rounded-xl flex items-center justify-center">
              <LineChart size={18} className="text-indigo-400" />
            </div>
            <h4 className="text-base font-black uppercase italic tracking-wider">Tendenza Mensile</h4>
          </div>
          <div className="h-[150px] flex items-end justify-between gap-2 px-2">
            {monthlyTrend.map((month, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="relative w-full flex justify-center">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(month.rate / 100) * 130}px` }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className="w-6 md:w-10 bg-gradient-to-t from-indigo-600 to-indigo-400 rounded-t-lg relative"
                  >
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[8px] font-black text-indigo-400">{month.rate}%</span>
                  </motion.div>
                </div>
                <span className="text-[7px] font-black text-white/30 uppercase">{month.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Breakdown */}
      <div className="bg-white/2 border border-white/5 rounded-[40px] p-6 mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-green-600/20 rounded-xl flex items-center justify-center">
            <Calendar size={18} className="text-green-400" />
          </div>
          <h4 className="text-base font-black uppercase italic tracking-wider">Riepilogo Mensile</h4>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {months.map((month) => {
            const monthHabits = habits[month] || [];
            const completed = monthHabits.filter(h => h.completed).length;
            const total = monthHabits.length;
            const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
            return (
              <motion.div 
                key={month}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/5 border border-white/10 rounded-2xl p-5"
              >
                <div className="text-sm font-black uppercase italic mb-2">{month}</div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-xl font-black italic">{total}</div>
                    <div className="text-[7px] font-black text-white/30 uppercase">obiettivi</div>
                  </div>
                  <div className={`text-lg font-black ${rate >= 50 ? 'text-green-400' : 'text-orange-400'}`}>
                    {rate}%
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-white/2 border border-white/5 rounded-[40px] p-6 mb-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-yellow-600/20 rounded-xl flex items-center justify-center">
            <Award size={18} className="text-yellow-400" />
          </div>
          <h4 className="text-base font-black uppercase italic tracking-wider">Achievements Sbloccati</h4>
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
                  ? 'bg-yellow-500/10 border border-yellow-500/30' 
                  : 'bg-white/5 border border-white/5 opacity-30'
              }`}
            >
              <achievement.icon 
                size={24} 
                className={achievement.earned ? 'text-yellow-400 mb-2' : 'text-white/20 mb-2'} 
              />
              <span className="text-xs font-black uppercase tracking-wider mb-1">{achievement.label}</span>
              <span className="text-[7px] font-black text-white/30 uppercase">{achievement.desc}</span>
            </motion.div>
          ))}
        </div>
      </div>

       {/* Quick Actions */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <motion.button
           whileHover={{ scale: 1.02 }}
           whileTap={{ scale: 0.98 }}
           onClick={() => onPlanModalOpen(true)}
           className="bg-gradient-to-r from-purple-600 to-indigo-600 p-6 rounded-[32px] flex items-center gap-4 cursor-pointer"
         >
           <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
             <Sparkles size={24} className="text-white" />
           </div>
           <div className="text-left">
             <div className="text-base font-black uppercase italic tracking-wider mb-1">Genera Nuovo Piano</div>
             <div className="text-xs font-bold text-white/60">Lascia che l'AI crei un piano personalizzato per te</div>
           </div>
         </motion.button>

         <motion.button
           whileHover={{ scale: 1.02 }}
           whileTap={{ scale: 0.98 }}
           onClick={onPlansOpen}
           className="bg-white/5 border border-white/10 p-6 rounded-[32px] flex items-center gap-4 cursor-pointer hover:bg-white/10 transition-colors"
         >
           <div className="w-12 h-12 bg-blue-600/20 rounded-xl flex items-center justify-center">
             <BookOpen size={24} className="text-blue-400" />
           </div>
           <div className="text-left">
             <div className="text-base font-black uppercase italic tracking-wider mb-1">Piani Attivi</div>
             <div className="text-xs font-bold text-white/40">Visualizza e gestisci i tuoi piani di abitudini</div>
           </div>
         </motion.button>

         <motion.button
           whileHover={{ scale: 1.02 }}
           whileTap={{ scale: 0.98 }}
           onClick={onChatOpen}
           className="bg-white/5 border border-white/10 p-6 rounded-[32px] flex items-center gap-4 cursor-pointer hover:bg-white/10 transition-colors"
         >
           <div className="w-12 h-12 bg-purple-600/20 rounded-xl flex items-center justify-center">
             <Bot size={24} className="text-purple-400" />
           </div>
           <div className="text-left">
             <div className="text-base font-black uppercase italic tracking-wider mb-1">Chat con AI</div>
             <div className="text-xs font-bold text-white/40">Chiedi consigli all'assistente virtuale</div>
           </div>
         </motion.button>
       </div>
    </motion.div>
  );
}