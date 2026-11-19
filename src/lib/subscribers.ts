import "server-only";

import { sql } from "@/lib/db";

/* Columnas «name» y «last_name» de subscribers (18-nov-2026). Se añade sola la primera vez
   que hace falta; también está en schema.sql. */
let ready: Promise<void> | null = null;

export function ensureSubscriberNameColumn(): Promise<void> {
  if (!ready) {
    const p: Promise<void> = sql`
      ALTER TABLE subscribers
        ADD COLUMN IF NOT EXISTS name TEXT,
        ADD COLUMN IF NOT EXISTS last_name TEXT
    `
      .then(() => undefined)
      .catch((err) => {
        ready = null; // reintenta en la próxima llamada
        throw err;
      });
    ready = p;
    return p;
  }
  return ready;
}
