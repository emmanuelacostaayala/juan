import "server-only";

import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST;
const user = process.env.SMTP_USER;
const pass = process.env.SMTP_PASSWORD;

if (!host || !user || !pass) {
  // Don't crash the build — only fail when sending if config is missing.
  // eslint-disable-next-line no-console
  console.warn("[mail] SMTP env vars not fully configured. Email sending will fail.");
}

export const mailer = nodemailer.createTransport({
  host: host ?? "smtp.zoho.eu",
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: process.env.SMTP_SECURE !== "false",
  auth: { user: user ?? "", pass: pass ?? "" },
});

export const FROM = process.env.SMTP_FROM
  ?? `"Juan Andrés Romero" <${user ?? "marketing@juanandresromero.es"}>`;

export const CONTACT_INBOX = process.env.CONTACT_TO || "info@juanandresromero.es";
