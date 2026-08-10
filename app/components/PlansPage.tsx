'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Calendar, Trash2, Play, Sparkles, CheckCircle } from 'lucide-react';
import { API_URL } from './constants';
import { useToast } from './ToastContext';
import type { User, Plan } from '../types';

interface PlansPageProps {
  user: User | null;
}

export default function PlansPage({ user }: PlansPageProps) {
  const { showToast } = useToast();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);

  const showPopup = (message: string, type: 'success' | 'error' | 'info' = 'info') => showToast(message, type);

  const fetchPlans = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('omni_token');
      const res = await fetch(`${API_URL}/plans`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setPlans(data);
      } else {
        setError(data.error || 'Errore nel caricamento dei piani');
      }
    } catch {
      setError('Errore di connessione');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  const handleApply = async (planId: string) => {
    try {
      const token = localStorage.getItem('omni_token');
      const res = await fetch(`${API_URL}/plans/${planId}/apply`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        showPopup(`Piano applicato! ${data.habitsCreated} abitudini create.`);
        fetchPlans();
      } else {
        showPopup(data.error || 'Errore nell\'applicare il piano');
      }
    } catch {
      showPopup('Errore di connessione');
    }
  };

  const handleDelete = async (planId: string) => {
    if (confirmingId !== planId) {
      setConfirmingId(planId);
      showPopup('Clicca di nuovo per confermare l\'eliminazione', 'info');
      return;
    }
    setConfirmingId(null);

    try {
      const token = localStorage.getItem('omni_token');
      const res = await fetch(`${API_URL}/plans/${planId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setPlans(plans.filter(p => p._id !== planId));
        showPopup('Piano eliminato', 'success');
      } else {
        showPopup('Errore nell\'eliminare il piano', 'error');
      }
    } catch {
      showPopup('Errore di connessione', 'error');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };


  return (
    <div className="min-h-screen bg-background pt-32 pb-20 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center">
              <BookOpen size={32} className="text-white" />
            </div>
            <div>
              <div className="inline-flex border-l-2 border-white bg-white/15 px-3 py-1.5 backdrop-blur-md mb-5">
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white">
                  I Tuoi Piani
                </span>
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium leading-[0.9] tracking-tighter text-white drop-shadow-lg">
                Piani <span className="text-white/40">Attivi</span>
              </h1>
              <p className="mt-4 max-w-md text-white/80 drop-shadow-md">I tuoi piani di abitudini generati con l'AI</p>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-white/40">Caricamento...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400">{error}</p>
            <button onClick={fetchPlans} className="mt-4 text-white/60 hover:text-white underline cursor-pointer">
              Riprova
            </button>
          </div>
        ) : plans.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles size={48} className="text-white/80" />
            </div>
            <h3 className="font-display text-2xl font-medium tracking-tighter mb-3">Nessun piano salvato</h3>
            <p className="text-white/40 mb-6 max-w-md mx-auto">
              Genera il tuo primo piano personalizzato di abitudini con l'AI e salvalo per tenerne traccia.
            </p>
          </motion.div>
        ) : (
          <div className="space-y-4">
            {plans.map((plan, index) => (
              <motion.div
                key={plan._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`bg-white/5 border rounded-2xl p-6 transition-all backdrop-blur-md ${
                  plan.isActive ? 'border-white/30' : 'border-white/10'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      plan.habitsApplied 
                        ? 'bg-white/20 text-white' 
                        : 'bg-white/10 text-white'
                    }`}>
                      {plan.habitsApplied ? (
                        <CheckCircle size={24} />
                      ) : (
                        <Calendar size={24} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-display text-xl font-medium tracking-tighter mb-1">
                        {plan.title}
                      </h3>
                      <p className="text-white/50 text-sm">{plan.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-white/40">
                          Creato: {formatDate(plan.createdAt)}
                        </span>
                        {plan.habitsApplied && (
                          <span className="text-xs text-white/70 flex items-center gap-1">
                            <CheckCircle size={12} /> Applicato
                          </span>
                        )}
                        {plan.isActive && !plan.habitsApplied && (
                          <span className="text-xs text-white/50">Attivo</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {!plan.habitsApplied && (
                      <button
                        onClick={() => handleApply(plan._id)}
                        className="px-4 py-2 rounded-full bg-white text-black font-medium text-xs hover:bg-white/85 transition-colors flex items-center gap-2 cursor-pointer"
                      >
                        <Play size={14} /> Applica
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(plan._id)}
                      className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                      aria-label="Elimina piano"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                {/* Preview months */}
                {plan.planData?.plan && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {plan.planData.plan.map((monthPlan, i) => (
                      <span 
                        key={i}
                        className="px-3 py-1 bg-white/5 rounded-full text-xs font-bold text-white/60"
                      >
                        {monthPlan.month}: {monthPlan.habits.length} abitudini
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
