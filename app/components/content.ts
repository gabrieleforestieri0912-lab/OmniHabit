export interface Faq {
  question: string;
  answer: string;
}

export const faqs: Faq[] = [
  {
    question: "Cos'è OmniHabit?",
    answer: "OmniHabit è una piattaforma di tracciamento abitudini che combina un design minimalista con potenti strumenti basati sulla neuroscienza. Ti aiuta a costruire e mantenere abitudini positive attraverso un sistema di persistence che premia la costanza."
  },
  {
    question: 'È completamente gratuito?',
    answer: 'Sì, OmniHabit è completamente gratuito. Non richiede carta di credito e non ci sono funzionalità nascoste a pagamento. Ti bastano pochi secondi per registrarti e iniziare.'
  },
  {
    question: 'Come funziona il tracciamento?',
    answer: 'Seleziona i mesi, aggiungi le abitudini che vuoi sviluppare e segna ogni giorno i tuoi progressi. Più giorni consecutivi completi, più alta sarà la tua streak. Il sistema premia la costanza.'
  },
  {
    question: "Posso usare l'AI Assistant?",
    answer: "Certamente! OmniMind, l'AI Assistant di OmniHabit, è disponibile per tutti gli utenti. Puoi chiedere consigli, ricevere suggerimenti personalizzati e discutere le tue strategie per migliorare le abitudini."
  },
  {
    question: 'I miei dati sono al sicuro?',
    answer: "Assolutamente sì. Utilizziamo l'autenticazione sicura di Google e i tuoi dati sono criptati. Non condividiamo mai le tue informazioni con terze parti."
  },
  {
    question: 'Posso accedere da più dispositivi?',
    answer: 'Sì, i tuoi dati sono sincronizzati nel cloud. Accedi con lo stesso account Google da qualsiasi dispositivo e troverai sempre i tuoi progressi aggiornati.'
  }
];

export interface Step {
  number: string;
  title: string;
  description: string;
}

export const steps: Step[] = [
  { number: '01', title: 'Costruisci', description: 'Crea l\u2019abitudine con il builder guidato delle 4 Leggi: cue, identità, versione 2 minuti, ricompensa.' },
  { number: '02', title: 'Impila', description: 'Aggancia la nuova abitudine a una che già fai (habit stacking) e riduci ogni attrito.' },
  { number: '03', title: 'Ripeti', description: 'Check-in quotidiano, con la regola dei 2 minuti come rete di sicurezza nei giorni difficili.' },
  { number: '04', title: 'Non mancare due volte', description: 'Se sbagli un giorno torna subito in pista: la prima mancanza è un incidente, la seconda l\u2019inizio di una nuova abitudine.' }
];

export interface Feature {
  icon: string;
  title: string;
  description: string;
}

export const features: Feature[] = [
  {
    icon: 'Target',
    title: 'Tracciamento Preciso',
    description: 'Monitora le tue abitudini giornaliere con un sistema di persistence che premia la costanza.'
  },
  {
    icon: 'TrendingUp',
    title: 'Progresso Visivo',
    description: 'Grafici e statistiche in tempo reale per vedere la tua evoluzione nel tempo.'
  },
  {
    icon: 'Zap',
    title: 'OmniMind',
    description: "Chatta con OmniMind, l'AI coach di OmniHabit, per ricevere consigli personalizzati sulle tue abitudini."
  },
  {
    icon: 'Brain',
    title: 'Neuroscienza',
    description: 'Basato su principi scientifici di neuroplasticità e costruzione dell\u2019abitudine.'
  },
  {
    icon: 'Award',
    title: 'Achievements',
    description: 'Sblocca achievement mentre progredisci. Ogni traguardo è una vittoria.'
  },
  {
    icon: 'Shield',
    title: 'Google Auth',
    description: 'Accesso sicuro e veloce con il tuo account Google. I tuoi dati sono al sicuro.'
  }
];

export const SITE_NAME = 'OmniHabit';
export const AI_ASSISTANT_NAME = 'OmniMind';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://omnihabit.it';
export const SITE_DESCRIPTION =
  'Domina le tue abitudini con OmniHabit. Il sistema operativo gratuito per la tua evoluzione personale: tracker abitudini, AI Coach con OmniMind e piani basati su neuroscienza.';
export const SITE_KEYWORDS = [
  'tracker abitudini',
  'abitudini',
  'habit tracker',
  'neuroplasticità',
  'deep work',
  'evoluzione personale',
  'produttività',
  'sistemi abitudini',
  'streak',
  'AI coach'
].join(', ');
