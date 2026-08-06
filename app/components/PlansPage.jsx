'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Calendar, Trash2, Play, Pause, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import { API_URL } from './constants';

export default function PlansPage({ onBack, user }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const showPopup = (message) => alert(message);

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

  const handleApply = async (planId) => {
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

  const handleDelete = async (planId) => {
    if (!confirm('Sei sicuro di voler eliminare questo piano?')) return;
    
    try {
      const token = localStorage.getItem('omni_token');
      const res = await fetch(`${API_URL}/plans/${planId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setPlans(plans.filter(p => p._id !== planId));
      } else {
        showPopup('Errore nell\'eliminare il piano');
      }
    } catch {
      showPopup('Errore di connessione');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };


  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 font-black uppercase italic tracking-wider text-sm"
          >
            <ArrowLeft size={18} />
            Indietro
          </button>
          
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
              <BookOpen size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                Piani <span className="text-purple-500">Attivi</span>
              </h1>
              <p className="text-white/40 mt-1">I tuoi piani di abitudini generati con l'AI</p>
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
            <button onClick={fetchPlans} className="mt-4 text-purple-400 hover:underline">
              Riprova
            </button>
          </div>
        ) : plans.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles size={48} className="text-purple-400" />
            </div>
            <h3 className="text-2xl font-black uppercase italic tracking-wider mb-3">Nessun piano salvato</h3>
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
                className={`bg-white/3 border rounded-2xl p-6 transition-all ${
                  plan.isActive ? 'border-purple-500/30' : 'border-white/10'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                      plan.habitsApplied 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-purple-600/20 text-purple-400'
                    }`}>
                      {plan.habitsApplied ? (
                        <CheckCircle size={24} />
                      ) : (
                        <Calendar size={24} />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-black uppercase italic tracking-wider mb-1">
                        {plan.title}
                      </h3>
                      <p className="text-white/50 text-sm">{plan.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-white/30">
                          Creato: {formatDate(plan.createdAt)}
                        </span>
                        {plan.habitsApplied && (
                          <span className="text-xs text-green-400 flex items-center gap-1">
                            <CheckCircle size={12} /> Applicato
                          </span>
                        )}
                        {plan.isActive && !plan.habitsApplied && (
                          <span className="text-xs text-purple-400">Attivo</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    {!plan.habitsApplied && (
                      <button
                        onClick={() => handleApply(plan._id)}
                        className="px-4 py-2 bg-green-600 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-green-500 transition-colors flex items-center gap-2"
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
