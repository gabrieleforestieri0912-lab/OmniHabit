'use client';

import { Hexagon, Github, Mail } from 'lucide-react';
import Reveal from './Reveal';
import type { View, NavClickHandler } from '../types';

interface FooterProps {
  onNavClick: NavClickHandler;
  currentView: string;
}

export default function Footer({ onNavClick, currentView }: FooterProps) {
  const legal: { name: string; view: View }[] = [
    { name: 'Privacy Policy', view: 'privacy' },
    { name: 'Termini di Servizio', view: 'terms' }
  ];

  const company: { name: string; view?: View; href?: string }[] = [
    { name: 'Il Metodo', view: 'doc' },
    { name: 'AI Coach', view: 'chat' },
    { name: 'Contatti', href: 'mailto:info@omnihabit.it' }
  ];

  // Stesso pattern della Navbar: da qualsiasi view torna in home e scorre alla sezione.
  const goToSection = (target: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (currentView !== 'home') {
      onNavClick('home', e);
      setTimeout(() => document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' }), 150);
    } else {
      document.getElementById(target)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const openPage = (view: View, e: React.MouseEvent) => {
    e.preventDefault();
    onNavClick(view, e);
  };

  return (
    <footer className="relative border-t border-white/15 bg-background/70">
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
                { icon: Github, href: 'https://github.com/gabrieleforestieri0912-lab/OmniHabit', name: 'GitHub', external: true },
                { icon: Mail, href: 'mailto:info@omnihabit.it', name: 'Email' }
              ].map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  {...(social.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
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
                { name: 'Metodo', target: 'features' },
                { name: 'Timeline', target: 'months' },
                { name: 'Pricing', target: 'pricing' }
              ].map((link) => (
                <li key={link.name}>
                  <a
                    href={`#${link.target}`}
                    onClick={(e) => goToSection(link.target, e)}
                    className="text-sm text-white/40 hover:text-white transition-colors duration-300"
                  >
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
              {company.map((link) => (
                <li key={link.name}>
                  {link.view ? (
                    <a
                      href="#"
                      onClick={(e) => openPage(link.view as View, e)}
                      className="text-sm text-white/40 hover:text-white transition-colors duration-300"
                    >
                      {link.name}
                    </a>
                  ) : (
                    <a href={link.href} className="text-sm text-white/40 hover:text-white transition-colors duration-300">
                      {link.name}
                    </a>
                  )}
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
                    onClick={(e) => openPage(link.view, e)}
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
          </div>
        </div>
      </Reveal>
    </footer>
  );
}
