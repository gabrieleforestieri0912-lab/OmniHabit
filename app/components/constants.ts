export const months = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
];

export const quarters = [
  months.slice(0, 4),
  months.slice(4, 8),
  months.slice(8, 12)
];

export const COLORS = ['#ffffff', '#1a1a1a'];

export const API_URL = '/api';

export interface DocSection {
  title: string;
  content: string;
  insights?: string;
  action?: string;
}

export const docContent: Record<string, DocSection> = {
  introduzione: {
    title: "Il Protocollo OmniHabit",
    content: "OmniHabit non è un semplice tracker. È un sistema operativo per la tua evoluzione biologica e mentale. Qui impariamo a hackerare i circuiti della dopamina per trasformare lo sforzo in automatismo. La nostra filosofia si basa sulla precisione chirurgica dell'azione quotidiana."
  },
  neuroscienza: {
    title: "Neuroplasticità Applicata",
    content: "Ogni volta che completi un'abitudine, rinforzi una connessione sinaptica. La ripetizione costante mielinizza i percorsi neurali, rendendo l'azione sempre più fluida e meno costosa in termini di energia cognitiva. Il tracciamento visivo serve a fornire il feedback immediato necessario per il rilascio di dopamina, chiudendo il loop dell'abitudine."
  },
  sistemi: {
    title: "Sistemi vs Obiettivi",
    content: "Gli obiettivi servono a impostare la direzione, ma i sistemi sono ciò che determina il progresso. Chi vince e chi perde ha spesso gli stessi obiettivi; la differenza risiede nella qualità del sistema. OmniHabit si focalizza sulla costruzione di un'infrastruttura quotidiana indistruttibile."
  },
  "deep-work": {
    title: "Focus Estremo (Deep Work)",
    content: "In un'economia dell'attenzione, la capacità di concentrarsi profondamente è un superpowere. Le abitudini mensili che tracci qui devono supportare i tuoi blocchi di Deep Work. Elimina le distrazioni, imposta l'ambiente e lascia che il sistema tracci la tua costanza."
  },
  "atomic-gains": {
    title: "Guadagni Atomici",
    content: "Un miglioramento dell'1% ogni giorno porta a essere 37 volte migliori dopo un anno. Non cercare il salto quantico immediato; cerca la vittoria atomica. La costanza batte l'intensità in ogni singolo scenario di lungo periodo."
  },
  "legge-1-percento": {
    title: "La Legge dell'1%",
    content: "«Piccole abitudini, risultati straordinari». Ogni giorno, scegli di essere l'1% migliore. Non serve una rivoluzione: serve una routine minima che, ripetuta, diventa parte del tuo DNA comportamentale. In OmniHabit, ogni spunta è un passo verso la versione 37x di te stesso.",
    insights: "La matematica compounding dell'abitudine",
    action: "Traccia un'abitudine piccola ma significativa tutti i giorni"
  },
  "stacking-abitudini": {
    title: "Habit Stacking: L'arte di concatenare",
    content: "Il modo più efficace per costruire una nuova abitudine? Agganciarla a una già esistente. Usa la formula: «Dopo [ABITUDINE ATTUALE], farò [NUOVA ABITUDINE]». Se bevi il caffè ogni mattina («Dopo il caffè, medito 2 minuti»). L'attuale diventa il trigger della nuova. Pianifica i tuoi stack direttamente nelle abitudini mensili.",
    insights: "Il cervello cerca correlazioni temporali",
    action: "Identifica 3 abitudini solide e agganciane una nuova a ciascuna"
  },
  "progettazione-ambiente": {
    title: "Il Potere dell'Ambiente",
    content: "La volontà è una risorsa finita. Modifica lo spazio invece della mente. Se vuoi leggere di più, tieni il libro sul cuscino. Se vuoi evitare lo smartphone, mettilo in un'altra stanza. La legge di minima resistenza: ciò che è più accessibile viene fatto. Progetta ambienti che rendano le buone abitudini inevitabili e quelle cattive impossibili.",
    insights: "L'ambiente batte la motivazione nel lungo termine",
    action: "Rimuovi 3 fonti di distrazione dalla tua camera da letto/studio"
  },
  "identità": {
    title: "Identity-Based Habits",
    content: "Non agire per raggiungere un obiettivo, agisci per diventare qualcuno. Cambia l'identità, non il comportamento. Invece di «Voglio correre una maratona», pensa «Sono un corridore». Ogni piccola azione che compi è un voto per il tipo di persona che vuoi essere. Le tue azioni votano ogni giorno per: «Sono la persona che rispetta i propri impegni».",
    insights: "I comportamenti allineati all'identità non richiedono motivazione",
    action: "Scrivi 3 identità che vuoi incarnare e agisci come se fossi già quella persona"
  },
  "2-minuti": {
    title: "La Regola dei 2 Minuti (2-Minute Rule)",
    content: "Come iniziare quando non hai voglia? Semplifica l'abitudine a una versione di 2 minuti. «Leggi» diventa «Leggi una pagina». «Medita» diventa «Respira profondamente 2 volte». L'obiettivo è mostrare présence, non performance. La regolarità costruisce più fiducia della perfezione. Una volta iniziato, spesso continui; ma anche se fermi ai 2 minuti, hai vinto la battaglia della resistenza.",
    insights: "Standardizzare prima, ottimizzare dopo",
    action: "Prendi ogni abitudine e riduci la sua versione minima a 2 minuti"
  },
  "breaking-bad": {
    title: "Spezzare le Cattive Abitudini",
    content: "Per eliminare un'abitudine, rendila invisibile, impossibile, scomoda o insoddisfacente. 1) Invisibile: rimuovi i trigger (es. disiscriviti dalle notifiche). 2) Impossibile: alza la barriera d'ingresso (es. cancella l'app dal telefono). 3) Scomoda: aggiungi attriti. 4) Insoddisfacente: associa una conseguenza negativa. Invece di reprimere, sostituisci: al posto dello scrolling, tieni un libro a portata di mano.",
    insights: "La rimozione è più potente dell'astinenza",
    action: "Scegli 1 cattiva abitudine e applica 2 delle 4 strategie sopra"
  },
  "tracciamento": {
    title: "Il Potere del Tracking",
    content: "«Ciò che viene misurato viene gestito». Il tracciamento visivo in OmniHabit non è un semplice diario: è un meccanismo di feedback dopaminergico. Ogni spunta creata rilascia una piccola ondata di soddisfazione. Non guardare solo alla streak, ma alla coerenza. La domanda giusta non è «Quanto?», ma «Hai mantenuto l'impegno con te stesso?». Il sistema esiste per ricordarti chi sei.",
    insights: "La visibility delle abitudini aumenta la responsabilità",
    action: "Controlla le tue streak ogni mattina e celebra ogni giorno consecutivo"
  },
  "pazienza": {
    title: "Pazienza e Processo",
    content: "Il valore di un'abitudine non è in un singolo momento, ma nella somma di mille decisioni minori. Smettere per un giorno non摧毁a la streak (a volte la fortifica ricordandoti il prezzo). Ricomincia immediatamente. Il «Non importa se sbagli, importa che riprenda» è il mantra. In OmniHabit, il valore è nel processo: il numero è solo un effetto collaterale.",
    insights: "L'errore singolo insegna più della perfezione",
    action: "Se rompi una streak, non rimandare al mese prossimo: ricominzia domani"
  }
};