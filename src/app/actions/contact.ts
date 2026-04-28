"use server";

import { mailer, FROM, CONTACT_INBOX } from "@/lib/mail";

export type ContactState = {
  ok: boolean;
  error?: string;
  echo?: { name: string; tab: string };
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] ?? c),
  );
}

export async function submitContact(
  _prev: ContactState | null,
  formData: FormData,
): Promise<ContactState> {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const message = String(formData.get("message") ?? "").trim();
  const tab = String(formData.get("tab") ?? "Prensa").trim();
  const accept = formData.get("accept") === "on";
  const honeypot = String(formData.get("company") ?? "").trim();

  if (honeypot) return { ok: true, echo: { name, tab } }; // silently drop bots

  if (!accept) {
    return { ok: false, error: "Debes aceptar la política de privacidad." };
  }
  if (!name || !email || !message) {
    return { ok: false, error: "Nombre, email y mensaje son obligatorios." };
  }
  if (!EMAIL_RE.test(email)) {
    return { ok: false, error: "El email no es válido." };
  }
  if (message.length > 4000) {
    return { ok: false, error: "El mensaje es demasiado largo." };
  }

  try {
    await mailer.sendMail({
      from: FROM,
      to: CONTACT_INBOX,
      replyTo: `"${name}" <${email}>`,
      subject: `Contacto · ${tab} · ${name}`,
      text:
        `Nuevo mensaje del formulario de contacto.\n\n` +
        `Tipo: ${tab}\nNombre: ${name}\nEmail: ${email}\n` +
        (phone ? `Teléfono: ${phone}\n` : "") +
        `\nMensaje:\n${message}`,
      html: `<div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 640px; line-height: 1.55; color: #1a1a18;">
        <h2 style="margin: 0 0 1rem; font-size: 22px;">Nuevo mensaje · ${escapeHtml(tab)}</h2>
        <p style="margin: 0.25rem 0;"><strong>Nombre:</strong> ${escapeHtml(name)}</p>
        <p style="margin: 0.25rem 0;"><strong>Email:</strong> <a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></p>
        ${phone ? `<p style="margin: 0.25rem 0;"><strong>Teléfono:</strong> ${escapeHtml(phone)}</p>` : ""}
        <p style="margin: 1rem 0 0.5rem;"><strong>Mensaje:</strong></p>
        <p style="white-space: pre-wrap; padding: 1rem; background: #f6f6f4; border-radius: 8px; margin: 0;">${escapeHtml(message)}</p>
      </div>`,
    });
    return { ok: true, echo: { name, tab } };
  } catch (err) {
    console.error("[contact] mail error", err);
    return {
      ok: false,
      error:
        "No se pudo enviar el mensaje. Inténtalo de nuevo o escríbenos a info@juanandresromero.es",
    };
  }
}
