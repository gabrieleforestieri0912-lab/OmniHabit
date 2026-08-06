'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Loader2, Check, Save, BookOpen } from 'lucide-react';
import { API_URL } from './constants';

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
  onPlanApplied
}) {
  const [saving, setSaving] = useState(false);
  const [applying, setApplying] = useState(false);
  const [savedPlanId, setSavedPlanId] = useState(null);
  const [message, setMessage] = useState(null);

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
            className="bg-white/3 border border-white/10 rounded-[32px] max-w-xl w-full max-h-[70vh] relative flex flex-col shadow-xl"
          >
            <button onClick={closeModal} className="absolute top-5 right-5 text-white/20 hover:text-white cursor-pointer z-10" aria-label="Chiudi"><X size={16} /></button>
            
            <div className="p-5 border-b border-white/10 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Sparkles size={20} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-black uppercase italic tracking-tight">Generatore Piani</h2>
                <p className="text-[8px] font-black text-purple-400 uppercase tracking-widest">AI Habit Planner • Llama 3</p>
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {!generatedPlan ? (
                <form onSubmit={generatePlan} className="space-y-4">
                  <div>
                    <label className="text-xs font-black uppercase italic tracking-wide text-white/60 block mb-2">Descrivi i tuoi obiettivi</label>
                    <textarea
                      value={planPrompt}
                      onChange={(e) => setPlanPrompt(e.target.value)}
                      placeholder="Es: Voglio migliorare la mia produttività, dormire meglio, leggere di più, fare esercizio fisico regolarmente..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 outline-none focus:ring-1 focus:ring-purple-500 italic font-bold text-sm h-32 resize-none"
                      required
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={planLoading || !planPrompt.trim()}
                    className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {planLoading ? <><Loader2 size={16} className="animate-spin" /> Generazione in corso...</> : <><Sparkles size={16} /> Genera Piano Personalizzato</>}
                  </button>
                </form>
              ) : (
                <div className="space-y-4">
                  <div className="bg-purple-600/10 border border-purple-500/20 rounded-xl p-5">
                    <p className="text-sm font-bold italic text-white/70">{generatedPlan.summary}</p>
                  </div>
                  
                  {message && (
                    <div className={`p-3 rounded-xl text-sm font-bold ${message.includes('errore') ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
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
                        className="bg-white/5 border border-white/10 rounded-xl p-5"
                      >
                        <h4 className="text-base font-black uppercase italic tracking-wider text-purple-400 mb-3">{monthPlan.month}</h4>
                        <ul className="space-y-2">
                          {monthPlan.habits.map((habit, j) => (
                            <li key={j} className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-purple-500" />
                              <span className="text-sm font-bold italic">{habit}</span>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    ))}
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      onClick={() => {setGeneratedPlan(null); setPlanPrompt(''); setSavedPlanId(null); setMessage(null);}}
                      className="flex-1 bg-white/5 border border-white/10 text-white py-3 rounded-xl font-black uppercase tracking-widest hover:bg-white/10 transition-all cursor-pointer"
                    >
                      Modifica
                    </button>
                    
                    {!user ? (
                      <button 
                        onClick={() => {closeModal(); onAuthClick('login');}}
                        className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-xl font-black uppercase tracking-widest hover:opacity-90 transition-all cursor-pointer flex items-center justify-center gap-2"
                      >
                        <Sparkles size={16} /> Accedi per Salvare
                      </button>
                    ) : (
                      <>
                        <button 
                          onClick={savePlan}
                          disabled={saving}
                          className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-black uppercase tracking-widest hover:bg-blue-500 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {saving ? <><Loader2 size={16} className="animate-spin" /> Salvando...</> : <><Save size={16} /> Salva Piano</>}
                        </button>
                        <button 
                          onClick={applyPlan}
                          disabled={applying}
                          className="flex-1 bg-green-600 text-white py-3 rounded-xl font-black uppercase tracking-widest hover:bg-green-500 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
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
