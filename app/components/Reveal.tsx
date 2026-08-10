'use client';

import { useEffect, useRef, useState } from 'react';

interface RevealProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
  /** Enables a fade + scale-in variant (used by floating glass panels) */
  scale?: boolean;
}

export default function Reveal({ children, delay = 0, className = '', scale = false }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all ease-out will-change-transform ${
        scale ? 'duration-[900ms]' : 'duration-700'
      } ${className} ${
        visible
          ? `translate-y-0 opacity-100${scale ? ' scale-100' : ''}`
          : scale
            ? 'translate-y-8 opacity-0 scale-[0.96]'
            : 'translate-y-8 opacity-0'
      }`}
    >
      {children}
    </div>
  );
}
