import env from "../configs/env";
import { resend } from "../configs/resend";

type sendMail = {
  from?: string;
  subject: string;
  data: Record<string, any>;
  email: string;
  html: string;
};

export async function sendEmail({ from, email, subject, html }: sendMail) {
  return await resend.emails.send({
    from: from || `<${env.EMAIL_FROM}>`,
    to: email,
    subject,
    replyTo: email,
    html
  });
}
