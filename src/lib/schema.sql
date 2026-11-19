-- Run once against your Neon/Vercel Postgres database.
-- psql "$DATABASE_URL" -f src/lib/schema.sql

CREATE TABLE IF NOT EXISTS subscribers (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active','unsubscribed')),
  unsubscribe_token TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Idempotent backfill for existing tables
ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS unsubscribe_token TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscribers_token ON subscribers (unsubscribe_token);

CREATE TABLE IF NOT EXISTS newsletter_posts (
  id SERIAL PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  cover_image_url TEXT,
  sent_at TIMESTAMPTZ,
  recipients_count INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Idempotent column add for already-existing tables
ALTER TABLE newsletter_posts ADD COLUMN IF NOT EXISTS cover_image_url TEXT;

CREATE TABLE IF NOT EXISTS admin_codes (
  email TEXT NOT NULL,
  code_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  attempts INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (email, created_at)
);

CREATE INDEX IF NOT EXISTS idx_admin_codes_email_expires
  ON admin_codes (email, expires_at DESC);

-- Ajustes editables desde /admin (p. ej. el mensaje de bienvenida).
-- La app también la crea sola la primera vez que se guarda.
CREATE TABLE IF NOT EXISTS site_settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Nombre y apellidos del suscriptor (los pide el formulario desde el 18-nov-2026).
ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS last_name TEXT;

-- Medición de la newsletter (19-nov-2026). La app también lo crea solo (lib/tracking.ts).
ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS source TEXT;
ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS referrer_host TEXT;
ALTER TABLE subscribers ADD COLUMN IF NOT EXISTS landing TEXT;
CREATE TABLE IF NOT EXISTS newsletter_visits (
  id SERIAL PRIMARY KEY,
  path TEXT NOT NULL,
  source TEXT,
  campaign TEXT,
  referrer_host TEXT,
  bot TEXT,
  visitor TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_nl_visits_created ON newsletter_visits (created_at);
CREATE TABLE IF NOT EXISTS email_sends (
  id SERIAL PRIMARY KEY,
  campaign TEXT NOT NULL,
  subscriber_id INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TABLE IF NOT EXISTS email_clicks (
  id SERIAL PRIMARY KEY,
  campaign TEXT NOT NULL,
  url TEXT NOT NULL,
  subscriber_id INTEGER,
  bot TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_email_clicks_campaign ON email_clicks (campaign);
