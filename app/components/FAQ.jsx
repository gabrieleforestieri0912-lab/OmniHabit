'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Reveal from './Reveal';

const faqs = [
  {
    question: "Cos'è OmniHabit?",
    answer: "OmniHabit è una piattaforma di tracciamento abitudini che combina un design minimalista con potenti strumenti basati sulla neuroscienza. Ti aiuta a costruire e mantenere abitudini positive attraverso un sistema di persistence che premia la costanza."
  },
  {
    question: 'È completamente gratuito?',
    answer: 'Sì, OmniHabit è completamente gratuito. Non richiede carta di credito e non ci sono funzionalità nascoste a pagamento. Ti bastano pochi secondi per registrarti e iniziare.'
  },
  {
    question: 'Come funziona il tracciamento?',
    answer: 'Seleziona i mesi, aggiungi le abitudini che vuoi sviluppare e segna ogni giorno i tuoi progressi. Più giorni consecutivi completi, più alta sarà la tua streak. Il sistema premia la costanza.'
  },
  {
    question: "Posso usare l'AI Assistant?",
    answer: "Certamente! L'AI Assistant basato su Llama 3 è disponibile per tutti gli utenti. Puoi chiedere consigli, ricevere suggerimenti personalizzati e discutere le tue strategie per migliorare le abitudini."
  },
  {
    question: 'I miei dati sono al sicuro?',
    answer: "Assolutamente sì. Utilizziamo l'autenticazione sicura di Google e i tuoi dati sono criptati. Non condividiamo mai le tue informazioni con terze parti."
  },
  {
    question: 'Posso accedere da più dispositivi?',
    answer: 'Sì, i tuoi dati sono sincronizzati nel cloud. Accedi con lo stesso account Google da qualsiasi dispositivo e troverai sempre i tuoi progressi aggiornati.'
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" className="relative bg-[#0a0a0a] px-5 sm:px-8 md:px-12 py-24 md:py-32">
      <div className="mx-auto max-w-3xl">
        <div className="mb-14 max-w-2xl">
          <Reveal delay={120}>
            <div className="inline-flex border-l-2 border-white bg-white/15 px-3 py-1.5 backdrop-blur-md mb-6">
              <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-white">
                FAQ
              </span>
            </div>
          </Reveal>
          <Reveal delay={220}>
            <h2 className="text-4xl sm:text-5xl font-normal leading-[1.05] tracking-tight text-white">
              Domande frequenti
            </h2>
          </Reveal>
          <Reveal delay={320}>
            <p className="mt-4 text-white/60">Tutto quello che devi sapere su OmniHabit.</p>
          </Reveal>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="rounded-xl border border-white/15 bg-white/10 backdrop-blur-md overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === i ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left transition-colors duration-300 hover:bg-white/5"
                >
                  <span className="text-sm sm:text-base font-medium text-white">{faq.question}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-white/60 transition-transform duration-300 ${openIndex === i ? 'rotate-180' : ''}`}
                    aria-hidden="true"
                  />
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-sm leading-relaxed text-white/60">{faq.answer}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
