/*
 * Datos del suscriptor en los correos: donde el texto diga {nombre} o {apellidos}
 * se pone el de la persona. Si falta el dato (p. ej. quien se suscribió antes de
 * que el formulario lo pidiera), se quita el hueco junto con la coma o el espacio
 * de delante: «Hola, {nombre}:» → «Hola:».
 * Además, «Bienvenido/a» se ajusta según el nombre (ver lib/gender.ts).
 */

import { applyGender, genderFromName } from "@/lib/gender";

/* videoUrl: enlace personal al vídeo exclusivo (lo calcula el servidor; ver
   lib/video-access.ts). Sin él, {enlace_video} lleva a la página general /video. */
export type Person = { name?: string | null; lastName?: string | null; videoUrl?: string | null };

/* Solo letras, marcas, espacios, guion, apóstrofo y punto: el texto pasa por
   Markdown/HTML al montar el correo, así que no se deja colar nada más. */
export function cleanName(raw: string): string {
  return raw
    .normalize("NFC")
    .replace(/[^\p{L}\p{M} '’.-]/gu, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 80);
}

function fill(text: string, key: string, value: string): string {
  const exact = new RegExp(`\\{\\s*${key}\\s*\\}`, "gi");
  if (value) return text.replace(exact, value);
  const withLead = new RegExp(`[ \\t]*,?[ \\t]*\\{\\s*${key}\\s*\\}`, "gi");
  return text.replace(withLead, "");
}

export function personalize(text: string, p: Person): string {
  // Apellidos primero: así «{nombre} {apellidos}» sin apellidos queda «Marta».
  let out = fill(text, "apellidos", cleanName(p.lastName ?? ""));
  out = fill(out, "nombre", cleanName(p.name ?? ""));
  out = out.replace(/\{\s*enlace_video\s*\}/gi, p.videoUrl || "https://juanandresromero.es/video");
  // «Bienvenido/a» → «Bienvenido» o «Bienvenida» si el nombre lo deja claro.
  out = applyGender(out, genderFromName(cleanName(p.name ?? "")));
  return out;
}
