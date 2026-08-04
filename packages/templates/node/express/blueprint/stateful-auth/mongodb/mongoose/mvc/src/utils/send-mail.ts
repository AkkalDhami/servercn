import env from "../configs/env";
import { resend } from "../configs/resend";

export type SendMail = {
  from?: string;
  subject: string;
  data: Record<string, any>;
  email: string;
  html: string;
};

export async function sendEmail({ from, email, subject, html }: SendMail) {
  const response = await resend.emails.send({
    from: from || `<${env.EMAIL_FROM}>`,
    to: email,
    subject,
    replyTo: email,
    html
  });

  if (response.error) {
    throw new Error(response.error.message || "Failed to send email");
  }

  return response.data;
}
