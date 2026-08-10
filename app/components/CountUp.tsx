'use client';

import { useEffect, useRef, useState } from 'react';

interface CountUpProps {
  /** Target value to count up to. */
  value: number;
  /** Total animation duration in ms. */
  duration?: number;
  /** Extra delay before the count starts (ms) — useful for staggering. */
  delay?: number;
  className?: string;
}

export default function CountUp({ value, duration = 1200, delay = 0, className = '' }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef(0);
  const startedRef = useRef(false);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // The value changed after a previous run — just snap to the final value.
    if (startedRef.current) {
      setDisplay(value);
      return;
    }

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || startedRef.current) return;
        startedRef.current = true;
        observer.disconnect();

        if (reduceMotion || value === 0) {
          setDisplay(value);
          return;
        }

        const start = performance.now() + delay;
        const tick = (now: number) => {
          const t = Math.min(1, Math.max(0, (now - start) / duration));
          const eased = 1 - Math.pow(1 - t, 3); // ease-out cubic
          setDisplay(Math.round(eased * value));
          if (t < 1) rafRef.current = requestAnimationFrame(tick);
        };
        rafRef.current = requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => {
      cancelAnimationFrame(rafRef.current);
      observer.disconnect();
    };
  }, [value, duration, delay]);

  return (
    <span ref={ref} className={`tabular-nums ${className}`}>
      {display}
    </span>
  );
}
