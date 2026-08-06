'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { docContent } from './constants';

export default function DocPage({ selectedDocCategory, setSelectedDocCategory, onBack }) {
  return (
    <motion.div
      key="doc-page"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="pt-24 pb-16 px-4 md:px-8 min-h-screen max-w-7xl mx-auto flex flex-col md:flex-row gap-8 md:gap-12"
    >
      {/* Sidebar */}
      <aside className="w-full md:w-56 flex flex-col gap-1.5 shrink-0">
        <div className="mb-6 px-4">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] text-purple-500 italic">Knowledge Base</h3>
          <p className="text-[8px] text-white/20 uppercase font-bold mt-1">V 1.0.2 / 2026</p>
        </div>
        {Object.keys(docContent)
          .sort((a, b) => {
            const order = ['introduzione', 'neuroscienza', 'sistemi', 'deep-work', 'atomic-gains', 'legge-1-percento', 'stacking-abitudini', 'progettazione-ambiente', 'identita', '2-minuti', 'breaking-bad', 'tracciamento', 'pazienza'];
            return order.indexOf(a) - order.indexOf(b);
          })
          .map((key) => (
            <button
              key={key}
              onClick={() => setSelectedDocCategory(key)}
              className={`text-left px-5 py-3 rounded-xl font-black uppercase italic tracking-widest text-xs transition-all cursor-pointer ${
                selectedDocCategory === key 
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20 translate-x-1.5' 
                  : 'text-white/30 hover:text-white hover:bg-white/5'
              }`}
              aria-label={`Mostra sezione ${key.replace('-', ' ')}`}
            >
              {key.replace('-', ' ')}
            </button>
          ))}
        <hr className="my-5 border-white/5" />
        <button 
          onClick={onBack}
          className="text-left px-5 py-3 text-white/20 hover:text-red-400 font-black uppercase italic tracking-widest text-[9px] flex items-center gap-2 transition-colors cursor-pointer"
          aria-label="Torna alla Home"
        >
          <X size={12} aria-hidden="true" /> Torna alla Home
        </button>
      </aside>

      {/* Content Area */}
      <main className="flex-1 bg-white/2 border border-white/5 rounded-[32px] p-6 md:p-10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/5 blur-[80px] -mr-32 -mt-32" />
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDocCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
             <div className="flex items-center gap-3 mb-6">
               <div className="w-1.5 h-6 bg-purple-600 rounded-full" />
               <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tight leading-none">
                 {docContent[selectedDocCategory].title}
               </h2>
             </div>
             <p className="text-white/50 text-base md:text-lg leading-relaxed font-medium max-w-3xl mb-8">
               {docContent[selectedDocCategory].content}
             </p>
             
             {(docContent[selectedDocCategory].insights || docContent[selectedDocCategory].action) && (
               <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                 {docContent[selectedDocCategory].insights && (
                   <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                     <h4 className="text-xs font-black uppercase tracking-widest text-purple-400 mb-3 italic">Insights</h4>
                     <p className="text-white/60 text-xs leading-relaxed">{docContent[selectedDocCategory].insights}</p>
                   </div>
                 )}
                 {docContent[selectedDocCategory].action && (
                   <div className="p-6 bg-purple-600/10 rounded-2xl border border-purple-500/20">
                     <h4 className="text-xs font-black uppercase tracking-widest text-purple-400 mb-3 italic">Action Item</h4>
                     <p className="text-white/60 text-xs leading-relaxed">{docContent[selectedDocCategory].action}</p>
                   </div>
                 )}
               </div>
             )}
          </motion.div>
        </AnimatePresence>
      </main>
    </motion.div>
  );
}