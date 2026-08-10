'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, MessageSquare } from 'lucide-react';
import type { User, AuthMode, ChatMessage } from '../types';

interface ChatModalProps {
  chatOpen: boolean;
  setChatOpen: (open: boolean) => void;
  chatMessages: ChatMessage[];
  chatInput: string;
  setChatInput: (value: string) => void;
  chatLoading: boolean;
  handleChatSubmit: (e: React.FormEvent) => void;
  user: User | null;
  onAuthClick: (mode: AuthMode) => void;
}

export default function ChatModal({
  chatOpen,
  setChatOpen,
  chatMessages,
  chatInput,
  setChatInput,
  chatLoading,
  handleChatSubmit,
  user,
  onAuthClick
}: ChatModalProps) {
  const chatContent = user ? (
    <>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {chatMessages.length === 0 && (
          <div className="text-center text-white/40 py-8">
            <MessageSquare size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-base font-normal">Chat con AI</p>
            <p className="text-sm text-white/50">Chiedi consigli sulle abitudini, produttività o crescita personale</p>
          </div>
        )}
        {chatMessages.map((msg, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
          >
            <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden ${msg.role === 'user' ? 'bg-white' : 'bg-white/15'}`}>
              {msg.role === 'user' ? <span className="text-xs font-medium text-black">Tu</span> : <img src="/omnihabit.png" alt="AI" className="w-5 h-5 object-contain" />}
            </div>
            <div className={`max-w-[75%] p-3 rounded-2xl ${msg.role === 'user' ? 'bg-white/15' : 'bg-white/10'}`}>
              <p className="text-sm leading-relaxed">{msg.content}</p>
            </div>
          </motion.div>
        ))}
        {chatLoading && (
          <div className="flex gap-3">
            <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center flex-shrink-0 overflow-hidden">
              <img src="/omnihabit.png" alt="AI" className="w-5 h-5 object-contain" />
            </div>
            <div className="bg-white/10 p-3 rounded-2xl">
              <p className="text-sm text-white/60">Scrivendo...</p>
            </div>
          </div>
        )}
      </div>
      
      <form onSubmit={handleChatSubmit} className="p-5 border-t border-white/15 flex gap-3">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder="Chiedi consigli..."
          className="flex-1 bg-white/10 border border-white/15 rounded-full px-5 py-3 outline-none focus:border-white/50 transition-colors font-medium"
          disabled={chatLoading}
        />
        <button 
          type="submit" 
          disabled={chatLoading || !chatInput.trim()}
          className="rounded-full bg-white text-black px-6 py-3 text-xs font-medium uppercase tracking-wide hover:bg-white/85 transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
        >
          Invia
        </button>
      </form>
    </>
  ) : (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6">
        <Zap size={40} className="text-white/80" />
      </div>
      <h3 className="text-2xl font-normal tracking-tight mb-3">Accesso Richiesto</h3>
      <p className="text-white/50 mb-8 max-w-sm">Accedi o registrati per utilizzare l'AI Assistant e chiedere consigli personalizzati sulle tue abitudini.</p>
      <button 
        onClick={() => { setChatOpen(false); onAuthClick('login'); }}
        className="rounded-full bg-white text-black px-8 py-4 text-sm font-medium hover:bg-white/85 transition-all cursor-pointer"
      >
        Accedi ora
      </button>
    </div>
  );

  return (
    <AnimatePresence>
      {chatOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-100 bg-black/80 backdrop-blur-2xl flex items-center justify-center p-3"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white/5 border border-white/15 backdrop-blur-2xl rounded-[28px] max-w-xl w-full h-[500px] max-h-[70vh] relative flex flex-col shadow-xl"
          >
            <button onClick={() => setChatOpen(false)} className="absolute top-5 right-5 text-white/30 hover:text-white cursor-pointer z-10" aria-label="Chiudi chat"><X size={16} /></button>
            
            <div className="p-5 border-b border-white/15 flex items-center gap-3">
              <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center overflow-hidden">
                <img src="/omnihabit.png" alt="OmniHabit" className="w-7 h-7 object-contain" />
              </div>
              <div>
                <h2 className="text-xl font-medium tracking-tight">AI Assistant</h2>
                <p className="text-[10px] font-mono text-white/50 uppercase tracking-[0.15em]">Llama 3 • OmniHabit</p>
              </div>
            </div>
            
            {chatContent}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}