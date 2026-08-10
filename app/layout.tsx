import type { Metadata, Viewport } from 'next';
import './globals.css';
import '@fontsource/geist-sans/400.css';
import '@fontsource/geist-sans/500.css';
import '@fontsource/geist-sans/600.css';
import '@fontsource/geist-sans/700.css';
import { SITE_NAME, SITE_URL, SITE_DESCRIPTION, SITE_KEYWORDS, faqs, steps, features } from './components/content';

const baseUrl = SITE_URL;

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: `${SITE_NAME} - Master Your Habits & Evolution`,
    template: `%s | ${SITE_NAME}`
  },
  description: SITE_DESCRIPTION,
  keywords: SITE_KEYWORDS,
  authors: [{ name: 'OmniHabit Team' }],
  creator: 'OmniHabit Team',
  publisher: 'OmniHabit',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  applicationName: SITE_NAME,
  category: 'productivity',
  formatDetection: {
    telephone: false
  },
  icons: {
    icon: '/icon.svg',
    apple: '/icon.svg'
  },
  openGraph: {
    type: 'website',
    url: baseUrl,
    siteName: SITE_NAME,
    title: `${SITE_NAME} - Master Your Habits & Evolution`,
    description: SITE_DESCRIPTION,
    locale: 'it_IT',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'OmniHabit - Master Your Habits & Evolution'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: `${SITE_NAME} - Master Your Habits & Evolution`,
    description: SITE_DESCRIPTION,
    images: ['/opengraph-image']
  },
  alternates: {
    canonical: baseUrl,
    languages: {
      'it-IT': baseUrl
    }
  }
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  colorScheme: 'dark',
  width: 'device-width',
  initialScale: 1
};

const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${baseUrl}/#organization`,
  name: SITE_NAME,
  url: baseUrl,
  logo: `${baseUrl}/icon.svg`,
  sameAs: [
    'https://twitter.com/omnihabit',
    'https://github.com/omnihabit'
  ],
  contactPoint: {
    '@type': 'ContactPoint',
    email: 'info@omnihabit.it',
    contactType: 'customer support',
    availableLanguage: 'Italian'
  }
};

const websiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${baseUrl}/#website`,
  url: baseUrl,
  name: SITE_NAME,
  description: SITE_DESCRIPTION,
  publisher: {
    '@id': `${baseUrl}/#organization`
  },
  inLanguage: 'it-IT'
};

const webApplicationSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: SITE_NAME,
  url: baseUrl,
  description: SITE_DESCRIPTION,
  applicationCategory: 'LifestyleApplication',
  operatingSystem: 'Any',
  browserRequirements: 'Requires JavaScript',
  offers: {
    '@type': 'AggregateOffer',
    lowPrice: '0',
    highPrice: '29',
    priceCurrency: 'EUR',
    offerCount: '4'
  },
  featureList: features.map((f) => f.title),
  inLanguage: 'it-IT'
};

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer
    }
  }))
};

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'Come iniziare con OmniHabit',
  description: 'Inizia a tracciare le tue abitudini in quattro semplici passaggi.',
  totalTime: 'PT10M',
  estimatedCost: {
    '@type': 'MonetaryAmount',
    currency: 'EUR',
    value: '0'
  },
  step: steps.map((step, i) => ({
    '@type': 'HowToStep',
    position: i + 1,
    name: step.title,
    text: step.description
  }))
};

const structuredData = [organizationSchema, websiteSchema, webApplicationSchema, faqSchema, howToSchema];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <head>
        <link rel="canonical" href={baseUrl} />
        {structuredData.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body>{children}</body>
    </html>
  );
}
