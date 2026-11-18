import "server-only";

import { sql } from "@/lib/db";

/*
 * Mensaje de bienvenida editable desde /admin. Se guarda en una tabla de una sola
 * fila (id = 1). Mientras no se guarde nada desde el panel se usa el texto por
 * defecto de abajo, que es el que estaba fijo en el código hasta ahora.
 */

export type WelcomeEmail = {
  subject: string;
  body: string;
  coverImageUrl: string | null;
  enabled: boolean;
  updatedAt: Date | null;
};

export const DEFAULT_WELCOME: WelcomeEmail = {
  subject: "Gracias por suscribirte",
  body: [
    "Hola:",
    "",
    "Gracias por suscribirte a la newsletter de Juan Andrés Romero. A partir de ahora recibirás en este correo cada nueva publicación.",
    "",
    "Si no te suscribiste tú, puedes darte de baja con el enlace que aparece al final de este mensaje.",
  ].join("\n"),
  coverImageUrl: null,
  enabled: true,
  updatedAt: null,
};

// La tabla se crea sola la primera vez (además está en schema.sql), para no
// depender de que alguien ejecute la migración a mano antes de desplegar.
let tablaLista: Promise<unknown> | null = null;
function asegurarTabla() {
  tablaLista ??= sql`
    CREATE TABLE IF NOT EXISTS welcome_email (
      id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
      subject TEXT NOT NULL,
      body TEXT NOT NULL,
      cover_image_url TEXT,
      enabled BOOLEAN NOT NULL DEFAULT true,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `.catch((err) => {
    tablaLista = null; // reintentar en la próxima llamada
    throw err;
  });
  return tablaLista;
}

type Fila = {
  subject: string;
  body: string;
  cover_image_url: string | null;
  enabled: boolean;
  updated_at: Date;
};

export async function getWelcomeEmail(): Promise<WelcomeEmail> {
  await asegurarTabla();
  const filas = await sql<Fila[]>`
    SELECT subject, body, cover_image_url, enabled, updated_at
    FROM welcome_email WHERE id = 1
  `;
  const f = filas[0];
  if (!f) return DEFAULT_WELCOME;
  return {
    subject: f.subject,
    body: f.body,
    coverImageUrl: f.cover_image_url,
    enabled: f.enabled,
    updatedAt: f.updated_at,
  };
}

export async function saveWelcomeEmail(w: Omit<WelcomeEmail, "updatedAt">): Promise<void> {
  await asegurarTabla();
  await sql`
    INSERT INTO welcome_email (id, subject, body, cover_image_url, enabled, updated_at)
    VALUES (1, ${w.subject}, ${w.body}, ${w.coverImageUrl}, ${w.enabled}, now())
    ON CONFLICT (id) DO UPDATE SET
      subject = EXCLUDED.subject,
      body = EXCLUDED.body,
      cover_image_url = EXCLUDED.cover_image_url,
      enabled = EXCLUDED.enabled,
      updated_at = now()
  `;
}
