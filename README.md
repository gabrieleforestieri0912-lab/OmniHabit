# OmniHabit

> Il sistema operativo per la tua evoluzione personale — abitudini costruite sul metodo **Atomic Habits** di James Clear, con AI Coach integrata.

OmniHabit è una piattaforma web full-stack per costruire abitudini che durano: applica le **4 Leggi del Cambiamento** (Rendila ovvia, attraente, facile, soddisfacente), organizza il percorso in **quadrimestri** che partono dal mese corrente, traccia streak ed EXP e offre un **AI Coach (OmniMind)** per piani personalizzati e supporto quotidiano.

---

## ✨ Funzionalità principali

- **Habit Builder · Le 4 Leggi** — creazione guidata di abitudini con cue, identità, versione 2 minuti e ricompensa (Atomic Habits)
- **Timeline per quadrimestri** — percorso che parte dal mese corrente per incentivare l'inizio immediato
- **Dashboard mensile** — grafico di completamento (Recharts), strike totale, neuro-feedback, sistema EXP/livello
- **User Dashboard** — progresso settimanale, tendenza mensile (ultimi 6 mesi), riepilogo mesi cliccabile, achievements
- **OmniMind AI Coach** — chat intelligente + generatore di piani personalizzati (4 Leggi applicate)
- **Promemoria basati su cue** (orario e luogo) con notifiche browser
- **Autenticazione completa** — email/password (JWT) + Google OAuth, pagine dedicate `/login`, `/register`, `/forgot-password`, `/reset-password`
- **Abbonamenti Stripe** — piani Free / Starter / Pro / Business, fatturazione mensile o annuale (2 mesi gratis)
- **Landing cinematografica** — video scroll-scrubbed, navbar fluttuante animata, pannelli liquid-glass, statistiche animate

---

## 🧱 Stack tecnologico

| Livello | Tecnologia |
|---|---|
| Frontend | Next.js 15 (App Router) · React 19 · TypeScript · Tailwind CSS v4 |
| UI/Animazioni | framer-motion · lucide-react · recharts · Geist Sans / General Sans |
| Database | Supabase (Postgres) — accesso server-side via service role |
| Auth | JWT (`jsonwebtoken`) + `bcryptjs` · Google OAuth |
| Pagamenti | Stripe (checkout session + webhook) |
| AI | Provider pluggable: OpenAI-compatible (`AI_BASE_URL`) o Ollama locale |
| Email | Nodemailer (SMTP) — fallback console in dev |
| Test | Node test runner via `tsx --test` |

---

## 🚀 Avvio rapido

### Prerequisiti
- Node.js ≥ 18
- Un progetto Supabase (con le tabelle: `users`, `habits`, `plans`, …)
- *(Opzionale)* Chiavi Stripe, OAuth Google, provider AI

### Installazione

```bash
# 1. Clona e installa le dipendenze
git clone https://github.com/gabrieleforestieri0912-lab/OmniHabit.git
cd omnihabit
npm install

# 2. Configura le variabili d'ambiente
cp .env.example .env.local   # oppure crea .env.local a mano (vedi tabella sotto)

# 3. Avvia in sviluppo
npm run dev
```

