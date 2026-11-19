import crypto from "node:crypto";

/*
 * Enlace temporal (firma SigV4 de S3) para leer un archivo privado de
 * Cloudflare R2. El enlace caduca a los `expiresIn` segundos: si alguien lo
 * copia, deja de servir. Sin dependencias externas.
 */

function rfc3986(s: string): string {
  return encodeURIComponent(s).replace(/[!'()*]/g, (c) => "%" + c.charCodeAt(0).toString(16).toUpperCase());
}

const hmac = (key: crypto.BinaryLike, data: string) => crypto.createHmac("sha256", key).update(data).digest();
const sha256hex = (data: string) => crypto.createHash("sha256").update(data).digest("hex");

export function presignGet(opts: Omit<PresignOpts, "method">): string {
  return presign({ ...opts, method: "GET" });
}

/* Enlace temporal para SUBIR un archivo (PUT) directamente desde el navegador. */
export function presignPut(opts: Omit<PresignOpts, "method">): string {
  return presign({ ...opts, method: "PUT" });
}

type PresignOpts = {
  method: "GET" | "PUT";
  host: string; // p. ej. <cuenta>.r2.cloudflarestorage.com
  path: string; // p. ej. /<bucket>/<archivo>
  accessKeyId: string;
  secretAccessKey: string;
  region?: string; // R2: "auto"
  expiresIn: number;
  now?: Date;
};

function presign(opts: PresignOpts): string {
  const region = opts.region ?? "auto";
  const now = opts.now ?? new Date();
  const amzDate = now.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, ""); // YYYYMMDDTHHMMSSZ
  const date = amzDate.slice(0, 8);
  const scope = `${date}/${region}/s3/aws4_request`;
  const canonicalPath = opts.path.split("/").map(rfc3986).join("/");

  const params: [string, string][] = [
    ["X-Amz-Algorithm", "AWS4-HMAC-SHA256"],
    ["X-Amz-Credential", `${opts.accessKeyId}/${scope}`],
    ["X-Amz-Date", amzDate],
    ["X-Amz-Expires", String(opts.expiresIn)],
    ["X-Amz-SignedHeaders", "host"],
  ];
  const query = params
    .map(([k, v]) => [rfc3986(k), rfc3986(v)])
    .sort(([a], [b]) => (a < b ? -1 : a > b ? 1 : 0))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

  const canonicalRequest = [opts.method, canonicalPath, query, `host:${opts.host}\n`, "host", "UNSIGNED-PAYLOAD"].join("\n");
  const stringToSign = ["AWS4-HMAC-SHA256", amzDate, scope, sha256hex(canonicalRequest)].join("\n");
  const kDate = hmac(`AWS4${opts.secretAccessKey}`, date);
  const kSigning = hmac(hmac(hmac(kDate, region), "s3"), "aws4_request");
  const signature = crypto.createHmac("sha256", kSigning).update(stringToSign).digest("hex");

  return `https://${opts.host}${canonicalPath}?${query}&X-Amz-Signature=${signature}`;
}
