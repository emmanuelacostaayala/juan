import "server-only";

import { marked, type Renderer, type Tokens } from "marked";

const SITE = "https://juanandresromero.es";

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] ?? c),
  );
}

// Custom renderer that emits inline-styled HTML safe for every email client.
// We override the bits that matter (h1-3, p, strong, em, ul/ol/li, a,
// blockquote, hr, img, code, pre) and let marked handle the rest.
function buildRenderer(): Partial<Renderer> {
  const r: Partial<Renderer> = {};

  r.heading = function ({ tokens, depth }: Tokens.Heading) {
    const text = (this as Renderer).parser.parseInline(tokens);
    const sizes = [0, 28, 22, 18];
    const size = sizes[depth] ?? 16;
    return `<h${depth} style="font-family:Georgia,'Times New Roman',serif;font-size:${size}px;line-height:1.2;letter-spacing:-0.02em;color:#1a1a18;font-weight:500;margin:24px 0 12px;">${text}</h${depth}>`;
  };
  r.paragraph = function ({ tokens }: Tokens.Paragraph) {
    const text = (this as Renderer).parser.parseInline(tokens);
    return `<p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:#1a1a18;">${text}</p>`;
  };
  r.strong = function ({ tokens }: Tokens.Strong) {
    const text = (this as Renderer).parser.parseInline(tokens);
    return `<strong style="font-weight:700;color:#1a1a18;">${text}</strong>`;
  };
  r.em = function ({ tokens }: Tokens.Em) {
    const text = (this as Renderer).parser.parseInline(tokens);
    return `<em style="font-style:italic;">${text}</em>`;
  };
  r.link = function ({ href, title, tokens }: Tokens.Link) {
    const text = (this as Renderer).parser.parseInline(tokens);
    const t = title ? ` title="${escapeHtml(title)}"` : "";
    return `<a href="${escapeHtml(href)}"${t} style="color:#0678FF;text-decoration:underline;">${text}</a>`;
  };
  r.list = function ({ ordered, items }: Tokens.List) {
    const tag = ordered ? "ol" : "ul";
    const body = items.map((item) => (this as Renderer).listitem(item)).join("");
    return `<${tag} style="margin:0 0 16px;padding-left:24px;color:#1a1a18;font-size:16px;line-height:1.65;">${body}</${tag}>`;
  };
  r.listitem = function (item: Tokens.ListItem) {
    const body = (this as Renderer).parser.parse(item.tokens);
    return `<li style="margin:0 0 6px;">${body}</li>`;
  };
  r.blockquote = function ({ tokens }: Tokens.Blockquote) {
    const body = (this as Renderer).parser.parse(tokens);
    return `<blockquote style="margin:0 0 16px;padding:8px 16px;border-left:3px solid #0678FF;color:#5a5a55;font-style:italic;font-family:Georgia,'Times New Roman',serif;font-size:17px;line-height:1.55;">${body}</blockquote>`;
  };
  r.hr = function () {
    return `<hr style="border:none;border-top:1px solid #ececea;margin:24px 0;">`;
  };
  r.image = function ({ href, title, text }: Tokens.Image) {
    const t = title ? ` title="${escapeHtml(title)}"` : "";
    const alt = escapeHtml(text ?? "");
    return `<img src="${escapeHtml(href)}" alt="${alt}"${t} style="display:block;max-width:100%;height:auto;margin:16px 0;border-radius:6px;" />`;
  };
  r.codespan = function ({ text }: Tokens.Codespan) {
    return `<code style="font-family:Menlo,Monaco,Consolas,monospace;font-size:14px;background:#f3f1ec;padding:1px 6px;border-radius:3px;">${escapeHtml(text)}</code>`;
  };
  r.code = function ({ text }: Tokens.Code) {
    return `<pre style="margin:0 0 16px;padding:12px 16px;background:#f3f1ec;border-radius:6px;overflow-x:auto;"><code style="font-family:Menlo,Monaco,Consolas,monospace;font-size:13px;line-height:1.5;color:#1a1a18;">${escapeHtml(text)}</code></pre>`;
  };
  return r;
}

const renderer = buildRenderer();

function markdownToHtml(md: string): string {
  marked.use({ renderer });
  return marked.parse(md, { async: false }) as string;
}

