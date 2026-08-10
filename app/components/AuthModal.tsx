'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { API_URL } from './constants';
import { useToast } from './ToastContext';
import type { AuthMode, AuthForm } from '../types';

interface AuthModalProps {
  authModal: AuthMode;
  setAuthModal: (mode: AuthMode) => void;
  authForm: AuthForm;
  setAuthForm: React.Dispatch<React.SetStateAction<AuthForm>>;
  handleAuthSubmit: (e: React.FormEvent) => void;
  handleGoogleLogin: () => void;
}

export default function AuthModal({ authModal, setAuthModal, authForm, setAuthForm, handleAuthSubmit, handleGoogleLogin }: AuthModalProps) {
  const { showToast } = useToast();
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  const handleForgot = async () => {
    if (!authForm.email) {
      showToast('Inserisci prima la tua email', 'info');
      return;
    }
    setForgotLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: authForm.email })
      });
      const data = await res.json();
      if (res.ok) {
        setForgotSent(true);
        showToast(data.message, 'success');
      } else {
        showToast(data.error || 'Errore', 'error');
      }
    } catch {
      showToast('Errore di connessione', 'error');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {authModal && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 bg-black/80 backdrop-blur-2xl flex items-center justify-center p-3"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white/5 border border-white/15 backdrop-blur-2xl p-5 md:p-8 rounded-[28px] max-w-md w-full relative shadow-xl"
          >
            <button onClick={() => setAuthModal(null)} className="absolute top-5 right-5 text-white/30 hover:text-white cursor-pointer" aria-label="Chiudi modal"><X size={18} /></button>
            <h2 className="text-3xl md:text-4xl font-normal tracking-tight mb-6">{authModal === 'login' ? 'Accedi' : 'Registrati'}</h2>
            
            {/* Google Login Button */}
            <button 
              onClick={handleGoogleLogin}
              className="w-full rounded-full border border-white/25 bg-white/10 backdrop-blur-md py-3 text-sm text-white hover:bg-white/20 transition-all cursor-pointer flex items-center justify-center gap-2 mb-5"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Accedi con Google
            </button>
            
            <div className="relative mb-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-transparent px-3 text-white/40 font-mono uppercase tracking-[0.15em]">oppure</span>
              </div>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3">
              {authModal === 'register' && (
                <input
                  type="text"
                  placeholder="Username"
                  required
                  value={authForm.username}
                  onChange={(e) => setAuthForm({...authForm, username: e.target.value})}
                  className="w-full bg-white/10 border border-white/15 rounded-full px-5 py-3 outline-none focus:border-white/50 transition-colors font-medium"
                  aria-label="Username"
                />
              )}
              <input
                type="email"
                placeholder="Email"
                required
                value={authForm.email}
                onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
                className="w-full bg-white/10 border border-white/15 rounded-full px-5 py-3 outline-none focus:border-white/50 transition-colors font-medium"
                aria-label="Email"
              />
              <input
                type="password"
                placeholder="Password"
                required
                value={authForm.password}
                onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
                className="w-full bg-white/10 border border-white/15 rounded-full px-5 py-3 outline-none focus:border-white/50 transition-colors font-medium"
                aria-label="Password"
              />
              <button type="submit" className="w-full rounded-full bg-white text-black py-3 text-sm font-medium hover:bg-white/85 transition-all cursor-pointer">
                Conferma
              </button>
            </form>
            {authModal === 'login' && (
              <button
                type="button"
                onClick={handleForgot}
                disabled={forgotLoading || forgotSent}
                className="mt-3 w-full text-center text-xs text-white/40 hover:text-white font-medium cursor-pointer disabled:opacity-40"
              >
                {forgotSent ? 'Controlla la tua email' : forgotLoading ? 'Invio...' : 'Password dimenticata?'}
              </button>
            )}
            <p className="mt-6 text-center text-xs text-white/50 font-medium cursor-pointer hover:text-white transition-colors" onClick={() => setAuthModal(authModal === 'login' ? 'register' : 'login')}>
              {authModal === 'login' ? "Non hai un account? Registrati" : "Hai già un account? Accedi"}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}