"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { mailer, FROM } from "@/lib/mail";
import { getSession } from "@/lib/session";

export type PublishState = {
  ok: boolean;
  error?: string;
  recipients?: number;
  slug?: string;
};

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] ?? c),
  );
}

function bodyToHtml(body: string): string {
  // Render plain text body as paragraphs separated by blank lines.
  return body
    .split(/\n{2,}/)
    .map((para) => `<p style="margin:0 0 1rem;line-height:1.65;color:#1a1a18">${escapeHtml(para).replace(/\n/g, "<br/>")}</p>`)
    .join("\n");
}

async function chunkSend(
  emails: string[],
  subject: string,
  html: string,
  text: string,
  size = 50,
): Promise<number> {
  let delivered = 0;
  for (let i = 0; i < emails.length; i += size) {
    const batch = emails.slice(i, i + size);
    await Promise.allSettled(
      batch.map((to) =>
        mailer
          .sendMail({ from: FROM, to, subject, html, text })
          .then(() => {
            delivered++;
          })
          .catch((err) => {
            console.error("[newsletter] send failed for", to, err);
          }),
      ),
    );
  }
  return delivered;
}

export async function publishNewsletter(
  _prev: PublishState | null,
  formData: FormData,
): Promise<PublishState> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Sesión expirada." };

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const sendNow = formData.get("send") === "on";

  if (!title || !body) return { ok: false, error: "Título y contenido son obligatorios." };

  const baseSlug = slugify(title) || `post-${Date.now()}`;
  let slug = baseSlug;
  let suffix = 1;

  // Ensure unique slug
  for (;;) {
    const conflict = await sql<{ count: number }[]>`
      SELECT COUNT(*)::int AS count FROM newsletter_posts WHERE slug = ${slug}
    `;
    if (conflict[0]?.count === 0) break;
    suffix++;
    slug = `${baseSlug}-${suffix}`;
  }

  let recipients = 0;

  if (sendNow) {
    type SubRow = { email: string };
    const subs = await sql<SubRow[]>`
      SELECT email FROM subscribers WHERE status = 'active'
    `;
    const emails = subs.map((r) => r.email);

    const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;max-width:640px;color:#1a1a18">
      <h1 style="font-size:28px;font-weight:500;letter-spacing:-0.02em;margin:0 0 1.25rem">${escapeHtml(title)}</h1>
      ${bodyToHtml(body)}
      <hr style="border:none;border-top:1px solid #e7e5e0;margin:2rem 0">
      <p style="font-size:12px;color:#888;margin:0">Recibes este correo porque te suscribiste en juanandresromero.es</p>
    </div>`;
    const text = `${title}\n\n${body}\n\n—\nRecibes este correo porque te suscribiste en juanandresromero.es`;

    recipients = await chunkSend(emails, title, html, text);
  }

  const sentAt = sendNow ? new Date() : null;

  await sql`
    INSERT INTO newsletter_posts (slug, title, body, sent_at, recipients_count)
    VALUES (${slug}, ${title}, ${body}, ${sentAt}, ${sendNow ? recipients : null})
  `;

  revalidatePath("/admin");
  return { ok: true, recipients, slug };
}
