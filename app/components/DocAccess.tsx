'use client';

import { motion } from 'framer-motion';
import { BookOpen, Brain, Zap, TrendingUp, LayoutGrid } from 'lucide-react';
import type { View } from '../types';

interface DocAccessProps {
  onNavigate: (view: View) => void;
}

export default function DocAccessSection({ onNavigate }: DocAccessProps) {
  return (
    <section id="doc-access" className="py-20 md:py-40 px-4 md:px-6 bg-black relative overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 text-left"
          >
            <h2 className="text-4xl md:text-6xl font-normal leading-[1.05] tracking-tight mb-8">
              La scienza delle <span className="text-white/40">abitudini</span>
            </h2>
            <p className="text-white/60 text-lg md:text-xl mb-10 leading-relaxed">
              Accedi alla nostra base di conoscenza per scoprire come neuroscienza e sistemi operativi possono accelerare la tua evoluzione.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('doc')}
              className="inline-flex items-center gap-4 rounded-full bg-white px-8 py-4 text-sm font-medium text-black hover:bg-white/85 transition-all cursor-pointer"
              aria-label="Apri documentazione"
            >
              Esplora la Documentazione
              <BookOpen size={18} strokeWidth={2} aria-hidden="true" />
            </motion.button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex-1 grid grid-cols-2 gap-4"
          >
            {[Brain, Zap, TrendingUp, LayoutGrid].map((Icon, i) => (
              <div key={i} className="aspect-square bg-white/10 border border-white/15 rounded-3xl flex items-center justify-center group hover:bg-white/15 transition-all duration-500">
                <Icon size={40} className="text-white/40 group-hover:text-white group-hover:scale-110 transition-all" aria-hidden="true" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}