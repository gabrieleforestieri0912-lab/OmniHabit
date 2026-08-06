'use client';

import { motion } from 'framer-motion';
import { BookOpen, Brain, Zap, TrendingUp, LayoutGrid } from 'lucide-react';

export default function DocAccessSection({ onNavigate }) {
  return (
    <section id="doc-access" className="py-20 md:py-40 px-4 md:px-6 bg-black relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-purple-600/5 blur-[120px] -z-10" />
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex-1 text-left"
          >
            <h2 className="text-4xl md:text-7xl font-black uppercase italic tracking-tighter leading-tight mb-8">
              LA SCIENZA DELLE <span className="text-purple-500">ABITUDINI</span>
            </h2>
            <p className="text-white/40 text-lg md:text-xl font-medium mb-10 leading-relaxed italic">
              Accedi alla nostra base di conoscenza per scoprire come neuroscienza e sistemi operativi possono accelerare la tua evoluzione.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onNavigate('doc')}
              className="bg-white text-black px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs cursor-pointer flex items-center gap-4 hover:bg-purple-500 hover:text-white transition-all shadow-2xl"
              aria-label="Apri documentazione"
            >
              Esplora la Documentazione
              <BookOpen size={18} strokeWidth={3} aria-hidden="true" />
            </motion.button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex-1 grid grid-cols-2 gap-4"
          >
            {[Brain, Zap, TrendingUp, LayoutGrid].map((Icon, i) => (
              <div key={i} className="aspect-square bg-white/3 border border-white/5 rounded-3xl flex items-center justify-center group hover:border-purple-500/30 transition-all duration-500">
                <Icon size={40} className="text-white/20 group-hover:text-purple-500 group-hover:scale-110 transition-all" aria-hidden="true" />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}