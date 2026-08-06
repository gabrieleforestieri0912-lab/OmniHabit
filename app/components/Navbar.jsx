'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Hexagon, LayoutDashboard, MessageSquare, Sparkles, BookOpen, LogOut } from 'lucide-react';
import Reveal from './Reveal';

const links = [
  { label: 'Mesi', sup: '12', target: 'months' },
  { label: 'Metodo', sup: null, target: 'features' },
  { label: 'AI Coach', sup: null, target: 'ai-assistant' },
  { label: 'Pricing', sup: null, target: 'pricing' },
  { label: 'FAQ', sup: null, target: 'faq' }
];

export default function Navbar({
  currentView,
  onNavClick,
  user,
  onLogout,
  onAuthClick,
  onPlanModalOpen,
  isMenuOpen,
  setIsMenuOpen
}) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [userMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMenuOpen, setIsMenuOpen]);

  const scrollToSection = (target, e) => {
    e.preventDefault();
    if (currentView !== 'home') {
      onNavClick('home', e);
      setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' }), 150);
    } else {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 border-b border-white/15 bg-[#0a0a0a]/40 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 sm:px-8 md:px-12 py-4">
        {/* Logo */}
        <Reveal>
          <button
            onClick={(e) => onNavClick('home', e)}
            className="group flex items-center gap-2.5 cursor-pointer"
            aria-label="OmniHabit home"
          >
            <Hexagon
              size={24}
              strokeWidth={1.5}
              className="text-white transition-transform duration-300 group-hover:rotate-90"
              aria-hidden="true"
            />
            <span className="text-lg sm:text-xl font-medium tracking-tight text-white">
              omnihabit
            </span>
          </button>
        </Reveal>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {links.map((link, i) => (
            <Reveal key={link.label} delay={100 + i * 100}>
              <a
                href={`#${link.target}`}
                onClick={(e) => scrollToSection(link.target, e)}
                className="text-sm text-white/85 hover:text-white transition-colors duration-300"
              >
                {link.label}
                {link.sup && (
                  <sup className="ml-0.5 font-mono text-[10px] text-white/60">{link.sup}</sup>
                )}
              </a>
            </Reveal>
          ))}
        </nav>

        {/* Right CTA / user */}
        <div className="flex items-center gap-3">
          <Reveal delay={500}>
            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
                  aria-label="Menu utente"
                >
                  <img
                    src={
                      user.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username)}&background=ffffff&color=000&bold=true`
                    }
                    alt={user.username}
                    className="w-8 h-8 rounded-full border border-white/25 object-cover"
                  />
                </button>
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className="absolute right-0 top-full mt-3 w-56 rounded-xl border border-white/15 bg-[#0a0a0a]/80 backdrop-blur-xl p-2 shadow-2xl"
                    >
                      <div className="px-3 py-2 border-b border-white/15 mb-2">
                        <div className="text-sm font-medium text-white">{user.username}</div>
                        <div className="text-xs text-white/40">{user.email || 'Utente'}</div>
                      </div>
                      {[
                        { label: 'Dashboard', icon: LayoutDashboard, action: 'user-dashboard' },
                        { label: 'Chat AI', icon: MessageSquare, action: 'chat' },
                        { label: 'Genera Piano', icon: Sparkles, action: 'plan' },
                        { label: 'Piani Attivi', icon: BookOpen, action: 'plans' }
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={() => {
                            if (item.action === 'plan') onPlanModalOpen(true);
                            else onNavClick(item.action);
                            setUserMenuOpen(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2 text-xs text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors duration-300 cursor-pointer"
                        >
                          <item.icon size={14} aria-hidden="true" /> {item.label}
                        </button>
                      ))}
                      <hr className="border-white/15 my-2" />
                      <button
                        onClick={() => {
                          onLogout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-xs text-red-400 hover:bg-red-500/10 rounded-lg transition-colors duration-300 cursor-pointer"
                      >
                        <LogOut size={14} aria-hidden="true" /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                onClick={() => onAuthClick('login')}
                className="rounded-md border border-white/20 bg-white/15 backdrop-blur-md px-4 py-2 text-xs sm:px-5 sm:text-sm text-white hover:bg-white/25 transition-colors duration-300 cursor-pointer"
              >
                Get Free Consultation
              </button>
            )}
          </Reveal>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-1 text-white/80 hover:text-white transition-colors cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            ref={mobileMenuRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden mx-5 sm:mx-8 mt-2 rounded-xl border border-white/15 bg-[#0a0a0a]/90 backdrop-blur-xl p-5 flex flex-col gap-1"
          >
            {links.map((link) => (
              <a
                key={link.label}
                href={`#${link.target}`}
                onClick={(e) => scrollToSection(link.target, e)}
                className="py-3 text-white/80 hover:text-white text-sm transition-colors"
              >
                {link.label}
                {link.sup && <sup className="ml-1 font-mono text-[10px] text-white/60">{link.sup}</sup>}
              </a>
            ))}
            <hr className="border-white/15 my-2" />
            {user ? (
              <>
                {[
                  { label: 'Dashboard', action: 'user-dashboard' },
                  { label: 'Chat AI', action: 'chat' },
                  { label: 'Piani Attivi', action: 'plans' }
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={(e) => {
                      onNavClick(item.action, e);
                      setIsMenuOpen(false);
                    }}
                    className="text-left py-3 text-sm text-white/80 hover:text-white transition-colors cursor-pointer"
                  >
                    {item.label}
                  </button>
                ))}
                <button
                  onClick={() => {
                    onPlanModalOpen(true);
                    setIsMenuOpen(false);
                  }}
                  className="text-left py-3 text-sm text-white/80 hover:text-white transition-colors cursor-pointer"
                >
                  Genera Piano
                </button>
                <button
                  onClick={() => {
                    onLogout();
                    setIsMenuOpen(false);
                  }}
                  className="text-left py-3 text-sm text-red-400 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  onAuthClick('login');
                  setIsMenuOpen(false);
                }}
                className="mt-2 rounded-md border border-white/20 bg-white/15 backdrop-blur-md px-4 py-2.5 text-xs text-white hover:bg-white/25 transition-colors duration-300 cursor-pointer"
              >
                Get Free Consultation
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
