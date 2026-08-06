'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Shield, FileText, Lock, Eye, Trash2, Mail, Phone, MapPin } from 'lucide-react';

export default function PrivacyPage({ onBack }) {
  const lastUpdate = '23 Aprile 2026';

  const sections = [
    {
      title: '1. Informazioni Raccolte',
      icon: Eye,
      content: [
         'OmniHabit raccoglie informazioni personali che fornisci direttamente, come nome, email e dati delle abitudini.',
         'Raccogliamo anche dati di utilizzo per migliorare il servizio, inclusi tempi di accesso, preferenze e metriche di performance.',
         'Tutti i dati sono archiviati su server protetti e crittografati.'
      ]
    },
    {
      title: '2. Utilizzo dei Dati',
      icon: Shield,
      content: [
        'Utilizziamo i tuoi dati per fornire e migliorare il servizio OmniHabit.',
        'Possiamo utilizzare informazioni aggregate e anonime per analisi e statistiche.',
        'Non vendiamo i tuoi dati personali a terze parti.'
      ]
    },
    {
      title: '3. Conservazione dei Dati',
      icon: Trash2,
      content: [
        'I tuoi dati sono conservati finché il tuo account è attivo.',
        'Puoi richiedere la cancellazione completa dei tuoi dati in qualsiasi momento.',
        'Alcune informazioni possono essere mantenute per ragioni legali o di sicurezza.'
      ]
    },
    {
      title: '4. Sicurezza',
      icon: Lock,
      content: [
        'Implementiamo misure tecniche e organizzative per proteggere i tuoi dati.',
        'Utilizziamo crittografia SSL/TLS per tutte le comunicazioni.',
        'Limitiamo l\'accesso ai dati personali solo al personale autorizzato.'
      ]
    },
    {
      title: '5. Cookie e Tecnologie Simili',
      icon: FileText,
      content: [
        'OmniHabit utilizza cookie essenziali per il funzionamento del sito.',
        'Utilizziamo localStorage per salvare le preferenze dell\'utente.',
        'Puoi gestire le preferenze dei cookie attraverso le impostazioni del browser.'
      ]
    },
    {
      title: '6. I Tuoi Diritti',
      icon: Shield,
      content: [
        'Hai il diritto di accedere, correggere o cancellare i tuoi dati personali.',
        'Puoi richiedere una copia dei tuoi dati in formato strutturato.',
        'Per esercitare questi diritti, contattaci all\'indirizzo email fornito qui sotto.'
      ]
    },
    {
      title: '7. Contatti',
      icon: Mail,
      content: [
        'Per domande sulla privacy, contattaci a: privacy@omnihabit.it',
        'Indirizzo: Via dellaPrivacy 1, 20100 Milano, Italia',
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
            className="flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-6 font-black uppercase italic tracking-wider text-sm"
          >
            <ArrowLeft size={18} />
            Indietro
          </button>

          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center">
              <Shield size={32} className="text-white" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">
                Privacy <span className="text-purple-500">Policy</span>
              </h1>
              <p className="text-white/40 mt-1">
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
            className="bg-white/3 border border-white/10 rounded-2xl p-8"
          >
            <p className="text-lg font-bold italic text-white/70 leading-relaxed">
              La presente Privacy Policy descrive come OmniHabit raccoglie, utilizza e protegge
              le tue informazioni personali quando utilizzi la nostra piattaforma. Utilizzando
              OmniHabit, accetti le pratiche descritte in questa policy.
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
                className="bg-white/3 border border-white/10 rounded-2xl p-6 md:p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center">
                    <Icon size={20} className="text-purple-400" />
                  </div>
                  <h2 className="text-xl font-black uppercase italic tracking-wider text-purple-400">
                    {section.title}
                  </h2>
                </div>
                <div className="space-y-3">
                  {section.content.map((paragraph, i) => (
                    <p key={i} className="text-sm font-bold text-white/70 leading-relaxed">
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
            Hai domande sulla privacy? Contattaci
          </p>
          <a
            href="mailto:privacy@omnihabit.it"
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-black uppercase tracking-widest hover:bg-purple-500 transition-all"
          >
            <Mail size={16} />
            Contattaci
          </a>
        </motion.div>
      </div>
    </div>
  );
}
