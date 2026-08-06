'use client';

import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import { ArrowLeft, LayoutGrid, Trophy, Zap, Target, CheckCircle2, Circle, Plus, Calendar } from 'lucide-react';
import { COLORS } from './constants';
import { getExpStats } from './utils';

export default function MonthDashboard({ 
  selectedMonth, 
  habits, 
  onBack,
  _newHabit,
  _setNewHabit,
  _addHabit,
  _toggleHabit
}) {
  const monthHabits = habits[selectedMonth] || [];
  
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
            className="flex items-center gap-2 text-white/40 hover:text-purple-400 font-black uppercase italic tracking-widest text-[10px] mb-6 transition-colors cursor-pointer"
            aria-label="Torna alla visione quadrimestri"
          >
            <ArrowLeft size={14} /> Torna ai Quadrimestri
          </motion.button>
          <h2 className="text-5xl md:text-8xl font-black uppercase italic tracking-tighter leading-none">
            {selectedMonth} <span className="text-purple-500">2026</span>
          </h2>
          <p className="text-white/20 font-black uppercase tracking-[0.4em] text-[10px] mt-4">Analisi Biometrica & Evolutiva</p>
        </div>

        {/* EXP & Level System */}
        <div className="w-full md:w-auto bg-white/3 border border-white/10 rounded-[40px] p-8 md:p-10 flex flex-col items-center gap-4 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-white/5">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${getExpStats(monthHabits).progress}%` }}
              className="h-full bg-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)]"
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-linear-to-tr from-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-purple-500/30">
              <Trophy size={32} className="text-white" />
            </div>
            <div>
              <div className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">Livello Attuale</div>
              <div className="text-4xl md:text-6xl font-black italic tracking-tighter">LVL {getExpStats(monthHabits).level}</div>
            </div>
          </div>
          <div className="w-full mt-4 flex justify-between text-[8px] font-black uppercase tracking-widest text-white/30">
            <span>EXP: {getExpStats(monthHabits).expInLevel}/10</span>
            <span>Prossimo Livello</span>
          </div>
        </div>
      </div>

      {/* Dashboard Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-10">
        
        {/* Pie Chart Analysis */}
        <div className="lg:col-span-2 bg-white/2 border border-white/5 rounded-[50px] p-8 md:p-12 relative overflow-hidden">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center">
              <Target size={20} className="text-purple-400" />
            </div>
            <h3 className="text-xl md:text-3xl font-black uppercase italic tracking-tighter">Completamento Obiettivi</h3>
          </div>
          <div className="h-[300px] md:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={getExpStats(monthHabits) ? [
                    { name: 'Completati', value: monthHabits.filter(h => h.completed).length },
                    { name: 'Rimanenti', value: monthHabits.filter(h => !h.completed).length }
                  ] : []}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={120}
                  paddingAngle={10}
                  dataKey="value"
                  stroke="none"
                >
                  {monthHabits.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip 
                  contentStyle={{ backgroundColor: '#000', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px' }}
                  itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold', textTransform: 'uppercase' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-10 mt-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-purple-600" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Completati</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-white/10" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Rimanenti</span>
            </div>
          </div>
        </div>

        {/* Daily Strike & Quick Stats */}
        <div className="flex flex-col gap-8">
          <div className="bg-white/2 border border-white/5 rounded-[40px] p-8 md:p-12 flex-1 flex flex-col justify-center items-center text-center">
            <div className="w-20 h-20 bg-purple-600/10 rounded-full flex items-center justify-center mb-6">
              <Zap size={40} className="text-purple-500 animate-pulse" />
            </div>
            <div className="text-[10px] font-black text-purple-400 uppercase tracking-[0.3em] mb-2">Strike Totale Mensile</div>
            <div className="text-6xl md:text-8xl font-black italic tracking-tighter">
              {getExpStats(monthHabits).totalStreak}
            </div>
            <div className="text-[10px] font-black text-white/20 uppercase tracking-widest mt-4">Azioni Persistenti</div>
          </div>

          <div className="bg-linear-to-br from-purple-900/20 to-indigo-900/20 border border-purple-500/20 rounded-[40px] p-8 md:p-12 flex-1">
            <h4 className="text-xs font-black uppercase tracking-widest text-purple-400 mb-6 italic">Neuro-Feedback</h4>
            <p className="text-white/40 text-sm leading-relaxed italic font-bold">
              {getExpStats(monthHabits).totalStreak > 20 
                ? "I tuoi percorsi neurali si stanno mielinizzando rapidamente. Continua a forzare il sistema."
                : "La resistenza cognitiva è normale in questa fase. La costanza atomica batterà lo sforzo iniziale."}
            </p>
          </div>
        </div>
      </div>

      {/* Monthly Habit List in Dashboard */}
      <div className="mt-16">
        <h3 className="text-2xl font-black uppercase italic tracking-tighter mb-10 flex items-center gap-4">
          <LayoutGrid size={24} className="text-purple-500" />
          Dettaglio Abitudini
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {monthHabits.map((habit) => (
            <div key={habit._id} className="bg-white/3 border border-white/10 rounded-3xl p-6 flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${habit.completed ? 'bg-green-500 text-black' : 'bg-white/5'}`}>
                  {habit.completed ? <CheckCircle2 size={24} strokeWidth={3} /> : <Circle size={24} className="text-white/10" />}
                </div>
                <div>
                  <div className="text-lg font-black italic uppercase">{habit.name}</div>
                  <div className="text-[10px] font-black text-purple-400 uppercase tracking-widest">Strike: {habit.streak} giorni</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}