'use client';

import { motion } from 'framer-motion';
import { Hexagon, Github, Twitter, Mail, Heart, ArrowUp, type LucideIcon } from 'lucide-react';
import Reveal from './Reveal';
import type { View, NavClickHandler } from '../types';

interface FooterProps {
  onNavClick: NavClickHandler;
}

export default function Footer({ onNavClick }: FooterProps) {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const legal: { name: string; view: View | null }[] = [
    { name: 'Privacy Policy', view: 'privacy' },
    { name: 'Termini di Servizio', view: 'terms' },
    { name: 'Cookie Policy', view: null }
  ];

  return (
    <footer className="relative border-t border-white/15 bg-background/60 backdrop-blur-md">
      <Reveal scale>
        <div className="mx-auto max-w-7xl px-5 sm:px-8 md:px-12 py-14 md:py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <Hexagon size={24} strokeWidth={1.5} className="text-white" aria-hidden="true" />
              <span className="text-lg font-medium tracking-tight text-white">omnihabit</span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed">
              Il sistema operativo per la tua evoluzione personale. Trasforma le abitudini in risultati.
            </p>
            <div className="mt-6 flex gap-3">
              {[
                { icon: Twitter, href: '#', name: 'Twitter' },
                { icon: Github, href: '#', name: 'GitHub' },
                { icon: Mail, href: 'mailto:info@omnihabit.it', name: 'Email' }
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 border border-white/15 text-white/50 hover:text-white hover:bg-white/20 transition-colors duration-300"
                  aria-label={social.name}
                >
                  <social.icon size={15} aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/50 mb-4">Prodotto</h4>
            <ul className="space-y-3">
              {[
                { name: 'Metodo', href: '#features' },
                { name: 'Timeline', href: '#months' },
                { name: 'Pricing', href: '#pricing' }
              ].map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="text-sm text-white/40 hover:text-white transition-colors duration-300">
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/50 mb-4">Azienda</h4>
            <ul className="space-y-3">
              {['Chi Siamo', 'Blog', 'Contatti'].map((name) => (
                <li key={name}>
                  <span className="text-sm text-white/40">{name}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/50 mb-4">Legale</h4>
            <ul className="space-y-3">
              {legal.map((link) => (
                <li key={link.name}>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (link.view && onNavClick) onNavClick(link.view);
                    }}
                    className="text-sm text-white/40 hover:text-white transition-colors duration-300"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/15 pt-8">
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/30">
            © 2026 OmniHabit. Tutti i diritti riservati.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-white/30 flex items-center gap-1.5">
            Made with <Heart size={11} className="text-red-500" aria-hidden="true" /> for the 1%
          </p>
          </div>
        </div>
      </Reveal>

      {/* Back to top */}
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={scrollToTop}
        className="fixed bottom-6 right-6 z-50 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/15 backdrop-blur-md text-white hover:bg-white/25 transition-colors duration-300 cursor-pointer"
        aria-label="Torna su"
      >
        <ArrowUp size={18} aria-hidden="true" />
      </motion.button>
    </footer>
  );
}
