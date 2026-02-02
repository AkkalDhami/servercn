import nodemailer from "nodemailer";
import env from "./env";

let transporter: nodemailer.Transporter | null = null;

export function getTransporter() {
  if (transporter) return transporter;
  const host = env.SMTP_HOST;
  const port = Number(env.SMTP_PORT || 465);
  const user = env.SMTP_USER;
  const pass = env.SMTP_PASS;
  const from = env.EMAIL_FROM;
  if (!host || !user || !pass || !from) {
    throw new Error("SMTP/EMAIL env not configured");
  }

  transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass }
  });
  return transporter;
}
