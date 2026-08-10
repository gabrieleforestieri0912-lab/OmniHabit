'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Loader2, MailCheck } from 'lucide-react';
import AuthShell, { authInputClass } from './AuthShell';
import { API_URL } from './constants';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = (await res.json()) as { message?: string; error?: string };
      if (res.ok) {
        setSent(true);
      } else {
        setError(data.error || 'Errore durante l\'invio');
      }
    } catch {
      setError('Errore di connessione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell>
      {sent ? (
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-green-500/30 bg-green-500/10">
            <MailCheck size={26} className="text-green-400" aria-hidden="true" />
          </div>
          <h1 className="font-display text-3xl font-medium leading-[1.05] tracking-tight text-white drop-shadow-lg">
            Controlla la tua email.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-white/60">
            Se esiste un account con <span className="text-white">{email}</span>, ti abbiamo
            inviato il link per reimpostare la password. Controlla anche la cartella spam.
          </p>
          <Link
            href="/login"
            className="mt-8 inline-block w-full cursor-pointer rounded-full bg-white py-3 text-sm font-medium text-black transition-colors duration-300 hover:bg-white/85"
          >
            Torna al login
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <div className="mb-4 inline-flex border-l-2 border-white bg-white/15 px-3 py-1.5 backdrop-blur-md">
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white">
                Recupero password
              </span>
            </div>
            <h1 className="font-display text-4xl font-medium leading-[1.02] tracking-tight text-white drop-shadow-lg">
              Password dimenticata?
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-white/60">
              Inserisci la tua email: ti invieremo un link per reimpostare la password.
            </p>
          </div>

          {error && (
            <p
              className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs font-medium text-red-300"
              role="alert"
            >
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              placeholder="La tua email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={authInputClass}
              aria-label="Email"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-white py-3 text-sm font-medium text-black transition-colors duration-300 hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading && <Loader2 size={15} className="animate-spin" aria-hidden="true" />}
              Invia link di recupero
            </button>
          </form>

          <p className="mt-6 text-center text-xs font-medium text-white/50">
            Ti sei ricordato la password?{' '}
            <Link
              href="/login"
              className="cursor-pointer text-white transition-colors duration-300 hover:text-white/80"
            >
              Accedi
            </Link>
          </p>
        </>
      )}
    </AuthShell>
  );
}
