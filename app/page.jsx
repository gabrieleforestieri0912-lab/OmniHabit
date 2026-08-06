'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import Navbar from './components/Navbar';
import ScrollVideo from './components/ScrollVideo';
import SectionOne from './components/SectionOne';
import SectionTwo from './components/SectionTwo';
import MonthSelection from './components/MonthSelection';
import DocAccessSection from './components/DocAccess';
import MonthDashboard from './components/MonthDashboard';
import UserDashboard from './components/UserDashboard';
import AuthModal from './components/AuthModal';
import ChatModal from './components/ChatModal';
import ChatPage from './components/ChatPage';
import PlanModal from './components/PlanModal';
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
import { getGlobalStats } from './components/utils';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [selectedDocCategory, setSelectedDocCategory] = useState('introduzione');
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isQuartersView, setIsQuartersView] = useState(false);
  const [user, setUser] = useState(null);
  const [authModal, setAuthModal] = useState(null);
  const [authForm, setAuthForm] = useState({ username: '', email: '', password: '' });
  const [habits, setHabits] = useState({});
  const [loading, setLoading] = useState(true);
  const [newHabit, setNewHabit] = useState('');
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [planPrompt, setPlanPrompt] = useState('');
  const [generatedPlan, setGeneratedPlan] = useState(null);
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
      const data = await res.json();
      const grouped = data.reduce((acc, habit) => {
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
          const data = await res.json();
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

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const endpoint = authModal === 'login' ? '/auth/login' : '/auth/register';
    try {
      const res = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(authForm)
      });
      const data = await res.json();
      if (res.ok) {
        localStorage.setItem('omni_token', data.token);
        setUser(data.user);
        setAuthModal(null);
        setAuthForm({ username: '', email: '', password: '' });
      } else {
        alert(data.error);
      }
    } catch {
      alert('Connection error');
    }
  };

  const logout = () => {
    localStorage.removeItem('omni_token');
    setUser(null);
    handleNavClick('home');
  };

  const handleGoogleLogin = async () => {
    try {
      const res = await fetch(`${API_URL}/auth/google`);
      const data = await res.json();
      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        alert(data.error || 'Errore con Google OAuth');
      }
    } catch {
      alert('Errore di connessione. Assicurati che il server sia in esecuzione su localhost:5000');
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const googleToken = urlParams.get('google_token');
    const username = urlParams.get('username');
    const error = urlParams.get('error');
    
    if (error) {
      alert('Errore durante l\'accesso con Google');
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
          setUser({ username: username || 'User' });
        });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, []);

  const handleChatSubmit = async (e) => {
    e.preventDefault();
    if (!chatInput.trim() || !user) return;
    if (!user) { setAuthModal('login'); return; }
    
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
      const data = await res.json();
      if (res.ok) {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setChatMessages(prev => [...prev, { role: 'assistant', content: data.error || 'Errore nella comunicazione con AI' }]);
      }
    } catch {
      setChatMessages(prev => [...prev, { role: 'assistant', content: 'Connessione ad AI non disponibile. Assicurati che Ollama sia in esecuzione.' }]);
    }
    setChatLoading(false);
  };

   const generatePlan = async (e) => {
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
         body: JSON.stringify({ prompt: planPrompt, currentHabits: allHabits })
       });
       const data = await res.json();
       if (res.ok) {
         setGeneratedPlan(data);
       } else {
         alert(data.error || 'Errore nella generazione del piano');
       }
     } catch {
       alert('Connessione ad AI non disponibile');
     }
     setPlanLoading(false);
   };

   const handlePlanApplied = async () => {
     await fetchHabits();
     setPlanModalOpen(false);
     setGeneratedPlan(null);
     setPlanPrompt('');
     alert('Piano applicato con successo!');
   };

  const addHabit = async (e) => {
    e.preventDefault();
    if (!newHabit.trim() || !selectedMonth || !user) {
        if (!user) setAuthModal('login');
        return;
    }
    
    const monthHabits = habits[selectedMonth] || [];
    if (monthHabits.length >= 5) { // Changed from 10 to 5
        alert('Limite raggiunto: puoi inserire un massimo di 5 abitudini per mese.'); // Changed from 10 to 5
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
      const data = await res.json();
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

  const toggleHabit = async (month, id, completed, streak) => {
    try {
      const token = localStorage.getItem('omni_token');
      const newCompleted = !completed;
      const newStreak = newCompleted ? streak + 1 : Math.max(0, streak - 1);
      
      const res = await fetch(`${API_URL}/habits/${id}`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ completed: newCompleted, streak: newStreak })
      });
      
      if (res.ok) {
        const updated = habits[month].map(h => 
          h._id === id ? { ...h, completed: newCompleted, streak: newStreak } : h
        );
        setHabits({ ...habits, [month]: updated });
      }
    } catch (e) {
      console.error('Toggle habit error', e);
    }
  };

  const deleteHabit = async (month, id) => {
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

  const handleNavClick = (view, e) => {
    if (e) e.preventDefault();
    setCurrentView(view);
    setIsQuartersView(false);
    setSelectedMonth(null);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openDashboard = (month) => {
    setSelectedMonth(month);
    if (user) { // Check if user is logged in
      setCurrentView('dashboard');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setAuthModal('login'); // Open login modal if not logged in
    }
  };

  // New useEffect hook to ensure direct dashboard access when a month is selected from home
  useEffect(() => {
    if (currentView === 'home' && selectedMonth) {
      if (user) { // Check if user is logged in
        setCurrentView('dashboard');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        setAuthModal('login'); // Open login modal if not logged in
      }
    }
  }, [selectedMonth, currentView, user]); // Add 'user' to dependencies

  // State for custom popup
  const [popupMessage, setPopupMessage] = useState('');
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const showPopup = (message) => {
    setPopupMessage(message);
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setPopupMessage('');
  };

  const globalStats = getGlobalStats(habits);

  return (
    <div className="relative min-h-screen font-sans text-white scroll-smooth bg-[#0a0a0a] overflow-x-hidden">

      {currentView !== 'chat' && (
       <Navbar 
         currentView={currentView}
         onNavClick={handleNavClick}
         user={user}
         onLogout={logout}
         onAuthClick={setAuthModal}
         onPlanModalOpen={setPlanModalOpen}
         isMenuOpen={isMenuOpen}
         setIsMenuOpen={setIsMenuOpen}
       />
      )}

      <AuthModal 
        authModal={authModal}
        setAuthModal={setAuthModal}
        authForm={authForm}
        setAuthForm={setAuthForm}
        handleAuthSubmit={handleAuthSubmit}
        handleGoogleLogin={handleGoogleLogin}
      />

       <ChatModal 
         chatOpen={chatOpen}
         setChatOpen={setChatOpen}
         chatMessages={chatMessages}
         chatInput={chatInput}
         setChatInput={setChatInput}
         chatLoading={chatLoading}
         handleChatSubmit={handleChatSubmit}
         user={user}
         onAuthClick={setAuthModal}
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
         onAuthClick={setAuthModal}
         onPlanApplied={handlePlanApplied}
       />

      {/* Custom Popup */}
      {isPopupVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl text-center max-w-sm">
            <p className="text-lg text-gray-800 mb-4">{popupMessage}</p>
            <button
              onClick={closePopup}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              OK
            </button>
          </div>
        </div>
      )}

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
                    totalStreak={globalStats.totalStreak}
                    onAuthClick={setAuthModal}
                  />
                )}

                {/* Mid spacer — gives the scroll-scrubbed video room between sections */}
                <div aria-hidden="true" className="h-[80vh]" />

                {/* Capability */}
                {!isQuartersView && (
                  <SectionTwo
                    onAuthClick={setAuthModal}
                    onStart={() => {
                      if (user) {
                        document.getElementById('months')?.scrollIntoView({ behavior: 'smooth' });
                      } else {
                        setAuthModal('login');
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
                />

                {/* Chat Section (AIAssistantSection) */}
                {!isQuartersView && (
                  <AIAssistantSection onNavigate={handleNavClick} />
                )}

                {/* Pricing Section */}
                {!isQuartersView && (
                  <PricingSection user={user} onAuthClick={setAuthModal} />
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
          />
         ) : currentView === 'user-dashboard' ? (
           <UserDashboard 
             habits={habits}
             onBack={() => handleNavClick('home')}
             onPlanModalOpen={setPlanModalOpen}
             onChatOpen={() => setChatOpen(true)}
             onPlansOpen={() => setCurrentView('plans')}
           />
         ) : currentView === 'chat' ? (
           <ChatPage 
             onBack={() => handleNavClick('home')}
             user={user}
             habits={habits}
             onAuthClick={() => setAuthModal('login')}
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

  export default App;