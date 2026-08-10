'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Scale, Users, CreditCard, AlertTriangle, CheckCircle, XCircle, Mail, type LucideIcon } from 'lucide-react';

interface TermsPageProps {
  onBack: () => void;
}

interface Section {
  title: string;
  icon: LucideIcon;
  content: string[];
}

export default function TermsPage({ onBack }: TermsPageProps) {
  const lastUpdate = '23 Aprile 2026';

  const sections: Section[] = [
    {
      title: '1. Accettazione dei Termini',
      icon: CheckCircle,
      content: [
        'Utilizzando OmniHabit, accetti integralmente i presenti Termini di Servizio.',
        'Se non sei d\'accordo con qualsiasi termine, non utilizzare il servizio.',
        'Ci riserviamo il diritto di modificare i termini in qualsiasi momento.'
      ]
    },
    {
      title: '2. Descrizione del Servizio',
      icon: FileText,
      content: [
        'OmniHabit è una piattaforma di tracciamento abitudini e sviluppo personale.',
        'Il servizio include l\'AI-powered plan generation, dashboard delle abitudini e analisi dei progressi.',
        'Il servizio è fornito "così com\'è" senza garanzie specifiche di risultato.'
      ]
    },
    {
      title: '3. Account e Registrazione',
      icon: Users,
      content: [
        'Sei responsabile del mantenimento della sicurezza del tuo account.',
        'Le informazioni fornite durante la registrazione devono essere accurate e aggiornate.',
        'Un solo account per persona. Non condividere le tue credenziali.'
      ]
    },
    {
      title: '4. Utilizzo del Servizio',
      icon: Scale,
      content: [
        'Accetti di utilizzare OmniHabit solo per scopi legittimi e leciti.',
        'Non puoi utilizzare il servizio per violare leggi o regolamenti.',
        'Non puoi interferire con il funzionamento normale del servizio.',
        'Non puoi copiare, modificare o distribuire il contenuto senza autorizzazione.'
      ]
    },
    {
      title: '5. Pagamenti e Fatturazione',
      icon: CreditCard,
      content: [
        'OmniHabit offre attualmente un piano gratuito con funzionalità base.',
        'Eventuali piani a pagamento saranno chiaramente identificati con prezzo e periodo di fatturazione.',
        'I pagamenti sono processati in modo sicuro attraverso provider terzi.',
        'Nessun rimborso per abbonamenti cancellati a metà periodo, salvo diversa disposizione di legge.'
      ]
    },
    {
      title: '6. Limitazione di Responsabilità',
      icon: AlertTriangle,
      content: [
        'OmniHabit non garantisce risultati specifici nel raggiungimento delle abitudini.',
        'Non siamo responsabili per eventuali danni diretti, indiretti o consequenziali.',
        'Il servizio può essere interrotto per manutenzione o cause di forza maggiore.',
        'Non garantiamo la compatibilità con tutti i dispositivi o browser.'
      ]
    },
    {
      title: '7. Proprietà Intellettuale',
      icon: FileText,
      content: [
        'Tutti i contenuti, loghi e materiali sono di proprietà di OmniHabit o dei rispettivi titolari.',
        'Non puoi utilizzare il marchio OmniHabit senza autorizzazione scritta.',
        'I contenuti generati dagli utenti rimangono di loro proprietà, ma concedi a OmniHabit il diritto di utilizzarli per fornire il servizio.'
      ]
    },
    {
      title: '8. Cessazione',
      icon: XCircle,
      content: [
        'Puoi cancellare il tuo account in qualsiasi momento dalla dashboard.',
        'Ci riserviamo il diritto di sospendere o terminare l\'accesso in caso di violazione dei termini.',
        'Alla cessazione, i tuoi dati saranno cancellati secondo la nostra Privacy Policy.',
        'Alcune disposizioni sopravvivono alla cessazione del contratto.'
      ]
    },
    {
      title: '9. Diritti Applicabili',
      icon: Scale,
      content: [
        'Questi termini sono regolati dalla legge italiana.',
        'Eventuali controversie saranno risolte presso i tribunali di Milano.',
        'Se una clausola è considerata invalida, le restanti rimangono valide.'
      ]
    },
    {
      title: '10. Contatti',
      icon: Users,
      content: [
        'Per domande sui Termini di Servizio, contattaci a: legal@omnihabit.it',
        'Indirizzo: Via deiTermini 1, 20100 Milano, Italia',
        'Telefono: +39 02 1234567'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 font-mono uppercase tracking-[0.15em] text-xs cursor-pointer"
          >
            <ArrowLeft size={18} />
            Indietro
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center">
              <FileText size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-normal tracking-tight leading-[1.05]">
                Termini di <span className="text-white/40">Servizio</span>
              </h1>
              <p className="text-white/50 mt-1">
                Ultimo aggiornamento: {lastUpdate}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Content */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-md"
          >
            <p className="text-lg text-white/70 leading-relaxed">
              Benvenuto in OmniHabit. Ti preghiamo di leggere attentamente i seguenti Termini
              di Servizio prima di utilizzare la piattaforma. Accedendo o utilizzando OmniHabit,
              accetti di essere vincolato da questi termini.
            </p>
          </motion.div>

          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * (index + 1) }}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8 backdrop-blur-md"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-white/15 rounded-xl flex items-center justify-center">
                    <Icon size={20} className="text-white" />
                  </div>
                  <h2 className="text-xl font-medium tracking-tight">
                    {section.title}
                  </h2>
                </div>
                <div className="space-y-3">
                  {section.content.map((paragraph, i) => (
                    <p key={i} className="text-sm text-white/70 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center"
        >
          <p className="text-white/40 text-sm mb-4">
            Hai domande sui termini? Contattaci
          </p>
          <a
            href="mailto:legal@omnihabit.it"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-white/85 transition-all"
          >
            <Mail size={16} />
            Contattaci
          </a>
        </motion.div>
      </div>
    </div>
  );
}
