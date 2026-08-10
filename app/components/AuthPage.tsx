'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Hexagon, ArrowLeft, Loader2 } from 'lucide-react';
import ScrollVideo from './ScrollVideo';
import { API_URL } from './constants';
import type { AuthMode } from '../types';

interface AuthPageProps {
  mode: Exclude<AuthMode, null>;
}

const inputClass =
  'w-full rounded-full border border-white/20 bg-white/5 px-5 py-3 outline-none focus:border-white/50 transition-colors font-medium text-sm placeholder:text-white/30';

export default function AuthPage({ mode }: AuthPageProps) {
  const router = useRouter();
  const isLogin = mode === 'login';

  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);

  // Already authenticated → skip the auth page.
  useEffect(() => {
    if (localStorage.getItem('omni_token')) router.replace('/');
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/${isLogin ? 'login' : 'register'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isLogin ? { email: form.email, password: form.password } : form)
      });
      const data = (await res.json()) as { token?: string; error?: string };
      if (res.ok && data.token) {
        localStorage.setItem('omni_token', data.token);
        router.replace('/');
      } else {
        setError(data.error || 'Errore durante la richiesta');
      }
    } catch {
      setError('Errore di connessione. Riprova.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/google`);
      const data = (await res.json()) as { authUrl?: string; error?: string };
      if (data.authUrl) {
        window.location.href = data.authUrl;
      } else {
        setError(data.error || 'Google OAuth non configurato');
      }
    } catch {
      setError('Errore di connessione');
    }
  };

  const handleForgot = async () => {
    if (!form.email) {
      setError('Inserisci prima la tua email');
      return;
    }
    setForgotLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email })
      });
      const data = (await res.json()) as { message?: string; error?: string };
      if (res.ok) {
        setForgotSent(true);
      } else {
        setError(data.error || 'Errore durante l\'invio');
      }
    } catch {
      setError('Errore di connessione');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <ScrollVideo />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Brand */}
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2.5 transition-opacity duration-300 hover:opacity-80"
            aria-label="OmniHabit home"
          >
            <Hexagon size={28} strokeWidth={1.5} className="text-foreground" aria-hidden="true" />
            <span className="text-xl font-medium tracking-tight text-foreground drop-shadow-md">
              omnihabit
            </span>
          </Link>

          {/* Glass card */}
          <div className="rounded-3xl border border-white/15 bg-background/40 p-6 sm:p-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_60px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl">
            <div className="mb-8">
              <div className="mb-4 inline-flex border-l-2 border-white bg-white/15 px-3 py-1.5 backdrop-blur-md">
                <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white">
                  {isLogin ? 'Accesso' : 'Registrazione'}
                </span>
              </div>
              <h1 className="font-display text-4xl font-medium leading-[1.02] tracking-tight text-white drop-shadow-lg">
                {isLogin ? 'Bentornato.' : 'Inizia oggi.'}
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                {isLogin
                  ? 'Accedi e riprendi da dove eri rimasto: la tua streak ti aspetta.'
                  : 'Crea il tuo account in 30 secondi e costruisci la tua prima abitudine.'}
              </p>
            </div>

            {/* Google */}
            <button
              onClick={handleGoogle}
              className="w-full cursor-pointer rounded-full border border-white/25 bg-white/5 py-3 text-sm text-white backdrop-blur-md transition-colors duration-300 hover:bg-white/10 flex items-center justify-center gap-2"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              {isLogin ? 'Accedi con Google' : 'Registrati con Google'}
            </button>

            <div className="relative my-5" aria-hidden="true">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-transparent px-3 font-mono text-[10px] uppercase tracking-[0.15em] text-white/40">
                  oppure
                </span>
              </div>
            </div>

            {error && (
              <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs font-medium text-red-300" role="alert">
                {error}
              </p>
            )}

            <form onSubmit={handleSubmit} className="space-y-3">
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Username"
                  required
                  minLength={3}
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className={inputClass}
                  aria-label="Username"
                />
              )}
              <input
                type="email"
                placeholder="Email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className={inputClass}
                aria-label="Email"
              />
              <input
                type="password"
                placeholder="Password"
                required
                minLength={isLogin ? undefined : 6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={inputClass}
                aria-label="Password"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full cursor-pointer rounded-full bg-white py-3 text-sm font-medium text-black transition-colors duration-300 hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && <Loader2 size={15} className="animate-spin" aria-hidden="true" />}
                {isLogin ? 'Accedi' : 'Crea account'}
              </button>
            </form>

            {isLogin && !forgotSent && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setForgotOpen(!forgotOpen)}
                  disabled={forgotLoading}
                  className="cursor-pointer text-xs font-medium text-white/40 transition-colors duration-300 hover:text-white disabled:opacity-40"
                >
                  {forgotLoading ? 'Invio...' : 'Password dimenticata?'}
                </button>
                {forgotOpen && (
                  <div className="mt-3 flex gap-2">
                    <input
                      type="email"
                      placeholder="La tua email"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className={`${inputClass} !py-2.5 text-xs`}
                      aria-label="Email per il recupero password"
                    />
                    <button
                      type="button"
                      onClick={handleForgot}
                      className="shrink-0 cursor-pointer rounded-full border border-white/25 bg-white/5 px-4 py-2 text-xs font-medium text-white transition-colors duration-300 hover:bg-white/10"
                    >
                      Invia
                    </button>
                  </div>
                )}
              </div>
            )}
            {forgotSent && (
              <p className="mt-4 text-center text-xs font-medium text-green-400">
                Controlla la tua email: ti abbiamo inviato il link per reimpostare la password.
              </p>
            )}

            <p className="mt-6 text-center text-xs font-medium text-white/50">
              {isLogin ? "Non hai un account? " : "Hai già un account? "}
              <Link
                href={isLogin ? '/register' : '/login'}
                className="cursor-pointer text-white transition-colors duration-300 hover:text-white/80"
              >
                {isLogin ? 'Registrati' : 'Accedi'}
              </Link>
            </p>
          </div>

          {/* Back home */}
          <Link
            href="/"
            className="mt-8 inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-white/40 transition-colors duration-300 hover:text-white"
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Torna alla home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
