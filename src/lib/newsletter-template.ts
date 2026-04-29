import "server-only";

const SITE = "https://juanandresromero.es";

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c] ?? c),
  );
}

function bodyToHtml(body: string): string {
  return body
    .split(/\n{2,}/)
    .map(
      (para) =>
        `<p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:#1a1a18;">${escapeHtml(
          para,
        ).replace(/\n/g, "<br/>")}</p>`,
    )
    .join("\n");
}

// 640px-wide table-based template, web-safe fonts, dark-mode tolerant.
// Renders inline styles only (no <style>) for max client compatibility.
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
            <h1 style="font-family:Georgia,'Times New Roman',serif;font-size:30px;line-height:1.15;letter-spacing:-0.02em;color:#1a1a18;font-weight:500;margin:0 0 24px;">${escapeHtml(title)}</h1>
            ${bodyToHtml(body)}
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
    body,
    "",
    "—",
    "Recibes este correo porque te suscribiste en juanandresromero.es",
    `Darse de baja: ${unsubscribeUrl}`,
  ]
    .filter(Boolean)
    .join("\n");

  return { html, text };
}