Apri [http://localhost:3000](http://localhost:3000).

### 🔧 Variabili d'ambiente (`.env.local`)

| Variabile | Descrizione |
|---|---|
| `SUPABASE_URL` | URL del progetto Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key di Supabase (server-only) |
| `JWT_SECRET` | Segreto per firmare i token JWT |
| `GOOGLE_CLIENT_ID` | Client ID dell'app OAuth Google |
| `GOOGLE_CLIENT_SECRET` | Client secret OAuth Google |
| `GOOGLE_REDIRECT_URI` | URI di callback (default `http://localhost:3000/api/auth/google/callback`) |
| `STRIPE_SECRET_KEY` | Secret key Stripe |
| `FRONTEND_URL` | URL del frontend per i redirect Stripe (default `http://localhost:3000`) |
| `NEXT_PUBLIC_STRIPE_STARTER_PRICE_ID` | Price ID Stripe — Starter mensile |
| `NEXT_PUBLIC_STRIPE_PRO_PRICE_ID` | Price ID Stripe — Pro mensile |
| `NEXT_PUBLIC_STRIPE_BUSINESS_PRICE_ID` | Price ID Stripe — Business mensile |
| `NEXT_PUBLIC_STRIPE_STARTER_ANNUAL_PRICE_ID` | Price ID Stripe — Starter annuale |
| `NEXT_PUBLIC_STRIPE_PRO_ANNUAL_PRICE_ID` | Price ID Stripe — Pro annuale |
| `NEXT_PUBLIC_STRIPE_BUSINESS_ANNUAL_PRICE_ID` | Price ID Stripe — Business annuale |
| `AI_PROVIDER` | `ollama` (default) o `openai` |
| `AI_BASE_URL` | Base URL OpenAI-compatible (default `https://api.openai.com/v1`) |
| `AI_API_KEY` | API key del provider AI |
| `AI_MODEL` | Modello AI (default `gpt-4o-mini`) |
| `OLLAMA_URL` | URL dell'istanza Ollama (default `http://localhost:11434`) |
| `OLLAMA_MODEL` | Modello Ollama (default `llama3`) |
| `SMTP_HOST` / `SMTP_PORT` / `SMTP_SECURE` / `SMTP_USER` / `SMTP_PASS` / `SMTP_FROM` | SMTP per le email (reset password). Senza `SMTP_HOST` i link vengono loggati in console (dev) |

### 🧪 Modalità sviluppo (DEV_MODE)

In `app/page.tsx` la costante `DEV_MODE = true` crea un **utente fittizio** ("Sviluppatore") e bypassa i redirect al login: utile per testare dashboard, chat e builder senza registrazione. Imposta `false` per la normale autenticazione.

---

## 📁 Struttura del progetto

```
omnihabit/
├── app/                          # Frontend (Next.js App Router)
│   ├── layout.tsx                # Root layout (font, metadata)
│   ├── page.tsx                  # Landing + routing interno delle viste
│   ├── globals.css               # Design system (palette, font, utility glass)
│   ├── manifest.ts · robots.ts · sitemap.ts · opengraph-image.tsx
│   ├── components/               # UI components
│   │   ├── SectionOne.tsx        # Hero: nome piattaforma, CTA, statistiche animate
│   │   ├── SectionTwo.tsx        # Sezione capability ("Impara a vedere brillantemente")
│   │   ├── ScrollVideo.tsx       # Video di sfondo scroll-scrubbed (canvas frame cache)
│   │   ├── Navbar.tsx            # Navbar fluttuante con dropdown e indicatore sezione
│   │   ├── Features.tsx          # Le 4 Leggi (Atomic Habits)
│   │   ├── MonthSelection.tsx    # Timeline quadrimestri dal mese corrente
│   │   ├── MonthDashboard.tsx    # Dashboard mensile (grafico, EXP, strike)
│   │   ├── UserDashboard.tsx     # Panoramica completa utente
│   │   ├── HabitBuilder.tsx      # Wizard delle 4 Leggi
│   │   ├── ChatPage.tsx · ChatModal.tsx · AIAssistant.tsx   # OmniMind
│   │   ├── Pricing.tsx · PlanModal.tsx · PlansPage.tsx      # Abbonamenti/piani AI
│   │   ├── AuthPage.tsx · AuthShell.tsx · ForgotPasswordPage.tsx
│   │   ├── DocAccess.tsx · DocPage.tsx · PrivacyPage.tsx · TermsPage.tsx
│   │   ├── FAQ.tsx · Footer.tsx · Reveal.tsx · CountUp.tsx · Chip.tsx · ShinyText.tsx
│   │   ├── ToastContext.tsx · useReminders.ts
│   │   ├── constants.ts · content.ts · utils.ts
│   │   └── ...
│   ├── login/ register/ forgot-password/ reset-password/   # Pagine auth dedicate
│   ├── chat/ metodo/ privacy/ termini/                      # Altre pagine
│   └── api/                        # Route handlers (backend)
│       ├── auth/                   # login, register, me, stats, google, reset-password, forgot-password
│       ├── habits/                 # CRUD + check-in
│       ├── plans/                  # CRUD piani AI + apply
│       ├── ai/plan/                # Generatore piani AI
│       ├── chat/                   # Chat con OmniMind
│       ├── create-checkout-session/ · stripe-webhook/       # Stripe
│       └── health/
├── lib/                          # Logica server
│   ├── auth.ts                   # JWT sign/verify, requireAuth
│   ├── db/                       # client.ts (Supabase), repos.ts, types.ts
│   ├── models/                   # Tipi: User, Habit, Plan
│   ├── middleware/               # rateLimit.ts, validation.ts
│   ├── services/                 # ai.ts (provider), email.ts (SMTP)
│   └── utils/                    # streak.ts, atomic.ts (regole Atomic Habits)
├── tests/                        # streak.test.ts, atomic.test.ts
├── eslint.config.js              # ESLint flat (next/core-web-vitals + typescript)
└── tsconfig.json
```

---

## 📜 Script disponibili

| Comando | Descrizione |
|---|---|
| `npm run dev` | Avvia il server di sviluppo |
| `npm run build` | Build di produzione (esegue lint + typecheck) |
| `npm start` | Avvia la build di produzione |
| `npm run lint` | ESLint (config flat: Next core-web-vitals + TypeScript) |
| `npm run typecheck` | TypeScript strict check (`tsc --noEmit`, con `noUnusedLocals`) |
| `npm test` | Test unitari (streak + regole atomiche) |

---

## 🧠 Architettura in breve

- **Backend integrato**: le API vivono in `app/api/*` come route handlers Next.js — nessun server separato. Ogni handler usa `requireAuth()` (`lib/auth.ts`) che verifica il JWT e 503 se il DB non è configurato.
- **Database**: accesso a Supabase solo lato server (`lib/db/client.ts`) con service role key, mai esposta al client.
- **AI**: `lib/services/ai.ts` espone `aiChat()` — sceglie il provider in base a `AI_PROVIDER` (Ollama locale per sviluppo, qualsiasi endpoint OpenAI-compatible in produzione). Il frontend chiama `/api/chat` e `/api/ai/plan`.
- **Stripe**: `/api/create-checkout-session` crea la sessione di abbonamento; `/api/stripe-webhook` aggiorna lo stato premium dell'utente. I prezzi annuali = 10 × mensile (2 mesi gratis).
- **Atomic Habits**: la logica di streak e le regole (mai mancare due volte, versione 2 minuti, coerenza 1%) sono in `lib/utils/` e coperte dai test.

---

## 🧪 Test

```bash
npm test
```

I test coprono la logica di **streak** (`tests/streak.test.ts`) e le **regole atomiche** (`tests/atomic.test.ts`).

---

## 🔒 Note di sicurezza

- `JWT_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`, `STRIPE_SECRET_KEY`, `AI_API_KEY` non devono mai finire nel client: prefisso `NEXT_PUBLIC_` solo per i price ID Stripe.
- Il webhook Stripe verifica la firma con `STRIPE_SECRET_KEY`.
- Rate limiting presente in `lib/middleware/rateLimit.ts` per gli endpoint sensibili.
