import './globals.css';

export const metadata = {
  title: 'OmniHabit - Master Your Habits & Evolution',
  description: 'Domina le tue abitudini con OmniHabit. Un sistema operativo per la tua evoluzione biologica e mentale basato su neuroscienza applicata e focus estremo.',
  keywords: 'abitudini, tracker abitudini, neuroplasticità, deep work, evoluzione personale, produttività, sistemi abitudini',
  authors: [{ name: 'OmniHabit Team' }],
  icons: {
    icon: '/omnihabit.png', // Updated to use omnihabit.png
  },
  openGraph: {
    type: 'website',
    url: 'https://omnihabit.it/',
    title: 'OmniHabit - Master Your Habits & Evolution',
    description: 'Domina le tue abitudini con OmniHabit. Un sistema operativo per la tua evoluzione biologica e mentale.',
    images: ['/omnihabit.png'], // Updated to use omnihabit.png
  },
  twitter: {
    card: 'summary_large_image',
    title: 'OmniHabit - Master Your Habits & Evolution',
    description: 'Domina le tue abitudini con OmniHabit. Un sistema operativo per la tua evoluzione biologica e mentale.',
    images: ['/omnihabit.png'], // Updated to use omnihabit.png
  },
  alternates: {
    canonical: 'https://omnihabit.it/',
  },
};

export const viewport = {
  themeColor: '#0a0a0a',
};

export default function RootLayout({ children }) {
  return (
    <html lang="it">
      <body>{children}</body>
    </html>
  );
}
