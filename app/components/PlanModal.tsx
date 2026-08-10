'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Loader2, Check, Save, BookOpen } from 'lucide-react';
import { API_URL } from './constants';
import Chip from './Chip';
import type { User, AuthMode, GeneratedPlan } from '../types';

interface PlanModalProps {
  planModalOpen: boolean;
  setPlanModalOpen: (open: boolean) => void;
  planPrompt: string;
  setPlanPrompt: (value: string) => void;
  generatedPlan: GeneratedPlan | null;
  setGeneratedPlan: (plan: GeneratedPlan | null) => void;
  planLoading: boolean;
  generatePlan: (e: React.FormEvent) => void;
  user: User | null;
  onAuthClick: (mode: AuthMode) => void;
  onPlanApplied?: () => void;
  planStyle: string;
  setPlanStyle: (value: string) => void;
  targetHabitCount: number;
  setTargetHabitCount: (value: number) => void;
}

export default function PlanModal({
  planModalOpen,
  setPlanModalOpen,
  planPrompt,
  setPlanPrompt,
  generatedPlan,
  setGeneratedPlan,
  planLoading,
  generatePlan,
  user,
  onAuthClick,
  onPlanApplied,
  planStyle,
  setPlanStyle,
  targetHabitCount,
  setTargetHabitCount
}: PlanModalProps) {
  const [saving, setSaving] = useState(false);
  const [applying, setApplying] = useState(false);
  const [savedPlanId, setSavedPlanId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const savePlan = async () => {
    if (!generatedPlan) return;
    
    setSaving(true);
    setMessage(null);
    
    try {
      const token = localStorage.getItem('omni_token');
      const res = await fetch(`${API_URL}/plans`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title: `Piano: ${planPrompt.slice(0, 30)}...`,
          description: generatedPlan.summary,
          planData: generatedPlan
        })
      });

      const data = await res.json();
      
      if (res.ok) {
        setSavedPlanId(data._id);
        setMessage('Piano salvato con successo!');
      } else {
        setMessage(data.error || 'Errore nel salvare il piano');
      }
    } catch (error) {
      console.error('Save plan error:', error);
      setMessage('Errore di connessione');
    } finally {
      setSaving(false);
    }
  };

  const applyPlan = async () => {
    if (!savedPlanId) {
      // If not saved yet, save first then apply
      await savePlan();
    }
    
    setApplying(true);
    setMessage(null);
    
    try {
      const token = localStorage.getItem('omni_token');
      const res = await fetch(`${API_URL}/plans/${savedPlanId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();
      
      if (res.ok) {
        setMessage(`Piano applicato! ${data.habitsCreated} abitudini create.`);
        if (onPlanApplied) onPlanApplied();
        // Close modal after delay
        setTimeout(() => {
          setPlanModalOpen(false);
          setGeneratedPlan(null);
          setPlanPrompt('');
          setSavedPlanId(null);
        }, 1500);
      } else {
        setMessage(data.error || 'Errore nell\'applicare il piano');
      }
    } catch (error) {
      console.error('Apply plan error:', error);
      setMessage('Errore di connessione');
    } finally {
      setApplying(false);
    }
  };

  const closeModal = () => {
    setPlanModalOpen(false);
    setGeneratedPlan(null);
    setPlanPrompt('');
    setSavedPlanId(null);
    setMessage(null);
  };

  return (
    <AnimatePresence>
      {planModalOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 bg-black/80 backdrop-blur-2xl flex items-center justify-center p-3"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white/5 border border-white/15 backdrop-blur-2xl rounded-[28px] max-w-xl w-full max-h-[70vh] relative flex flex-col shadow-xl"
          >
            <button onClick={closeModal} className="absolute top-5 right-5 text-white/30 hover:text-white cursor-pointer z-10" aria-label="Chiudi"><X size={16} /></button>
            
            <div className="p-5 border-b border-white/15 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/15 rounded-lg flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-medium tracking-tight">Generatore Piani</h2>
                <p className="text-[10px] font-mono text-white/50 uppercase tracking-[0.15em]">AI Habit Planner • OmniMind</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {!generatedPlan ? (
                <form onSubmit={generatePlan} className="space-y-4">
                  <div>
                    <label className="text-xs font-medium text-white/60 block mb-2">Descrivi i tuoi obiettivi</label>
                    <textarea
                      value={planPrompt}
                      onChange={(e) => setPlanPrompt(e.target.value)}
                      placeholder="Es: Voglio migliorare la mia produttività, dormire meglio, leggere di più, fare esercizio fisico regolarmente..."
                      className="w-full bg-white/10 border border-white/15 rounded-2xl px-5 py-4 outline-none focus:border-white/50 transition-colors font-medium text-sm h-32 resize-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium text-white/60 block mb-2">Stile</label>
                      <select
                        value={planStyle}
                        onChange={(e) => setPlanStyle(e.target.value)}
                        className="w-full bg-white/10 border border-white/15 rounded-2xl px-4 py-3 outline-none focus:border-white/50 transition-colors text-sm font-medium cursor-pointer"
                      >
                        <option value="balanced" className="text-black">Equilibrato</option>
                        <option value="intense" className="text-black">Intenso</option>
                        <option value="gentle" className="text-black">Morbido</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-white/60 block mb-2">
                        Abitudini totali: {targetHabitCount}
                      </label>
                      <input
                        type="range"
                        min={3}
                        max={12}
                        value={targetHabitCount}
                        onChange={(e) => setTargetHabitCount(Number(e.target.value))}
                        className="w-full mt-3 accent-white cursor-pointer"
                      />
                    </div>
                  </div>
                  <button 
                    type="submit" 
                    disabled={planLoading || !planPrompt.trim()}
                    className="w-full rounded-full bg-white text-black py-4 font-medium hover:bg-white/85 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {planLoading ? <><Loader2 size={16} className="animate-spin" /> Generazione in corso...</> : <><Sparkles size={16} /> Genera Piano Personalizzato</>}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="bg-white/10 border border-white/15 rounded-2xl p-5">
                    <p className="text-sm text-white/70">{generatedPlan.summary}</p>
                  </div>
                  
                  {message && (
                    <div className={`p-3 rounded-xl text-sm font-medium ${message.includes('errore') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                      {message}
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    {generatedPlan.plan.map((monthPlan, i) => (
                      <motion.div 
                        key={monthPlan.month}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/5 border border-white/10 rounded-2xl p-5"
                      >
                        <h4 className="text-base font-medium tracking-tight text-white/80 mb-3">{monthPlan.month}</h4>
                        <ul className="space-y-2">
                          {monthPlan.habits.map((habit, j) => {
                            const name = typeof habit === 'string' ? habit : habit.name;
                            const atomic = typeof habit === 'string' ? null : habit;
                            const cue = atomic?.cueTime
                              ? `${atomic.cueTime}${atomic.cueLocation ? ` · ${atomic.cueLocation}` : ''}`
                              : atomic?.cueLocation;
                            return (
                              <li key={j} className="group flex items-start gap-2">
                                <div className="w-2 h-2 rounded-full bg-white mt-2" />
                                <div className="min-w-0">
                                  <span className="text-sm text-white/70">{name}</span>
                                  {(cue || atomic?.stackAfter || atomic?.twoMinute || atomic?.reward) && (
                                    <div className="flex flex-wrap gap-1.5 mt-1.5">
                                      {cue && <Chip label={`🕐 ${cue}`} />}
                                      {atomic?.stackAfter && <Chip label={`🔗 dopo ${atomic.stackAfter}`} />}
                                      {atomic?.twoMinute && <Chip label={`⚡ 2min: ${atomic.twoMinute}`} />}
                                      {atomic?.reward && <Chip label={`🎁 ${atomic.reward}`} />}
                                    </div>
                                  )}
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => {setGeneratedPlan(null); setPlanPrompt(''); setSavedPlanId(null); setMessage(null);}}
                      className="flex-1 rounded-full bg-white/10 border border-white/15 text-white py-3 font-medium hover:bg-white/20 transition-all cursor-pointer"
                    >
                      Modifica
                    </button>
                    
                    {!user ? (
                      <button 
                        onClick={() => {closeModal(); onAuthClick('login');}}
                        className="flex-1 rounded-full bg-white text-black py-3 font-medium hover:bg-white/85 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Sparkles size={16} /> Accedi per Salvare
                      </button>
                    ) : (
                      <>
                        <button 
                          onClick={savePlan}
                          disabled={saving}
                          className="flex-1 rounded-full bg-white/10 border border-white/15 text-white py-3 font-medium hover:bg-white/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {saving ? <><Loader2 size={16} className="animate-spin" /> Salvando...</> : <><Save size={16} /> Salva Piano</>}
                        </button>
                        <button 
                          onClick={applyPlan}
                          disabled={applying}
                          className="flex-1 rounded-full bg-white text-black py-3 font-medium hover:bg-white/85 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {applying ? <><Loader2 size={16} className="animate-spin" /> Applicando...</> : <><BookOpen size={16} /> Applica Piano</>}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
