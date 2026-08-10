-- ============================================================
-- OmniHabit · Atomic Habits (James Clear) — schema migration
-- ============================================================
-- Esegui questo script nel SQL Editor di Supabase (Dashboard →
-- SQL Editor → New query) prima di usare le nuove funzionalità.
--
-- Aggiunge alla tabella "habits" i campi delle 4 Leggi:
--   Legge 1 · RENDILA OVVIA  → cue_time, cue_location, stack_after
--   Legge 2 · RENDILA ATTRAENTE → identity
--   Legge 3 · RENDILA FACILE → two_minute
--   Legge 4 · RENDILA SODDISFACENTE → reward
-- ============================================================

ALTER TABLE habits
  ADD COLUMN IF NOT EXISTS cue_time text,
  ADD COLUMN IF NOT EXISTS cue_location text,
  ADD COLUMN IF NOT EXISTS stack_after text,
  ADD COLUMN IF NOT EXISTS two_minute text,
  ADD COLUMN IF NOT EXISTS reward text,
  ADD COLUMN IF NOT EXISTS identity text;

-- Commenti descrittivi (utili in Supabase Table Editor)
COMMENT ON COLUMN habits.cue_time    IS 'Legge 1 · Rendila ovvia — orario del cue (implementation intention: "alle HH:MM")';
COMMENT ON COLUMN habits.cue_location IS 'Legge 1 · Rendila ovvia — luogo del cue (implementation intention: "in [luogo]")';
COMMENT ON COLUMN habits.stack_after  IS 'Legge 1 · Rendila ovvia — habit stacking: nome dell''abitudine trigger ("dopo [abitudine]")';
COMMENT ON COLUMN habits.identity     IS 'Legge 2 · Rendila attraente — identità: "Sono il tipo di persona che..."';
COMMENT ON COLUMN habits.two_minute   IS 'Legge 3 · Rendila facile — versione 2 minuti (gateway habit)';
COMMENT ON COLUMN habits.reward       IS 'Legge 4 · Rendila soddisfacente — ricompensa immediata';

-- Per verificare che la migrazione sia andata a buon fine:
-- SELECT column_name FROM information_schema.columns
-- WHERE table_name = 'habits' ORDER BY ordinal_position;
