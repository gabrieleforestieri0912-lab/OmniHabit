'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Reveal from './Reveal';
import { faqs } from './content';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <Reveal scale>
      <section id="faq" className="relative px-5 sm:px-8 md:px-12 py-16 md:py-20 mx-3 sm:mx-6 lg:mx-10 my-4 md:my-6 rounded-3xl border border-white/10 bg-background/25 backdrop-blur-sm shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_60px_-20px_rgba(0,0,0,0.7)]">
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
            <h2 className="font-display text-4xl sm:text-5xl font-medium leading-[0.9] tracking-tighter text-white drop-shadow-lg">
              Domande frequenti
            </h2>
          </Reveal>
          <Reveal delay={320}>
            <p className="mt-4 text-white/80 drop-shadow-md">Tutto quello che devi sapere su OmniHabit.</p>
          </Reveal>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <Reveal key={i} delay={i * 80}>
              <div className="rounded-xl border border-white/15 bg-white/5 backdrop-blur-sm overflow-hidden">
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
    </Reveal>
  );
}
