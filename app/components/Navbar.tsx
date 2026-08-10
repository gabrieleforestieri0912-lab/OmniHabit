'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, Hexagon, ChevronDown, LayoutDashboard, MessageSquare, Sparkles, BookOpen, LogOut } from 'lucide-react';
import type { User, AuthMode, View, NavClickHandler } from '../types';

const links: { label: string; target: string; chevron?: boolean }[] = [
  { label: 'Metodo', target: 'features', chevron: true },
  { label: 'Timeline', target: 'months' },
  { label: 'AI Coach', target: 'ai-assistant', chevron: true },
  { label: 'Pricing', target: 'pricing' }
];

// Ordered top-to-bottom as they appear on the page; the last section whose
// top crossed the probe wins, so the deepest one is highlighted.
const sectionIds = ['capability', ...links.map((l) => l.target)];
// Sections without a dedicated nav link map to the closest link.
const sectionAliases: Record<string, string> = { capability: 'features' };

interface NavbarProps {
  currentView: string;
  onNavClick: NavClickHandler;
  user: User | null;
  onLogout: () => void;
  onAuthClick: (mode: AuthMode) => void;
  onPlanModalOpen: (open: boolean) => void;
  isMenuOpen: boolean;
  setIsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Navbar({
  currentView,
  onNavClick,
  user,
  onLogout,
  onAuthClick,
  onPlanModalOpen,
  isMenuOpen,
  setIsMenuOpen
}: NavbarProps) {
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();

  // Navbar stays fixed at all times: scrolling only shrinks the pill slightly.
  // Also tracks the active section for the underline.
  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 24);

    // Active section indicator (home only). The probe sits just below the
    // floating navbar (~96px from the viewport top), independent of viewport
    // height, so short sections stay active while they are on screen.
    if (currentView !== 'home') {
      setActiveSection(null);
      return;
    }
    const probe = y + 96;
    let current: string | null = null;
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top + y <= probe) current = sectionAliases[id] || id;
    }
    setActiveSection(current);
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [userMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isMenuOpen, setIsMenuOpen]);

  // Initial active-section computation when entering the home view.
  useEffect(() => {
    if (currentView !== 'home') {
      setActiveSection(null);
      return;
    }
    const probe = window.scrollY + 96;
    let current: string | null = null;
    for (const id of sectionIds) {
      const el = document.getElementById(id);
      if (el && el.getBoundingClientRect().top + window.scrollY <= probe) {
        current = sectionAliases[id] || id;
      }
    }
    setActiveSection(current);
  }, [currentView]);

  const scrollToSection = (target: string, e: React.MouseEvent) => {
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
    <motion.header
      initial={{ y: -96, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed left-0 right-0 top-4 z-50 mx-auto w-[calc(100%-2rem)] max-w-5xl"
    >
      {/* Floating glass pill */}
      <div className="rounded-2xl border border-white/10 bg-background/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_60px_-20px_rgba(0,0,0,0.7)] backdrop-blur-md">
        <div
          className={`mx-auto flex items-center justify-between px-5 sm:px-8 transition-all duration-300 ${
            scrolled ? 'py-3' : 'py-4'
          }`}
        >
          {/* Logo */}
          <button
            onClick={(e) => onNavClick('home', e)}
            className="group flex items-center gap-2.5 cursor-pointer"
            aria-label="OmniHabit home"
          >
            <Hexagon
              size={24}
              strokeWidth={1.5}
              className="text-foreground transition-transform duration-300 group-hover:scale-105"
              aria-hidden="true"
            />
            <span className="text-lg sm:text-xl font-medium tracking-tight text-foreground">
              omnihabit
            </span>
          </button>

          {/* Center nav */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {links.map((link) => (
              <button
                key={link.label}
                onClick={(e) => scrollToSection(link.target, e)}
                className="relative inline-flex items-center gap-1 text-sm text-foreground/90 hover:text-foreground transition-colors duration-300 cursor-pointer whitespace-nowrap"
              >
                {link.label}
                {link.chevron && (
                  <ChevronDown size={14} className="text-foreground/40" aria-hidden="true" />
                )}
                {activeSection === link.target && (
                  <motion.span
                    layoutId="nav-underline"
                    className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          {/* Right CTA / user */}
          <div className="flex items-center gap-3">
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
                      className="absolute right-0 top-full mt-3 w-56 rounded-xl border border-white/15 bg-background/80 backdrop-blur-xl p-2 shadow-2xl"
                    >
                      <div className="px-3 py-2 border-b border-white/15 mb-2">
                        <div className="text-sm font-medium text-foreground">{user.username}</div>
                        <div className="text-xs text-white/40">{user.email || 'Utente'}</div>
                      </div>
                      {([
                        { label: 'Dashboard', icon: LayoutDashboard, action: 'user-dashboard' },
                        { label: 'Chat AI', icon: MessageSquare, action: 'chat' },
                        { label: 'Genera Piano', icon: Sparkles, action: 'plan' },
                        { label: 'Piani Attivi', icon: BookOpen, action: 'plans' }
                      ] as { label: string; icon: typeof LayoutDashboard; action: View | 'plan' }[]).map((item) => (
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
                onClick={() => onAuthClick('register')}
                className="liquid-glass rounded-full px-4 py-2 text-sm text-foreground transition-opacity duration-300 hover:opacity-90 cursor-pointer"
              >
                Sign Up
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-1 text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* 1px gradient divider inside the pill */}
        <div
          aria-hidden="true"
          className="mx-5 h-px bg-gradient-to-r from-transparent via-foreground/20 to-transparent"
        />

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              ref={mobileMenuRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden mx-4 sm:mx-6 mt-3 mb-3 rounded-xl border border-white/15 bg-background/90 backdrop-blur-xl p-5 flex flex-col gap-1"
            >
              {links.map((link) => (
                <button
                  key={link.label}
                  onClick={(e) => scrollToSection(link.target, e)}
                  className="py-3 text-foreground/80 hover:text-foreground text-sm transition-colors cursor-pointer text-left"
                >
                  {link.label}
                  {link.chevron && <ChevronDown size={14} className="inline ml-1 text-foreground/40" aria-hidden="true" />}
                </button>
              ))}
              <hr className="border-white/15 my-2" />
              {user ? (
                <>
                  {([
                    { label: 'Dashboard', action: 'user-dashboard' },
                    { label: 'Chat AI', action: 'chat' },
                    { label: 'Piani Attivi', action: 'plans' }
                  ] as { label: string; action: View }[]).map((item) => (
                    <button
                      key={item.label}
                      onClick={(e) => {
                        onNavClick(item.action, e);
                        setIsMenuOpen(false);
                      }}
                      className="text-left py-3 text-sm text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
                    >
                      {item.label}
                    </button>
                  ))}
                  <button
                    onClick={() => {
                      onPlanModalOpen(true);
                      setIsMenuOpen(false);
                    }}
                    className="text-left py-3 text-sm text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
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
                    onAuthClick('register');
                    setIsMenuOpen(false);
                  }}
                  className="liquid-glass mt-2 self-start rounded-full px-4 py-2.5 text-sm text-foreground transition-opacity duration-300 hover:opacity-90 cursor-pointer"
                >
                  Sign Up
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
