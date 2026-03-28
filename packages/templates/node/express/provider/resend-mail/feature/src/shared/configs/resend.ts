import { Resend } from "resend";
import env from "./env";

export const resend = new Resend(env.RESEND_API_KEY);

/**
 *? USAGE: 
  export async function sendEmail({
  from,
  email,
  subject,
  html
}: sendMail) {
 
  return await resend.emails.send({
      from: from || `<${env.EMAIL_FROM}>`,
      to: email,
      subject,
      replyTo: email,
      html
    });
}
 */
