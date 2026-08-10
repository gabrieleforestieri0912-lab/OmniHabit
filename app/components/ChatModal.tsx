'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, MessageSquare, Send, Hexagon } from 'lucide-react';
import { AI_ASSISTANT_NAME } from './content';
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

function OmniMindAvatar({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const sizes = { sm: 'h-8 w-8 rounded-xl', md: 'h-10 w-10 rounded-xl' };
  const iconSizes = { sm: 14, md: 18 };
  return (
    <div className={`${sizes[size]} flex shrink-0 items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-amber-400`}>
      <Hexagon size={iconSizes[size]} strokeWidth={1.5} className="text-white" aria-hidden="true" />
    </div>
  );
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
            <p className="font-display text-base font-medium tracking-tighter">Chat con {AI_ASSISTANT_NAME}</p>
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
            {msg.role === 'assistant' ? (
              <OmniMindAvatar size="sm" />
            ) : (
              <div className="h-8 w-8 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] font-semibold text-black">Tu</span>
              </div>
            )}
            <div className={`max-w-[75%] px-4 py-3 text-sm leading-relaxed ${
              msg.role === 'user'
                ? 'bg-gradient-to-br from-indigo-500/90 via-purple-500/90 to-amber-400/90 text-white rounded-3xl rounded-tr-md'
                : 'bg-white/10 border border-white/10 text-white/90 rounded-3xl rounded-tl-md'
            }`}>
              {msg.content}
            </div>
          </motion.div>
        ))}
        {chatLoading && (
          <div className="flex gap-3">
            <OmniMindAvatar size="sm" />
            <div className="bg-white/10 border border-white/10 px-4 py-3 rounded-3xl rounded-tl-md">
              <div className="flex gap-1.5">
                <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleChatSubmit} className="p-5 border-t border-white/10 flex gap-3">
        <input
          type="text"
          value={chatInput}
          onChange={(e) => setChatInput(e.target.value)}
          placeholder={`Chiedi a ${AI_ASSISTANT_NAME}...`}
          className="flex-1 bg-white/10 border border-white/15 rounded-full px-5 py-3 outline-none focus:border-white/50 transition-colors font-medium"
          disabled={chatLoading}
        />
        <button
          type="submit"
          disabled={chatLoading || !chatInput.trim()}
          className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 text-black p-3 font-medium hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Invia"
        >
          <Send size={18} />
        </button>
      </form>
    </>
  ) : (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 via-purple-500 to-amber-400 flex items-center justify-center mb-6">
        <Hexagon size={34} strokeWidth={1.5} className="text-white" />
      </div>
      <h3 className="font-display text-2xl font-medium tracking-tighter mb-3">Accesso Richiesto</h3>
      <p className="text-white/50 mb-8 max-w-sm">
        Accedi o registrati per utilizzare {AI_ASSISTANT_NAME} e chiedere consigli personalizzati sulle tue abitudini.
      </p>
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
          className="fixed inset-0 z-100 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            className="bg-white/5 border border-white/15 backdrop-blur-2xl rounded-[28px] max-w-xl w-full h-[500px] max-h-[70vh] relative flex flex-col shadow-xl"
          >
            <button onClick={() => setChatOpen(false)} className="absolute top-5 right-5 text-white/30 hover:text-white cursor-pointer z-10" aria-label="Chiudi chat">
              <X size={16} />
            </button>

            <div className="p-5 border-b border-white/10 flex items-center gap-3">
              <OmniMindAvatar size="md" />
              <div>
                <h2 className="font-display text-xl font-medium tracking-tighter">{AI_ASSISTANT_NAME}</h2>
                <p className="text-[10px] font-mono text-white/50 uppercase tracking-[0.15em]">{AI_ASSISTANT_NAME} · OmniHabit</p>
              </div>
            </div>

            {chatContent}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}