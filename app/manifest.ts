import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'OmniHabit - Master Your Habits & Evolution',
    short_name: 'OmniHabit',
    description:
      'Domina le tue abitudini con OmniHabit. Il sistema operativo gratuito per la tua evoluzione personale: tracker abitudini, AI Coach con OmniMind e piani basati su neuroscienza.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    orientation: 'portrait-primary',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
        purpose: 'any'
      }
    ]
  };
}
