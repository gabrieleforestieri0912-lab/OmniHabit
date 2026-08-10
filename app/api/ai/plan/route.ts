import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import type { IUser } from '@/lib/models/User';
import { findUserById, updateUserById } from '@/lib/db/repos';
import { aiChat, extractJson, AIMessage } from '@/lib/services/ai';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { prompt, currentHabits, planStyle, targetHabitCount } = await request.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    // Optional auth: enforce free usage limit for logged-in non-premium users
    let user: IUser | null = null;
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as jwt.JwtPayload;
        user = await findUserById(decoded.id);
      } catch {
        /* token non valido: trattiamo come utente anonimo */
      }
    }
    if (user && !user.isPremium && user.aiPlanUsageCount >= user.aiPlanUsageLimit) {
      return NextResponse.json(
        {
          error: 'Hai raggiunto il limite di piani AI gratuiti. Diventa Premium per generare piani illimitati.'
        },
        { status: 402 }
      );
    }

    const style = typeof planStyle === 'string' && ['balanced', 'intense', 'gentle'].includes(planStyle) ? planStyle : 'balanced';
    const count = Math.min(Math.max(Number(targetHabitCount) || 5, 3), 12);

    const systemPrompt = `Sei un esperto di sviluppo personale e neuroscienze delle abitudini, specializzato nel metodo di James Clear (Atomic Habits). Il tuo compito è creare un piano di abitudini mensile personalizzato per l'utente.

I mesi disponibili sono: Gennaio, Febbraio, Marzo, Aprile, Maggio, Giugno, Luglio, Agosto, Settembre, Ottobre, Novembre, Dicembre.

Stile richiesto: ${style === 'intense' ? 'intenso e ambizioso, più abitudini impegnative' : style === 'gentle' ? 'morbido e sostenibile, abitudini piccole e facili da mantenere' : 'equilibrato, un mix realistico e sostenibile'}.
Obiettivo: circa ${count} abitudini totali distribuite nei mesi.

OGNI abitudine DEVE applicare le 4 Leggi del Cambiamento di Atomic Habits:
1. RENDILA OVVIA (cue): definisci "cueTime" (orario HH:MM) e "cueLocation" (luogo) e, quando sensato, "stackAfter" (dopo quale abitudine esistente/quotidiana, es. "dopo il caffè del mattino")
2. RENDILA ATTRAENTE: scrivi una "identity" breve (es. "sono uno scrittore")
3. RENDILA FACILE: "twoMinute" = versione minima da 2 minuti (es. per "Leggere 20 pagine" → "Leggi 1 pagina")
4. RENDILA SODDISFACENTE: "reward" = ricompensa immediata

Restituisci SEMPRE un JSON valido con questa struttura esatta:
{
  "plan": [
    {
      "month": "Nome del mese",
      "habits": [
        {
          "name": "Abitudine specifica",
          "cueTime": "07:30",
          "cueLocation": "luogo",
          "stackAfter": "dopo [trigger]" oppure "",
          "identity": "frase identità",
          "twoMinute": "versione 2 minuti",
          "reward": "ricompensa"
        }
      ]
    }
  ],
  "summary": "Breve descrizione del piano (1-2 frasi)"
}

REGOLE:
- Massimo 3 abitudini per mese
- Le abitudini devono essere specifiche, misurabili e basate sul prompt dell'utente
- Progressione logica: inizia con abitudini facili, aumenta la difficoltà
- Includi abitudini legate a: focus, salute, apprendimento, produttività
- Se un campo non è applicabile usa stringa vuota ""
- Rispondi SOLO con JSON valido, nessun altro testo
- Se l'utente scrive in inglese, rispondi in inglese con mesi in inglese (January, February, etc.)`;

    const userPrompt = currentHabits && currentHabits.length > 0
      ? `${prompt}\n\nAbitudini già esistenti dell'utente: ${JSON.stringify(currentHabits)}`
      : prompt;

    const messages: AIMessage[] = [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ];

    const content = await aiChat(messages);
    const parsedPlan = extractJson(content);

    if (user) {
      await updateUserById(user.id, { ai_plan_usage_count: user.aiPlanUsageCount + 1 });
    }
    return NextResponse.json(parsedPlan);
  } catch (error) {
    console.error('Plan generation error:', error);
    const err = error as Error;
    return NextResponse.json({ error: err.message || 'Plan generation error' }, { status: 502 });
  }
}
