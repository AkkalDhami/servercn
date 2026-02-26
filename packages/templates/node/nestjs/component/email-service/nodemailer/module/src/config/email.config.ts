import { EmailConfig } from '../email/email.interface';

export function getEmailConfig(): EmailConfig {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '465', 10);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const from = process.env.EMAIL_FROM;

  if (!host || !user || !pass || !from) {
    throw new Error('Missing required email configuration. Please check SMTP_HOST, SMTP_USER, SMTP_PASS, and EMAIL_FROM environment variables.');
  }

  return {
    host,
    port,
    secure: port === 465,
    user,
    pass,
    from,
  };
}
