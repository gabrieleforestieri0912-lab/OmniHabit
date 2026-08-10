const MONTHS = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
];
const MONTHS_SET = new Set(MONTHS);

export interface HabitInput {
  name?: unknown;
  month?: unknown;
  reminderTime?: unknown;
  targetDays?: unknown;
  completed?: unknown;
  cueTime?: unknown;
  cueLocation?: unknown;
  stackAfter?: unknown;
  twoMinute?: unknown;
  reward?: unknown;
  identity?: unknown;
}

function validateOptionalText(value: unknown, field: string, max = 200): string | null {
  if (value === undefined || value === null || value === '') return null;
  if (typeof value !== 'string') return `Il campo ${field} non è valido`;
  if (value.length > max) return `Il campo ${field} non può superare ${max} caratteri`;
  return null;
}

export function validateHabitBody(body: HabitInput): string | null {
  if (body.name !== undefined) {
    if (typeof body.name !== 'string' || body.name.trim().length === 0) {
      return 'Il nome dell\'abitudine è obbligatorio';
    }
    if (body.name.trim().length > 120) {
      return 'Il nome dell\'abitudine non può superare 120 caratteri';
    }
  }
  if (body.month !== undefined) {
    if (typeof body.month !== 'string' || !MONTHS_SET.has(body.month)) {
      return 'Mese non valido';
    }
  }
  if (body.reminderTime !== undefined) {
    if (body.reminderTime === null || body.reminderTime === '') {
      return null;
    }
    if (typeof body.reminderTime !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(body.reminderTime)) {
      return 'Orario promemoria non valido (usa formato HH:MM)';
    }
  }
  if (body.targetDays !== undefined) {
    const n = Number(body.targetDays);
    if (!Number.isInteger(n) || n < 1 || n > 7) {
      return 'La frequenza settimanale deve essere tra 1 e 7';
    }
  }
  if (body.cueTime !== undefined && body.cueTime !== null && body.cueTime !== '') {
    if (typeof body.cueTime !== 'string' || !/^([01]\d|2[0-3]):[0-5]\d$/.test(body.cueTime)) {
      return 'Orario del cue non valido (usa formato HH:MM)';
    }
  }
  const textChecks: Array<[unknown, string]> = [
    [body.cueLocation, 'cueLocation'],
    [body.stackAfter, 'stackAfter'],
    [body.twoMinute, 'twoMinute'],
    [body.reward, 'reward'],
    [body.identity, 'identity']
  ];
  for (const [value, field] of textChecks) {
    const err = validateOptionalText(value, field);
    if (err) return err;
  }
  return null;
}

export function validatePassword(password: unknown): string | null {
  if (typeof password !== 'string' || password.length < 6) {
    return 'La password deve essere di almeno 6 caratteri';
  }
  return null;
}

export function validateEmail(email: unknown): string | null {
  if (typeof email !== 'string' || !/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return 'Inserisci un indirizzo email valido';
  }
  return null;
}
