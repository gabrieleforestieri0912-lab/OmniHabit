'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Trash2, Plus, MessageSquare, Bot, Send, Hexagon, Sparkles, Zap, Target, Brain, Menu } from 'lucide-react';
import { API_URL } from './constants';
import { AI_ASSISTANT_NAME } from './content';
import { getGlobalStats } from './utils';
import type { User, HabitsMap, ChatMessage } from '../types';

interface ChatPageProps {
  onBack: () => void;
  user: User | null;
  habits: HabitsMap;
  onAuthClick: () => void;
}

interface SavedChat {
  id: string;
  title: string;
  messages: ChatMessage[];
  updatedAt: number;
}

const quickPrompts = [
  { icon: Target, label: 'Come posso migliorare la mia produttività?' },
  { icon: Brain, label: 'Quali abitudini dovrei sviluppare?' },
  { icon: Zap, label: 'Come mantenere la costanza?' },
  { icon: Sparkles, label: 'Consigli per il deep work' }
];

function OmniMindAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 'h-8 w-8 rounded-xl',
    md: 'h-10 w-10 rounded-xl',
    lg: 'h-20 w-20 rounded-3xl'
  };
  const iconSize = { sm: 14, md: 18, lg: 34 };
  return (
    <div
      className={`${sizes[size]} flex shrink-0 items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-amber-400 shadow-[0_0_20px_rgba(168,85,247,0.35)]`}
    >
      <Hexagon size={iconSize[size]} strokeWidth={1.5} className="text-white" aria-hidden="true" />
    </div>
  );
}

