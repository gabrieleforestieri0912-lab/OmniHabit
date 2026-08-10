'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Hexagon } from 'lucide-react';
import ScrollVideo from './ScrollVideo';

export const authInputClass =
  'w-full rounded-full border border-white/20 bg-white/5 px-5 py-3 outline-none focus:border-white/50 transition-colors font-medium text-sm placeholder:text-white/30';

interface AuthShellProps {
  children: React.ReactNode;
}

export default function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background text-foreground">
      <ScrollVideo />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="w-full max-w-md"
        >
          {/* Brand */}
          <Link
            href="/"
            className="mb-8 inline-flex items-center gap-2.5 transition-opacity duration-300 hover:opacity-80"
            aria-label="OmniHabit home"
          >
            <Hexagon size={28} strokeWidth={1.5} className="text-foreground" aria-hidden="true" />
            <span className="text-xl font-medium tracking-tight text-foreground drop-shadow-md">
              omnihabit
            </span>
          </Link>

          {/* Glass card */}
          <div className="rounded-3xl border border-white/15 bg-background/40 p-6 sm:p-10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06),0_20px_60px_-20px_rgba(0,0,0,0.7)] backdrop-blur-xl">
            {children}
          </div>

        </motion.div>
      </div>
    </div>
  );
}
