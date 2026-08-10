'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { docContent } from './constants';
import { useGoBack } from './useGoBack';

interface DocPageProps {
  selectedDocCategory?: string;
  setSelectedDocCategory?: (category: string) => void;
  onBack?: () => void;
}

export default function DocPage({ selectedDocCategory, setSelectedDocCategory, onBack }: DocPageProps) {
  // Uso standalone (es. route /metodo): categoria e back gestiti internamente
  const [internalCategory, setInternalCategory] = useState('introduzione');
  const goBack = useGoBack();

  const category = selectedDocCategory ?? internalCategory;
  const setCategory = setSelectedDocCategory ?? setInternalCategory;
  const handleBack = onBack ?? goBack;

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
          <h3 className="text-xs font-mono uppercase tracking-[0.2em] text-white/80">Knowledge Base</h3>
          <p className="text-[10px] text-white/40 font-mono mt-1">V 1.0.2 / 2026</p>
        </div>
        {Object.keys(docContent)
          .sort((a, b) => {
            const order = ['introduzione', 'neuroscienza', 'sistemi', 'deep-work', 'atomic-gains', 'legge-1-percento', 'stacking-abitudini', 'progettazione-ambiente', 'identita', '2-minuti', 'breaking-bad', 'tracciamento', 'pazienza'];
            return order.indexOf(a) - order.indexOf(b);
          })
          .map((key) => (
            <button
              key={key}
              onClick={() => setCategory(key)}
              className={`text-left px-5 py-3 rounded-xl font-medium text-xs transition-all cursor-pointer ${
                category === key 
                  ? 'bg-white text-black shadow-lg' 
                  : 'text-white/40 hover:text-white hover:bg-white/10'
              }`}
              aria-label={`Mostra sezione ${key.replace('-', ' ')}`}
            >
              {key.replace('-', ' ')}
            </button>
          ))}
        <hr className="my-5 border-white/15" />
        <button 
          onClick={handleBack}
          className="text-left px-5 py-3 text-white/40 hover:text-white font-medium text-[10px] flex items-center gap-2 transition-colors cursor-pointer"
          aria-label="Torna alla Home"
        >
          <X size={12} aria-hidden="true" /> Torna alla Home
        </button>
      </aside>

      {/* Content Area */}
      <main className="flex-1 bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 relative overflow-hidden backdrop-blur-md">
        <AnimatePresence mode="wait">
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
             <div className="flex items-center gap-3 mb-6">
               <div className="w-1.5 h-6 bg-white rounded-full" />
               <h2 className="text-3xl md:text-5xl font-normal leading-[1.05] tracking-tight">
                 {docContent[category].title}
               </h2>
             </div>
             <p className="text-white/60 text-base md:text-lg leading-relaxed max-w-3xl mb-8">
               {docContent[category].content}
             </p>
             
             {(docContent[category].insights || docContent[category].action) && (
               <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
                 {docContent[category].insights && (
                   <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                     <h4 className="text-xs font-mono uppercase tracking-[0.15em] text-white/70 mb-3">Insights</h4>
                     <p className="text-white/60 text-xs leading-relaxed">{docContent[category].insights}</p>
                   </div>
                 )}
                 {docContent[category].action && (
                   <div className="p-6 bg-white/10 rounded-2xl border border-white/15">
                     <h4 className="text-xs font-mono uppercase tracking-[0.15em] text-white/80 mb-3">Action Item</h4>
                     <p className="text-white/60 text-xs leading-relaxed">{docContent[category].action}</p>
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
