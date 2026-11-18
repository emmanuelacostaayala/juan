import "server-only";

import { sql } from "@/lib/db";

/*
 * Mensaje de bienvenida para nuevos suscriptores, editable desde /admin
 * (desplegable «Plantilla» → «Mensaje de bienvenida»). Se guarda en la tabla
 * site_settings; si aún no hay nada guardado se usa el texto por defecto.
 */

export type WelcomeMessage = { subject: string; body: string };

export const DEFAULT_WELCOME: WelcomeMessage = {
  subject: "Gracias por suscribirte",
  body: [
    "Hola:",
    "",
    "Gracias por suscribirte a la newsletter de Juan Andrés Romero. A partir de ahora recibirás en este correo cada nueva publicación.",
    "",
    "Si no te suscribiste tú, puedes darte de baja con el enlace que aparece al final de este mensaje.",
  ].join("\n"),
};

const KEY_SUBJECT = "welcome_subject";
const KEY_BODY = "welcome_body";

/* La tabla se crea sola la primera vez que se guarda (también está en schema.sql). */
async function ensureTable(): Promise<void> {
  await sql`
    CREATE TABLE IF NOT EXISTS site_settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
}

export async function getWelcomeMessage(): Promise<WelcomeMessage> {
  try {
    const rows = await sql<{ key: string; value: string }[]>`
      SELECT key, value FROM site_settings WHERE key IN (${KEY_SUBJECT}, ${KEY_BODY})
    `;
    const map = new Map(rows.map((r) => [r.key, r.value]));
    return {
      subject: map.get(KEY_SUBJECT)?.trim() || DEFAULT_WELCOME.subject,
      body: map.get(KEY_BODY)?.trim() || DEFAULT_WELCOME.body,
    };
  } catch {
    // Tabla aún no creada (nunca se ha guardado) o fallo puntual: texto por defecto.
    return DEFAULT_WELCOME;
  }
}

export async function saveWelcomeMessage(msg: WelcomeMessage): Promise<void> {
  await ensureTable();
  await sql`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES (${KEY_SUBJECT}, ${msg.subject}, now()), (${KEY_BODY}, ${msg.body}, now())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
  `;
}

/* Fecha del último envío manual de la bienvenida a los suscriptores que ya
   estaban dados de alta (botón del panel). Sirve para no mandarlo dos veces sin
   darse cuenta. */
const KEY_SENT_EXISTING = "welcome_sent_existing_at";

export async function getWelcomeSentToExistingAt(): Promise<string | null> {
  try {
    const rows = await sql<{ value: string }[]>`
      SELECT value FROM site_settings WHERE key = ${KEY_SENT_EXISTING}
    `;
    return rows[0]?.value ?? null;
  } catch {
    return null;
  }
}

export async function setWelcomeSentToExistingAt(iso: string): Promise<void> {
  await ensureTable();
  await sql`
    INSERT INTO site_settings (key, value, updated_at)
    VALUES (${KEY_SENT_EXISTING}, ${iso}, now())
    ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = now()
  `;
}