// Plain-text projection of markdown (strip everything to readable text).
function markdownToText(md: string): string {
  return md
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/\[(.+?)\]\((.+?)\)/g, "$1 ($2)")
    .replace(/!\[(.*?)\]\((.+?)\)/g, "[imagen: $1]")
    .replace(/^>\s?/gm, "")
    .replace(/^[-*]\s+/gm, "• ")
    .replace(/`{1,3}([^`]+)`{1,3}/g, "$1");
}

export function renderNewsletterEmail({
  title,
  body,
  unsubscribeUrl,
  isPreview = false,
  recipientsCount,
}: {
  title: string;
  body: string;
  unsubscribeUrl: string;
  isPreview?: boolean;
  recipientsCount?: number;
}): { html: string; text: string } {
  const previewBanner = isPreview
    ? `<div style="background:#fff7e0;border:1px solid #f0e0a8;padding:12px 16px;border-radius:6px;font-size:13px;color:#1a1a18;margin:0 0 24px;">
        <strong>Copia interna</strong> — enviado a ${recipientsCount ?? 0} suscriptor${
        recipientsCount === 1 ? "" : "es"
      }.
      </div>`
    : "";

  const bodyHtml = markdownToHtml(body);

  const html = `<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background:#f6f4ef;font-family:Helvetica,Arial,sans-serif;color:#1a1a18;-webkit-font-smoothing:antialiased;">
<div style="display:none;max-height:0;overflow:hidden;mso-hide:all;">${escapeHtml(title)} — Juan Andrés Romero</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f6f4ef;">
  <tr>
    <td align="center" style="padding:32px 16px;">
      <table role="presentation" width="640" cellpadding="0" cellspacing="0" border="0" style="max-width:640px;width:100%;background:#ffffff;border-radius:8px;overflow:hidden;">
        <tr>
          <td style="padding:32px 40px 8px;">
            <table role="presentation" cellpadding="0" cellspacing="0" border="0">
              <tr>
                <td style="font-family:Helvetica,Arial,sans-serif;font-size:13px;font-weight:700;letter-spacing:0.08em;color:#888;text-transform:uppercase;">
                  JUAN ANDRÉS ROMERO
                </td>
                <td width="6"></td>
                <td valign="top" style="padding-top:2px;">
                  <table role="presentation" cellpadding="0" cellspacing="0" border="0"><tr>
                    <td width="10" height="10" bgcolor="#0CAFFE" style="background:#0CAFFE;background:linear-gradient(135deg,#12C9F9 0%,#0CAFFE 50%,#0678FF 100%);font-size:0;line-height:0;">&nbsp;</td>
                  </tr></table>
                </td>
              </tr>
            </table>
          </td>
        </tr>
        <tr>
          <td style="padding:8px 40px 0;">
            ${previewBanner}
          </td>
        </tr>
        <tr>
          <td style="padding:16px 40px 32px;">
            <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:32px;line-height:1.15;letter-spacing:-0.02em;color:#1a1a18;font-weight:500;margin:0 0 24px;">${escapeHtml(title)}</h1>
            ${bodyHtml}
          </td>
        </tr>
        <tr>
          <td style="border-top:1px solid #ececea;padding:24px 40px 32px;font-size:12px;line-height:1.6;color:#888;">
            <p style="margin:0 0 8px;">Recibes este correo porque te suscribiste en <a href="${SITE}" style="color:#888;text-decoration:underline;">juanandresromero.es</a>.</p>
            <p style="margin:0;">
              <a href="${unsubscribeUrl}" style="color:#0678FF;text-decoration:underline;">Darme de baja</a>
              &nbsp;·&nbsp;
              <a href="${SITE}" style="color:#888;text-decoration:underline;">Visitar sitio</a>
            </p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;

  const text = [
    isPreview ? `[Copia interna — enviado a ${recipientsCount ?? 0} suscriptor${recipientsCount === 1 ? "" : "es"}]` : null,
    title,
    "",
    markdownToText(body),
    "",
    "—",
    "Recibes este correo porque te suscribiste en juanandresromero.es",
    `Darse de baja: ${unsubscribeUrl}`,
  ]
    .filter(Boolean)
    .join("\n");

  return { html, text };
}
