'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2, KeyRound } from 'lucide-react';
import AuthShell, { authInputClass } from '../components/AuthShell';
import { API_URL } from '../components/constants';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      setError('La password deve essere di almeno 6 caratteri');
      return;
    }
    if (password !== confirm) {
      setError('Le password non coincidono');
      return;
    }
    setStatus('loading');
    setError(null);
    try {
      const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('done');
      } else {
        setStatus('error');
        setError(data.error || 'Errore nel reimpostare la password');
      }
    } catch {
      setStatus('error');
      setError('Errore di connessione');
    }
  };

  if (status === 'done') {
    return (
      <div className="text-center">
        <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-green-500/30 bg-green-500/10">
          <KeyRound size={26} className="text-green-400" aria-hidden="true" />
        </div>
        <p className="mb-6 text-lg font-medium text-green-400">Password aggiornata con successo!</p>
        <Link
          href="/"
          className="inline-block w-full rounded-full bg-white px-6 py-3 text-center text-sm font-medium text-black transition-colors duration-300 hover:bg-white/85"
        >
          Torna alla Home
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="mb-4 inline-flex border-l-2 border-white bg-white/15 px-3 py-1.5 backdrop-blur-md">
          <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white">
            Reimposta password
          </span>
        </div>
        <h1 className="font-display text-4xl font-medium leading-[0.95] tracking-tighter text-white drop-shadow-lg">
          Nuova password
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-white/60">
          Scegli una nuova password per il tuo account OmniHabit (min 6 caratteri).
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
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Nuova password"
          className={authInputClass}
          required
        />
        <input
          type="password"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          placeholder="Conferma nuova password"
          className={authInputClass}
          required
        />
        <button
          type="submit"
          disabled={status === 'loading' || !token}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-white py-3 font-medium text-black transition-colors duration-300 hover:bg-white/85 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {status === 'loading' && <Loader2 size={15} className="animate-spin" aria-hidden="true" />}
          {status === 'loading' ? 'Aggiornamento...' : 'Aggiorna password'}
        </button>
        {!token && (
          <p className="text-center text-xs font-medium text-white/40">
            Link non valido: token mancante.
          </p>
        )}
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthShell>
      <Suspense fallback={<p className="text-center text-white/40">Caricamento...</p>}>
        <ResetPasswordForm />
      </Suspense>
    </AuthShell>
  );
}
