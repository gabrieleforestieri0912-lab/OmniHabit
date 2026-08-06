'use client';

import { Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { API_URL } from './constants';
import Reveal from './Reveal';

const plans = [
  {
    name: 'Free',
    price: '0',
    period: 'Per sempre',
    description: 'Per iniziare il tuo percorso',
    features: [
      'Tracciamento illimitato abitudini',
      'Streak tracking',
      'AI Assistant base',
      'Accesso Documenti',
      'Dashboard mensile',
      'Sincronizzazione cloud'
    ],
    popular: false,
    cta: 'Inizia Gratis',
    priceId: null
  },
  {
    name: 'Pro',
    price: '9',
    period: '/mese',
    description: 'Per chi vuole massimizzare i risultati',
    features: [
      'Tutto del piano Free',
      'AI Assistant avanzato Llama 3',
      'Piani personalizzati AI',
      'Analisi approfondite',
      'Export dati',
      'Priorità supporto'
    ],
    popular: true,
    cta: 'Passa a Pro',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_pro'
  },
  {
    name: 'Team',
    price: '29',
    period: '/mese',
    description: 'Per gruppi e organizzazioni',
    features: [
      'Tutto del piano Pro',
      'Dashboard condivisa',
      'Gestione team',
      'Analisi collettive',
      'API access',
      'Supporto dedicato 24/7'
    ],
    popular: false,
    cta: 'Inizia Team',
    priceId: process.env.NEXT_PUBLIC_STRIPE_TEAM_PRICE_ID || 'price_team'
  }
];

export default function PricingSection({ user, onAuthClick }) {
  const [loading, setLoading] = useState(false);

  const handleCheckout = async (plan) => {
    if (!plan.priceId) {
      return;
    }

    if (!user) {
      onAuthClick?.('login');
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('omni_token');
      const res = await fetch(`${API_URL}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          planName: plan.name
        })
      });

      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Errore nell\'avviare il checkout');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Errore di connessione');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="pricing" className="relative bg-[#0a0a0a] px-5 sm:px-8 md:px-12 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div className="mb-16 max-w-2xl">
          <Reveal delay={120}>
            <div className="inline-flex border-l-2 border-white bg-white/15 px-3 py-1.5 backdrop-blur-md mb-6">
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white">
                Pricing
              </span>
            </div>
          </Reveal>
          <Reveal delay={220}>
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.05] tracking-tight text-white">
              Scegli il tuo piano
            </h2>
          </Reveal>
          <Reveal delay={320}>
            <p className="mt-4 text-white/60">Inizia gratis, upgrade quando vuoi.</p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 100}>
              <div
                className={`relative flex h-full flex-col rounded-2xl border p-8 ${
                  plan.popular
                    ? 'bg-white/20 border-white/40'
                    : 'bg-white/10 border-white/15'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-white px-4 py-1 text-xs font-medium text-black">
                    Popolare
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-lg font-medium text-white">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="text-4xl font-normal tracking-tight text-white">€{plan.price}</span>
                    <span className="text-sm text-white/50">{plan.period}</span>
                  </div>
                  <p className="mt-3 text-sm text-white/50">{plan.description}</p>
                </div>

                <ul className="mb-8 space-y-3 flex-1">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <Check size={15} className="shrink-0 text-white/70" aria-hidden="true" />
                      <span className="text-sm text-white/70">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleCheckout(plan)}
                  disabled={loading}
                  className={`w-full rounded-full py-3 text-sm font-medium transition-colors duration-300 flex items-center justify-center gap-2 ${
                    plan.popular
                      ? 'bg-white text-black hover:bg-white/85'
                      : 'border border-white/25 bg-white/10 text-white hover:bg-white/20'
                  } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {loading ? <Loader2 size={16} className="animate-spin" aria-hidden="true" /> : null}
                  {plan.cta}
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
