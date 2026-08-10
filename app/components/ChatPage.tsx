'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Trash2, Zap, Plus, LogOut, MessageSquare, Bot, Send } from 'lucide-react';
import { API_URL } from './constants';
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

export default function ChatPage({ onBack, user, habits, onAuthClick }: ChatPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<SavedChat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string | null>(null);
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
      c.id === currentChatId ? { ...c, messages: history, updatedAt: Date.now() } 
      : c
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
  };

  const loadChat = (chat: SavedChat) => {
    setCurrentChatId(chat.id);
    setMessages(chat.messages || []);
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
          ...(token ? { 'Authorization': `Bearer ${token}` } : {})
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
      setMessages([...newMessages, { role: 'assistant', content: 'Connessione ad AI non disponibile. Assicurati che Ollama sia in esecuzione.' }]);
    }
    setLoading(false);
  };

  

  const quickPrompts = [
    "Come posso migliorare la mia produttività?",
    "Quali abitudini dovrei sviluppare?",
    "Come mantenere la costanza?",
    "Consigli per il deep work"
  ];

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  return (
    <div className="fixed inset-0 bg-black flex">
      {!user ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mb-8">
            <Zap size={56} className="text-white/80" />
          </div>
          <h2 className="text-3xl font-normal tracking-tight mb-4">Accesso Richiesto</h2>
          <p className="text-white/50 mb-8 max-w-md">Accedi o registrati per utilizzare l'AI Assistant e chiedere consigli personalizzati sulle tue abitudini.</p>
          <button 
            onClick={onAuthClick}
            className="rounded-full bg-white text-black px-10 py-4 text-sm font-medium hover:bg-white/85 transition-all cursor-pointer"
          >
            Accedi ora
          </button>
        </div>
      ) : (
      <>
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-72 bg-white/5 border-r border-white/15 flex flex-col h-full"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/15">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeft size={18} />
            <span className="text-sm font-medium">Indietro</span>
          </button>
          
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={startNewChat}
            className="w-full rounded-full bg-white text-black py-3 px-4 text-xs font-medium flex items-center justify-center gap-2 cursor-pointer hover:bg-white/85 transition-colors"
          >
            <Plus size={16} /> Nuova Chat
          </motion.button>
        </div>
        
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {chatHistory.length === 0 ? (
            <p className="text-white/30 text-xs text-center py-8">Nessuna cronologia</p>
          ) : (
            chatHistory.map((chat) => (
              <div
                key={chat.id}
                onClick={() => loadChat(chat)}
                className={`group p-3 rounded-xl cursor-pointer transition-all flex items-center justify-between ${
                  currentChatId === chat.id 
                    ? 'bg-white/15 border border-white/30' 
                    : 'hover:bg-white/10 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <MessageSquare size={14} className="text-white/40 flex-shrink-0" />
                  <span className="text-xs font-medium truncate">{chat.title}</span>
                </div>
                <button
                  onClick={(e) => deleteChat(chat.id, e)}
                  className="opacity-0 group-hover:opacity-100 text-white/40 hover:text-red-500 transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            ))
          )}
        </div>
        
        {/* User Info */}
        {user && (
          <div className="p-4 border-t border-white/15">
            <div className="flex items-center gap-3">
              <img 
                src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=ffffff&color=000&bold=true`} 
                alt={user.username}
                className="w-8 h-8 rounded-full border border-white/30"
              />
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">{user.username}</div>
                <div className="text-xs text-white/40">Livello {Math.min(10, Math.floor(getGlobalStats(habits).totalStreak / 10) + 1)}</div>
              </div>
            </div>
          </div>
        )}
      </motion.aside>
      
      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col h-full">
        {/* Header */}
        <div className="h-16 px-6 border-b border-white/15 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-medium tracking-tight">AI Assistant</h1>
              <p className="text-xs text-white/40">Llama 3 • Online</p>
            </div>
          </div>
          
        </div>
        
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center px-4">
<motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="w-20 h-20 bg-white/10 rounded-3xl flex items-center justify-center mb-6 overflow-hidden"
            >
              <img src="/omnihabit.png" alt="OmniHabit" className="w-14 h-14 object-contain" />
            </motion.div>
              <h3 className="text-2xl font-normal tracking-tight mb-3">Chat con AI</h3>
              <p className="text-white/40 mb-8 max-w-md">Chiedi consigli sulle abitudini, produttività, neuroscienza o crescita personale.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-lg">
                {quickPrompts.map((prompt, i) => (
                  <motion.button
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => handleQuickPrompt(prompt)}
                    className="p-4 bg-white/5 border border-white/15 rounded-2xl text-left hover:bg-white/10 hover:border-white/30 transition-all cursor-pointer"
                  >
                    <p className="text-sm">{prompt}</p>
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
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden ${msg.role === 'user' ? 'bg-white' : 'bg-white/15'}`}>
                {msg.role === 'user' ? <span className="text-xs font-medium text-black">{user?.username?.slice(0, 2).toUpperCase() || 'Tu'}</span> : <img src="/omnihabit.png" alt="AI" className="w-6 h-6 object-contain" />}
              </div>
              <div className={`max-w-[75%] p-5 rounded-3xl ${msg.role === 'user' ? 'bg-white/15' : 'bg-white/10'}`}>
                <p className="text-sm font-medium leading-relaxed whitespace-pre-wrap">{msg.content}</p>
              </div>
            </motion.div>
          ))}
          
          {loading && (
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/15 flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img src="/omnihabit.png" alt="AI" className="w-6 h-6 object-contain" />
              </div>
              <div className="bg-white/10 p-5 rounded-3xl">
                <div className="flex gap-1">
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
        <form onSubmit={handleSubmit} className="p-4 border-t border-white/15 flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Scrivi un messaggio..."
            className="flex-1 bg-white/10 border border-white/15 rounded-full px-5 py-4 outline-none focus:border-white/50 transition-colors font-medium"
            disabled={loading}
          />
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit" 
            disabled={loading || !input.trim()}
            className="rounded-full bg-white text-black px-6 font-medium hover:bg-white/85 transition-all disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <Send size={20} />
          </motion.button>
         </form>
       </main>
     </>
   )}
 </div>
  );
}