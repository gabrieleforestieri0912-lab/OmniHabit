'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';
import { Menu, X, Hexagon, ChevronDown, LayoutDashboard, MessageSquare, Sparkles, BookOpen, LogOut, Brain, Target, Send, FileText } from 'lucide-react';
import type { User, AuthMode, View, NavClickHandler } from '../types';

interface DropdownItem {
  label: string;
  icon?: typeof LayoutDashboard;
  href?: string;
  target?: string;
  action?: 'plan';
}

interface NavLink {
  label: string;
  target: string;
  chevron?: boolean;
  dropdown?: DropdownItem[];
}

const links: NavLink[] = [
  {
    label: 'Metodo',
    target: 'features',
    chevron: true,
    dropdown: [
      { label: 'Il Metodo', icon: FileText, href: '/metodo' },
      { label: 'Timeline', icon: Target, target: 'months' },
      { label: 'Le 4 Leggi', icon: Brain, target: 'features' }
    ]
  },
  { label: 'Timeline', target: 'months' },
  {
    label: 'AI Coach',
    target: 'ai-assistant',
    chevron: true,
    dropdown: [
      { label: 'Chat con AI', icon: Send, href: '/chat' },
      { label: 'Genera Piano', icon: Sparkles, action: 'plan' },
      { label: 'AI Assistant', icon: Brain, target: 'ai-assistant' }
    ]
  },
  { label: 'Pricing', target: 'pricing' }
];

const sectionIds = ['capability', ...links.map((l) => l.target)];
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
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { scrollY } = useScroll();
  const lastScrollY = useRef(0);
  const scrollRaf = useRef(0);

  useMotionValueEvent(scrollY, 'change', (y) => {
    lastScrollY.current = y;
    if (scrollRaf.current) return;
    scrollRaf.current = requestAnimationFrame(() => {
      scrollRaf.current = 0;
      const yv = lastScrollY.current;
      setScrolled(yv > 24);
      if (currentView !== 'home') {
        setActiveSection(null);
        return;
      }
      const probe = yv + 96;
      let current: string | null = null;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top + yv <= probe) current = sectionAliases[id] || id;
      }
      setActiveSection(current);
    });
  });

  useEffect(() => () => cancelAnimationFrame(scrollRaf.current), []);

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

  // Close dropdown when clicking outside or scrolling
  useEffect(() => {
    if (!openDropdown) return;
    const close = () => setOpenDropdown(null);
    document.addEventListener('scroll', close, { once: true, passive: true });
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-dropdown]')) setOpenDropdown(null);
    };
    document.addEventListener('mousedown', handleClick);
    return () => {
      document.removeEventListener('scroll', close);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [openDropdown]);

  const handleDropdownItem = (item: DropdownItem, e: React.MouseEvent) => {
    e.preventDefault();
    setOpenDropdown(null);
    setIsMenuOpen(false);
    if (item.action === 'plan') {
      onPlanModalOpen(true);
    } else if (item.href) {
      // Navigate via window.location for external consistency
      window.location.href = item.href;
    } else if (item.target) {
      scrollToSection(item.target, e);
    }
  };

  const scrollToSection = (target: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (currentView !== 'home') {
      onNavClick('home', e);
      setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' }), 150);
    } else {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleLinkClick = (link: NavLink, e: React.MouseEvent) => {
    if (!link.dropdown) {
      scrollToSection(link.target, e);
      setOpenDropdown(null);
    }
  };

  return (
    <motion.header
      initial={{ y: -96, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed left-0 right-0 top-[max(1rem,env(safe-area-inset-top))] z-50 mx-auto w-[calc(100%-2rem)] max-w-5xl"
    >
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
            <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-amber-400 border border-amber-400/50 rounded-full px-2 py-0.5">
              DEV
            </span>
          </button>

          {/* Center nav */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {links.map((link) => (
              <div
                key={link.label}
                className="relative"
                data-dropdown
                onMouseEnter={() => {
                  if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
                  if (link.dropdown) setOpenDropdown(link.label);
                }}
                onMouseLeave={() => {
                  if (link.dropdown) {
                    dropdownTimeoutRef.current = setTimeout(() => setOpenDropdown(null), 150);
                  }
                }}
              >
                <button
                  onClick={(e) => {
                    if (link.dropdown) {
                      setOpenDropdown(openDropdown === link.label ? null : link.label);
                    } else {
                      handleLinkClick(link, e);
                    }
                  }}
                  className="relative inline-flex items-center gap-1 text-sm text-foreground/90 hover:text-foreground transition-colors duration-300 cursor-pointer whitespace-nowrap"
                >
                  {link.label}
                  {link.chevron && (
                    <ChevronDown
                      size={14}
                      className={`text-foreground/40 transition-transform duration-300 ${
                        openDropdown === link.label ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  )}
                  {activeSection === link.target && (
                    <motion.span
                      layoutId="nav-underline"
                      className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>

                {/* Dropdown */}
                {link.dropdown && (
                  <AnimatePresence>
                    {openDropdown === link.label && (
                      <motion.div
                        initial={{ opacity: 0, y: -4, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -4, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className="absolute left-0 top-full pt-3"
                      >
                        <div className="w-56 rounded-xl border border-white/15 bg-background/95 backdrop-blur-xl p-1.5 shadow-2xl">
                          {link.dropdown.map((item) => (
                            <button
                              key={item.label}
                              onClick={(e) => handleDropdownItem(item, e)}
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs text-white/70 hover:text-white hover:bg-white/10 transition-colors duration-200 cursor-pointer text-left"
                            >
                              {item.icon && <item.icon size={14} className="text-white/40 shrink-0" aria-hidden="true" />}
                              {item.label}
                            </button>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
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

            <button
              className="md:hidden -mr-1 p-2.5 text-foreground/80 hover:text-foreground transition-colors cursor-pointer"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

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
                <div key={link.label}>
                  <button
                    onClick={(e) => {
                      if (link.dropdown) {
                        setOpenDropdown(openDropdown === link.label ? null : link.label);
                      } else {
                        scrollToSection(link.target, e);
                        setIsMenuOpen(false);
                      }
                    }}
                    className="flex items-center justify-between w-full py-3 text-foreground/80 hover:text-foreground text-sm transition-colors cursor-pointer text-left"
                  >
                    <span>{link.label}</span>
                    {link.chevron && (
                      <ChevronDown
                        size={14}
                        className={`text-foreground/40 transition-transform duration-300 ${
                          openDropdown === link.label ? 'rotate-180' : ''
                        }`}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                  {link.dropdown && openDropdown === link.label && (
                    <div className="ml-3 mb-1 border-l border-white/15 pl-3 space-y-1">
                      {link.dropdown.map((item) => (
                        <button
                          key={item.label}
                          onClick={(e) => handleDropdownItem(item, e)}
                          className="flex items-center gap-2 w-full py-2.5 text-xs text-white/60 hover:text-white transition-colors cursor-pointer text-left"
                        >
                          {item.icon && <item.icon size={14} className="text-white/40 shrink-0" />}
                          {item.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
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