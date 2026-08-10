'use client';

import { Check, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { API_URL } from './constants';
import Reveal from './Reveal';
import { useToast } from './ToastContext';
import type { User, AuthMode } from '../types';

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  cta: string;
  priceId: string | null;
}

const plans: PricingPlan[] = [
  {
    name: 'Free',
    price: '0',
    period: 'Per sempre',
    description: 'Per iniziare e costruire le prime abitudini',
    features: [
      'Fino a 3 abitudini attive',
      'Streak tracking base',
      'OmniMind base (5 messaggi/mese)',
      'Accesso alla Knowledge Base',
      'Dashboard mensile'
    ],
    popular: false,
    cta: 'Inizia Gratis',
    priceId: null
  },
  {
    name: 'Starter',
    price: '4',
    period: '/mese',
    description: 'Per chi vuole abitudini illimitate senza limiti',
    features: [
      'Tutto del piano Free',
      'Abitudini illimitate',
      'OmniMind AI avanzato',
      '3 piani personalizzati AI/mese',
      'Export dati CSV',
      'Supporto via email'
    ],
    popular: false,
    cta: 'Passa a Starter',
    priceId: process.env.NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID || 'price_starter'
  },
  {
    name: 'Pro',
    price: '9',
    period: '/mese',
    description: 'Per chi vuole massimizzare i risultati con l\'AI',
    features: [
      'Tutto del piano Starter',
      'Piani personalizzati AI illimitati',
      'Analisi approfondite e trend',
      'Promemoria avanzati',
      'Achievement esclusivi',
      'Priorità supporto'
    ],
    popular: true,
    cta: 'Passa a Pro',
    priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || 'price_pro'
  },
  {
    name: 'Business',
    price: '29',
    period: '/mese',
    description: 'Per team e organizzazioni ad alte prestazioni',
    features: [
      'Tutto del piano Pro',
      'Fino a 10 membri del team',
      'Dashboard condivisa',
      'Analisi collettive',
      'API access',
      'Supporto dedicato 24/7'
    ],
    popular: false,
    cta: 'Contatta le Vendite',
    priceId: process.env.NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID || 'price_business'
  }
];

interface PricingSectionProps {
  user: User | null;
  onAuthClick: (mode: AuthMode) => void;
}

export default function PricingSection({ user, onAuthClick }: PricingSectionProps) {
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const handleCheckout = async (plan: PricingPlan) => {
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
        showToast(data.error || 'Errore nell\'avviare il checkout', 'error');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      showToast('Errore di connessione', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Reveal scale>
      <section id="pricing" className="relative px-5 sm:px-8 md:px-12 py-16 md:py-20 mx-3 sm:mx-6 lg:mx-10 my-4 md:my-6 rounded-3xl border border-white/10 bg-background/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_60px_-20px_rgba(0,0,0,0.7)]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 max-w-2xl">
          <Reveal delay={120}>
            <div className="inline-flex border-l-2 border-white bg-white/15 px-3 py-1.5 backdrop-blur-md mb-6">
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white">
                Pricing
              </span>
            </div>
          </Reveal>
          <Reveal delay={220}>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-medium leading-[0.9] tracking-tighter text-white drop-shadow-lg">
              Scegli il tuo piano
            </h2>
          </Reveal>
          <Reveal delay={320}>
            <p className="mt-4 text-white/80 drop-shadow-md">Inizia gratis, upgrade quando vuoi.</p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {plans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 100}>
              <div
                className={`relative flex h-full flex-col rounded-2xl border p-8 ${
                  plan.popular
                    ? 'bg-white/10 border-white/40'
                    : 'bg-white/5 border-white/20'
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
                      : 'border border-white/25 bg-white/5 text-white hover:bg-white/10'
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
    </Reveal>
  );
}
