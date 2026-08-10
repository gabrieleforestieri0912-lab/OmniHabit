'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
        <p className="text-green-400 font-medium text-lg mb-6">Password aggiornata con successo!</p>
        <Link href="/" className="inline-block px-6 py-3 rounded-full bg-white text-black font-medium text-sm hover:bg-white/85 transition-colors">
          Torna alla Home
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto space-y-4">
      <h1 className="text-3xl font-normal tracking-tight mb-8 text-center">
        Reimposta <span className="text-white/40">Password</span>
      </h1>
      {error && <p className="text-red-400 text-sm font-medium">{error}</p>}
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Nuova password (min 6 caratteri)"
        className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 outline-none focus:border-white/50 transition-colors font-medium text-sm placeholder:text-white/30"
        required
      />
      <input
        type="password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        placeholder="Conferma nuova password"
        className="w-full rounded-full border border-white/20 bg-white/10 px-5 py-3 outline-none focus:border-white/50 transition-colors font-medium text-sm placeholder:text-white/30"
        required
      />
      <button
        type="submit"
        disabled={status === 'loading' || !token}
        className="w-full rounded-full bg-white py-3 font-medium text-black hover:bg-white/85 transition-colors disabled:opacity-40 cursor-pointer"
      >
        {status === 'loading' ? 'Aggiornamento...' : 'Aggiorna password'}
      </button>
      {!token && (
        <p className="text-center text-white/40 text-xs font-medium">Link non valido: token mancante.</p>
      )}
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center px-4 py-24">
      <Suspense fallback={<p className="text-white/40">Caricamento...</p>}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
