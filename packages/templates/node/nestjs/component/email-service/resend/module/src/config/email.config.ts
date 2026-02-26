import { EmailConfig } from '../email/email.interface';

export function getEmailConfig(): EmailConfig {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    throw new Error('Missing required email configuration. Please check RESEND_API_KEY and EMAIL_FROM environment variables.');
  }

  return {
    apiKey,
    from,
  };
}
