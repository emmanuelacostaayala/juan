"use server";

import { revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { mailer, FROM, CONTACT_INBOX } from "@/lib/mail";
import { getSession } from "@/lib/session";
import { renderNewsletterEmail } from "@/lib/newsletter-template";

export type PublishState = {
  ok: boolean;
  error?: string;
  recipients?: number;
  slug?: string;
};

const SITE = "https://juanandresromero.es";
// Zoho free SMTP is rate-limited (50–500/h dynamic). Pace sends to keep us
// well under the floor; for lists >100 we should switch to a transactional
// email service (Resend/Postmark/SES) or Zoho Campaigns.
const SEND_DELAY_MS = 250;

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 80);
}

function unsubUrl(token: string) {
  return `${SITE}/unsubscribe?t=${encodeURIComponent(token)}`;
}
function unsubPostUrl(token: string) {
  return `${SITE}/api/unsubscribe?t=${encodeURIComponent(token)}`;
}

async function sleep(ms: number) {
  return new Promise<void>((res) => setTimeout(res, ms));
}

type Sub = { email: string; unsubscribe_token: string };

async function sendOne(
  sub: Sub,
  title: string,
  body: string,
  coverImageUrl: string | null,
): Promise<boolean> {
  const url = unsubUrl(sub.unsubscribe_token);
  const { html, text } = renderNewsletterEmail({
    title,
    body,
    unsubscribeUrl: url,
    coverImageUrl,
  });
  try {
    await mailer.sendMail({
      from: FROM,
      to: sub.email,
      subject: title,
      html,
      text,
      headers: {
        "List-Unsubscribe": `<${unsubPostUrl(sub.unsubscribe_token)}>, <${url}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        "X-Auto-Response-Suppress": "All",
        Precedence: "bulk",
      },
    });
    return true;
  } catch (err) {
    console.error("[newsletter] send failed for", sub.email, err);
    return false;
  }
}

export async function publishNewsletter(
  _prev: PublishState | null,
  formData: FormData,
): Promise<PublishState> {
  const session = await getSession();
  if (!session) return { ok: false, error: "Sesión expirada." };

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const coverImageUrl = String(formData.get("coverImageUrl") ?? "").trim() || null;
  const sendNow = formData.get("send") === "on";

  if (!title || !body) return { ok: false, error: "Título y contenido son obligatorios." };

  const baseSlug = slugify(title) || `post-${Date.now()}`;
  let slug = baseSlug;
  let suffix = 1;
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
    const subs = await sql<Sub[]>`
      SELECT email, unsubscribe_token
      FROM subscribers
      WHERE status = 'active' AND unsubscribe_token IS NOT NULL
    `;

    // Sequential with small delay — gentle on Zoho's rate limit and on
    // spam-pattern detectors. Sleep BEFORE each send except the first.
    for (let i = 0; i < subs.length; i++) {
      if (i > 0) await sleep(SEND_DELAY_MS);
      const ok = await sendOne(subs[i], title, body, coverImageUrl);
      if (ok) recipients++;
    }

    // Internal preview copy to info@ — uses a sentinel token so the
    // unsubscribe link in the preview won't unsubscribe a real subscriber.
    const { html: previewHtml, text: previewText } = renderNewsletterEmail({
      title,
      body,
      unsubscribeUrl: `${SITE}/unsubscribe`,
      coverImageUrl,
      isPreview: true,
      recipientsCount: recipients,
    });
    try {
      await mailer.sendMail({
        from: FROM,
        to: CONTACT_INBOX,
        subject: `[Copia] ${title}`,
        html: previewHtml,
        text: previewText,
      });
    } catch (err) {
      console.error("[newsletter] preview copy failed", err);
    }
  }

  const sentAt = sendNow ? new Date() : null;

  await sql`
    INSERT INTO newsletter_posts (slug, title, body, cover_image_url, sent_at, recipients_count)
    VALUES (${slug}, ${title}, ${body}, ${coverImageUrl}, ${sentAt}, ${sendNow ? recipients : null})
  `;

  revalidatePath("/admin");
  return { ok: true, recipients, slug };
}
