'use client';

import { useRouter } from 'next/navigation';

/**
 * Torna alla pagina precedente; se non c'è cronologia (accesso diretto),
 * riporta alla home. Usato dalle pagine standalone (privacy, termini, metodo, chat).
 */
export function useGoBack() {
  const router = useRouter();

  return () => {
    if (typeof window !== 'undefined' && window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  };
}
