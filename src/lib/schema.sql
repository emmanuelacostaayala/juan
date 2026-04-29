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