export default function ChatPage({ onBack, user, habits, onAuthClick }: ChatPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<SavedChat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('omni_chat_history');
    if (saved) {
      try {
        setChatHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Parse chat history error', e);
      }
    }
  }, []);

  const saveHistory = (history: ChatMessage[]) => {
    const updated = chatHistory.map(c =>
      c.id === currentChatId ? { ...c, messages: history, updatedAt: Date.now() } : c
    );
    if (!chatHistory.find(c => c.id === currentChatId) && history.length > 0) {
      const newChat: SavedChat = {
        id: Date.now().toString(),
        title: history[0]?.content?.slice(0, 30) || 'Nuova chat',
        messages: history,
        updatedAt: Date.now()
      };
      updated.unshift(newChat);
    }
    setChatHistory(updated);
    localStorage.setItem('omni_chat_history', JSON.stringify(updated));
  };

  const startNewChat = () => {
    setCurrentChatId(null);
    setMessages([]);
    setHistoryOpen(false);
  };

  const loadChat = (chat: SavedChat) => {
    setCurrentChatId(chat.id);
    setMessages(chat.messages || []);
    setHistoryOpen(false);
  };

  const deleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = chatHistory.filter(c => c.id !== chatId);
    setChatHistory(updated);
    localStorage.setItem('omni_chat_history', JSON.stringify(updated));
    if (currentChatId === chatId) {
      startNewChat();
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setLoading(true);

    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: userMessage }];
    setMessages(newMessages);

    try {
      const token = localStorage.getItem('omni_token');
      const res = await fetch(`${API_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify({ message: userMessage, history: messages })
      });
      const data = await res.json();
      if (res.ok) {
        const updatedMessages: ChatMessage[] = [...newMessages, { role: 'assistant', content: data.response }];
        setMessages(updatedMessages);
        saveHistory(updatedMessages);
      } else {
        setMessages([...newMessages, { role: 'assistant', content: data.error || 'Errore nella comunicazione con AI' }]);
      }
    } catch {
      setMessages([...newMessages, { role: 'assistant', content: 'Connessione ad AI non disponibile. Riprova tra poco.' }]);
    }
    setLoading(false);
  };

  const historyPanel = (
    <>
      <div className="p-4 border-b border-white/10">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4 cursor-pointer"
        >
          <ArrowLeft size={16} />
          <span className="text-sm font-medium">Indietro</span>
        </button>

        <button
          onClick={startNewChat}
          className="w-full rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 text-black py-3 px-4 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
        >
          <Plus size={16} /> Nuova Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {chatHistory.length === 0 ? (
          <p className="text-white/30 text-xs text-center py-8">Nessuna cronologia</p>
        ) : (
          chatHistory.map((chat) => (
            <div
              key={chat.id}
              onClick={() => loadChat(chat)}
              className={`group p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                currentChatId === chat.id ? 'bg-white/15 border border-white/30' : 'hover:bg-white/10 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <MessageSquare size={14} className="text-white/40 flex-shrink-0" />
                <span className="text-xs font-medium truncate">{chat.title}</span>
              </div>
              <button
                onClick={(e) => deleteChat(chat.id, e)}
                className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-500 transition-all"
                aria-label="Elimina chat"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))
        )}
      </div>

      {user && (
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <img
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=ffffff&color=000&bold=true`}
              alt={user.username}
              className="w-8 h-8 rounded-full border border-white/30 object-cover"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">{user.username}</div>
              <div className="text-xs text-white/40">Livello {Math.min(10, Math.floor(getGlobalStats(habits).totalStreak / 10) + 1)}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <div className="fixed inset-0 bg-black flex">
      {!user ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-8"
          >
            <OmniMindAvatar size="lg" />
          </motion.div>
          <h2 className="font-display text-3xl font-medium tracking-tighter mb-4">Accesso Richiesto</h2>
          <p className="text-white/50 mb-8 max-w-md">
            Accedi o registrati per utilizzare {AI_ASSISTANT_NAME} e chiedere consigli personalizzati sulle tue abitudini.
          </p>
          <button
            onClick={onAuthClick}
            className="rounded-full bg-white text-black px-10 py-4 text-sm font-medium hover:bg-white/85 transition-all cursor-pointer"
          >
            Accedi ora
          </button>
        </div>
      ) : (
        <>
          {/* Sidebar — desktop */}
          <motion.aside
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="hidden md:flex w-72 bg-white/5 border-r border-white/10 flex-col h-full"
          >
            {historyPanel}
          </motion.aside>

          {/* History overlay — mobile */}
          <AnimatePresence>
            {historyOpen && (
              <motion.div
                initial={{ x: -280, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -280, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className="fixed inset-y-0 left-0 z-50 md:hidden w-72 bg-[#0a0a0a] border-r border-white/10 flex flex-col"
              >
                <div className="flex justify-end p-3">
                  <button
                    onClick={() => setHistoryOpen(false)}
                    className="p-2 text-white/50 hover:text-white transition-colors cursor-pointer"
                    aria-label="Chiudi cronologia"
                  >
                    <ArrowLeft size={16} />
                  </button>
                </div>
                {historyPanel}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main chat */}
          <main className="flex-1 flex flex-col h-full min-w-0">
            {/* Header */}
            <div className="h-16 px-4 sm:px-6 border-b border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  onClick={onBack}
                  className="md:hidden p-2 -ml-2 text-white/60 hover:text-white transition-colors cursor-pointer"
                  aria-label="Indietro"
                >
                  <ArrowLeft size={18} />
                </button>
                <OmniMindAvatar size="md" />
                <div className="min-w-0">
                  <h1 className="font-display text-lg font-medium tracking-tighter truncate">{AI_ASSISTANT_NAME}</h1>
                  <p className="text-xs text-white/40 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    Online · AI Coach
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHistoryOpen(true)}
                  className="md:hidden p-2 text-white/60 hover:text-white transition-colors cursor-pointer"
                  aria-label="Cronologia chat"
                >
                  <Menu size={18} />
                </button>
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.15em] text-white/50">
                  <Bot size={11} aria-hidden="true" />
                  {AI_ASSISTANT_NAME} · OmniHabit
                </span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center px-4">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mb-6"
                  >
                    <OmniMindAvatar size="lg" />
                  </motion.div>
                  <h3 className="font-display text-2xl font-medium tracking-tighter mb-2">
                    Ciao, sono {AI_ASSISTANT_NAME}
                  </h3>
                  <p className="text-white/40 mb-8 max-w-md">
                    Il tuo AI Coach per abitudini, produttività e neuroscienza. Chiedimi qualsiasi cosa.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                    {quickPrompts.map((prompt, i) => (
                      <motion.button
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        onClick={() => setInput(prompt.label)}
                        className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-2xl text-left hover:bg-white/10 hover:border-white/30 transition-all cursor-pointer group"
                      >
                        <prompt.icon
                          size={16}
                          className="text-white/40 shrink-0 transition-colors group-hover:text-white"
                          aria-hidden="true"
                        />
                        <p className="text-sm">{prompt.label}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>
              ) : null}

              {messages.map((msg, i) => (
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
                      <span className="text-[10px] font-semibold text-black">
                        {user?.username?.slice(0, 2).toUpperCase() || 'Tu'}
                      </span>
                    </div>
                  )}
                  <div
                    className={`max-w-[75%] px-4 py-3 ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-br from-indigo-500/90 via-purple-500/90 to-amber-400/90 text-white rounded-3xl rounded-tr-md'
                        : 'bg-white/10 border border-white/10 text-white/90 rounded-3xl rounded-tl-md'
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                </motion.div>
              ))}

              {loading && (
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
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t border-white/10">
              <div className="flex gap-2 sm:gap-3 items-center rounded-full border border-white/15 bg-white/5 pl-5 pr-2 py-2 focus-within:border-white/40 transition-colors">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={`Chiedi a ${AI_ASSISTANT_NAME}...`}
                  className="flex-1 bg-transparent outline-none text-sm font-medium placeholder:text-white/30 min-w-0"
                  disabled={loading}
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 text-black p-2.5 font-medium hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                  aria-label="Invia messaggio"
                >
                  <Send size={18} />
                </motion.button>
              </div>
              <p className="text-center text-[10px] font-mono uppercase tracking-[0.15em] text-white/30 mt-2">
                {AI_ASSISTANT_NAME} può commettere errori. Verifica le informazioni importanti.
              </p>
            </form>
          </main>
        </>
      )}
    </div>
  );
}