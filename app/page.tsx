'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

import Navbar from './components/Navbar';
import ScrollVideo from './components/ScrollVideo';
import SectionOne from './components/SectionOne';
import SectionTwo from './components/SectionTwo';
import MonthSelection from './components/MonthSelection';
import DocAccessSection from './components/DocAccess';
import MonthDashboard from './components/MonthDashboard';
import UserDashboard from './components/UserDashboard';
import ChatModal from './components/ChatModal';
import ChatPage from './components/ChatPage';
import PlanModal from './components/PlanModal';
import HabitBuilder, { type AtomicHabitDraftInput } from './components/HabitBuilder';
import DocPage from './components/DocPage';
import Footer from './components/Footer';
import FeaturesSection from './components/Features';
import FAQSection from './components/FAQ';
import AIAssistantSection from './components/AIAssistant';
import PricingSection from './components/Pricing';
import PlansPage from './components/PlansPage';
import PrivacyPage from './components/PrivacyPage';
import TermsPage from './components/TermsPage';

import { API_URL } from './components/constants';
import { getGlobalStats, todayKey } from './components/utils';
import { ToastProvider, useToast } from './components/ToastContext';
import { useReminders } from './components/useReminders';
import type { User, Habit, HabitsMap, View, AuthMode, ChatMessage, GeneratedPlan } from './types';

