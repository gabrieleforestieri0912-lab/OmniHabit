'use client';

import { motion } from 'framer-motion';
import type { CSSProperties } from 'react';

interface ShinyTextProps {
  text: string;
  baseColor?: string;
  shineColor?: string;
  speed?: number;
  gradientDegrees?: number;
  className?: string;
}

export default function ShinyText({
  text,
  baseColor = '#64CEFB',
  shineColor = '#ffffff',
  speed = 3,
  gradientDegrees = 100,
  className = '',
}: ShinyTextProps) {
  const gradientStyle: CSSProperties = {
    backgroundImage: `linear-gradient(${gradientDegrees}deg, ${baseColor} 20%, ${shineColor} 50%, ${baseColor} 80%)`,
    backgroundSize: '200% 100%',
    backgroundClip: 'text',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    color: 'transparent',
    display: 'inline-block',
  };

  return (
    <motion.span
      className={className}
      style={gradientStyle}
      animate={{ backgroundPosition: ['200% 0%', '-200% 0%'] }}
      transition={{ duration: speed, ease: 'linear', repeat: Infinity }}
      aria-hidden="true"
    >
      {text}
    </motion.span>
  );
}