function AppInner() {
  const { showToast } = useToast();
  const router = useRouter();
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedDocCategory, setSelectedDocCategory] = useState<string>('introduzione');
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQuartersView, setIsQuartersView] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<HabitsMap>({});
  const [loading, setLoading] = useState(true);
  const [newHabit, setNewHabit] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [habitBuilderOpen, setHabitBuilderOpen] = useState(false);
  const [habitBuilderMonth, setHabitBuilderMonth] = useState<string | null>(null);
  const [planPrompt, setPlanPrompt] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);
  const [planLoading, setPlanLoading] = useState(false);

  // New states for dynamic plan generation
  const [planStyle, setPlanStyle] = useState('balanced'); // e.g., 'balanced', 'intense', 'gentle'
  const [targetHabitCount, setTargetHabitCount] = useState(5); // e.g., number of habits


  const fetchHabits = useCallback(async () => {
    try {
      const token = localStorage.getItem('omni_token');
      const res = await fetch(`${API_URL}/habits`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = (await res.json()) as Habit[];
      const grouped = data.reduce<HabitsMap>((acc, habit) => {
        if (!acc[habit.month]) acc[habit.month] = [];
        acc[habit.month].push(habit);
        return acc;
      }, {});
      setHabits(grouped);
    } catch (err) {
      console.error('Fetch habits error', err);
    }
  }, []);

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem('omni_token');
    if (token) {
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.ok) {
          const data = (await res.json()) as { user: User };
          setUser(data.user);
        } else {
          localStorage.removeItem('omni_token');
        }
      } catch (err) {
        console.error('Auth error', err);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (user) fetchHabits();
    else setHabits({});
  }, [user, fetchHabits]);

  const logout = () => {
    localStorage.removeItem('omni_token');
    setUser(null);
    handleNavClick('home');
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const googleToken = urlParams.get('google_token');
    const username = urlParams.get('username');
    const error = urlParams.get('error');
    
    if (error) {
      showToast('Errore durante l\'accesso con Google', 'error');
      window.history.replaceState({}, document.title, window.location.pathname);
      return;
    }
    
    if (googleToken) {
      localStorage.setItem('omni_token', googleToken);
      // Fetch user data to get avatar
      fetch(`${API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${googleToken}` }
      })
        .then(res => res.json())
        .then(data => {
          setUser(data.user);
        })
        .catch(() => {
          setUser({ username: username || 'User' } as User);
        });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    if (!user) { goToAuth('login'); return; }
    
    const userMessage = chatInput.trim();
    setChatInput('');
    setChatLoading(true);
    
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    
    try {
      const token = localStorage.getItem('omni_token');
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message: userMessage, history: chatMessages })
      });
      const data = (await res.json()) as { response?: string; error?: string };
      if (res.ok) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.response || '' }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.error || 'Errore nella comunicazione con AI' }]);
      }
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Connessione ad AI non disponibile. Assicurati che Ollama sia in esecuzione.' }]);
    }
    setChatLoading(false);
  };

   const generatePlan = async (e: React.FormEvent) => {
     e.preventDefault();
     if (!planPrompt.trim()) return;
     
     setPlanLoading(true);
     try {
       const token = localStorage.getItem('omni_token');
       const allHabits = Object.values(habits).flat();
       const res = await fetch(`${API_URL}/ai/plan`, {
         method: 'POST',
         headers: { 
           'Content-Type': 'application/json',
           ...(token ? { 'Authorization': `Bearer ${token}` } : {})
         },
body: JSON.stringify({
          prompt: planPrompt,
          currentHabits: allHabits,
          planStyle,
          targetHabitCount
        })
      });
      const data = (await res.json()) as GeneratedPlan & { error?: string };
      if (res.ok) {
        setGeneratedPlan(data);
      } else {
        showToast(data.error || 'Errore nella generazione del piano', 'error');
      }
    } catch {
      showToast('Connessione ad AI non disponibile', 'error');
    }
    setPlanLoading(false);
  };

   const handlePlanApplied = async () => {
     await fetchHabits();
     setPlanModalOpen(false);
     setGeneratedPlan(null);
     setPlanPrompt('');
     showToast('Piano applicato con successo!', 'success');
   };

  const addHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabit.trim() || !selectedMonth || !user) {
        if (!user) goToAuth('login');
        return;
    }
    
    const monthHabits = habits[selectedMonth] || [];
    if (monthHabits.length >= 5) {
        showToast('Limite raggiunto: puoi inserire un massimo di 5 abitudini per mese.', 'info');
        return;
    }
    
    try {
      const token = localStorage.getItem('omni_token');
      const res = await fetch(`${API_URL}/habits`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newHabit, month: selectedMonth })
      });
      const data = (await res.json()) as Habit;
      if (res.ok) {
        const monthHabits = habits[selectedMonth] || [];
        setHabits({
          ...habits,
          [selectedMonth]: [...monthHabits, data]
        });
        setNewHabit('');
      }
    } catch (e) {
      console.error('Add habit error', e);
    }
  };

  // Habit Builder (Atomic Habits — the four laws)
  const createAtomicHabit = async (data: AtomicHabitDraftInput) => {
    if (!habitBuilderMonth || !user) {
      setHabitBuilderOpen(false);
      setHabitBuilderMonth(null);
      goToAuth('login');
      return;
    }
    const month = habitBuilderMonth;
    const monthHabits = habits[month] || [];
    if (monthHabits.length >= 5) {
      showToast('Limite raggiunto: puoi inserire un massimo di 5 abitudini per mese.', 'info');
      return;
    }
    try {
      const token = localStorage.getItem('omni_token');
      const res = await fetch(`${API_URL}/habits`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ ...data, month, reminderTime: data.cueTime || null })
      });
      const created = (await res.json()) as Habit & { error?: string };
      if (res.ok) {
        setHabits((prev) => ({
          ...prev,
          [month]: [...(prev[month] || []), created]
        }));
        setHabitBuilderOpen(false);
        setHabitBuilderMonth(null);
        showToast('Abitudine creata con le 4 Leggi!', 'success');
      } else {
        showToast(created.error || "Errore nella creazione (hai eseguito la migrazione SQL su Supabase?)", 'error');
      }
    } catch {
      showToast('Errore di connessione', 'error');
    }
  };

  const toggleHabit = async (month: string, id: string) => {
    try {
      const token = localStorage.getItem('omni_token');
      const res = await fetch(`${API_URL}/habits/${id}/checkin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ date: todayKey() })
      });

      if (res.ok) {
        const updatedHabit = (await res.json()) as Habit;
        const updated = habits[month].map(h =>
          h._id === id ? updatedHabit : h
        );
        setHabits({ ...habits, [month]: updated });

        // Habit stacking nudge: after checking the trigger habit, suggest the stacked one
        if (updatedHabit.completed) {
          const stacked = (habits[month] || []).find(
            (h) => h._id !== id && h.stackAfter && h.stackAfter === updatedHabit.name && !h.completed
          );
          if (stacked) {
            showToast(`Habit stacking: ora fai "${stacked.name}" (dopo ${updatedHabit.name})`, 'success');
          }
        }
      } else {
        const data = await res.json().catch(() => ({} as { error?: string }));
        showToast(data.error || 'Errore nel check-in', 'error');
      }
    } catch (e) {
      console.error('Toggle habit error', e);
    }
  };

  const deleteHabit = async (month: string, id: string) => {
    try {
      const token = localStorage.getItem('omni_token');
      const res = await fetch(`${API_URL}/habits/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const updated = habits[month].filter(h => h._id !== id);
        setHabits({ ...habits, [month]: updated });
      }
    } catch (e) {
      console.error('Delete habit error', e);
    }
  };

  const updateHabit = async (month: string, id: string, updates: Partial<Habit>) => {
    try {
      const token = localStorage.getItem('omni_token');
      const res = await fetch(`${API_URL}/habits/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = (await res.json()) as Habit;
        setHabits(prev => ({
          ...prev,
          [month]: (prev[month] || []).map(h => h._id === id ? updated : h)
        }));
      } else {
        const data = await res.json().catch(() => ({} as { error?: string }));
        showToast(data.error || 'Errore nell\'aggiornamento', 'error');
      }
    } catch (e) {
      console.error('Update habit error', e);
      showToast('Errore di connessione', 'error');
    }
  };

  // Dedicated auth pages: every login/register trigger navigates to /login or /register.
  const goToAuth = (mode: AuthMode) => {
    router.push(mode === 'register' ? '/register' : '/login');
  };

  const handleNavClick = (view: View, e?: React.MouseEvent) => {
    if (e) e.preventDefault();
    setCurrentView(view);
    setIsQuartersView(false);
    setSelectedMonth(null);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openBuilderFor = (month: string) => {
    setHabitBuilderMonth(month);
    setHabitBuilderOpen(true);
  };

  const openDashboard = (month: string) => {
    setSelectedMonth(month);
    if (user) { // Check if user is logged in
      setCurrentView('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      goToAuth('login'); // Open the dedicated login page if not logged in
    }
  };

  // New useEffect hook to ensure direct dashboard access when a month is selected from home
  useEffect(() => {
    if (currentView === 'home' && selectedMonth) {
      if (user) { // Check if user is logged in
        setCurrentView('dashboard');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        router.push('/login'); // Open the dedicated login page if not logged in
      }
    }
  }, [selectedMonth, currentView, user]); // Add 'user' to dependencies

  const globalStats = getGlobalStats(habits);
  useReminders(habits, user);

  return (
    <div className="relative min-h-screen font-sans text-foreground bg-background overflow-x-hidden">

      {currentView !== 'chat' && (
       <Navbar 
         currentView={currentView}
         onNavClick={handleNavClick}
         user={user}
         onLogout={logout}
         onAuthClick={goToAuth}
         onPlanModalOpen={setPlanModalOpen}
         isMenuOpen={isMenuOpen}
         setIsMenuOpen={setIsMenuOpen}
       />
      )}

       <ChatModal 
         chatOpen={chatOpen}
         setChatOpen={setChatOpen}
         chatMessages={chatMessages}
         chatInput={chatInput}
         setChatInput={setChatInput}
         chatLoading={chatLoading}
         handleChatSubmit={handleChatSubmit}
         user={user}
         onAuthClick={goToAuth}
       />

       <PlanModal 
         planModalOpen={planModalOpen}
         setPlanModalOpen={setPlanModalOpen}
         planPrompt={planPrompt}
         setPlanPrompt={setPlanPrompt}
         generatedPlan={generatedPlan}
         setGeneratedPlan={setGeneratedPlan}
         planLoading={planLoading}
         generatePlan={generatePlan}
         user={user}
         onAuthClick={goToAuth}
         onPlanApplied={handlePlanApplied}
         planStyle={planStyle}
         setPlanStyle={setPlanStyle}
         targetHabitCount={targetHabitCount}
         setTargetHabitCount={setTargetHabitCount}
       />

       <HabitBuilder
         open={habitBuilderOpen}
         month={habitBuilderMonth || ''}
         existingHabits={habitBuilderMonth ? habits[habitBuilderMonth] || [] : []}
         onClose={() => {
           setHabitBuilderOpen(false);
           setHabitBuilderMonth(null);
         }}
         onCreate={createAtomicHabit}
       />

      <AnimatePresence mode="wait">
        {currentView === 'home' ? (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <ScrollVideo />

            <div className="relative z-10">
              <main>
                {/* Hero */}
                {!isQuartersView && (
                  <SectionOne
                    user={user}
                    stats={globalStats}
                    onStart={() => {
                      if (user) {
                        document.getElementById('months')?.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        goToAuth('login');
                      }
                    }}
                  />
                )}

                {/* Capability */}
                {!isQuartersView && (
                  <SectionTwo
                    onAuthClick={goToAuth}
                    onStart={() => {
                      if (user) {
                        document.getElementById('months')?.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        goToAuth('login');
                      }
                    }}
                  />
                )}

                {/* Features Section */}
                {!isQuartersView && (
                  <FeaturesSection />
                )}

                {/* Month Selection */}
                <MonthSelection
                  habits={habits}
                  selectedMonth={selectedMonth}
                  setSelectedMonth={setSelectedMonth}
                  isQuartersView={isQuartersView}
                  setIsQuartersView={setIsQuartersView}
                  openDashboard={openDashboard}
                  newHabit={newHabit}
                  setNewHabit={setNewHabit}
                  addHabit={addHabit}
                  toggleHabit={toggleHabit}
                  deleteHabit={deleteHabit}
                  onOpenBuilder={openBuilderFor}
                />

                {/* Chat Section (AIAssistantSection) */}
                {!isQuartersView && (
                  <AIAssistantSection onNavigate={handleNavClick} />
                )}

                {/* Pricing Section */}
                {!isQuartersView && (
                  <PricingSection user={user} onAuthClick={goToAuth} />
                )}

                {/* FAQ Section */}
                {!isQuartersView && (
                  <FAQSection />
                )}
              </main>
            </div>
          </motion.div>
        ) : currentView === 'dashboard' ? (
          <MonthDashboard 
            selectedMonth={selectedMonth}
            habits={habits}
            onBack={() => {setCurrentView('home'); setIsQuartersView(true);}}
            newHabit={newHabit}
            setNewHabit={setNewHabit}
            addHabit={addHabit}
            toggleHabit={toggleHabit}
            deleteHabit={deleteHabit}
            onUpdate={updateHabit}
            onOpenBuilder={openBuilderFor}
          />
         ) : currentView === 'user-dashboard' ? (
           <UserDashboard 
             habits={habits}
             user={user}
             onBack={() => handleNavClick('home')}
             onPlanModalOpen={setPlanModalOpen}
             onChatOpen={() => setChatOpen(true)}
             onPlansOpen={() => setCurrentView('plans')}
             onCheckin={toggleHabit}
             onOpenMonth={(month) => {
               setSelectedMonth(month);
               setCurrentView('dashboard');
               window.scrollTo({ top: 0, behavior: 'smooth' });
             }}
           />
         ) : currentView === 'chat' ? (
           <ChatPage 
             onBack={() => handleNavClick('home')}
             user={user}
             habits={habits}
             onAuthClick={() => goToAuth('login')}
           />
         ) : currentView === 'plans' ? (
           <PlansPage 
             onBack={() => handleNavClick('home')}
             user={user}
           />
          ) : currentView === 'doc' ? (
           <DocPage 
             selectedDocCategory={selectedDocCategory}
             setSelectedDocCategory={setSelectedDocCategory}
             onBack={() => handleNavClick('home')}
           />
         ) : currentView === 'privacy' ? (
           <PrivacyPage onBack={() => handleNavClick('home')} />
         ) : currentView === 'terms' ? (
           <TermsPage onBack={() => handleNavClick('home')} />
         ) : null}
      </AnimatePresence>

      {currentView !== 'chat' && <Footer onNavClick={handleNavClick} />}
    </div>
  );
  }

  function App() {
    return (
      <ToastProvider>
        <AppInner />
      </ToastProvider>
    );
  }

  export default App;
